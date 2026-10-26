/* Runs only inspection commands, with a server-enforced read-only connection.
 * --audit-output saves stdout locally (useful for db pull --print).
 * resolve/deploy/dev/reset/db push/db execute are intentionally not supported. */
import { config } from 'dotenv';
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
config({path:['.env.local','.env'],quiet:true});
const args=process.argv.slice(2);
let output;
const index=args.indexOf('--audit-output');
if(index!==-1){output=args[index+1];args.splice(index,2);if(!output)throw Error('--audit-output requires a path')}
const [group,command]=args;
if(!((group==='migrate'&&['status','diff'].includes(command))||(group==='db'&&command==='pull'&&args.includes('--print'))))throw Error('Only migrate status/diff or db pull --print are allowed');
if(args.some(a=>a==='--url'||a.startsWith('--url=')||a==='--config'||a.startsWith('--config=')))throw Error('Do not override the guarded datasource');
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
const url=new URL(process.env.DATABASE_URL);
url.searchParams.set('options','-c default_transaction_read_only=on -c statement_timeout=15000 -c lock_timeout=3000');
const result=spawnSync(process.execPath,['node_modules/prisma/build/index.js',...args],{
  env:{...process.env,DATABASE_URL:url.toString()},encoding:'utf8',maxBuffer:16*1024*1024,
});
if(output&&result.status===0)writeFileSync(output,result.stdout,'utf8');else process.stdout.write(result.stdout||'');
process.stderr.write(result.stderr||'');
if(result.error)throw result.error;
process.exitCode=result.status??1;
