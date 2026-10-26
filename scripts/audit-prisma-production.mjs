/* Production inspection only. Server-enforced read-only session + transaction.
 * No customer values, credentials or migration error logs are exported. */
import { config } from 'dotenv';
import assert from 'node:assert/strict';
import { Client } from 'pg';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

config({ path: ['.env.local', '.env'], quiet: true });
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required');
const auditArgs=process.argv.slice(2);
const expectPreIdempotency=auditArgs.includes('--expect-pre-idempotency');
const expectBaselineOnly=auditArgs.includes('--expect-baseline-only');
const output = resolve(auditArgs.find(arg=>!arg.startsWith('--')) || (expectPreIdempotency?'prisma/audit/pre-resolve-catalog.json':expectBaselineOnly?'prisma/audit/post-resolve-catalog.json':'prisma/audit/production-catalog.json'));
const url = new URL(process.env.DATABASE_URL);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  options: '-c default_transaction_read_only=on -c statement_timeout=15000 -c lock_timeout=3000',
  application_name: 'utf_prisma_baseline_readonly_audit',
});
const ident = value => '"' + value.replaceAll('"', '""') + '"';
const rows = async sql => (await client.query(sql)).rows;
const report = {
  auditedAt: new Date().toISOString(),
  endpointFingerprint: createHash('sha256').update(url.hostname + ':' + url.port + url.pathname).digest('hex'),
};
try {
  await client.connect();
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  report.session = (await rows(`SELECT current_database() AS database, current_setting('server_version') AS postgres_version,
    current_setting('transaction_read_only') AS transaction_read_only,
    current_setting('default_transaction_read_only') AS default_transaction_read_only,
    current_setting('search_path') AS search_path`))[0];
  if (report.session.transaction_read_only !== 'on' || report.session.default_transaction_read_only !== 'on') throw Error('Read-only guards missing');
  report.schemas = await rows(`SELECT nspname AS name FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema' ORDER BY 1`);
  report.tables = await rows(`SELECT n.nspname AS schema, c.relname AS name, c.relkind AS kind,
    c.relpersistence AS persistence, c.relrowsecurity AS rls, c.relforcerowsecurity AS force_rls,
    pg_get_partkeydef(c.oid) AS partition_key
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname<>'information_schema' AND c.relkind IN ('r','p','v','m','f') ORDER BY 1,2`);
  report.columns = await rows(`SELECT n.nspname AS schema, c.relname AS table_name, a.attnum AS position, a.attname AS name,
    format_type(a.atttypid,a.atttypmod) AS type, a.attnotnull AS not_null,
    pg_get_expr(d.adbin,d.adrelid) AS default_expression, a.attidentity AS identity, a.attgenerated AS generated,
    CASE WHEN a.attcollation<>t.typcollation THEN col.collname ELSE NULL END AS custom_collation
    FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    JOIN pg_type t ON t.oid=a.atttypid LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
    LEFT JOIN pg_collation col ON col.oid=a.attcollation
    WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname<>'information_schema' AND c.relkind IN ('r','p','v','m','f') AND a.attnum>0 AND NOT a.attisdropped ORDER BY 1,2,3`);
  report.constraints = await rows(`SELECT n.nspname AS schema, c.relname AS table_name, con.conname AS name,
    con.contype AS type, con.convalidated AS validated, con.condeferrable AS deferrable, con.condeferred AS deferred,
    pg_get_constraintdef(con.oid,true) AS definition,
    ARRAY(SELECT a.attname::text FROM unnest(con.conkey) WITH ORDINALITY k(num,pos) JOIN pg_attribute a ON a.attrelid=con.conrelid AND a.attnum=k.num ORDER BY k.pos) AS columns,
    rn.nspname AS referenced_schema, rc.relname AS referenced_table,
    ARRAY(SELECT a.attname::text FROM unnest(con.confkey) WITH ORDINALITY k(num,pos) JOIN pg_attribute a ON a.attrelid=con.confrelid AND a.attnum=k.num ORDER BY k.pos) AS referenced_columns
    FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    LEFT JOIN pg_class rc ON rc.oid=con.confrelid LEFT JOIN pg_namespace rn ON rn.oid=rc.relnamespace
    WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname<>'information_schema' ORDER BY 1,2,3`);
  report.indexes = await rows(`SELECT n.nspname AS schema, t.relname AS table_name, i.relname AS name,
    x.indisunique AS unique, x.indisprimary AS primary, x.indisvalid AS valid, x.indisready AS ready,
    pg_get_indexdef(i.oid) AS definition, pg_get_expr(x.indpred,x.indrelid) AS predicate,
    pg_get_expr(x.indexprs,x.indrelid) AS expressions
    FROM pg_index x JOIN pg_class i ON i.oid=x.indexrelid JOIN pg_class t ON t.oid=x.indrelid
    JOIN pg_namespace n ON n.oid=t.relnamespace WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname<>'information_schema' ORDER BY 1,2,3`);
  report.enums = await rows(`SELECT n.nspname AS schema,t.typname AS name,array_agg(e.enumlabel::text ORDER BY e.enumsortorder) AS values
    FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace JOIN pg_enum e ON e.enumtypid=t.oid
    WHERE n.nspname NOT LIKE 'pg_%' GROUP BY 1,2 ORDER BY 1,2`);
  report.extensions = await rows('SELECT extname AS name,extversion AS version FROM pg_extension ORDER BY 1');
  report.sequences = await rows(`SELECT schemaname AS schema,sequencename AS name,data_type,start_value,min_value,max_value,increment_by,cycle FROM pg_sequences WHERE schemaname NOT LIKE 'pg_%' ORDER BY 1,2`);
  report.triggers = await rows(`SELECT n.nspname AS schema,c.relname AS table_name,t.tgname AS name,pg_get_triggerdef(t.oid) AS definition
    FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE NOT t.tgisinternal AND n.nspname NOT LIKE 'pg_%' ORDER BY 1,2,3`);
  report.routines = await rows(`SELECT n.nspname AS schema,p.proname AS name,pg_get_function_identity_arguments(p.oid) AS arguments
    FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname<>'information_schema' ORDER BY 1,2,3`);
  report.policies = await rows(`SELECT schemaname AS schema,tablename AS table_name,policyname AS name,permissive,roles,cmd,qual,with_check FROM pg_policies ORDER BY 1,2,3`);
  report.rowCounts = [];
  for (const table of report.tables.filter(t=>['r','p'].includes(t.kind))) {
    const [count] = await rows(`SELECT count(*)::text AS rows FROM ${ident(table.schema)}.${ident(table.name)}`);
    report.rowCounts.push({ schema:table.schema,table:table.name,rows:count.rows });
  }
  const migrations = report.tables.find(t=>t.name==='_prisma_migrations');
  report.migrationHistory = migrations ? await rows(`SELECT migration_name,checksum,started_at,finished_at,rolled_back_at,applied_steps_count,(logs IS NOT NULL AND logs<>'') AS has_logs FROM ${ident(migrations.schema)}."_prisma_migrations" ORDER BY started_at,migration_name`) : null;
  report.foreignKeyChecks = [];
  for (const fk of report.constraints.filter(c=>c.type==='f')) {
    const nonNull=fk.columns.map(c=>`child.${ident(c)} IS NOT NULL`).join(' AND ');
    const equal=fk.columns.map((c,i)=>`parent.${ident(fk.referenced_columns[i])}=child.${ident(c)}`).join(' AND ');
    const [check]=await rows(`SELECT count(*)::text AS orphan_rows FROM ${ident(fk.schema)}.${ident(fk.table_name)} child WHERE ${nonNull} AND NOT EXISTS (SELECT 1 FROM ${ident(fk.referenced_schema)}.${ident(fk.referenced_table)} parent WHERE ${equal})`);
    report.foreignKeyChecks.push({name:fk.name,...check});
  }
  report.idempotency = {};
  for (const [table,result] of [['customer_order','merchNotificationResult'],['booking_request','bookingNotificationResult']]) {
    const names=['idempotencyKey','idempotencyRequestHash',result];
    const found=report.columns.filter(c=>c.schema==='public'&&c.table_name===table&&names.includes(c.name));
    const item={columns:found,indexes:report.indexes.filter(i=>i.schema==='public'&&i.table_name===table&&/idempotency/i.test(i.definition))};
    if(found.some(c=>c.name==='idempotencyKey')){
      item.keyStats=(await rows(`SELECT count(*)::text AS rows,count("idempotencyKey")::text AS non_null_keys,count(DISTINCT "idempotencyKey")::text AS distinct_non_null_keys FROM public.${ident(table)}`))[0];
      item.duplicateGroups=(await rows(`SELECT count(*)::text AS duplicate_groups FROM (SELECT "idempotencyKey" FROM public.${ident(table)} WHERE "idempotencyKey" IS NOT NULL GROUP BY "idempotencyKey" HAVING count(*)>1) d`))[0];
    }
    report.idempotency[table]=item;
  }
  await client.query('ROLLBACK');
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(report,null,2)+'\n');
  if(expectPreIdempotency||expectBaselineOnly){
    const reference=JSON.parse(await readFile('prisma/audit/production-catalog.json','utf8'));
    assert.equal(report.endpointFingerprint,reference.endpointFingerprint,'Datasource target changed; audit again before resolve');
    for(const key of ['schemas','tables','columns','constraints','indexes','enums','extensions','sequences','triggers','routines','policies']){
      const current=expectBaselineOnly?report[key].filter(item=>item.table_name!=='_prisma_migrations'&&!(key==='tables'&&item.name==='_prisma_migrations')):report[key];
      assert.deepEqual(current,reference[key],`Production ${key} changed; stop before deploy`);
    }
    if(expectPreIdempotency)assert.equal(report.migrationHistory,null,'Migration history now exists; inspect it before resolve');
    if(expectBaselineOnly){
      assert.equal(report.migrationHistory?.length,1,'Only the baseline must be recorded');
      const entry=report.migrationHistory[0];
      assert.equal(entry.migration_name,'0_init_pre_idempotency');
      assert.ok(entry.finished_at&&!entry.rolled_back_at&&!entry.has_logs,'Baseline history is not a clean completed entry');
      assert.equal(entry.checksum,createHash('sha256').update(await readFile('prisma/migrations/0_init_pre_idempotency/migration.sql')).digest('hex'),'Baseline checksum differs');
    }
    assert.ok(report.foreignKeyChecks.every(f=>f.orphan_rows==='0'),'Foreign-key orphan rows found');
    assert.ok(Object.values(report.idempotency).every(item=>item.columns.length===0&&item.indexes.length===0),'Idempotency is already partially or fully present');
  }
  console.log(JSON.stringify({output,session:report.session,tables:report.rowCounts,migrationHistory:report.migrationHistory,idempotency:report.idempotency,invalidForeignKeys:report.foreignKeyChecks.filter(f=>f.orphan_rows!=='0'),enums:report.enums.length,indexes:report.indexes.length},null,2));
} finally { await client.end(); }
