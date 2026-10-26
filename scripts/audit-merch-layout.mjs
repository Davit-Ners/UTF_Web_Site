/* Targeted image-load CLS regression check; uses the same local CDP browser. */
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
const tab=(await(await fetch('http://127.0.0.1:9337/json')).json()).find(t=>t.type==='page');
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const results=[];
await send('Page.enable');
await send('Network.enable');
await send('Network.setCacheDisabled',{cacheDisabled:true});
await send('Emulation.setCPUThrottlingRate',{rate:1});
await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.shifts=[];new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)shifts.push({value:e.value,sources:e.sources.map(s=>({cls:s.node?.className,before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))})}).observe({type:'layout-shift',buffered:true})`});
try{
  for(const width of [1440,820,375])for(const reduced of [false,true]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
    await send('Page.navigate',{url:'http://127.0.0.1:3338/merch'});await delay(1200);
    await ev(`Promise.all([...document.images].map(e=>{e.loading='eager';return e.decode().catch(()=>{})}))`);
    await delay(150);
    const result=await ev(`(()=>{const nodes=[...document.querySelectorAll('main article,main article [class],main h1,main h2')];return {cls:shifts.reduce((s,e)=>s+e.value,0),shifts,geometry:nodes.map(e=>{const r=e.getBoundingClientRect();return {cls:e.className,x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height}})}})()`);
    results.push({width,reduced,...result});
  }
  const path=join(tmpdir(),'utf-motion-freeze','merch-'+(process.argv.includes('--compare')?'after':'before')+'.json');
  await writeFile(path,JSON.stringify(results,null,2));
  if(process.argv.includes('--compare')){
    const before=JSON.parse(await readFile(join(tmpdir(),'utf-motion-freeze','merch-before.json'),'utf8'));
    for(let i=0;i<results.length;i++){
      assert.equal(results[i].geometry.length,before[i].geometry.length);
      for(let j=0;j<results[i].geometry.length;j++)for(const key of ['x','y','w','h'])assert.ok(Math.abs(results[i].geometry[j][key]-before[i].geometry[j][key])<.1,JSON.stringify({i,j,key,before:before[i].geometry[j],after:results[i].geometry[j]}));
      assert.ok(results[i].cls<.01,`CLS ${results[i].width}: ${results[i].cls}`);
    }
    console.log('PASS: six cold-cache cases; identical settled geometry, CLS < .01');
    await send('Emulation.setScriptExecutionDisabled',{value:true});
    for(const width of [1440,820,375]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
      await send('Page.navigate',{url:'http://127.0.0.1:3338/merch'});await delay(1200);
      assert.ok(await ev(`document.querySelector('main h1')?.textContent==='Merch'&&document.documentElement.scrollWidth<=innerWidth+1&&!document.querySelector('[data-reveal]')`),`JS-off Merch ${width}`);
    }
    console.log('PASS: JS-off Merch remains visible with no overflow at all three widths');
  }
  console.log(JSON.stringify(results.map(({width,reduced,cls})=>({width,reduced,cls}))));
}finally{await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Network.setCacheDisabled',{cacheDisabled:false});ws.close()}
