/* Builds an isolated copy of the real application, with an unreachable local DB.
 * No source/env file in the actual app is edited and Railway is never targeted. */
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
const root=process.cwd();
const fixture=resolve(`.seo-audit-outage-${Date.now()}`);
await mkdir(fixture,{recursive:true});
for(const path of ['app','lib','public','prisma','package.json','package-lock.json','tsconfig.json','next-env.d.ts','postcss.config.mjs','prisma.config.ts','next.config.ts'])await cp(resolve(path),join(fixture,path),{recursive:true});
const config=await readFile(join(fixture,'next.config.ts'),'utf8');
await writeFile(join(fixture,'next.config.ts'),config.replace('const nextConfig: NextConfig = {',`const nextConfig: NextConfig = {\n  turbopack: { root: ${JSON.stringify(root)} },`));
const result=spawnSync(process.execPath,[resolve('node_modules/next/dist/bin/next'),'build',fixture],{
  cwd:fixture,env:{...process.env,NODE_ENV:'production',DATABASE_URL:'postgresql://seo_outage:unused@127.0.0.1:1/seo_outage?connect_timeout=1',NEXT_PUBLIC_SITE_URL:'https://wrong-preview.vercel.app',VERCEL_URL:'wrong-preview.vercel.app'},
  encoding:'utf8',maxBuffer:16*1024*1024,
});
await writeFile(join(tmpdir(),'utf-seo-outage-build.log'),result.stdout+result.stderr);
await writeFile(join(tmpdir(),'utf-seo-outage-fixture.json'),JSON.stringify({fixture,status:result.status},null,2));
console.log(JSON.stringify({fixture,status:result.status,log:join(tmpdir(),'utf-seo-outage-build.log')},null,2));
if(result.error)throw result.error;
process.exitCode=result.status??1;
