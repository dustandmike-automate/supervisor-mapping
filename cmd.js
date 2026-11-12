// Command deck layer (bridge): always-on voice, spoken brief, spoken commands with model/effort, agent consoles.
// Layered on top of the map: mounts into #cc, reads live/current + live/crew + reports, writes reports (lane "cmd").
(function(){
const CH='polygon(14px 0,calc(100% - 14px) 0,100% 14px,100% calc(100% - 14px),calc(100% - 14px) 100%,14px 100%,0 calc(100% - 14px),0 14px)';
const CS='polygon(8px 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%,0 8px)';
const CSS=`.cc{--void:#04060A;--hull:#0B1018;--hull2:#121A26;--edge:#3FD4FF;--saph:#2F6BFF;--neb:#7A5CFF;--gold:#EAD9A6;--pearl:#EEF3FF;--dim:#7F8EA8;margin:0 0 18px;padding:1px;background:linear-gradient(180deg,rgba(63,212,255,.55),rgba(47,107,255,.12) 40%,rgba(63,212,255,.35));clip-path:${CH};font-family:var(--display);color:var(--pearl)}
.cc .hull{background:radial-gradient(120% 70% at 50% 0%,#0E1626 0%,var(--void) 70%);clip-path:${CH};padding:12px 12px 0;display:grid;gap:12px}
.cc .bar{display:flex;align-items:center;gap:10px;font:700 11px/1 var(--mono);letter-spacing:.22em;color:var(--dim)}
.cc .bar b{color:var(--pearl);font-weight:700}.cc .bar .seg{flex:1;height:2px;background:linear-gradient(90deg,var(--edge),transparent);opacity:.6}
.cc .bar .dot{width:6px;height:6px;background:var(--edge);box-shadow:0 0 8px var(--edge)}
.cc .vp{position:relative;height:clamp(300px,72vw,380px);padding:1px;background:linear-gradient(180deg,#26344A,#0B1018);clip-path:polygon(9% 0,91% 0,100% 18%,100% 82%,91% 100%,9% 100%,0 82%,0 18%)}
.cc .vp .glass{position:relative;height:100%;background:#020308;clip-path:polygon(9% 0,91% 0,100% 18%,100% 82%,91% 100%,9% 100%,0 82%,0 18%);overflow:hidden}
.cc .vp canvas{position:absolute;inset:0;width:100%;height:100%}
.cc .vp .rim{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 40px rgba(2,3,8,.95),inset 0 1px 0 rgba(63,212,255,.35)}
.cc .hud{position:absolute;left:9%;right:9%;top:14px;display:flex;justify-content:space-between;font:700 10px/1 var(--mono);letter-spacing:.2em;color:rgba(238,243,255,.62)}
.cc .heard{position:absolute;left:9%;right:9%;bottom:96px;z-index:2;max-height:4.4em;overflow:hidden;font:600 clamp(15px,4.2vw,19px)/1.3 'Orbitron','Chivo',system-ui,sans-serif;letter-spacing:.04em;color:#A98BEF;text-shadow:0 1px 0 #1A1030,0 2px 12px rgba(2,3,8,.95),0 0 18px rgba(124,92,214,.55);word-break:break-word}
.cc .heard .w{display:inline-block;white-space:pre;transform:skewX(-12deg)}.cc .heard .w.nw{animation:ccW .42s cubic-bezier(.3,1.6,.5,1) both}
.cc .alrt{position:absolute;inset:8% 7% 10%;z-index:5;display:none;flex-direction:column;gap:10px;padding:16px 18px;background:linear-gradient(180deg,rgba(40,6,12,.94),rgba(12,3,8,.96));border:1px solid #FF4D6D;box-shadow:0 0 0 1px rgba(255,77,109,.25),0 0 40px rgba(255,77,109,.45),inset 0 0 30px rgba(255,77,109,.18);clip-path:polygon(6% 0,94% 0,100% 12%,100% 88%,94% 100%,6% 100%,0 88%,0 12%)}
.cc .alrt.show{display:flex}.cc .alrt.flash{animation:ccA 1s steps(2,jump-none) infinite}
@keyframes ccA{50%{border-color:#FFE3E8;box-shadow:0 0 0 1px rgba(255,227,232,.6),0 0 70px rgba(255,77,109,.9),inset 0 0 50px rgba(255,77,109,.35)}}
.cc .alrt .ah{font:700 11px/1 "Chivo Mono",monospace;letter-spacing:.24em;color:#FF4D6D}
.cc .alrt .at{flex:1;overflow:auto;font:600 clamp(14px,3.8vw,17px)/1.35 'Orbitron','Chivo',system-ui,sans-serif;color:#FFE3E8}
.cc .alrt .at .w{display:inline-block;white-space:pre;animation:ccD .38s cubic-bezier(.3,1.5,.5,1) both}
@keyframes ccD{0%{opacity:0;transform:translateY(-22px)}100%{opacity:1;transform:none}}
.cc .alrt .av{display:flex;flex-wrap:wrap;gap:6px;font:700 10px/1 "Chivo Mono",monospace;letter-spacing:.18em;color:#FF8FA3}.alrt .av:empty{display:none}.alrt .av b{padding:6px 9px;border:1px solid #6B1A2A;background:#12040A;color:#FFE3E8;font-weight:700}.alrt .av b.hit{background:#FF4D6D;color:#1A0207;border-color:#FF8FA3}.alrt form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px}
.cc .alrt input{font:500 13px/1.2 "Chivo",system-ui,sans-serif;color:#FFE3E8;background:#12040A;border:1px solid #6B1A2A;border-radius:0;padding:10px;min-width:0}
.cc .alrt button{font:700 11px/1 "Chivo Mono",monospace;letter-spacing:.16em;padding:0 14px;border:0;border-radius:0;color:#1A0207;background:linear-gradient(180deg,#FF8FA3,#FF4D6D);cursor:pointer}
@keyframes ccW{0%{opacity:0;transform:skewX(-12deg) translateY(7px)}60%{opacity:1;transform:skewX(-12deg) translateY(-3px)}100%{transform:skewX(-12deg)}}
.cc .heard i{font-style:normal;color:rgba(169,139,239,.6)}
.cc .st{position:absolute;left:9%;right:9%;bottom:78px;font:500 11px/1.2 var(--mono);color:var(--gold);letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cc .orb{position:absolute;left:50%;bottom:8px;z-index:3;transform:translateX(-50%);width:70px;height:66px;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 0 14px rgba(63,212,255,.55))}
.cc .orb svg{width:100%;height:100%;overflow:visible}.cc .orb .tet{transform-origin:35px 40px}
.cc .orb.on{filter:saturate(.6) brightness(.8) drop-shadow(0 0 8px rgba(63,212,255,.35))}.cc .orb.on.arm .tet{animation:ccT 6s ease-in-out infinite}.cc .orb.on.arm{animation:ccG 2s ease-out infinite;filter:none}.cc .orb.off{filter:saturate(.2) brightness(.5)}
@keyframes ccT{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-4deg) scale(1.04)}50%{transform:rotate(0) scale(1)}75%{transform:rotate(4deg) scale(1.04)}}
@keyframes ccG{50%{filter:drop-shadow(0 0 26px rgba(63,212,255,.9))}}
@keyframes ccP{0%{box-shadow:0 0 0 6px rgba(4,6,10,.85),0 0 0 6px rgba(63,212,255,.5),0 0 28px rgba(63,212,255,.55)}100%{box-shadow:0 0 0 6px rgba(4,6,10,.85),0 0 0 26px rgba(63,212,255,0),0 0 28px rgba(63,212,255,.55)}}
.cc .cons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;perspective:700px;margin-top:6px}
.cc .con{position:relative;padding:1px;background:linear-gradient(180deg,#2B3A52,#0B1018 60%);clip-path:${CS};transform:rotateX(9deg);transform-origin:50% 100%}
.cc .con .in{clip-path:${CS};background:linear-gradient(180deg,#101826,#080C13);padding:10px 6px 12px;display:grid;justify-items:center;gap:6px;text-align:center}
.cc .con canvas{width:52px;height:52px}
.cc .con .nm{font:700 9px/1.1 var(--mono);letter-spacing:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pearl)}
.cc .con .nt{font:400 10px/1.25 var(--mono);color:var(--dim);margin-top:3px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.cc .con .ln{position:absolute;left:10px;right:10px;bottom:3px;height:2px;background:#1B2535}
.cc .con[data-s=run] .ln{background:var(--edge);box-shadow:0 0 10px var(--edge)}
.cc .con[data-s=you] .ln{background:var(--gold);box-shadow:0 0 10px var(--gold)}
.cc .con[data-s=you] .nm{color:var(--gold)}
.cc .keys{display:grid;gap:6px;padding:10px;background:linear-gradient(180deg,#0D131D,#070A10);border-top:1px solid rgba(63,212,255,.25)}
.cc .kl{font:700 9px/1 var(--mono);letter-spacing:.24em;color:var(--dim);margin-bottom:2px}
.cc .row{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:4px}
.cc .k{position:relative;font:700 11px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:10px 4px 11px;border:0;border-radius:0;color:var(--dim);background:linear-gradient(180deg,#151E2C,#0B1018);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),inset 0 -1px 0 rgba(0,0,0,.6);cursor:pointer}
.cc .k::after{content:"";position:absolute;left:18%;right:18%;bottom:3px;height:2px;background:#1B2535}
.cc .k.sel{color:var(--pearl)}.cc .k.sel::after{background:var(--edge);box-shadow:0 0 8px var(--edge)}
.cc .k.go{color:#04121C;background:linear-gradient(180deg,#7FE6FF,var(--edge));letter-spacing:.2em}.cc .k.go::after{display:none}
.cc .floor{height:16px;margin:0 -12px;background:linear-gradient(100deg,transparent 8%,rgba(63,212,255,.7) 8.5%,transparent 9.5%) ,linear-gradient(80deg,transparent 90.5%,rgba(63,212,255,.7) 91.5%,transparent 92%),linear-gradient(180deg,#070A10,#04060A)}
#ccM .k{font-size:10px;letter-spacing:0;padding-inline:2px}
@media (max-width:420px){.cc .con .nm{font-size:8px}.cc .hull{padding-inline:8px}.cc .cons{gap:6px}}
.cc .vp .glass{background:#020308 url(bridge.jpg) center/cover no-repeat}
.cc .vp .img{position:absolute;inset:-3%;background:url(bridge.jpg) center/cover no-repeat;animation:ccB 14s ease-in-out infinite;filter:saturate(1.05) brightness(.9)}
@keyframes ccB{50%{transform:scale(1.04);filter:saturate(1.12) brightness(1)}}
.cc .vp .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,3,8,.55) 0%,rgba(2,3,8,0) 28%,rgba(2,3,8,0) 50%,rgba(2,3,8,.92) 72%,rgba(2,3,8,.97) 100%)}
.cc .vp .scan{position:absolute;left:0;right:0;height:38%;background:linear-gradient(180deg,rgba(63,212,255,0),rgba(63,212,255,.07),rgba(63,212,255,0));animation:ccS 9s linear infinite}
@keyframes ccS{from{top:-40%}to{top:100%}}
.cc{animation:ccH 7s ease-in-out infinite}@keyframes ccH{50%{filter:drop-shadow(0 0 18px rgba(63,212,255,.28))}}
.cc .type{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px;align-items:start}
.cc .taW{position:relative}.cc .taW textarea{display:block;width:100%;min-height:44px;resize:none;padding-right:28px!important}
.cc .grip{position:absolute;right:2px;bottom:2px;width:24px;height:24px;cursor:ns-resize;touch-action:none;background:linear-gradient(135deg,transparent 45%,#3FD4FF 45%,#3FD4FF 52%,transparent 52%,transparent 62%,#3FD4FF 62%,#3FD4FF 69%,transparent 69%,transparent 79%,#3FD4FF 79%,#3FD4FF 86%,transparent 86%)}
.cc .type textarea{font:500 13px/1.2 var(--display);color:var(--pearl);background:#070B12;border:1px solid #1E2A3C;border-radius:0;padding:10px}
.cc .type textarea:focus{outline:none;border-color:var(--edge);box-shadow:0 0 0 1px rgba(63,212,255,.35)}
body{background:radial-gradient(90% 60% at 50% 0%,#0B1424 0%,#03050A 70%) fixed #03050A!important;color:#EEF3FF}
#names,#namesTab,#bSpeak,#spkMsg,main>*:not(#cc):not(#pyrWrap){display:none!important}
main{display:flex!important;flex-direction:column;gap:6px;max-width:560px;margin:0 auto}
#pyrWrap{order:0;color:#9FEBFF!important;animation:ccF 9s ease-in-out infinite}#cc{order:1}
@keyframes ccF{50%{transform:translateY(-4px)}}
#pyrWrap svg{width:min(210px,52vw)!important}
.cc .help{font:400 10px/1.4 var(--mono);color:var(--dim);padding:0 2px}`;
const AG=[['you','You'],['orch','Orchestrator'],['fable','Fable'],['gov','Governor'],['loop','Cloud loop'],['watch','Watcher']];
const MODELS=['orchestrator','fable','opus','sonnet','haiku'],EFF=['low','medium','high','max'];
let db,live={},crew={},reports=[],rec,on=false,want=true,speaking=false,buf='',interim='',model='orchestrator',effort='medium';
const $=s=>document.querySelector(s);
function mount(){
  const host=document.getElementById('cc');if(!host)return false;
  const fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&display=swap';document.head.appendChild(fl);const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  host.className='cc';host.setAttribute('aria-label','Command deck');
  host.innerHTML=`<div class="hull">
  <div class="bar"><span class="dot"></span><b>BRIDGE</b><span>COMMAND DECK</span><span class="seg"></span><span id="ccClock"></span></div>
  <div class="vp"><div class="glass"><div class="img" aria-hidden="true"></div><canvas id="ccFx" aria-hidden="true" style="mix-blend-mode:screen;opacity:.55"></canvas><div class="scan" aria-hidden="true"></div><div class="shade"></div><canvas id="ccNet" aria-hidden="true"></canvas><div class="alrt" id="ccAl" role="alertdialog" aria-labelledby="ccAlH" aria-describedby="ccAlT"><div class="ah" id="ccAlH">HIGH RISK · NEEDS YOU</div><div class="at" id="ccAlT"></div><div class="av" id="ccAlV" aria-live="polite"></div><form id="ccAlF"><input id="ccAlI" maxlength="600" placeholder="Your answer" aria-label="Your answer"><button type="submit">ANSWER</button></form></div><div class="rim"></div>
   <div class="hud"><span id="ccHudL">VOICE</span><span id="ccHudR">CREW</span></div>
   <div class="heard" id="ccHeard" aria-live="polite"><i>Say "brief" to start. Say "command off" to stop.</i></div>
   <div class="st" id="ccSt">Voice starting…</div>
   <button class="orb off" id="ccOrb" type="button" aria-label="Voice on or off"><svg viewBox="0 0 70 66" aria-hidden="true"><defs><linearGradient id="tA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#BFF3FF"/><stop offset="1" stop-color="#3FD4FF"/></linearGradient><linearGradient id="tB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FD4FF"/><stop offset="1" stop-color="#2F6BFF"/></linearGradient><linearGradient id="tC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset="1" stop-color="#0A1530"/></linearGradient></defs><g class="tet" stroke="#BFF3FF" stroke-width=".8" stroke-linejoin="round"><polygon points="35,2 4,58 35,44" fill="url(#tA)"/><polygon points="35,2 66,58 35,44" fill="url(#tB)"/><polygon points="4,58 66,58 35,44" fill="url(#tC)"/></g></svg></button></div></div>
  <div class="cons" id="ccCons" aria-label="Agent consoles">${AG.map(([k,l])=>`<div class="con" data-k="${k}" data-s="idle"><div class="in"><canvas width="80" height="80" aria-hidden="true"></canvas><div><div class="nm">${l.toUpperCase()}</div><div class="nt"></div></div></div><span class="ln"></span></div>`).join('')}</div>
  <div class="keys"><div class="kl">DELEGATE TO</div><div class="row" id="ccM"></div><div class="kl">EFFORT</div><div class="row" id="ccE"></div>
   <form class="type" id="ccType"><div class="taW"><textarea id="ccIn" maxlength="600" rows="2" placeholder="Speak, or type a command" aria-label="Type a command"></textarea><span class="grip" id="ccGrip" role="separator" aria-label="Drag to resize the command box" aria-orientation="horizontal" tabindex="0"></span></div><button class="k go" id="ccSend" type="submit">Send</button></form>
   <div class="row" style="margin-top:4px"><button class="k" id="ccBrief" type="button">Brief</button><button class="k" id="ccClr" type="button">Clear</button></div>
   <div class="help">Say “brief” to start command mode; it stays on until “command off”. In command mode: send · clear · a model and an effort to delegate.</div></div>
  <div class="floor"></div></div>`;
  const keys=(id,list,set)=>{const el=$(id);el.innerHTML=list.map(v=>`<button type="button" class="k" data-v="${v}">${v==='orchestrator'?'orch':v}</button>`).join('');el.onclick=e=>{const v=e.target.dataset&&e.target.dataset.v;if(v){set(v);paint();}};};
  keys('#ccM',MODELS,v=>model=v);keys('#ccE',EFF,v=>effort=v);
  $('#ccOrb').onclick=()=>{if(on){want=false;armed=false;stop();}else{want=true;armed=true;start();brief();}};
  $('#ccType').onsubmit=e=>{e.preventDefault();const v=$('#ccIn').value.trim();if(v){buf=v;$('#ccIn').value='';}send();};const py=document.getElementById('bPyr');if(py)py.addEventListener('click',e=>{e.stopImmediatePropagation();brief();},true);$('#ccBrief').onclick=brief;$('#ccClr').onclick=()=>{buf='';interim='';paint();};
  grip();$('#ccAlF').onsubmit=answerAlert;fx();return true;
}
function grip(){const g=$('#ccGrip'),ta=$('#ccIn');let d=false,y0=0,h0=0;const Y=e=>e.touches?e.touches[0].clientY:e.clientY;
  const st=e=>{e.preventDefault();d=true;y0=Y(e);h0=ta.offsetHeight;},mv=e=>{if(!d)return;e.preventDefault();ta.style.height=Math.max(44,Math.min(innerHeight*.7,h0+Y(e)-y0))+'px';},en=()=>{d=false;};
  g.addEventListener('mousedown',st);g.addEventListener('touchstart',st,{passive:false});addEventListener('mousemove',mv);addEventListener('touchmove',mv,{passive:false});addEventListener('mouseup',en);addEventListener('touchend',en);
  g.onkeydown=e=>{const k={ArrowUp:-20,ArrowDown:20}[e.key];if(k){e.preventDefault();ta.style.height=Math.max(44,ta.offsetHeight+k)+'px';}};
  ta.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#ccType').requestSubmit();}};}
let VOX=[],VN='',SHOWN=0,armed=false;function loadV(){if(window.speechSynthesis){const l=speechSynthesis.getVoices();if(l.length)VOX=l;}}loadV();if(window.speechSynthesis)speechSynthesis.addEventListener('voiceschanged',loadV);
let alertId='',alertTimer=0,alertOpts=[],alertPend='';
const okey=o=>String(o).trim().split(/\s+/)[0].toLowerCase();
function alertChips(){const V=$('#ccAlV');if(!V)return;V.innerHTML='';if(!alertId)return;const L=document.createElement('span');L.textContent='SAY ';V.appendChild(L);(alertOpts.length?alertOpts:['answer …']).forEach(o=>{const b=document.createElement('b');b.textContent=alertOpts.length?okey(o).toUpperCase():'ANSWER …';if(alertPend&&o===alertPend)b.className='hit';V.appendChild(b);});if(alertPend){const c=document.createElement('span');c.textContent=' → YES TO SEND · NO TO CLEAR';V.appendChild(c);}}
function showAlert(a){const box=$('#ccAl');if(!box)return;
  if(!a||!a.id||a.answered||!a.text){box.className='alrt';alertId='';alertOpts=[];alertPend='';alertChips();clearTimeout(alertTimer);return;}
  if(a.id===alertId)return;alertId=a.id;alertPend='';alertOpts=Array.isArray(a.opts)?a.opts.filter(Boolean).map(String):[];alertChips();const T=$('#ccAlT');T.textContent='';box.className='alrt show flash';
  const ws=String(a.text).split(/\s+/).filter(Boolean);ws.forEach((w,i)=>{const s=document.createElement('span');s.className='w';s.style.animationDelay=(i*.12)+'s';s.textContent=w+' ';T.appendChild(s);});
  clearTimeout(alertTimer);alertTimer=setTimeout(()=>box.classList.remove('flash'),ws.length*120+60000);
  const ask=alertOpts.length?' Say '+alertOpts.map(okey).join(', or ')+'.':' Say answer, then your words.';
  if(on||want)say('High risk. '+a.text+ask);else status('High risk waiting · tap the orb to answer by voice');}
async function answerAlert(e){e.preventDefault();const v=$('#ccAlI').value.trim();if(v)sendAlert(v);}
async function sendAlert(v){if(!v||!db||!alertId)return false;
  try{await db.doc('reports/a'+Date.now().toString(36)).set({text:'ALERT '+alertId+': '+v,lane:'intraday',at:Date.now(),fix:''});
    await db.doc('live/alert').update({answered:true,answer:v,answered_at:Date.now()});$('#ccAlI').value='';showAlert(null);return true;}
  catch(err){status('Answer not sent: '+(err.message||err.code||'error'));return false;}}
function heardAlert(w){
  if(alertPend){
    if(/^(yes|yes send|send|send it|confirm|go ahead)$/.test(w)){const v=alertPend;alertPend='';sendAlert(v).then(ok=>say(ok?'Sent: '+v+'.':'Not sent. Try again.'));return true;}
    if(/^(no|cancel|clear|scratch that)$/.test(w)){alertPend='';alertChips();say('Cleared. Say your answer again.');return true;}}
  let v='';for(const o of alertOpts){if(new RegExp('\\b'+okey(o).replace(/[^a-z0-9]/g,'')+'\\b').test(w)){v=o;break;}}
  if(!v){const m=w.match(/^answer\s+(.+)/);if(m)v=m[1];}
  if(!v)return false;alertPend=v;alertChips();say('Heard: '+v+'. Say yes to send, or no.');return true;}
function paint(){
  document.querySelectorAll('#ccM .k').forEach(b=>b.classList.toggle('sel',b.dataset.v===model));
  document.querySelectorAll('#ccE .k').forEach(b=>b.classList.toggle('sel',b.dataset.v===effort));
  const h=$('#ccHeard');if(!h)return;
  if(buf||interim){const ws=buf.split(/\s+/).filter(Boolean);h.textContent='';ws.forEach((w,k)=>{const sp=document.createElement('span');sp.className='w'+(k>=SHOWN?' nw':'');sp.textContent=w+' ';h.appendChild(sp);});SHOWN=ws.length;if(interim){const i=document.createElement('i');i.textContent=interim;h.appendChild(i);}}else SHOWN=0;
  $('#ccOrb').className='orb '+(on?'on':'off');$('#ccHudL').textContent=(!on?'VOICE · OFF':armed?'VOICE · COMMAND':'VOICE · STANDBY')+(VN?' · '+VN:'');$('#ccOrb').classList.toggle('arm',armed);
  const N=crew.nodes||{};let run=0;
  document.querySelectorAll('#ccCons .con').forEach(c=>{const d=N[c.dataset.k]||{};c.dataset.s=d.s||'idle';c.querySelector('.nt').textContent=d.n||'standing by';if(d.s==='run')run++;});
  $('#ccHudR').textContent=run+' RUNNING';
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
  rec.onresult=e=>{interim='';for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i],t=r[0].transcript.trim();if(r.isFinal)heard(t);else if(armed)interim+=t+' ';}paint();};
  try{rec.start();}catch(e){}
}
function stop(){try{rec&&rec.stop();}catch(e){}on=false;status('Voice off · tap the orb');paint();}
function heard(t){
  const w=t.toLowerCase().replace(/[.,!?]/g,'').trim();
  if(/\bcommands? off\b/.test(w)){armed=false;buf='';interim='';paint();return say('Command off. Say brief to start.');}
  if(alertId&&heardAlert(w))return;
  if(!armed){if(/\bbrief\b/.test(w)){armed=true;paint();return brief();}return;}
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
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=.94;u.pitch=.88;
  loadV();const V=VOX.filter(v=>/^en/i.test(v.lang)),pick=[/Premium/i,/Enhanced/i,/Siri/i,/Natural|Neural|Online/i,/Evan|Nathan|Aaron|Daniel|Arthur/i,/Google UK English Male|Google US English/i];
  let v=null;for(const r of pick){v=V.find(x=>r.test(x.name));if(v)break;}if(v){u.voice=v;VN=v.name.replace(/\s*\(.*\)/,'').toUpperCase();paint();}
  speaking=true;try{rec&&rec.stop();}catch(e){}
  u.onend=u.onerror=()=>{speaking=false;status(on?'Listening':'Ready');if(want)setTimeout(start,250);};
  speechSynthesis.speak(u);
}
function fx(){
  const c=document.getElementById('ccFx'),x=c.getContext('2d');let t=0,stars=[];
  const mk=(w,h)=>{stars=[];for(let i=0;i<260;i++)stars.push([Math.random()*w,Math.random()*h,Math.random()*1.2+.2,Math.random()*6.3,Math.random()<.25]);};
  const neb=[[.18,.62,'122,92,255',.30],[.36,.48,'47,107,255',.34],[.55,.56,'63,212,255',.20],[.7,.42,'122,92,255',.30],[.86,.5,'47,107,255',.26],[.62,.52,'234,217,166',.07]];

  const nc=document.getElementById('ccNet'),y=nc.getContext('2d');
  // Firing sequence: agents + git channel over the bridge image. Live from live/crew (nodes s, chan events).
  const NP={you:[.17,.42,'YOU'],orch:[.47,.33,'ORCH'],fable:[.31,.56,'FABLE'],watch:[.60,.55,'WATCH'],git:[.76,.21,'GIT'],gov:[.88,.40,'GOV'],loop:[.76,.58,'LOOP']};
  const LK=[['you','orch'],['orch','fable'],['orch','watch'],['watch','git'],['orch','git'],['git','gov'],['git','loop'],['gov','loop']];
  let P=[],nextAuto=0,nextReplay=0,ri=0;const C={run:'63,212,255',you:'234,217,166',idle:'110,128,160',git:'198,160,255'};
  const st=k=>k==='git'?'git':((crew.nodes||{})[k]||{}).s||'idle';
  const fire=(a,b,col,lab)=>{if(NP[a]&&NP[b])P.push({a,b,t0:t,col,lab});};
  function net(w,h){const d=devicePixelRatio||1;if(nc.width!==Math.round(w*d)){nc.width=Math.round(w*d);nc.height=Math.round(h*d);}y.setTransform(d,0,0,d,0,0);y.clearRect(0,0,w,h);
    const N=crew.nodes||{},ev=(crew.chan||[]).filter(e=>e&&NP[e.from]&&NP[e.to]).slice(-8);
    if(t>nextAuto){nextAuto=t+1.4;LK.forEach(([a,b])=>{const sa=st(a),sb=st(b);if(sa==='run'||sb==='run')fire(sa==='run'?a:b,sa==='run'?b:a,C.run);else if(sa==='you'||sb==='you')fire(sa==='you'?b:a,sa==='you'?a:b,C.you);});}
    if(ev.length&&t>nextReplay){const e=ev[ri%ev.length];ri++;nextReplay=t+(ri%ev.length?1.1:4);fire(e.from,e.to,C.git,(e.kind||'').toUpperCase());}
    y.lineWidth=1;LK.forEach(([a,b])=>{const A=NP[a],B=NP[b],hot=st(a)==='run'||st(b)==='run';y.strokeStyle=hot?'rgba(63,212,255,.35)':'rgba(150,170,210,.14)';y.setLineDash(hot?[]:[3,5]);y.beginPath();y.moveTo(A[0]*w,A[1]*h);y.lineTo(B[0]*w,B[1]*h);y.stroke();});y.setLineDash([]);
    P=P.filter(p=>t-p.t0<1.25);y.globalCompositeOperation='lighter';
    P.forEach(p=>{const A=NP[p.a],B=NP[p.b],k=Math.min(1,(t-p.t0)/1.0),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      const px=(A[0]+(B[0]-A[0])*e)*w,py=(A[1]+(B[1]-A[1])*e)*h,g=y.createRadialGradient(px,py,0,px,py,14);
      g.addColorStop(0,`rgba(${p.col},.95)`);g.addColorStop(.3,`rgba(${p.col},.35)`);g.addColorStop(1,`rgba(${p.col},0)`);y.fillStyle=g;y.fillRect(px-14,py-14,28,28);
      y.strokeStyle=`rgba(${p.col},${.5*(1-k)})`;y.lineWidth=2;y.beginPath();y.moveTo(A[0]*w,A[1]*h);y.lineTo(px,py);y.stroke();
      if(p.lab&&k<1){y.globalCompositeOperation='source-over';y.font='700 9px "Chivo Mono",monospace';y.fillStyle=`rgba(${p.col},${1-k*.6})`;y.fillText(p.lab,(A[0]+B[0])/2*w+6,(A[1]+B[1])/2*h-6);y.globalCompositeOperation='lighter';}
      if(k>=.98){const r=6+(t-p.t0-1)*60;y.strokeStyle=`rgba(${p.col},${Math.max(0,.8-(t-p.t0-1)*3)})`;y.beginPath();y.arc(B[0]*w,B[1]*h,r,0,7);y.stroke();}});
    y.globalCompositeOperation='source-over';
    Object.entries(NP).forEach(([k,[nx,ny,lab]])=>{const S=st(k),col=C[S]||C.idle,X=nx*w,Y=ny*h,z=k==='git'?9:7,pul=S==='run'||S==='you'?1+.25*Math.sin(t*4):1;
      y.fillStyle=`rgba(2,3,8,.75)`;y.beginPath();y.arc(X,Y,z+6,0,7);y.fill();y.strokeStyle=`rgba(${col},.35)`;y.lineWidth=1;y.beginPath();y.arc(X,Y,z+6,0,7);y.stroke();
      y.fillStyle=`rgba(${col},1)`;y.strokeStyle=`rgba(${col},.9)`;y.beginPath();
      if(k==='git'){for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.PI/6;x[i?'lineTo':'moveTo'](X+Math.cos(a)*z*pul,Y+Math.sin(a)*z*pul);}}else{y.moveTo(X,Y-z*pul);y.lineTo(X+z*pul,Y);y.lineTo(X,Y+z*pul);y.lineTo(X-z*pul,Y);}
      y.closePath();y.fill();y.font='700 10px "Chivo Mono",monospace';y.textAlign='center';y.shadowColor='rgba(2,3,8,1)';y.shadowBlur=6;y.fillStyle=`rgba(${col},.95)`;y.fillText(lab,X,Y-z-9);y.shadowBlur=0;y.textAlign='start';});
  }
  function frame(){
    const w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;
    if(c.width!==Math.round(w*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);mk(w,h);}
    x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);t+=.016;
    x.globalCompositeOperation='lighter';
    if(0)neb.forEach((b,i)=>{const bx=w*(b[0]+.02*Math.sin(t*.07+i)),by=h*(b[1]+.05*Math.sin(t*.05+i*1.7)),r=w*(.16+.03*Math.sin(t*.09+i));
      const g=x.createRadialGradient(bx,by,0,bx,by,r);g.addColorStop(0,`rgba(${b[2]},${b[3]})`);g.addColorStop(.55,`rgba(${b[2]},${b[3]*.35})`);g.addColorStop(1,`rgba(${b[2]},0)`);
      x.fillStyle=g;x.save();x.translate(bx,by);x.scale(1.9,.62);x.translate(-bx,-by);x.fillRect(bx-r,by-r,2*r,2*r);x.restore();});
    stars.forEach(s=>{s[0]-=s[2]*.04;if(s[0]<0)s[0]+=w;const a=.35+.65*Math.abs(Math.sin(t*.8+s[3]));
      x.fillStyle=s[4]?`rgba(191,243,255,${a})`:`rgba(238,243,255,${a*.8})`;x.fillRect(s[0],s[1],s[2],s[2]);});
    x.globalCompositeOperation='source-over';net(w,h);
    document.querySelectorAll('#ccCons .con').forEach((con,i)=>{const cv=con.querySelector('canvas'),r=cv.getContext('2d'),S=con.dataset.s,cx=40,cy=40;
      r.clearRect(0,0,80,80);const col=S==='you'?'234,217,166':S==='run'?'63,212,255':'90,108,138';
      for(let k=1;k<=3;k++){r.strokeStyle=`rgba(${col},${S==='idle'?.25:.45})`;r.lineWidth=1.2;r.beginPath();r.arc(cx,cy,k*12,0,7);r.stroke();}
      r.beginPath();r.moveTo(cx-36,cy);r.lineTo(cx+36,cy);r.moveTo(cx,cy-36);r.lineTo(cx,cy+36);r.strokeStyle=`rgba(${col},.18)`;r.stroke();
      if(S!=='idle'){const a=t*(S==='run'?2.2:.9)+i;const g=r.createConicGradient?r.createConicGradient(a-.9,cx,cy):null;
        if(g){g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.14,`rgba(${col},.55)`);g.addColorStop(.15,`rgba(${col},0)`);r.fillStyle=g;r.beginPath();r.arc(cx,cy,36,0,7);r.fill();}
        r.fillStyle=`rgba(${col},1)`;r.beginPath();r.arc(cx+Math.cos(a)*24,cy+Math.sin(a)*24,2.6,0,7);r.fill();}
      r.fillStyle=`rgba(${col},${S==='you'?.6+.4*Math.sin(t*4):1})`;r.beginPath();r.arc(cx,cy,4,0,7);r.fill();});
    const ck=document.getElementById('ccClock');if(ck&&Math.round(t*60)%60===0)ck.textContent=new Date().toLocaleTimeString('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'})+' ET';
    requestAnimationFrame(frame);}
  frame();
}
document.addEventListener('DOMContentLoaded',async()=>{
  if(!mount())return;paint();
  db=await window.SBDB();
  db.doc('live/current').onSnapshot(s=>{live=s.data()||{};});
  db.doc('live/crew').onSnapshot(s=>{crew=s.data()||{};paint();});
  db.doc('live/alert').onSnapshot(s=>showAlert(s.data()));
  db.collection('reports').onSnapshot(s=>{reports=s.docs.map(d=>d.data());});
  start();
  const once=()=>{document.removeEventListener('pointerdown',once);if(!on){want=true;start();}};
  document.addEventListener('pointerdown',once);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&want&&!on)start();});
});
})();
