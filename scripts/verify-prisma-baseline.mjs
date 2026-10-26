/* Writes only to the isolated, explicitly pinned localhost audit instance.
 * Never reads DATABASE_URL, never accepts a production URL, never resets/drops. */
import assert from 'node:assert/strict';
import { Client } from 'pg';
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const localUrl='postgresql://utf_baseline_audit@127.0.0.1:55439/postgres';
const parsed=new URL(localUrl);
assert.equal(parsed.hostname,'127.0.0.1');
assert.equal(parsed.port,'55439');
assert.equal(parsed.username,'utf_baseline_audit');
const client=new Client({connectionString:localUrl});
const baseline='0_init_pre_idempotency';
const pendingNames=['20261023120000_merch_order_idempotency','20261025120000_booking_idempotency'];
const report={target:'isolated localhost audit instance only',steps:[],checksums:{}};
const cli=(args,expectedStatus=0)=>{
  const r=spawnSync(process.execPath,['node_modules/prisma/build/index.js',...args],{
    env:{...process.env,DATABASE_URL:localUrl,PRISMA_HIDE_UPDATE_MESSAGE:'1'},encoding:'utf8',maxBuffer:8*1024*1024,
  });
  if(r.error)throw r.error;
  report.steps.push({command:'prisma '+args.join(' '),exitCode:r.status,stdout:r.stdout,stderr:r.stderr});
  assert.equal(r.status,expectedStatus,r.stdout+r.stderr);
  return r;
};
const normalize=(rows,keys)=>rows.map(row=>Object.fromEntries(keys.map(key=>[key,row[key]])));
await client.connect();
try{
  assert.equal((await client.query(`SELECT count(*)::int AS n FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p')`)).rows[0].n,0,'Audit target must be empty; do not reuse it');
  for(const name of [baseline,...pendingNames])report.checksums[name]=createHash('sha256').update(await readFile(`prisma/migrations/${name}/migration.sql`)).digest('hex');
  await client.query(await readFile(`prisma/migrations/${baseline}/migration.sql`,'utf8'));
  const production=JSON.parse(await readFile('prisma/audit/production-catalog.json','utf8'));
  const localColumns=(await client.query(`SELECT c.table_schema AS schema,c.table_name,c.column_name AS name,c.is_nullable='NO' AS not_null,
    format_type(a.atttypid,a.atttypmod) AS type,c.column_default AS default_expression
    FROM information_schema.columns c JOIN pg_namespace n ON n.nspname=c.table_schema JOIN pg_class t ON t.relnamespace=n.oid AND t.relname=c.table_name
    JOIN pg_attribute a ON a.attrelid=t.oid AND a.attname=c.column_name WHERE c.table_schema='public' ORDER BY c.table_name,c.column_name`)).rows;
  const columnKeys=['schema','table_name','name','type','not_null','default_expression'];
  const prodColumns=[...production.columns].sort((a,b)=>a.table_name.localeCompare(b.table_name)||a.name.localeCompare(b.name));
  // Sort in JS on both sides (database collation is environment dependent).
  localColumns.sort((a,b)=>a.table_name.localeCompare(b.table_name)||a.name.localeCompare(b.name));
  assert.deepEqual(normalize(localColumns,columnKeys),normalize(prodColumns,columnKeys),'Replayed baseline columns differ from production');
  const localIndexes=(await client.query(`SELECT schemaname AS schema,tablename AS table_name,indexname AS name,indexdef AS definition FROM pg_indexes WHERE schemaname='public' ORDER BY tablename,indexname`)).rows;
  assert.deepEqual(normalize(localIndexes,['schema','table_name','name','definition']),normalize(production.indexes,['schema','table_name','name','definition']),'Replayed baseline indexes differ');
  const localConstraints=(await client.query(`SELECT n.nspname AS schema,c.relname AS table_name,con.conname AS name,con.contype AS type,
    con.convalidated AS validated,con.condeferrable AS deferrable,con.condeferred AS deferred,pg_get_constraintdef(con.oid,true) AS definition
    FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND con.contype<>'n' ORDER BY 1,2,3`)).rows;
  // PostgreSQL 18 names historical NOT NULL constraints by creation order; column attnotnull was compared above.
  assert.deepEqual(localConstraints,normalize(production.constraints.filter(c=>c.type!=='n'),['schema','table_name','name','type','validated','deferrable','deferred','definition']),'Replayed PK/FK constraints differ');
  const localEnums=(await client.query(`SELECT n.nspname AS schema,t.typname AS name,array_agg(e.enumlabel::text ORDER BY e.enumsortorder) AS values FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace JOIN pg_enum e ON e.enumtypid=t.oid WHERE n.nspname='public' GROUP BY 1,2 ORDER BY 1,2`)).rows;
  assert.deepEqual(localEnums,production.enums,'Replayed enum values/order differ');
  report.baselineCatalogMatchesProduction={columns:localColumns.length,indexes:localIndexes.length,constraints:localConstraints.length,enums:localEnums.length};
  cli(['migrate','diff','--from-config-datasource','--to-schema','prisma/audit/pre-idempotency.prisma','--exit-code']);
  // Synthetic legacy rows only. No production records are copied.
  await client.query(`INSERT INTO booking_request (id,name,email,message,"updatedAt") VALUES ('legacy-booking-1','Audit fixture','fixture@example.invalid','Synthetic fixture',CURRENT_TIMESTAMP),('legacy-booking-2','Audit fixture','fixture@example.invalid','Synthetic fixture',CURRENT_TIMESTAMP);
    INSERT INTO customer_order (id,"subtotalAmount","totalAmount",email,"updatedAt") VALUES ('legacy-order-1',1,1,'fixture@example.invalid',CURRENT_TIMESTAMP),('legacy-order-2',1,1,'fixture@example.invalid',CURRENT_TIMESTAMP);`);
  const before={};
  for(const table of ['booking_request','customer_order'])before[table]=(await client.query(`SELECT * FROM "${table}" ORDER BY id`)).rows;
  cli(['migrate','resolve','--applied',baseline]);
  const historyBefore=(await client.query('SELECT migration_name,finished_at,rolled_back_at FROM _prisma_migrations ORDER BY migration_name')).rows;
  assert.deepEqual(historyBefore.map(r=>r.migration_name),[baseline]);
  assert.ok(historyBefore.every(r=>r.finished_at&&!r.rolled_back_at));
  const status=cli(['migrate','status'],1);
  assert.ok(status.stdout.includes('Following migrations have not yet been applied:'));
  const remaining=status.stdout.split('Following migrations have not yet been applied:')[1].split('To apply migrations')[0].trim().split(/\r?\n/).filter(Boolean);
  assert.deepEqual(remaining,pendingNames);
  report.pendingAfterBaselineOnly=remaining;
  // Baseline/catalog equivalence has now been established. Deploy only to localhost.
  cli(['migrate','deploy']);
  cli(['migrate','status']);
  cli(['migrate','diff','--from-config-datasource','--to-schema','prisma/schema.prisma','--exit-code']);
  for(const [table,result] of [['booking_request','bookingNotificationResult'],['customer_order','merchNotificationResult']]){
    const after=(await client.query(`SELECT * FROM "${table}" ORDER BY id`)).rows;
    assert.deepEqual(after.map(row=>{const copy={...row};delete copy.idempotencyKey;delete copy.idempotencyRequestHash;delete copy[result];return copy}),before[table]);
    assert.ok(after.every(row=>row.idempotencyKey===null&&row.idempotencyRequestHash===null&&row[result]===null));
    await client.query(`UPDATE "${table}" SET "idempotencyKey"='audit-key' WHERE id=$1`,[after[0].id]);
    await assert.rejects(client.query(`UPDATE "${table}" SET "idempotencyKey"='audit-key' WHERE id=$1`,[after[1].id]),error=>error.code==='23505');
  }
  report.legacyRowsPreserved=true;
  report.multipleNullKeysAllowed=true;
  report.duplicateNonNullKeysRejected=true;
  report.finalHistory=(await client.query('SELECT migration_name,checksum,finished_at,rolled_back_at,applied_steps_count FROM _prisma_migrations ORDER BY migration_name')).rows;
  assert.deepEqual(report.finalHistory.map(r=>r.migration_name),[baseline,...pendingNames]);
  assert.ok(report.finalHistory.every(r=>r.finished_at&&!r.rolled_back_at&&r.checksum===report.checksums[r.migration_name]));
  await writeFile('prisma/audit/local-rehearsal.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({baselineCatalogMatchesProduction:report.baselineCatalogMatchesProduction,pendingAfterBaselineOnly:remaining,legacyRowsPreserved:true,multipleNullKeysAllowed:true,duplicateNonNullKeysRejected:true,finalSchemaDiff:'empty',productionWrites:0},null,2));
}finally{await client.end()}
