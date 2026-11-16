// Five-roots funnel: turns the Command deck viewport into the crystal funnel (owner image, 2026-11-16).
// Inflow (binary rain: voice, market, asks) -> Law -> Memory -> Skills -> Tools -> Automations -> apex (one point of action, sparks out over the earth grid).
// Display only. Keeps the deck's alert overlay, status line and crew consoles. Data: roots-data.js.
(function(){
const LEDGER='https://claude.ai/artifact/Q5w5EBbk9KQS5qS65naJCz';
const CSS=`.cc .vp{height:clamp(420px,118vw,560px)!important}
.cc .vp .img,.cc .vp .scan,#ccFx,#ccNet,.cc .heard,#pyrWrap,#ccCons,#ccNd{display:none!important}
.cc .alrt{inset:auto 6% auto 6%!important;top:10px!important;max-height:55%!important}
.cc .vp .glass{background:#020308!important}
#rtFun{position:absolute;inset:0;width:100%;height:100%;cursor:pointer;touch-action:manipulation}
.cc .vp .shade{background:linear-gradient(180deg,rgba(2,3,8,0) 70%,rgba(2,3,8,.85) 100%)!important;pointer-events:none}
.rtCard{position:absolute;z-index:4;width:min(270px,74%);max-height:62%;overflow:auto;padding:10px 12px;cursor:pointer;background:rgba(3,6,14,.92);border:1px solid rgba(63,224,255,.6);box-shadow:0 0 30px rgba(226,85,255,.3);clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%,0 10px);display:grid;gap:6px;font:400 12px/1.4 Inter,system-ui,sans-serif;color:#DCE6F7}
.rtCard[hidden]{display:none}.rtCard h4{margin:0;display:flex;justify-content:space-between;font:700 15px/1.1 'Orbitron',system-ui,sans-serif;letter-spacing:.12em;color:#EEF4FF}
.rtCard h4 i{font:400 9px/1 'Chivo Mono',monospace;letter-spacing:.12em;color:#8A97A8;font-style:normal}
.rtId{position:absolute;z-index:3;display:flex;align-items:center;gap:5px;padding:4px 8px 4px 4px;border:1px solid rgba(147,163,184,.35);background:rgba(3,6,14,.72);color:#DCE6F7;font:700 9px/1 'Chivo Mono',monospace;letter-spacing:.1em;cursor:grab;touch-action:none;user-select:none;transform:translate(-50%,-50%);white-space:nowrap}
.rtId:active{cursor:grabbing}.rtId i{width:10px;height:10px;border-radius:50%;background:#55606f;box-shadow:0 0 0 2px rgba(255,255,255,.08)}
.rtId[data-s=run] i{background:#3FE0FF;box-shadow:0 0 10px #3FE0FF}.rtId[data-s=you] i{background:#F2C66B;box-shadow:0 0 10px #F2C66B}.rtId[data-s=you]{color:#F2C66B}
.rtId:focus-visible{outline:1px solid #3FE0FF}
.rtCard .he{font:500 20px/1.1 'Times New Roman',serif;color:#fff}
.rtCard em{font-style:italic;color:#F3E9FF}.rtCard small{display:block;color:#8A97A8;font:400 10.5px/1.3 'Chivo Mono',monospace}
.rtCard a,.rtList a{color:#3FE0FF}
.rtList{display:grid;gap:6px}
.rtRow{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 10px;padding:9px 10px;background:linear-gradient(90deg,rgba(63,224,255,.08),rgba(226,85,255,.08));border:1px solid #1E2A3C;border-left:2px solid var(--c);font:400 11.5px/1.4 Inter,system-ui,sans-serif;color:#C9D6EA;cursor:pointer;text-align:left}
.rtRow:focus-visible{outline:1px solid #3FE0FF}
.rtRow b{grid-row:span 3;font:700 11px/1.3 'Orbitron',system-ui,sans-serif;letter-spacing:.12em;color:#EEF4FF;writing-mode:horizontal-tb;min-width:6.5em}
.rtRow .he{font:500 15px 'Times New Roman',serif;color:#fff}.rtRow em{font-style:italic;color:#EDE2FF}
.rtApex{margin:2px 0 0;font:500 12px/1.45 Inter,system-ui,sans-serif;color:#EEF4FF;text-align:center}
.rtApex small{display:block;color:#8A97A8;font:400 10px/1.4 'Chivo Mono',monospace;margin-top:4px}`;
const COL=['#3FE0FF','#6FB8FF','#A98BFF','#D06BFF','#E255FF'];
function mount(){
 const glass=document.querySelector('#cc .vp .glass'),vp=document.querySelector('#cc .vp');
 if(!glass||!window.ROOTS)return false;
 const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 const R=window.ROOTS,OH=window.ROOTS_OH;
 const cv=document.createElement('canvas');cv.id='rtFun';cv.setAttribute('role','img');cv.setAttribute('aria-label','Five-roots funnel: Law, Memory, Skills, Tools, Automations narrowing to one point of action. Tap a band.');
 glass.insertBefore(cv,glass.querySelector('.shade'));
 const card=document.createElement('div');card.className='rtCard';card.hidden=true;card.setAttribute('aria-live','polite');glass.appendChild(card);
 const list=document.createElement('div');list.className='rtList';list.setAttribute('aria-label','The five roots');
 list.innerHTML=R.map((r,i)=>`<button type="button" class="rtRow" data-i="${i}" style="--c:${COL[i]}"><b>${r.name.toUpperCase()}</b><span><i>${r.latin}</i> · <span class="he" lang="he" dir="rtl">${r.hebrew}</span> · ${r.means}</span><span><em>${r.quote}</em></span></button>`).join('')
  +`<p class="rtApex">${window.ROOTS_APEX}<small>Lines drawn from each root (MODEL wording) · <a href="${LEDGER}" target="_blank" rel="noopener">Laws and automation roots</a> · O.H. opens each root on this Mac</small></p>`;
 vp.after(list);
 let sel=-1;
 function place(el,px,py){const gw=glass.clientWidth,gh=glass.clientHeight,w=el.offsetWidth,h=el.offsetHeight;el.style.left=Math.max(6,Math.min(gw-w-6,px-w/2))+'px';el.style.top=Math.max(6,Math.min(gh-h-6,py+14))+'px';}
 function open(i,px,py){if(i===sel||i<0){sel=-1;card.hidden=true;return;}sel=i;closeId();const r=R[i];
  card.innerHTML=`<h4><span style="color:${COL[i]}">${r.name.toUpperCase()}</span><i>TAP TO CLOSE</i></h4>
  <div><i>${r.latin}</i>: ${r.latinSays}</div><div><span class="he" lang="he" dir="rtl">${r.hebrew}</span> ${r.hebrewSays}</div>
  <div><b>${r.means}</b></div><div><em>${r.quote}</em><small>${r.who}</small></div>
  <div><a href="${OH}${r.oh}" target="_blank" rel="noopener">Open ${r.name} in O.H.</a> · <a href="${LEDGER}#t-${r.id}" target="_blank" rel="noopener">See every ${r.name.toLowerCase()} node</a></div>`;
  card.hidden=false;place(card,px??glass.clientWidth/2,py??glass.clientHeight*.3);}
 card.onclick=e=>{if(e.target.closest('a'))return;open(-1);};
 list.onclick=e=>{const b=e.target.closest('.rtRow');if(b){const k=+b.dataset.i;open(k,glass.clientWidth/2,(Y(T[k])+Y(T[k+1]))/2);vp.scrollIntoView({behavior:'smooth',block:'center'});}};

 // Agent identities: move on their own (running ones work down toward the point of action, the one waiting on you rises to the rim,
 // idle ones drift at the edge); drag one to give it a new home (kept per device). Tap opens a small anchored note; tap again closes.
 const AGS=[...document.querySelectorAll('#ccCons .con')].map(c=>({k:c.dataset.k,c,name:c.querySelector('.nm').textContent}));
 let HOME={};try{HOME=JSON.parse(localStorage.getItem('rtHome')||'{}');}catch(_){}
 const idBox=document.createElement('div');idBox.className='rtCard';idBox.hidden=true;glass.appendChild(idBox);let idSel=null;
 function closeId(){idSel=null;idBox.hidden=true;}
 idBox.onclick=closeId;
 const ag=AGS.map((a,n)=>{const b=document.createElement('button');b.type='button';b.className='rtId';b.innerHTML='<i></i><span></span>';b.querySelector('span').textContent=a.name;b.setAttribute('aria-label',a.name+': drag to move, tap for status');glass.appendChild(b);
  const ang=n*Math.PI*2/6+.3;return {...a,b,ang,x:.5+.42*Math.cos(ang),y:.16+.06*Math.sin(ang),drag:false};});
 function goal(o,s){const h=HOME[o.k];if(h)return [h[0]+.03*Math.sin(s*.4+o.ang),h[1]+.02*Math.cos(s*.5+o.ang)];
  const st=o.c.dataset.s,w=W||1,hh=H||1;
  if(st==='run'){const t=.55+.3*((Math.sin(s*.3+o.ang)+1)/2),r=rad(t),a=s*.6+o.ang;return [(cx+r*Math.cos(a))/w,(Y(t)+r*.17*Math.sin(a))/hh];}
  if(st==='you')return [.5+.18*Math.cos(o.ang),(y0-24)/hh];
  const a=o.ang+s*.04;return [.5+.4*Math.cos(a),(y0/hh)+.1*Math.sin(a)];}
 function moveIds(s){ag.forEach(o=>{if(o.drag)return;const [gx,gy]=goal(o,s);o.x+=(gx-o.x)*.03;o.y+=(gy-o.y)*.03;o.x=Math.max(.06,Math.min(.94,o.x));o.y=Math.max(.09,Math.min(.95,o.y));o.b.style.left=(o.x*100)+'%';o.b.style.top=(o.y*100)+'%';o.b.dataset.s=o.c.dataset.s;});}
 ag.forEach(o=>{let sx=0,sy=0,moved=false;
  o.b.addEventListener('pointerdown',e=>{o.drag=true;moved=false;sx=e.clientX;sy=e.clientY;o.b.setPointerCapture(e.pointerId);});
  o.b.addEventListener('pointermove',e=>{if(!o.drag)return;if(Math.hypot(e.clientX-sx,e.clientY-sy)>6)moved=true;if(!moved)return;const g=glass.getBoundingClientRect();o.x=Math.max(.06,Math.min(.94,(e.clientX-g.left)/g.width));o.y=Math.max(.04,Math.min(.95,(e.clientY-g.top)/g.height));o.b.style.left=(o.x*100)+'%';o.b.style.top=(o.y*100)+'%';});
  o.b.addEventListener('pointerup',e=>{o.drag=false;if(moved){HOME[o.k]=[o.x,o.y];try{localStorage.setItem('rtHome',JSON.stringify(HOME));}catch(_){}return;}
   if(idSel===o.k)return closeId();idSel=o.k;sel=-1;card.hidden=true;const st=o.c.dataset.s;
   idBox.innerHTML='<h4><span></span><i>TAP TO CLOSE</i></h4><div class="nt"></div><small>Drag to give it a new home. Double-tap to let it roam again.</small>';idBox.querySelector('span').textContent=o.name+' · '+(st==='you'?'WAITS ON YOU':st.toUpperCase());idBox.querySelector('.nt').textContent=o.c.querySelector('.nt').textContent||'standing by';
   idBox.hidden=false;place(idBox,o.x*glass.clientWidth,o.y*glass.clientHeight);});
  o.b.addEventListener('dblclick',()=>{delete HOME[o.k];try{localStorage.setItem('rtHome',JSON.stringify(HOME));}catch(_){}closeId();});});
 // geometry
 const x=cv.getContext('2d');let W=0,H=0,cx=0,y0=0,ya=0,R0=0;
 const T=[0,.2,.4,.6,.8,1];
 const rad=t=>R0*Math.pow(1-t,1.55)+R0*.012;
 const Y=t=>y0+(ya-y0)*Math.pow(t,.85);
 function size(){const d=devicePixelRatio||1,b=cv.getBoundingClientRect();W=b.width;H=b.height;cv.width=Math.round(W*d);cv.height=Math.round(H*d);x.setTransform(d,0,0,d,0,0);cx=W/2;y0=H*.2;ya=H*.73;R0=Math.min(W*.44,H*.6);}
 cv.addEventListener('click',e=>{const b=cv.getBoundingClientRect(),px=e.clientX-b.left,py=e.clientY-b.top;closeId();if(py<y0-20||py>ya+10){sel=-1;card.hidden=true;return;}for(let i=0;i<5;i++){if(py<=Y(T[i+1])+4)return open(i,px,py);}});
 // particles
 const cols=[],shards=[],sparks=[];let t0=performance.now();
 function seed(){cols.length=0;const n=Math.max(18,Math.round(W/14));for(let i=0;i<n;i++)cols.push({x:(i+.5)*W/n,y:Math.random()*H*.3,v:.4+Math.random()*.9,s:Array.from({length:8},()=>Math.random()<.5?'0':'1')});}
 function grad(a){const g=x.createLinearGradient(cx-R0,0,cx+R0,0);g.addColorStop(0,`rgba(63,224,255,${a})`);g.addColorStop(.5,`rgba(140,150,255,${a})`);g.addColorStop(1,`rgba(226,85,255,${a})`);return g;}
 function ring(t,a,lw){const r=rad(t),ry=Math.max(2,r*.17);x.beginPath();x.ellipse(cx,Y(t),r,ry,0,0,Math.PI*2);x.strokeStyle=grad(a);x.lineWidth=lw;x.stroke();}
 function frame(now){
  const s=(now-t0)/1000;x.clearRect(0,0,W,H);
  // earth grid floor
  x.strokeStyle='rgba(63,140,255,.10)';x.lineWidth=1;for(let i=-8;i<=8;i++){x.beginPath();x.moveTo(cx+i*W*.04,ya);x.lineTo(cx+i*W*.16,H);x.stroke();}
  for(let k=0;k<5;k++){const yy=ya+(H-ya)*Math.pow(k/4,1.6);x.beginPath();x.moveTo(0,yy);x.lineTo(W,yy);x.stroke();}
  // inflow: binary rain
  x.font='600 9px "Chivo Mono",monospace';x.textAlign='center';
  cols.forEach(c=>{c.y+=c.v;if(c.y>y0+6)c.y=-60;const m=c.x/W;c.s.forEach((ch,j)=>{const yy=c.y-j*10;if(yy<0||yy>y0+4)return;x.fillStyle=`rgba(${Math.round(63+m*163)},${Math.round(224-m*139)},255,${(1-j/8)*.75})`;x.fillText(ch,c.x,yy);});});
  // glass body: back half ring + silhouettes + facets
  x.save();x.beginPath();for(let k=0;k<=40;k++){const t=k/40;x.lineTo(cx-rad(t),Y(t));}for(let k=40;k>=0;k--){const t=k/40;x.lineTo(cx+rad(t),Y(t));}x.closePath();
  const body=x.createLinearGradient(0,y0,0,ya);body.addColorStop(0,'rgba(80,140,255,.10)');body.addColorStop(1,'rgba(226,85,255,.16)');x.fillStyle=body;x.fill();x.restore();
  for(let f=0;f<14;f++){const ph=f/14*Math.PI*2+s*.12,c=Math.cos(ph),sn=Math.sin(ph);x.beginPath();for(let k=0;k<=24;k++){const t=k/24,r=rad(t);x.lineTo(cx+r*c,Y(t)+r*.17*sn);}x.strokeStyle=sn>0?grad(.32):grad(.12);x.lineWidth=sn>0?1:.6;x.stroke();}
  for(const side of[-1,1]){x.beginPath();for(let k=0;k<=40;k++){const t=k/40;x.lineTo(cx+side*rad(t),Y(t));}x.strokeStyle=side<0?'rgba(63,224,255,.9)':'rgba(226,85,255,.9)';x.lineWidth=1.6;x.shadowColor=x.strokeStyle;x.shadowBlur=12;x.stroke();x.shadowBlur=0;}
  // shards spiral in
  if(shards.length<70&&Math.random()<.5)shards.push({t:0,a:Math.random()*Math.PI*2,v:.0016+Math.random()*.0024,z:2+Math.random()*4});
  for(let i=shards.length-1;i>=0;i--){const p=shards[i];p.t+=p.v;p.a+=.02+p.t*.05;if(p.t>=1){shards.splice(i,1);continue;}const r=rad(p.t)*.92,px=cx+r*Math.cos(p.a),py=Y(p.t)+r*.17*Math.sin(p.a),z=p.z*(1-p.t*.6);x.save();x.translate(px,py);x.rotate(p.a);x.fillStyle=Math.cos(p.a)<0?'rgba(63,224,255,.8)':'rgba(226,85,255,.8)';x.beginPath();x.moveTo(0,-z);x.lineTo(z*.7,0);x.lineTo(0,z);x.lineTo(-z*.7,0);x.closePath();x.fill();x.restore();}
  // five band rings + labels
  for(let i=0;i<=5;i++){const lit=sel>=0&&(i===sel||i===sel+1);ring(T[i],lit?.95:.5,lit?2.2:1.1);}
  for(let i=0;i<5;i++){const tm=(T[i]+T[i+1])/2,yy=(Y(T[i])+Y(T[i+1]))/2+4,r=R[i],on=sel===i;
   x.textAlign='center';x.font=`700 ${on?13:12}px Orbitron,system-ui,sans-serif`;x.fillStyle=on?'#FFFFFF':COL[i];x.shadowColor=COL[i];x.shadowBlur=on?14:6;
   const lab=r.name.toUpperCase();const w=Math.max(rad(tm)*2-20,0);x.fillText(lab,cx,yy-(w<90?0:4));x.shadowBlur=0;
   if(w>=90){x.font='500 10px "Chivo Mono",monospace';x.fillStyle='rgba(220,230,247,.75)';x.fillText(`${r.latin.split(',')[0]} · ${r.hebrew}`,cx,yy+10);}
   else{x.font='500 10px "Chivo Mono",monospace';x.fillStyle='rgba(220,230,247,.7)';x.textAlign='left';x.font=`700 ${on?13:12}px Orbitron,system-ui,sans-serif`;const nw=x.measureText(lab).width/2;x.font='500 10px "Chivo Mono",monospace';x.fillText(`${r.latin.split(',')[0]} · ${r.hebrew}`,cx+Math.max(rad(tm),nw)+10,yy);x.textAlign='center';}}
  // inflow + apex labels
  x.font='700 9px "Chivo Mono",monospace';x.fillStyle='rgba(191,243,255,.7)';x.fillText('VOICE · MARKET · ASKS',cx,y0-R0*.17-10);
  const pulse=.75+.25*Math.sin(s*3),ag=x.createRadialGradient(cx,ya,0,cx,ya,46*pulse);ag.addColorStop(0,'rgba(255,255,255,1)');ag.addColorStop(.25,'rgba(255,190,255,.85)');ag.addColorStop(1,'rgba(226,85,255,0)');x.fillStyle=ag;x.beginPath();x.arc(cx,ya,46*pulse,0,Math.PI*2);x.fill();
  if(Math.random()<.35)sparks.push({a:Math.PI*(.05+Math.random()*.9),l:20+Math.random()*60,life:1,c:Math.random()<.5?'63,224,255':'226,85,255'});
  for(let i=sparks.length-1;i>=0;i--){const k=sparks[i];k.life-=.05;if(k.life<=0){sparks.splice(i,1);continue;}x.beginPath();let px=cx,py=ya;x.moveTo(px,py);for(let j=1;j<=4;j++){px=cx+Math.cos(k.a)*k.l*j/4+(Math.random()-.5)*8;py=ya+Math.sin(k.a)*k.l*j/4*.6;x.lineTo(px,py);}x.strokeStyle=`rgba(${k.c},${k.life})`;x.lineWidth=1;x.stroke();}
  x.font='700 10px Orbitron,system-ui,sans-serif';x.fillStyle='#FFFFFF';x.fillText('ONE POINT OF ACTION',cx,ya+30);
 }
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function loop(n){frame(n);moveIds((n-t0)/1000);if(!still)requestAnimationFrame(loop);}
 size();seed();new ResizeObserver(()=>{size();seed();if(still){frame(performance.now());moveIds(0);}}).observe(cv);requestAnimationFrame(loop);
 return true;
}
let tries=0;(function wait(){if(mount())return;if(++tries<100)setTimeout(wait,150);})();
})();
