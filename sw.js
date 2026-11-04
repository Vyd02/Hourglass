const CACHE='hourglass-v41';
const SHELL=['./','index.html','husband.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.pathname.endsWith('version.txt'))return; // always straight from the network
  // the app page: always ask GitHub for the newest copy (skip the phone's 10-minute cache); use the saved copy only when offline
  if(r.mode==='navigate'||u.pathname.endsWith('index.html')||u.pathname.endsWith('husband.html')||u.pathname.endsWith('/')){
    const key=u.pathname.endsWith('husband.html')?'husband.html':'index.html';
    const fresh=new URL(r.url.split('#')[0]);fresh.searchParams.set('_',Date.now());
    e.respondWith(fetch(fresh.href,{cache:'no-store'}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(key,c));return res}).catch(()=>caches.match(key)));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})))}
});
