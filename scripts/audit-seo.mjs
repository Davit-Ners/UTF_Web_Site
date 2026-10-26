/* Production GET/HTML audit. No POST, external configuration or database writes.
 * Start Chromium CDP on 9337 and the production server on 3338.
 * SEO_AUDIT_ORIGIN and SEO_AUDIT_OUTAGE=1 select the isolated outage build. */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { get as httpGet } from 'node:http';
const origin=process.env.SEO_AUDIT_ORIGIN||'http://127.0.0.1:3338';
const outage=process.env.SEO_AUDIT_OUTAGE==='1';
const apex='https://untiltheyfall.com';
const tab=(await(await fetch('http://127.0.0.1:9337/json')).json()).find(t=>t.type==='page');
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}});
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const out=join(tmpdir(),'utf-seo-final');await mkdir(out,{recursive:true});
const results=[],failures=[],socialImages=new Map();
const check=(ok,message,detail)=>{if(!ok)failures.push({message,detail})};
const canonical=path=>new URL(path,apex).href;
const sameUrl=(value,expected)=>{try{return new URL(value).href===new URL(expected).href}catch{return false}};
const get=async(path,ua='Mozilla/5.0')=>{
  const r=await fetch(origin+path,{redirect:'manual',headers:{'user-agent':ua}});
  return {path,ua,status:r.status,location:r.headers.get('location'),xRobots:r.headers.get('x-robots-tag'),html:await r.text()};
};
async function parse(html){return ev(`(()=>{const d=new DOMParser().parseFromString(${JSON.stringify(html)},'text/html');const meta=n=>d.querySelector('meta[property="'+n+'"],meta[name="'+n+'"]')?.content;return {title:d.querySelector('title')?.textContent,description:meta('description'),canonicals:[...d.querySelectorAll('link[rel="canonical"]')].map(e=>e.getAttribute('href')),robots:[...d.querySelectorAll('meta[name="robots"]')].map(e=>e.content),ogTitle:meta('og:title'),ogDescription:meta('og:description'),ogUrl:meta('og:url'),twitterTitle:meta('twitter:title'),twitterDescription:meta('twitter:description'),twitterCard:meta('twitter:card'),images:[...d.querySelectorAll('meta[property="og:image"]')].map(e=>({url:e.content,width:e.parentElement.querySelector('meta[property="og:image:width"]')?.content,height:e.parentElement.querySelector('meta[property="og:image:height"]')?.content})),twitterImages:[...d.querySelectorAll('meta[name="twitter:image"]')].map(e=>e.content),jsonld:[...d.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)),links:[...d.querySelectorAll('a[href]')].map(e=>({href:e.getAttribute('href'),text:e.textContent})),text:d.querySelector('main')?.textContent,headOg:!!d.head.querySelector('meta[property="og:url"]')}})()`)}
const normalPaths=['/','/music','/music/sent-to-die','/concerts','/concerts/utf-arlon','/gallery','/about','/merch','/booking','/privacy','/legal'];
try{
  const robot=await get('/robots.txt');
  check(robot.status===200,'robots HTTP 200');
  check(/Allow: \/(?:\r?\n|$)/.test(robot.html)&&/Disallow: \/api\//.test(robot.html)&&robot.html.includes(`Sitemap: ${apex}/sitemap.xml`)&&!/Disallow: \/\s*$|noindex/im.test(robot.html),'robots public crawlability',robot.html);
  const sitemap=await get('/sitemap.xml');check(sitemap.status===200,'sitemap HTTP 200');
  const urls=await ev(`(()=>{const d=new DOMParser().parseFromString(${JSON.stringify(sitemap.html)},'application/xml');if(d.querySelector('parsererror'))throw Error('Invalid sitemap XML');return [...d.querySelectorAll('loc')].map(e=>e.textContent)})()`);
  check(new Set(urls).size===urls.length,'unique sitemap URLs');
  check(!sitemap.html.includes('lastmod'),'no invented lastModified');
  for(const path of normalPaths.filter(p=>p!=='/concerts/utf-arlon'))check(urls.some(u=>new URL(u).href===canonical(path)),`sitemap static/release ${path}`);
  for(const url of urls)check(new URL(url).origin===apex&&!/\/api\/|\/past$|concert-photos$|does-not-exist/.test(url),'canonical sitemap URL',url);
  if(outage)check(urls.length===10,'outage sitemap retains exactly 10 static/release URLs',urls);
  const paths=[...new Set([...normalPaths,...urls.map(u=>new URL(u).pathname),...(outage?['/concerts/utf-arlon/gallery']:[])])];
  for(const path of paths){
    const r=await get(path,'bingbot');const d=await parse(r.html);
    check(r.status===200,`${path}: HTTP 200`,r.status);
    check(d.canonicals.length===1&&sameUrl(d.canonicals[0],canonical(path)),`${path}: own apex canonical`,d.canonicals);
    check(sameUrl(d.ogUrl,canonical(path)),`${path}: own OG URL`,d.ogUrl);
    check(!!d.title&&!!d.description&&!!d.ogTitle&&!!d.ogDescription&&!!d.twitterTitle&&!!d.twitterDescription&&!!d.twitterCard,`${path}: complete metadata`,d);
    check(!d.robots.some(s=>/noindex/i.test(s))&&!/noindex/i.test(r.xRobots||''),`${path}: public page indexable`,d.robots);
    check(d.images.length>0&&d.twitterImages.length>0,`${path}: social image present`,{og:d.images,twitter:d.twitterImages});
    check(d.headOg,`${path}: Bing metadata in head`);
    for(const image of d.images){check(new URL(image.url).origin===apex,`${path}: local canonical social image`,image);socialImages.set(image.url,image)}
    for(const image of d.twitterImages)if(!socialImages.has(image))socialImages.set(image,{url:image});
    if(outage&&path.startsWith('/concerts/utf-arlon'))check(!d.description.includes('Arlon')&&!d.description.includes('2025')&&!d.jsonld.some(j=>j['@type']==='MusicEvent'),`${path}: truthful outage metadata`,d);
    if(path==='/'){
      const groups=d.jsonld.filter(j=>j['@type']==='MusicGroup');check(groups.length===1,'one authoritative homepage MusicGroup',groups);
      const band=groups[0];check(band?.name==='Until They Fall'&&band.url===apex&&band.foundingDate==='2018'&&band.member.length===5&&band.foundingLocation.address.addressLocality==='Brussels'&&band.foundingLocation.address.addressCountry==='BE'&&band.album[0].name==='Sent To Die'&&band.sameAs.length>=3,'homepage band schema',band);
    }
    if(path==='/music/sent-to-die'){
      const album=d.jsonld.find(j=>j['@type']==='MusicAlbum');
      check(album?.name==='Sent To Die'&&album.numTracks===8&&album.track.itemListElement.length===8&&album.datePublished==='2023-12-01'&&album.byArtist['@id']===apex+'/#band'&&album.image===apex+'/album-cover.jpg','MusicAlbum schema',album);
      check(!/recordLabel|catalogNumber|"offers"|"price"/.test(JSON.stringify(album)),'no invented album commerce');
    }
    if(path.startsWith('/concerts/')&&!outage){const event=d.jsonld.find(j=>j['@type']==='MusicEvent');check(event?.performer[0].name==='Until They Fall'&&event.performer[0]['@id']===apex+'/#band'&&event.eventStatus==='https://schema.org/EventScheduled'&&!!event.location?.name&&!!event.startDate,'MusicEvent schema',event);check(!event?.offers,'past concerts have no ticket offers',event?.offers)}
    if(path==='/merch')check(/request|requests/i.test(d.description)&&/email/i.test(d.description)&&!d.jsonld.some(j=>['Product','Offer'].includes(j['@type'])),'truthful Merch SEO',d.description);
    check(!d.links.some(l=>['/concerts/past','/gallery/concert-photos'].includes(l.href)),`${path}: no important redirect links`);
    results.push({path,ua:r.ua,status:r.status,...d});
  }
  check(new Set(results.filter(r=>normalPaths.includes(r.path)).map(r=>r.title)).size===normalPaths.length,'major route titles unique');
  for(const [path,target] of [['/','/music'],['/','/concerts'],['/','/merch'],['/music','/music/sent-to-die'],['/booking','/privacy'],['/merch','/privacy'],['/concerts/utf-arlon',outage?'/concerts':'/concerts#archive']])check(results.find(r=>r.path===path)?.links.some(l=>l.href===target),`${path} crawl link to ${target}`);
  for(const d of results.filter(r=>normalPaths.includes(r.path)))for(const target of ['/privacy','/legal'])check(d.links.some(l=>l.href===target),`${d.path} footer link ${target}`);
  if(!outage)check(results.find(r=>r.path==='/concerts').links.some(l=>l.href==='/concerts/utf-arlon'),'Concerts links to dossiers');
  for(const [url,image] of socialImages){const path=new URL(url).pathname;const r=await get(path);check(r.status===200,'social image HTTP 200',path);const m=await sharp(await readFile(join('public',decodeURIComponent(path)))).metadata();if(image.width)check(Number(image.width)===m.width&&Number(image.height)===m.height,'correct social image dimensions',{image,actual:[m.width,m.height]})}
  if(!outage){
    for(const path of ['/missing-seo-audit','/music/does-not-exist','/concerts/does-not-exist','/concerts/does-not-exist/gallery','/concerts/utf-arlon/gallery'])for(const ua of ['Mozilla/5.0','Googlebot','bingbot']){
      const r=await get(path,ua),d=await parse(r.html);check(r.status===404,`${ua} ${path}: true HTTP 404`,r.status);check(d.robots.some(s=>/noindex/.test(s)),`${ua} ${path}: noindex`,d.robots);check(!d.canonicals.includes(apex+'/'),`${ua} ${path}: no homepage canonical`,d.canonicals);check(/page not found/i.test(d.title),`${ua} ${path}: branded 404 title`,d.title);results.push({path,ua,status:r.status,title:d.title,robots:d.robots,canonicals:d.canonicals});
    }
  }
  for(const path of ['/concerts/utf-arlon','/music/sent-to-die'])for(const ua of ['Googlebot','Twitterbot','facebookexternalhit']){const r=await get(path,ua),d=await parse(r.html);check(r.status===200&&d.canonicals[0]===canonical(path)&&d.ogUrl===canonical(path),`${ua} ${path}: crawl/social metadata`);if(ua!=='Googlebot')check(d.headOg,`${ua} ${path}: head OG`);results.push({path,ua,status:r.status,title:d.title,canonical:d.canonicals,headOg:d.headOg})}
  // Native HTTP is required here: this Node fetch version does not forward Host.
  for(const [host,expected] of [['www.untiltheyfall.com',308],['untiltheyfall.com',200]]){
    const r=await new Promise((resolve,reject)=>{httpGet(origin+'/music/sent-to-die?x=1&source=seo',{headers:{host}},r=>{r.resume();resolve({status:r.statusCode,location:r.headers.location})}).on('error',reject)});
    check(r.status===expected,`${host}: redirect without loop`,r.status);if(expected===308)check(r.location===apex+'/music/sent-to-die?x=1&source=seo','www preserves path and query',r.location);
  }
  const dom=[];
  if(!outage){
    await send('Page.enable');
    for(const path of normalPaths){
      await send('Page.navigate',{url:origin+path});
      for(let attempt=0;attempt<80;attempt++){
        if(await ev(`location.pathname===${JSON.stringify(path)}&&document.readyState==='complete'`))break;
        await new Promise(r=>setTimeout(r,100));
      }
      await new Promise(r=>setTimeout(r,250));
      const d=await ev(`({path:location.pathname,title:document.title,canonical:[...document.querySelectorAll('link[rel="canonical"]')].map(e=>e.href),ogUrl:document.querySelector('meta[property="og:url"]')?.content,noindex:[...document.querySelectorAll('meta[name="robots"]')].some(e=>/noindex/.test(e.content))})`);
      check(d.path===path&&d.canonical.length===1&&sameUrl(d.canonical[0],canonical(path))&&sameUrl(d.ogUrl,canonical(path))&&!d.noindex,`${path}: hydrated browser metadata`,d);
      dom.push(d);
    }
  }
  await writeFile(join(out,outage?'outage.json':'production.json'),JSON.stringify({origin,outage,robots:robot.html,sitemap:urls,results,dom,socialImages:[...socialImages.keys()],failures},null,2));
  console.log(JSON.stringify({cases:results.length,domCases:dom.length,sitemapEntries:urls.length,socialImages:socialImages.size,failures},null,2));
  process.exitCode=failures.length?1:0;
}finally{ws.close()}
