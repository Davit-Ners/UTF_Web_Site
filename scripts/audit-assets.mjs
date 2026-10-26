/* Local production asset smoke test. CDP browser on 9337, next start on 3338.
 * Screenshots/results go to the OS temp directory; no forms are submitted. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const tab=(await(await fetch('http://127.0.0.1:9337/json')).json()).find(t=>t.type==='page');
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const out=join(tmpdir(),'utf-assets-p0');await mkdir(out,{recursive:true});
const results=[];
const merchOnly=process.env.ASSET_AUDIT_MERCH==='1';
await send('Page.enable');
async function screenshot(name){const s=await send('Page.captureScreenshot',{format:'png'});await writeFile(join(out,name+'.png'),Buffer.from(s.data,'base64'))}
try{
  for(const width of [1440,820,375]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
    for(const path of merchOnly?['/merch']:['/','/about','/gallery','/merch','/music','/music/sent-to-die','/concerts','/concerts/utf-arlon']){
      await send('Page.navigate',{url:'http://127.0.0.1:3338'+path});await delay(1200);
      await ev(`Promise.all([...document.images].map(e=>{e.loading='eager';return e.decode().catch(()=>{})}))`);
      const data=await ev(`(()=>{const sources=[...document.querySelectorAll('main img')].map(e=>{const u=new URL(e.currentSrc||e.src);return {src:u.pathname==='/_next/image'?u.searchParams.get('url'):u.pathname,ok:e.complete&&e.naturalWidth>0,width:e.naturalWidth,sizes:e.sizes}});return {path:location.pathname,overflow:document.documentElement.scrollWidth>innerWidth+1,sources,text:document.querySelector('main').textContent,og:document.querySelector('meta[property="og:image"]')?.content}})()`);
      assert.equal(data.path,path);assert.equal(data.overflow,false,`${width} ${path} overflow`);
      assert.ok(data.sources.every(e=>e.ok),`${width} ${path} broken image: ${JSON.stringify(data.sources.filter(e=>!e.ok))}`);
      if(path==='/'){
        for(const src of ['/bandphoto.jpg','/album-cover.jpg'])assert.ok(data.sources.some(e=>e.src===src),src);
        assert.ok(!data.sources.some(e=>['/optimized/bandphoto-hero.webp','/optimized/album-cover.webp'].includes(e.src)));
        assert.ok(data.text.includes('Photo — Laurent Henoumont'));
      }
      if(path==='/concerts/utf-arlon')assert.ok(data.sources.some(e=>e.src==='/concerts/utf-arlon/poster.jpg'));
      if(path==='/merch'){
        assert.ok(data.text.includes('Album Artwork Tee')&&data.text.includes('Product photo pending.'));
        const tee=await ev(`(()=>{const row=[...document.querySelectorAll('main li')].find(e=>e.textContent.includes('Album Artwork Tee'));return {image:row?.querySelectorAll('img').length,button:!!row?.querySelector('button'),pending:row?.textContent.includes('Product photo pending.')}})()`);
        assert.deepEqual(tee,{image:0,button:true,pending:true});
        await ev(`const row=[...document.querySelectorAll('main li')].find(e=>e.textContent.includes('Album Artwork Tee'));row.scrollIntoView({block:'center'})`);
        await delay(120);await screenshot(`${width}-tee-photo-pending`);
        await ev(`[...document.querySelectorAll('main li')].find(e=>e.textContent.includes('Album Artwork Tee')).querySelector('button').click()`);await delay(80);
        await ev(`document.querySelector(${JSON.stringify(width>900?'button[class*="mastAction"]':'button[class*="trigger"]')}).click()`);await delay(250);
        assert.ok(await ev(`document.querySelector('dialog[open]')?.textContent.includes('Album Artwork Tee')`),'photo-less product stays requestable');
        await ev(`document.querySelector('dialog[open]').close()`);await delay(80);
        await ev(`document.querySelector('#all-items').scrollIntoView({block:'start'})`);await delay(150);await screenshot(`${width}-merch-rows`);
      }
      await ev('scrollTo(0,0)');await delay(200);await screenshot(`${width}-${path.replaceAll('/','_')||'home'}`);
      if(path==='/'){
        for(const [name,selector] of [['release','[class*="featuredRelease"][class*="cover"]'],['break','section[aria-label="Until They Fall live"]']]){
          await ev(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'center'})`);await delay(600);await screenshot(`${width}-home-${name}`);
        }
      }
      results.push({width,...data});
    }
    console.log('PASS asset routes:',width);
  }
  const icons=[];
  for(const path of ['/favicon.ico','/icon0.svg','/icon1.png','/apple-icon.png','/web-app-manifest-192x192.png','/web-app-manifest-512x512.png','/manifest.json']){
    const response=await fetch('http://127.0.0.1:3338'+path);assert.equal(response.status,200,path);icons.push({path,status:response.status,bytes:(await response.arrayBuffer()).byteLength});
  }
  await writeFile(join(out,merchOnly?'merch-flow.json':'results.json'),JSON.stringify({results,icons},null,2));
  console.log(`PASS ${results.length} route/width cases; all images decode, 7 icon/manifest endpoints respond. Evidence: ${out}`);
}finally{ws.close()}
