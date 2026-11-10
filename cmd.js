// Command deck layer: always-on voice, spoken brief, spoken commands to the orchestrator, live crew board.
// Layered on top of the map: mounts into #cc, reads live/current + live/crew + reports, writes reports (lane "cmd").
(function(){
const CSS=`.cc{--sea:#061226;--deep:#0A2148;--saph:#2F6BFF;--saph2:#0F52BA;--gold:#EAD9A6;--gold2:#F6EDCF;--pearl:#F4F7FF;position:relative;overflow:hidden;margin:0 0 16px;border:1px solid rgba(234,217,166,.35);background:linear-gradient(160deg,var(--sea),var(--deep));color:var(--pearl);font-family:var(--display)}
.cc canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.cc .in{position:relative;display:grid;gap:10px;padding:14px 16px 16px}
.cc .top{display:flex;align-items:center;gap:12px}
.cc .orb{flex:none;width:46px;height:46px;border-radius:50%;border:1px solid var(--gold);background:radial-gradient(circle at 35% 30%,var(--gold2),var(--saph) 55%,var(--saph2));cursor:pointer;box-shadow:0 0 0 0 rgba(47,107,255,.6)}
.cc .orb.on{animation:ccP 1.8s ease-out infinite}.cc .orb.off{filter:grayscale(.8) brightness(.6)}
@keyframes ccP{0%{box-shadow:0 0 0 0 rgba(234,217,166,.55)}100%{box-shadow:0 0 0 16px rgba(234,217,166,0)}}
.cc h2{margin:0;font:700 13px/1.1 var(--mono);letter-spacing:.14em;color:var(--gold)}
.cc .st{font:500 12px/1.3 var(--mono);color:#B9C7E8}
.cc .heard{min-height:44px;font:700 17px/1.35 var(--display);color:var(--pearl);text-shadow:0 0 18px rgba(47,107,255,.55);word-break:break-word}
.cc .heard i{font-style:normal;color:#8FA6D8}
.cc .row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.cc .chip{font:500 12px/1 var(--mono);padding:7px 10px;border:1px solid rgba(234,217,166,.45);background:rgba(6,18,38,.55);color:var(--gold2);cursor:pointer;border-radius:0}
.cc .chip.sel{background:var(--gold);color:var(--sea);border-color:var(--gold)}
.cc .chip.go{background:var(--saph);border-color:var(--saph);color:var(--pearl);font-weight:700}
.cc .crew{height:210px}
.cc .help{font:400 12px/1.4 var(--mono);color:#93A3C7}`;
const AG=[['you','You'],['orch','Orchestrator'],['fable','Fable'],['gov','Governor'],['loop','Cloud loop'],['watch','Watcher']];
const LINK=[['you','orch'],['orch','fable'],['orch','gov'],['gov','loop'],['orch','watch'],['watch','gov'],['gov','you']];
const MODELS=['orchestrator','fable','opus','sonnet','haiku'],EFF=['low','medium','high','max'];
let db,live={},crew={},reports=[],rec,on=false,want=true,speaking=false,buf='',interim='',model='orchestrator',effort='medium';
const $=s=>document.querySelector(s);
function mount(){
  const host=document.getElementById('cc');if(!host)return false;
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  host.className='cc';host.setAttribute('aria-label','Command deck');
  host.innerHTML=`<canvas id="ccFx" aria-hidden="true"></canvas><div class="in">
  <div class="top"><button class="orb off" id="ccOrb" type="button" aria-label="Voice on or off"></button><div><h2>COMMAND DECK</h2><div class="st" id="ccSt">Voice starting…</div></div></div>
  <div class="heard" id="ccHeard" aria-live="polite"><i>Say "brief" for the state. Speak a task, then say "send".</i></div>
  <div class="row" id="ccM"></div><div class="row" id="ccE"></div>
  <div class="row"><button class="chip go" id="ccSend" type="button">Send</button><button class="chip" id="ccBrief" type="button">Brief</button><button class="chip" id="ccClr" type="button">Clear</button></div>
  <div class="crew" aria-label="Crew board"></div>
  <div class="help">Voice words: brief · send · clear · mute. Name a model (fable, opus, sonnet, haiku) and an effort (low, medium, high, max) to delegate.</div></div>`;
  const chips=(id,list,get,set)=>{const el=$(id);el.innerHTML=list.map(v=>`<button type="button" class="chip" data-v="${v}">${v}</button>`).join('');el.onclick=e=>{const v=e.target.dataset&&e.target.dataset.v;if(v){set(v);paint();}};};
  chips('#ccM',MODELS,()=>model,v=>model=v);chips('#ccE',EFF,()=>effort,v=>effort=v);
  $('#ccOrb').onclick=()=>{if(on){want=false;stop();}else{want=true;start();brief();}};
  $('#ccSend').onclick=send;$('#ccBrief').onclick=brief;$('#ccClr').onclick=()=>{buf='';interim='';paint();};
  fx();return true;
}
function paint(){
  document.querySelectorAll('#ccM .chip').forEach(b=>b.classList.toggle('sel',b.dataset.v===model));
  document.querySelectorAll('#ccE .chip').forEach(b=>b.classList.toggle('sel',b.dataset.v===effort));
  const h=$('#ccHeard');if(!h)return;
  if(buf||interim){h.textContent=buf;if(interim){const i=document.createElement('i');i.textContent=' '+interim;h.appendChild(i);}}
  $('#ccOrb').className='orb '+(on?'on':'off');
}
function status(t){const s=$('#ccSt');if(s)s.textContent=t;}
function start(){
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!R){status('Voice not supported in this browser. Type in Ask or change.');return;}
  if(on||speaking)return;
  rec=new R();rec.continuous=true;rec.interimResults=true;rec.lang='en-US';
  rec.onstart=()=>{on=true;status('Listening');paint();};
  rec.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed'){want=false;status('Tap the orb to allow the microphone');}};
  rec.onend=()=>{on=false;paint();if(want&&!speaking)setTimeout(start,400);};
  rec.onresult=e=>{interim='';for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i],t=r[0].transcript.trim();if(r.isFinal)heard(t);else interim+=t+' ';}paint();};
  try{rec.start();}catch(e){}
}
function stop(){try{rec&&rec.stop();}catch(e){}on=false;status('Voice off · tap the orb');paint();}
function heard(t){
  const w=t.toLowerCase().replace(/[.,!?]/g,'').trim();
  if(/^(brief|brief me|status|state)$/.test(w))return brief();
  if(/^(clear|cancel|scratch that)$/.test(w)){buf='';return;}
  if(/^(mute|stop listening|voice off)$/.test(w)){want=false;return stop();}
  const m=w.match(/\b(fable|opus|sonnet|haiku|orchestrator)\b/);if(m)model=m[1];
  const f=w.match(/\b(low|medium|high|max)\s*(effort)?\b/);if(f)effort=f[1];
  const end=/\b(send it|send|go ahead)$/.test(w);
  buf=(buf+' '+t.replace(/\b(send it|send|go ahead)[.!]?$/i,'')).trim();
  if(end)send();
}
function lane(t){return /\btrigger|1sd intake\b/i.test(t)?'trigger':/\b(map|app|deck)\b/i.test(t)?'map':'intraday';}
async function send(){
  const t=buf.trim();if(!t){say('Nothing to send yet.');return;}
  if(!db){say('Sign in first.');return;}
  const id='c'+Date.now().toString(36);
  try{await db.doc('reports/'+id).set({text:t,lane:'cmd',route:lane(t),model,effort,at:Date.now(),fix:''});
    buf='';paint();say(model==='orchestrator'?'Sent to the orchestrator.':'Sent. '+model+' at '+effort+' effort.');}
  catch(e){say('Not sent. '+(e.message||'error'));}
}
function brief(){
  const wait=reports.filter(r=>!r.fix).length,you=Object.entries(crew.nodes||{}).filter(([k,v])=>v.s==='you').map(([k])=>(AG.find(a=>a[0]===k)||[k,k])[1]);
  const run=Object.values(crew.nodes||{}).filter(v=>v.s==='run').length;
  say([(live.verdict||'No verdict yet')+'.',run+' agents running.',you.length?'Waiting on you: '+you.join(', ')+'.':'Nothing waits on you.',wait?wait+' messages not answered yet.':'',live.watch?'Watching: '+live.watch.split('·').slice(0,2).join(', ')+'.':''].filter(Boolean).join(' '));
}
function say(t){
  status(t);if(!window.speechSynthesis)return;
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=1.04;u.pitch=.95;
  const v=speechSynthesis.getVoices().find(v=>/en-(US|GB)/.test(v.lang)&&/Samantha|Daniel|Google|Natural/.test(v.name));if(v)u.voice=v;
  speaking=true;try{rec&&rec.stop();}catch(e){}
  u.onend=u.onerror=()=>{speaking=false;status(on?'Listening':'Ready');if(want)setTimeout(start,250);};
  speechSynthesis.speak(u);
}
function fx(){
  const c=document.getElementById('ccFx'),x=c.getContext('2d');let t=0;
  const blobs=[[.2,.3,'47,107,255'],[.75,.25,'15,82,186'],[.55,.8,'234,217,166'],[.1,.85,'47,107,255']];
  function frame(){
    const w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;if(c.width!==w*d){c.width=w*d;c.height=h*d;}
    x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);t+=.004;
    x.globalCompositeOperation='lighter';
    blobs.forEach((b,i)=>{const bx=w*(b[0]+.08*Math.sin(t*(1+i*.3)+i)),by=h*(b[1]+.06*Math.cos(t*(1.2+i*.2)+i)),r=Math.max(w,h)*.42;
      const g=x.createRadialGradient(bx,by,0,bx,by,r);g.addColorStop(0,`rgba(${b[2]},${i===2?.16:.22})`);g.addColorStop(1,`rgba(${b[2]},0)`);x.fillStyle=g;x.fillRect(0,0,w,h);});
    x.globalCompositeOperation='source-over';
    const box=document.querySelector('.cc .crew');if(box){const r=box.getBoundingClientRect(),o=c.getBoundingClientRect();crewDraw(x,r.left-o.left,r.top-o.top,r.width,r.height,t);}
    requestAnimationFrame(frame);}
  frame();
}
function crewDraw(x,ox,oy,w,h,t){
  const n=AG.length,pos={};AG.forEach(([k],i)=>{const a=-Math.PI/2+i*2*Math.PI/n;pos[k]=[ox+w/2+Math.cos(a)*w*.34,oy+h*.44+Math.sin(a)*h*.34];});
  const S=k=>((crew.nodes||{})[k]||{}).s||'idle';
  LINK.forEach(([a,b])=>{const A=pos[a],B=pos[b],act=S(a)==='run'||S(b)==='run'||S(b)==='you';
    x.strokeStyle=act?'rgba(47,107,255,.75)':'rgba(234,217,166,.18)';x.lineWidth=act?1.6:1;x.beginPath();x.moveTo(A[0],A[1]);x.lineTo(B[0],B[1]);x.stroke();
    if(act){const p=(t*18+a.length)%1;x.fillStyle='#F6EDCF';x.beginPath();x.arc(A[0]+(B[0]-A[0])*p,A[1]+(B[1]-A[1])*p,2.2,0,7);x.fill();}});
  AG.forEach(([k,label])=>{const[px,py]=pos[k],s=S(k),pulse=.5+.5*Math.sin(t*40+k.length);
    const col=s==='run'?'#2F6BFF':s==='you'?'#EAD9A6':'#3A4D73';
    if(s!=='idle'){x.fillStyle=s==='you'?`rgba(234,217,166,${.18*pulse})`:`rgba(47,107,255,${.25*pulse})`;x.beginPath();x.arc(px,py,16+6*pulse,0,7);x.fill();}
    x.fillStyle=col;x.beginPath();x.arc(px,py,9,0,7);x.fill();x.strokeStyle='#F6EDCF';x.lineWidth=1;x.stroke();
    x.fillStyle='#F4F7FF';x.font='700 11px "Chivo Mono",monospace';x.textAlign='center';x.fillText(label.toUpperCase(),px,py+24);
    const note=((crew.nodes||{})[k]||{}).n;if(note){x.fillStyle='#B9C7E8';x.font='400 10px "Chivo Mono",monospace';x.fillText(note.slice(0,26),px,py+36);}});
}
document.addEventListener('DOMContentLoaded',async()=>{
  if(!mount())return;paint();
  db=await window.SBDB();
  db.doc('live/current').onSnapshot(s=>{live=s.data()||{};});
  db.doc('live/crew').onSnapshot(s=>{crew=s.data()||{};});
  db.collection('reports').onSnapshot(s=>{reports=s.docs.map(d=>d.data());});
  start();
  const once=()=>{document.removeEventListener('pointerdown',once);if(!on){want=true;start();}};
  document.addEventListener('pointerdown',once);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&want&&!on)start();});
});
})();
