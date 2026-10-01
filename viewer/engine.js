/* Smart Pergola 3D viewer engine — shared by all quote models (p/<quote>/index.html). Requires three@0.147 + OrbitControls loaded first. */
const Q=new URLSearchParams(location.search);
if(Q.get('shot'))document.body.classList.add('shot');
const cv=document.getElementById('c');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
R.outputEncoding=THREE.sRGBEncoding;
const S=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(45,1,.1,200);
const ctl=new THREE.OrbitControls(cam,cv);ctl.enableDamping=true;ctl.maxPolarAngle=Math.PI*.49;
const hemi=new THREE.HemisphereLight(0xdfefff,0xb8a88a,.75);S.add(hemi);
const sun=new THREE.DirectionalLight(0xfff4e0,1.0);sun.position.set(-8,14,12);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,far:60});S.add(sun);

// ---------- textures
function stoneTex(rough){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
 g.fillStyle='#e7dcc4';g.fillRect(0,0,512,512);
 for(let r=0;r<8;r++){const off=(r%2)*64;for(let k=-1;k<5;k++){const x=k*128+off,y=r*64;
  const t=225+Math.random()*20|0;g.fillStyle=`rgb(${t},${t-10},${t-32})`;g.fillRect(x+2,y+2,124,60);
  if(rough){for(let i=0;i<40;i++){g.fillStyle=`rgba(120,100,70,${Math.random()*.12})`;g.fillRect(x+Math.random()*124,y+Math.random()*60,3,2)}}}}
 g.strokeStyle='#cbbd9f';g.lineWidth=3;for(let r=0;r<=8;r++){g.beginPath();g.moveTo(0,r*64);g.lineTo(512,r*64);g.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return t}
function tileTex(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
 g.fillStyle='#d6ccba';g.fillRect(0,0,256,256);g.strokeStyle='#cfc4b0';g.lineWidth=2;g.strokeRect(0,0,256,256);
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return t}
const TS=stoneTex(true),TT=tileTex();
function stoneMat(w,h){const t=TS.clone();t.needsUpdate=true;t.repeat.set(w/2.2,h/1.1);return new THREE.MeshStandardMaterial({map:t,roughness:.9})}
const M={
 alu:new THREE.MeshStandardMaterial({color:0x151515,roughness:.62,metalness:.35}),
 fab:new THREE.MeshStandardMaterial({color:0xe9e6df,roughness:.85,side:THREE.DoubleSide}),
 dark:new THREE.MeshStandardMaterial({color:0x22262a,roughness:.4,metalness:.3}),
 glass:new THREE.MeshStandardMaterial({color:0x33424d,roughness:.1,metalness:.6}),
 led:new THREE.MeshStandardMaterial({color:0xfff2c8,emissive:0xffd88a,emissiveIntensity:0}),
 cap:new THREE.MeshStandardMaterial({color:0xefe6d2,roughness:.7})
};
function box(w,h,d,mat,x,y,z,g){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(g||S).add(m);return m}
function beam(a,b,w,h,mat,g){const L=a.distanceTo(b);const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,L),mat);
 m.position.copy(a).add(b).multiplyScalar(.5);m.lookAt(b);m.castShadow=m.receiveShadow=true;g.add(m);return m}
const V=(x,y,z)=>new THREE.Vector3(x,y,z);

// ---------- RTS unit: x0..x0+W along wall (z=0) projecting to z=D. front height hf, back hb
const units=[],leds=[],lamps=[];
function rts(g,x0,W,D,hf,hb,posts){
 const u={g:new THREE.Group(),x0,W,D,hf,hb};g.add(u.g);
 const H=z=>hb+(hf-hb)*z/D;
 beam(V(x0,hb+.05,.06),V(x0+W,hb+.05,.06),.12,.2,M.alu,u.g);           // wall profile
 beam(V(x0,hf,D),V(x0+W,hf,D),.14,.22,M.alu,u.g);                      // front gutter beam
 const n=Math.max(2,Math.round(W/2.6)+1);
 for(let i=0;i<n;i++){const x=x0+.06+(W-.12)*i/(n-1);
  beam(V(x,hb,.06),V(x,hf,D),.1,.2,M.alu,u.g);
  const l=beam(V(x,hb-.105,.3),V(x,hf-.105,D-.1),.03,.012,M.led,u.g);leds.push(l);
  if(i<n-1){const p=new THREE.PointLight(0xffd9a0,0,6,2);p.position.set(x+(W-.12)/(n-1)/2,(hb+hf)/2-.4,D/2);u.g.add(p);lamps.push(p)}}
 posts.forEach(p=>{box(.13,hf-p.y-.1,.13,M.alu,p.x,p.y+(hf-p.y-.1)/2,D,u.g)});
 u.fab=new THREE.Group();u.g.add(u.fab);u.H=H;u.n=n;units.push(u);return u}
function setFabric(u,t){
 u.fab.clear();const cover=Math.max(.35,(u.D-.12)*(1-t)),nb=Math.max(3,Math.round(u.D/0.55));
 const bay=cover/nb,sag=Math.min(.09,bay*.28)*(1+t*1.6);
 const segZ=nb*10,segX=2,pos=[],idx=[];
 for(let j=0;j<=segZ;j++){const z=.1+cover*j/segZ,f=(j%10)/10,y=u.H(z)+.1-sag*Math.sin(Math.PI*f)*(j%10?1:0)-0.02;
  for(let i=0;i<=segX;i++)pos.push(u.x0+.08+(u.W-.16)*i/segX,y,z)}
 for(let j=0;j<segZ;j++)for(let i=0;i<segX;i++){const a=j*(segX+1)+i,b=a+segX+1;idx.push(a,b,a+1,b,b+1,a+1)}
 const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gg.setIndex(idx);gg.computeVertexNormals();
 const m=new THREE.Mesh(gg,M.fab);m.castShadow=m.receiveShadow=true;u.fab.add(m);
 for(let k=0;k<=nb;k++){const z=.1+bay*k;beam(V(u.x0+.08,u.H(z)+.1,z),V(u.x0+u.W-.08,u.H(z)+.1,z),.04,.035,M.alu,u.fab)}}

// ---------- generic controls (projects/views come from the project page)
let night=false,SPcfg=null;
function setOpen(t){units.forEach(u=>setFabric(u,t))}
function setNight(n){night=n;S.background=new THREE.Color(n?0x0d1622:0xbfdcf2);hemi.intensity=n?.1:.75;sun.intensity=n?.03:1.0;
 M.led.emissiveIntensity=n?3:0;lamps.forEach(l=>l.intensity=n?1.6:0);const b=document.getElementById('nt');if(b)b.classList.toggle('on',n)}
function setView(name){const v=SPcfg.views[name];if(!v)return;cam.position.set(...v[0]);ctl.target.set(...v[1])}
function setProj(i){const p=SPcfg.projects[i-1];if(!p)return;setView(p.view);
 SPcfg.projects.forEach((q,k)=>{const b=document.getElementById('p'+(k+1));if(b)b.classList.toggle('on',k+1===i)})}
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<1?62:45;cam.updateProjectionMatrix()}  // מסך צר/טלפון: שדה ראייה רחב יותר
/* SP.start({views:{name:[[camX,camY,camZ],[tgtX,tgtY,tgtZ]]}, projects:[{label:'...', view:'name'}], labels:{open:'...',night:'...',reset:'...'},
   controls:{pan:false,minDist:4,maxDist:20,azimuth:.45,minPolar:.25,maxPolar:.47}})  — controls אופציונלי; azimuth:false מבטל את הגבלת הסיבוב */
// ---------- שליטה נוחה (מאושר 01.10.2026): המרכז קבוע על הפרגולה, ללא pan, סיבוב רק מול הבניין, כפתור איפוס ולחיצה כפולה
function easyControls(cfg){const c=Object.assign({pan:false,minDist:4,maxDist:20,azimuth:.45,minPolar:.25,maxPolar:.47},cfg.controls||{});
 ctl.enablePan=!!c.pan;ctl.rotateSpeed=.55;ctl.zoomSpeed=.7;ctl.minDistance=c.minDist;ctl.maxDistance=c.maxDist;
 if(c.azimuth){ctl.minAzimuthAngle=-Math.PI*c.azimuth;ctl.maxAzimuthAngle=Math.PI*c.azimuth}
 ctl.minPolarAngle=c.minPolar;ctl.maxPolarAngle=Math.PI*c.maxPolar;
 const pn=document.getElementById('panel');
 if(pn&&!document.getElementById('rs')){const b=document.createElement('button');b.id='rs';
  b.textContent='↺ '+((cfg.labels&&cfg.labels.reset)||(document.documentElement.lang==='he'?'איפוס':'إعادة الضبط'));
  b.onclick=()=>setProj(1);pn.appendChild(b)}
 cv.addEventListener('dblclick',()=>setProj(1))}
const SP={start(cfg){SPcfg=cfg;const panel=document.getElementById('panel');
 if(panel){let h='';cfg.projects.forEach((p,k)=>{h+=`<button id="p${k+1}">${p.label}</button>`});
  h+=`<span>${(cfg.labels&&cfg.labels.open)||'فتح السقف'}</span><input id="op" type="range" min="0" max="100" value="0">`;
  h+=`<button id="nt">🌙 ${(cfg.labels&&cfg.labels.night)||'ليلي'}</button>`;panel.innerHTML=h;
  cfg.projects.forEach((p,k)=>{document.getElementById('p'+(k+1)).onclick=()=>setProj(k+1)});
  document.getElementById('op').oninput=e=>setOpen(e.target.value/100);document.getElementById('nt').onclick=()=>setNight(!night)}
 if(!Q.get('shot'))easyControls(cfg);
 addEventListener('resize',size);size();
 setNight(Q.get('mode')==='night');setOpen(+(Q.get('open')||0));setProj(+(Q.get('p')||1));
 if(Q.get('view'))setView(Q.get('view'));
 (function loop(){ctl.update();R.render(S,cam);requestAnimationFrame(loop)})();
 setTimeout(()=>window.__ready=true,600)}};
