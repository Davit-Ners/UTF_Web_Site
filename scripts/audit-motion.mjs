/* Read-only production browser audit. Run against `next start`, with Chromium
 * listening on CDP_PORT (default 9337). No submissions or database writes. */
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const origin = process.env.MOTION_AUDIT_ORIGIN || 'http://127.0.0.1:3337';
const probe = process.env.MOTION_AUDIT_PROBE === '1';
const detailsOnly = process.env.MOTION_AUDIT_DETAILS === '1';
const tabs = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9337}/json`)).json();
const socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => socket.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', ({ data }) => {
  const m = JSON.parse(data);
  if (m.method === 'Runtime.exceptionThrown') runtimeErrors.push(m.params.exceptionDetails.text);
  if (!m.id) return;
  const p = pending.get(m.id);
  pending.delete(m.id);
  if (m.error) p.reject(Error(JSON.stringify(m.error))); else p.resolve(m.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const ev = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const delay = ms => new Promise(r => setTimeout(r, ms));
const out = join(tmpdir(), 'utf-motion-freeze');
await mkdir(out, { recursive: true });
const results = [];
const failures = [];
function check(value, message, detail) {
  if (!value) failures.push({ message, detail });
}
await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
await send('Accessibility.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.audit = {cls:0,lcp:0,frames:[],longTasks:[],shifts:[]};
  new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput){audit.cls+=e.value;audit.shifts.push({value:e.value,time:e.startTime,sources:e.sources.map(s=>({node:s.node?.className,tag:s.node?.tagName,src:s.node?.getAttribute('src'),before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))})}}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())audit.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())audit.longTasks.push(e.duration)}).observe({type:'longtask',buffered:true});
  let last;const until=performance.now()+2200;function frame(t){if(last)audit.frames.push(t-last);last=t;if(t<until)requestAnimationFrame(frame)}requestAnimationFrame(frame);
` });
const routes = [
  ['/', 2, 1, 1], ['/music', 1, 1, 0], ['/music/sent-to-die', 1, 2, 0],
  ['/concerts', 1, 1, 0], ['/concerts/utf-arlon', 0, 1, 0],
  ['/about', 1, 0, 0], ['/gallery', 1, 0, 0], ['/missing-motion-audit', 0, 0, 1],
  ['/booking', 0, 0, 0], ['/privacy', 0, 0, 0], ['/legal', 0, 0, 0], ['/merch', 0, 0, 0],
];
async function navigate(path, wait = 1000) {
  await send('Page.navigate', { url: origin + path });
  for (let n = 0; n < 150; n++) {
    if (await ev(`location.pathname===${JSON.stringify(path)}&&document.readyState==='complete'`)) break;
    await delay(50);
  }
  await delay(wait);
}
const snapshot = `(()=>{
  const style=(e,p)=>getComputedStyle(e,p);
  const plates=[...document.querySelectorAll('.plate')];
  const rules=[...document.querySelectorAll('.rule-cut')];
  const ghosts=[...document.querySelectorAll('.registration')];
  return {
    counts:[plates.length,rules.length,ghosts.length],
    pending:document.querySelectorAll('[data-reveal="pending"]').length,
    covered:plates.filter(e=>style(e,'::after').transform!=='matrix(1, 0, 0, 0, 0, 0)').map(e=>({cls:e.className,t:style(e,'::after').transform})),
    incompleteRules:rules.filter(e=>!['none','matrix(1, 0, 0, 1, 0, 0)'].includes(style(e,'::before').transform)).map(e=>e.className),
    visibleGhosts:ghosts.filter(e=>style(e,'::before').visibility!=='hidden').length,
    invisibleLabels:[...document.querySelectorAll('.rule-cut-label')].filter(e=>style(e).color==='rgba(0, 0, 0, 0)').length,
    delayedPrimitives:[...plates,...rules,...ghosts].filter(e=>[style(e),style(e,'::before'),style(e,'::after')].some(s=>[s.animationDelay,s.transitionDelay].some(d=>d.split(',').some(v=>parseFloat(v)>0)))).length,
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    main:document.querySelector('main')?.innerText.length||0,
    animatedRows:[...document.querySelectorAll('main li,main img')].filter(e=>style(e).animationName!=='none'||style(e).transitionProperty.split(', ').some(p=>['filter','backdrop-filter','box-shadow'].includes(p))).map(e=>e.className),
    motion:document.getAnimations().filter(a=>a.playState==='running').map(a=>a.animationName||a.transitionProperty),
    metrics:window.audit,
  }
})()`;
async function scrollAll() {
  // Timers in the document are intentionally disabled during the JS-off pass.
  const { height, step } = await ev('({height:document.documentElement.scrollHeight,step:innerHeight*.65})');
  for(let y=0;y<height;y+=step){await ev(`scrollTo(0,${y})`);await delay(85)}
  await delay(1600);
}
async function key(key, modifiers = 0) {
  const keyCode = { Escape:27, Tab:9, ArrowLeft:37, ArrowRight:39, Home:36, End:35 }[key];
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, modifiers, windowsVirtualKeyCode:keyCode, nativeVirtualKeyCode:keyCode });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, modifiers, windowsVirtualKeyCode:keyCode, nativeVirtualKeyCode:keyCode });
}
async function click(selector) {
  const point = await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)return null;e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  assert.ok(point, selector);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  await delay(60);
}
try {
  for (const width of probe || detailsOnly ? [] : [1440, 820, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width===375?812:900, deviceScaleFactor:1, mobile:false });
    for (const mode of ['normal', 'reduce', 'js-off']) {
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: mode==='reduce'?'reduce':'no-preference' }] });
      await send('Emulation.setScriptExecutionDisabled', { value: mode==='js-off' });
      for (const [path, ...counts] of routes) {
        await navigate(path);
        const before = await ev(snapshot);
        check(JSON.stringify(before.counts)===JSON.stringify(counts), `${width} ${mode} ${path}: route primitives`, before.counts);
        check(!before.overflow, `${width} ${mode} ${path}: overflow`);
        check(before.main>10, `${width} ${mode} ${path}: content visible`);
        check(!before.animatedRows.length, `${width} ${mode} ${path}: static rows/images`, before.animatedRows);
        if(mode!=='normal') {
          check(!before.pending&&!before.covered.length&&!before.incompleteRules.length&&!before.visibleGhosts&&!before.invisibleLabels&&!before.motion.length, `${width} ${mode} ${path}: final static state`, before);
          if(mode==='reduce')check(!before.delayedPrimitives,`${width} ${path}: no reduced-motion delays`,before.delayedPrimitives);
        }
        await scrollAll();
        const after = await ev(snapshot);
        check(!after.pending&&!after.covered.length&&!after.incompleteRules.length&&!after.visibleGhosts&&!after.invisibleLabels, `${width} ${mode} ${path}: settled after scroll`, after);
        if(mode!=='js-off') check(after.metrics.cls<.01, `${width} ${mode} ${path}: CLS < .01`, after.metrics.cls);
        results.push({width,mode,path,cls:after.metrics?.cls,lcp:before.metrics?.lcp});
      }
      console.log('Routes complete:',width,mode);
      await writeFile(join(out,'progress.json'),JSON.stringify({results,failures},null,2));
    }
  }
  await send('Emulation.setScriptExecutionDisabled', { value:false });
  for(const width of detailsOnly ? [] : [1440,820,375]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
    for(const reduced of [false,true]) {
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
      await navigate('/gallery');
      await click('button[aria-label^="Open Photo"]');
      const open=await ev(`(()=>{const d=document.querySelector('dialog[open]');return {open:!!d,focus:document.activeElement?.textContent,live:d?.querySelectorAll('[aria-live="polite"]').length,caption:d?.querySelector('[aria-live]')?.textContent,images:d?.querySelectorAll('img').length,animations:document.getAnimations().filter(a=>a.playState==='running').map(a=>a.animationName),name:d?.getAttribute('aria-label')}})()`);
      check(open.open&&open.focus.trim()==='Close'&&open.live===1&&open.images===1,`${width} ${reduced}: viewer open`,open);
      if(reduced)check(!open.animations.length,`${width}: reduced viewer instant`,open);
      await key('ArrowRight');
      const next=await ev(`document.querySelector('dialog [aria-live]')?.textContent`);
      check(next!==open.caption,`${width}: next updates caption`);
      await key('ArrowLeft');
      check(await ev(`document.querySelector('dialog [aria-live]')?.textContent`)===open.caption,`${width}: previous restores caption`);
      const ax=await send('Accessibility.getFullAXTree');
      check(ax.nodes.filter(n=>n.role?.value==='dialog'&&!n.ignored).length===1,`${width}: accessible viewer dialog`);
      await key('Escape');
      await delay(180);
      check(await ev(`!document.querySelector('dialog[open]')&&document.activeElement?.getAttribute('aria-label')?.startsWith('Open Photo')`),`${width}: viewer Escape + focus return`);
      await navigate('/merch');
      const trigger=width>900?'button[class*="mastAction"]':'button[class*="trigger"]';
      await click(trigger);
      const drawer=await ev(`({open:!!document.querySelector('dialog[open]'),focus:document.activeElement?.textContent.trim(),animations:document.getAnimations().filter(a=>a.playState==='running').map(a=>a.animationName)})`);
      check(drawer.open&&drawer.focus.startsWith('Close'),`${width}: drawer open`,drawer);
      if(reduced||width<=900)check(!drawer.animations.length,`${width}: instant drawer`,drawer);
      await key('Escape');await delay(80);
      check(await ev(`!document.querySelector('dialog[open]')&&document.activeElement?.getAttribute('aria-haspopup')==='dialog'`),`${width}: drawer focus return`);
      if(width<=980){
        await navigate('/');await click('button[aria-controls="mobile-menu"]');
        check(await ev(`document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')==='true'&&document.body.style.overflow==='hidden'&&!document.querySelector('#mobile-menu').inert`),`${width}: menu state/lock/inert`);
        await ev(`const links=[...document.querySelectorAll('header a[href],header button')].filter(e=>e.offsetParent!==null&&!e.closest('[inert]'));links.at(-1).focus()`);
        await key('Tab');
        check(await ev(`document.activeElement===document.querySelector('header a')`),`${width}: menu Tab wraps`);
        await key('Tab',8);
        check(await ev(`document.activeElement.closest('#mobile-menu')!==null`),`${width}: menu Shift+Tab wraps`);
        await ev(`document.querySelector('#mobile-menu a').focus()`);
        await key('Escape');await delay(180);
        check(await ev(`document.activeElement===document.querySelector('[aria-controls="mobile-menu"]')`),`${width}: menu Escape restores toggle focus`);
        check(await ev(`document.body.style.overflow!=='hidden'&&document.querySelector('#mobile-menu').inert`),`${width}: menu unlock`);
        await click('button[aria-controls="mobile-menu"]');
        await send('Emulation.setDeviceMetricsOverride',{width:1200,height:900,deviceScaleFactor:1,mobile:false});await delay(180);
        check(await ev(`document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')==='false'&&document.body.style.overflow!=='hidden'`),`${width}: breakpoint cleanup`);
        await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
      }
      results.push({width,reduced,interactions:true});
    }
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  if (detailsOnly) {
    await send('Emulation.setDeviceMetricsOverride',{width:820,height:900,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await send('Network.setCacheDisabled',{cacheDisabled:true});
    for(let run=0;run<2;run++){
      await navigate('/merch');await scrollAll();
      const merch=await ev('window.audit');
      results.push({merchClsProbe:run,cls:merch.cls,shifts:merch.shifts});
      console.log('Merch CLS probe:',JSON.stringify(results.at(-1)));
    }
    await send('Network.setCacheDisabled',{cacheDisabled:false});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await send('Page.addScriptToEvaluateOnNewDocument',{source:`
      window.motionFrames=[];const stop=performance.now()+1400;
      function sample(t){
        const photo=document.querySelector('[data-signature] img');
        const plate=document.querySelector('[data-signature] .plate');
        if(photo&&plate){const s=getComputedStyle(photo);motionFrames.push({t,photo:s.transform,opacity:s.opacity,plate:getComputedStyle(plate,'::after').transform,ghost:getComputedStyle(document.querySelector('.registration'),'::before').visibility})}
        if(t<stop)requestAnimationFrame(sample)
      }requestAnimationFrame(sample);
    `});
    for(const width of [1440,820,375]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
      await send('Emulation.setCPUThrottlingRate',{rate:width===375?4:width===820?2:1});
      await navigate('/',1600);
      const frames=await ev('window.motionFrames');
      check(frames.length>0&&new Set(frames.map(f=>f.photo+'|'+f.opacity)).size===1,`${width}: hero photo never zooms/fades`,frames.slice(0,3));
      const scroll=await ev(`(async()=>{const gaps=[];let last;const end=performance.now()+2000;const heights=document.documentElement.scrollHeight-innerHeight;await new Promise(resolve=>{function step(t){if(last)gaps.push(t-last);last=t;scrollTo(0,heights*(1-(end-t)/2000));if(t<end)requestAnimationFrame(step);else resolve()}requestAnimationFrame(step)});return {over34:gaps.filter(t=>t>34).length,max:Math.max(...gaps),frames:gaps.length}})()`);
      results.push({width,heroFrames:frames.length,scroll});
      await ev('scrollTo(0,0)');
      const shot=await send('Page.captureScreenshot',{format:'png'});
      await writeFile(join(out,`${width}-home.png`),Buffer.from(shot.data,'base64'));
      await ev(`document.querySelector('header a[href="/music"]').click()`);await delay(500);
      check(await ev(`location.pathname==='/music'`),`${width}: client navigation to Music`);
      // Client navigation back to Home must settle the signature immediately.
      await click('header a[aria-label="Until They Fall home"]');await delay(350);
      check(await ev(`!!document.querySelector('[data-signature-played]')&&getComputedStyle(document.querySelector('.plate-load'),'::after').animationName==='none'`),`${width}: no Hero replay on client navigation`);
      await navigate('/gallery');await click('button[aria-label^="Open Photo"]');
      await delay(250);
      const viewerShot=await send('Page.captureScreenshot',{format:'png'});
      await writeFile(join(out,`${width}-viewer.png`),Buffer.from(viewerShot.data,'base64'));
      await key('Escape');
      if(width<=980){
        await click('button[aria-controls="mobile-menu"]');await delay(250);
        const menuShot=await send('Page.captureScreenshot',{format:'png'});
        await writeFile(join(out,`${width}-menu.png`),Buffer.from(menuShot.data,'base64'));
        // Real pointer navigation closes the menu and releases its lock.
        await click('#mobile-menu a[href="/music"]');await delay(400);
        check(await ev(`location.pathname==='/music'&&document.body.style.overflow!=='hidden'&&document.querySelector('[aria-controls="mobile-menu"]').getAttribute('aria-expanded')==='false'`),`${width}: menu navigation cleanup`);
      }
    }
    await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setSafeAreaInsetsOverride',{insets:{top:47,bottom:34,left:0,right:0}});
    await navigate('/');await click('button[aria-controls="mobile-menu"]');await delay(250);
    const safe=await ev(`(()=>{const row=document.querySelector('header>div');const panel=document.querySelector('#mobile-menu');return {header:getComputedStyle(document.documentElement).getPropertyValue('--header-h'),row:row.getBoundingClientRect().top,panel:panel.getBoundingClientRect().top,locked:document.body.style.overflow==='hidden',expanded:document.querySelector('[aria-controls]').getAttribute('aria-expanded')}})()`);
    check(safe.row===47&&safe.panel===103&&safe.locked&&safe.expanded==='true','iOS safe-area header and menu',safe);
    await key('Escape');
    await send('Emulation.setSafeAreaInsetsOverride',{insets:{top:0,bottom:0,left:0,right:0}});
    results.push({safeArea:safe});
  }
  await navigate('/music/sent-to-die');
  const pendingBefore=await ev(`document.querySelectorAll('[data-reveal="pending"]').length`);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await delay(60);
  check(pendingBefore>0&&await ev(`document.querySelectorAll('[data-reveal="pending"]').length===0`),'live reduced-motion change: Reveal settles pending targets',pendingBefore);
  check(!(await ev(snapshot)).delayedPrimitives,'reduced primitives have no animation or transition delay');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await navigate('/concerts/utf-arlon');
  await ev(`document.querySelector('.rule-cut-label').dataset.reveal='pending'`);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  check(await ev(`getComputedStyle(document.querySelector('.rule-cut-label')).color!=='rgba(0, 0, 0, 0)'`),'live reduced-motion change: pending label visible');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  // Production, local warm-cache diagnostic, 5 runs per width; mobile at 4x CPU.
  const perf=[];
  for(const width of probe || detailsOnly ? [] : [1440,820,375]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:900,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setCPUThrottlingRate',{rate:width===375?4:width===820?2:1});
    for(let run=0;run<5;run++){
      await navigate('/',2400);
      const data=await ev('window.audit');
      perf.push({width,run,cls:data.cls,lcp:data.lcp,framesOver34:data.frames.filter(t=>t>34).length,maxFrame:Math.max(...data.frames),longTasks:data.longTasks});
    }
  }
  await send('Emulation.setCPUThrottlingRate',{rate:1});
  check(!runtimeErrors.length,'no uncaught browser exceptions',runtimeErrors);
  await writeFile(join(out,detailsOnly?'details.json':probe?'interactions.json':'results.json'),JSON.stringify({origin,results,perf,failures},null,2));
  console.log(JSON.stringify({cases:results.length,failures,perf},null,2));
  process.exitCode=failures.length?1:0;
} finally {
  await send('Emulation.setScriptExecutionDisabled',{value:false});
  await send('Emulation.setCPUThrottlingRate',{rate:1});
  socket.close();
}
