/* Generated from the app plan builder (core.js) — the same schedule + edits logic the app uses. */
const START='2026-11-17', END='2027-02-28';
/* PLAN_V: bump whenever the plan builder changes task order, so ticks / edits saved for the old plan
   are not attached to different tasks of the new one (task ids are date-index). */
const PLAN_V=5;
const SUBJ={
  sft:{n:'SFT',c:'var(--sft)',full:'Science for Technology'},
  et:{n:'ET',c:'var(--et)',full:'Engineering Technology'},
  ict:{n:'ICT',c:'var(--ict)',full:'Information & Communication Technology'},
  dip:{n:'DIPLOMA',c:'var(--dip)',full:'Technology diploma'},
  hex:{n:'HEXORA',c:'var(--hex)',full:'Hexora site සහ apps'},
  asg:{n:'ASSIGNMENT',c:'var(--asg)',full:'Diploma assignments + deadlines'},
  rev:{n:'REVIEW',c:'var(--rev)',full:'Review'},
  mix:{n:'පන්ති',c:'var(--mix)',full:''}
};
const KIND={old:'පරණ වැඩ',now:'දැන් යන',cls:'පන්තිය',daily:'හැමදාම',rev:'Review',buf:'Buffer',rest:''};
const DAYS=['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'];
const DSH=['ඉරි','සඳු','අඟ','බදා','බ්‍රහ','සිකු','සෙන'];
const MON={1:'ජන',2:'පෙබ',3:'මාර්',4:'අප්‍රේ',5:'මැයි',6:'ජූනි',7:'ජූලි',8:'අගෝ',9:'සැප්',10:'ඔක්',11:'නොවැ',12:'දෙසැ'};
const MONF={1:'ජනවාරි',2:'පෙබරවාරි',3:'මාර්තු',4:'අප්‍රේල්',5:'මැයි',6:'ජූනි',7:'ජූලි',8:'අගෝස්තු',9:'සැප්තැම්බර්',10:'ඔක්තෝබර්',11:'නොවැම්බර්',12:'දෙසැම්බර්'};
const DAYTYPE={1:['SFT Backlog + Recording','sft'],2:['ICT + පන්ති','ict'],3:['ET + ICT Day Papers','et'],4:['Diploma Backlog + ICT Quiz','dip'],5:['Development 01 + Diploma','hex'],6:['ET / SFT / Diploma පන්ති','mix'],0:['Development 02 + Weekly Review','hex']};

const isoAdd=(iso,n)=>{const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const dow=iso=>new Date(iso+'T00:00:00Z').getUTCDay();
const diff=(a,b)=>Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/864e5);
const yr=iso=>iso.slice(0,4)!=='2026'?' '+iso.slice(0,4):'';
const fmt=iso=>{const m=+iso.slice(5,7),d=+iso.slice(8,10);return MON[m]+' '+d+yr(iso)};
const fmtLong=iso=>{const m=+iso.slice(5,7),d=+iso.slice(8,10);return MONF[m]+' '+d+yr(iso)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 12-hour clock -> minutes after midnight ("12:30" am = 00:30, "12:30" pm = 12:30) */
function mins(t,ap){let[h,m]=t.split(':').map(Number);if(ap==='pm'&&h<12)h+=12;if(ap==='am'&&h===12)h=0;return h*60+m}
function todayISO(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}

/* === Nima Schedule V5 · 2026-11-17 → 2027-02-28 === */
const SFT_W=[
'Unit 01 + 03 පරණ Recordings බලන්න|Unit 01 + 03 එකම Tute පිටු 24 Theory පාඩම් කරන්න|Unit 01 + 03 ගණන් පුහුණු වෙන්න',
'Unit 01 + 03 Tute එකේ ගණන් සම්පූර්ණ කරන්න|Unit 01 + 03 ගණන් විසඳන App ප්‍රශ්න සකස් කරන්න|Unit 01 + 03 Flash Cards + Short Notes හදන්න',
'Unit 02 මිනුම් උපකරණ Recording — පැය 2:15 බලන්න|Unit 02 Recording ඉතිරි විනාඩි 15 + Theory පිටු 1–18|Unit 02 Theory පිටු 19–37',
'Unit 02 ගණන් පුහුණු වෙන්න|Unit 02 Question Book පළමු කොටස|Unit 02 Question Book සම්පූර්ණ කරන්න',
'Unit 02 App Theory Questions + ගණන් කරන්න|Unit 02 වැරදුණු ගණන් නැවත පුහුණුව|Unit 02 Flash Cards + Short Notes',
'Unit 04 සෛලීය සංවිධානයක් සහිත ජීවීන් Recording කොටස 1|Unit 04 Recording ඉතිරි කොටස + Theory පිටු 1–20|Unit 04 Theory පිටු 21–40',
'Unit 04 Theory පිටු 41–60|Unit 04 Biology Theory Revision|Unit 04 Question Book පළමු කොටස',
'Unit 04 Question Book සම්පූර්ණ කරන්න|Unit 04 Theory App එක හදන්න|Unit 04 App එකෙන් Theory ප්‍රශ්න කරන්න',
'Unit 04 Flash Cards හදන්න|Unit 04 Short Notes හදන්න|Unit 01–04 Flash Cards Revision',
'Unit 01 + 03 Full Paper එක ලියන්න|Unit 02 Full Paper + විවරණ|Unit 04 Full Paper + විවරණ',
'SFT Units 01–04 Past Papers|SFT Unit 02 / 01 / 03 ගණන් Revision|SFT Flash Cards සහ Short Notes',
'SFT Mixed Paper|SFT Mixed Paper වැරදි ප්‍රශ්න|SFT අලුත් Class Notes + Calculations',
'SFT Past Papers Practice|SFT App Theory සහ ගණන්|SFT Short Notes Revision',
'SFT Pending Backlog / Weak Areas|SFT අලුත් පාඩම් Tute + ගණන්|SFT Weekly Mixed Revision',
'SFT Final Backlog Check|SFT Current Lesson Revision|SFT Weekly Paper'
].map(s=>s.split('|'));
const ET_W=[
'Unit 06 ස්වයංචල තාක්ෂණවේදය Recording කොටස 1|Unit 06 පරණ Theory + Diagrams පාඩම් කරන්න|Unit 06 ගණන් පුහුණු වෙන්න',
'Unit 06 Recording ඉතිරි කොටස|Unit 06 Theory + ගණන් App එකට දාන්න|Unit 06 Flash Cards + Short Notes',
'Unit 06 ගණන් + Tute ප්‍රශ්න|Unit 06 App Theory + Calculations Practice|Unit 06 ඉතිරි පරණ වැඩ',
'Unit 05 චලිතය හා ජව සම්ප්‍රේෂණ Recording|Unit 05 Theory + සූත්‍ර පාඩම්|Unit 05 ගණන් පුහුණුව',
'Unit 05 ගණන් Question Book පළමු කොටස|Unit 05 ගණන් Question Book ඉතිරි කොටස|Unit 05 Theory + Calculations App එක හදන්න',
'Unit 05 Short Notes + Flash Cards|Unit 03 සෞඛ්‍ය හා ආරක්ෂාව Recording|Unit 03 Theory පාඩම් කරන්න (App හදලා තියෙනවා)',
'Unit 03 Short Notes + Flash Cards|Unit 01 ඉංජිනේරු තාක්ෂණවේදය හැඳින්වීම Recording|Unit 01 Theory පාඩම් කරන්න',
'Unit 01 Short Notes + Flash Cards|Unit 01 Theory App එක හදන්න|Unit 02 සැලසුම් චිත්‍ර Recording කොටස 1',
'Unit 02 Recording ඉතිරිය + Notes|Unit 02 Short Notes + Flash Cards|Unit 02 App එක හදන්න',
'Unit 04 ගොඩනැගිලි තාක්ෂණවේදය Recording|Unit 04 Short Notes + Flash Cards|Unit 04 App එක හදන්න',
'ET Units 01–06 Full Paper ලියන්න|ET Full Paper වැරදි විවරණ|ET Unit 05 / 06 ගණන් Revision',
'ET Past Papers|ET App Theory + Calculations|ET Short Notes Revision',
'ET Mixed Paper|ET Mixed Paper වැරදි විවරණ|ET Theory Flash Cards',
'ET Unit 05 / 06 ගණන් පුහුණුව|ET App Questions / Past Papers|ET Unit 06 අලුත් Notes Revision',
'ET Pending Backlog Check|ET Units 01–06 Full Revision|ET Weekly Paper'
].map(s=>s.split('|'));
const ICT_W=[
'Lesson 01 Recording|Lesson 01 Theory පළමු කොටස',
'Lesson 01 Theory ඉතිරි කොටස|Lesson 01 Short Notes + Flash Cards',
'Lesson 01 App Theory Questions|Lesson 01 Full Paper + විවරණ',
'Lesson 02 Recording|Lesson 02 Theory පළමු කොටස',
'Lesson 02 Theory ඉතිරි කොටස|Lesson 02 Short Notes + Flash Cards',
'Lesson 02 App Theory Questions|Lesson 02 Full Paper + විවරණ',
'Lesson 03 Recording|Lesson 03 Theory + ගණන් පුහුණුව',
'Lesson 03 Short Notes + Flash Cards|Lesson 03 Theory + Calculations App',
'Lesson 03 Full Paper|Lesson 03 Past Paper Book',
'Lesson 04 පරණ Recording|Lesson 04 පරණ Theory + ගණන්',
'Lesson 04 Short Notes + Flash Cards|Lesson 04 App Theory + Calculations',
'Lesson 04 Past Paper Book|Lesson 03 / 04 ගණන් Revision',
'ICT Lessons 01–04 Past Papers|ICT App MCQ Practice',
'ICT වැරදුණු MCQ / Weak Areas|ICT Short Notes + Flash Cards',
'ICT Backlog Review|ICT Lessons 01–04 Mixed Paper'
].map(s=>s.split('|'));
const BASE={},ORDER=[];
(function build(){
 let mon=0,tue=0,wed=0,dip=0,dayCount=0,dailyCount=0;
 const minutes=s=>{const p=s.split(':').map(Number);return p[0]*60+p[1]};
 for(let date=START;date<=END;date=isoAdd(date,1)){
  const w=dow(date),wk=Math.floor(diff(START,date)/7)+1,L=[];
  const add=(a,b,s,ti,k='now',extra={})=>{
   const time=m=>{const h=Math.floor(m/60)%24;return {t:(h%12||12)+':'+String(m%60).padStart(2,'0'),ap:h>=12?'pm':'am'}};
   const x=time(minutes(a)),y=time(minutes(b));L.push(Object.assign({s,ti,k,t:x.t,ap:x.ap,e:y.t,ap2:y.ap===x.ap?'':y.ap,h:(minutes(b)-minutes(a))/60},extra))};
  const old=(a,b,s,ti,extra={})=>add(a,b,s,ti,'old',Object.assign({bl:1},extra));
  const fixed=(a,b,s,ti)=>add(a,b,s,ti,'cls',{fx:1});
  const rest=(a,b)=>add(a,b,'rev','කෑම / විවේකය','rest',{fx:1});
  const buffer=(a,b)=>add(a,b,'rev','Buffer — මඟහැරුණු වැඩ','buf',{fx:1});
  const daily=late=>add(late?'23:10':'22:00',late?'23:25':'22:20','ict',
    'Daily Quiz #'+(110+diff(START,date))+' (MCQ 5) — Telegram පිළිතුරු + short explanation','daily');
  if(w===1){
    const a=SFT_W[Math.min(mon++,SFT_W.length-1)],k=mon<=10?'old':'rev';
    add('10:00','12:15','sft',a[0],k,k==='old'?{bl:1}:{});
    rest('12:15','13:15');
    add('13:15','15:15','sft',a[1],k,k==='old'?{bl:1}:{});
    add('15:30','16:30','sft',a[2],k,k==='old'?{bl:1}:{});
    buffer('16:30','17:15');
    add('19:00','21:00','sft','සිකුරාදා SFT Online Class Recording + Notes');daily(false);
  }else if(w===2){
    const a=ICT_W[Math.min(tue++,ICT_W.length-1)],k=tue<=12?'old':'rev';
    add('10:00','12:15','ict',a[0],k,k==='old'?{bl:1}:{});
    add('13:00','14:00','ict',a[1],k,k==='old'?{bl:1}:{});
    rest('14:00','15:00');
    fixed('15:00','17:00','ict','ICT Physical Class (Lesson 04) + Day Paper MCQ 10');
    add('18:00','18:45','ict','අද Day Paper පිළිතුරු, ලකුණු සහ short explanations');
    fixed('19:30','21:30','ict','ICT Online Class (Lesson 04)');daily(false);
  }else if(w===3){
    const a=ET_W[Math.min(wed++,ET_W.length-1)],k=wed<=11?'old':'rev';
    add('10:00','12:15','et',a[0],k,k==='old'?{bl:1}:{});
    rest('12:15','13:15');
    add('13:15','15:15','et',a[1],k,k==='old'?{bl:1}:{});
    add('15:30','16:30','et',a[2],k,k==='old'?{bl:1}:{});
    buffer('16:30','17:15');
    if(dayCount<33){const n=Math.min(3,33-dayCount),a=dayCount+1;dayCount+=n;
      old('19:00','20:40','ict','පරණ Day Papers #'+a+'–#'+dayCount+' (MCQ 10 බැගින්, short explain)',{mc:{c:n}})}
    else add('19:00','20:40','ict','ICT Past Day Paper වැරදි ප්‍රශ්න Revision','rev');
    old('20:50','21:50','et','ET Online Class Recording — කොටස 1');daily(false);
  }else if(w===4){
    const n=dip++;
    if(n<7){
      old('10:00','12:30','dip','Diploma Lesson '+(n+1)+' Recording — පැය 2:30');
      old('13:30','14:00','dip','Diploma Lesson '+(n+1)+' Recording — ඉතිරි විනාඩි 30');
      old('14:00','15:30','dip','Diploma Lesson '+(n+1)+' Notes + පාඩම් + Short Notes');
    }else{
      add('10:00','12:30','dip','Diploma Lessons 01–07 Revision / Pending Recordings','rev');
      add('13:30','14:00','dip','Diploma Short Notes Review','rev');
      add('14:00','15:30','dip','Diploma පරණ පාඩම් Revision / Practice','rev');
    }
    add('15:45','17:15','dip',n===0?'Lesson 08 Software Engineering ආරම්භය + notes':'Lesson 08 Software Engineering / Deadline Assignment');
    if(dailyCount<106){const count=Math.min(5,106-dailyCount),a=dailyCount+1;dailyCount+=count;
      old('19:00','20:30','ict','පරණ Daily Quiz #'+a+'–#'+dailyCount+' (MCQ 5, short explain)',{mc:{d:count}})}
    else add('19:00','20:30','ict','පරණ Daily Quiz වැරදි MCQ Revision','rev');
    old('20:45','21:45','et','ET Online Class Recording — කොටස 2');daily(false);
  }else if(w===5){
    add('10:00','12:30','hex','Development 01 — Hexora / Client Projects');
    rest('12:30','13:30');
    add('13:30','15:30','hex','Development 01 — Features / Backend / Integration');
    add('15:45','17:15','hex','Development 01 — Testing, GitHub, Bug Fixing');
    rest('17:15','18:45');
    fixed('19:00','23:00','dip','Diploma Software Engineering Live Class');daily(true);
  }else if(w===6){
    fixed('07:00','09:30','et','ET Physical Class — Unit 06');
    fixed('10:00','12:00','sft','SFT Physical Class — Unit 01 + 03 + MCQ 7');
    rest('12:00','13:15');
    add('13:15','14:15','et','ET අද උගන්වපු Theory + Class Notes');
    add('14:15','15:15','et','ET අද ගණන් + App + Short Notes / Flash Cards');
    add('15:30','16:30','sft','SFT අද උගන්වපු Theory + ගණන්');
    add('16:30','17:15','sft','SFT අද ගණන් App එකට + Short Notes');
    add('17:15','17:45','sft','SFT අද Flash Cards');
    add('18:00','18:45','sft','SFT MCQ 7 විවරණ + ලකුණු; ලබන සතියේ discuss');
    rest('18:45','20:00');
    fixed('20:00','23:00','dip','Diploma Live Class (ET Online Recording Wed/Thu)');daily(true);
  }else if(w===0){
    add('10:00','12:30','hex','Development 02 — Personal Apps / A/L Tech Notes');
    rest('12:30','13:30');
    add('13:30','15:30','hex','Development 02 — SFT / ET / ICT Quiz Apps');
    add('15:45','17:15','hex','Development 02 — Testing / GitHub / Bugs');
    add('18:30','19:15','asg','Diploma Assignments + Lesson 08 Notes / Deadline Check');
    if(dailyCount<106){const count=Math.min(5,106-dailyCount),a=dailyCount+1;dailyCount+=count;
      old('19:15','20:45','ict','පරණ Daily Quiz #'+a+'–#'+dailyCount+' (MCQ 5, short explain)',{mc:{d:count}})}
    else add('19:15','20:45','ict','ICT පරණ Daily Quiz වැරදි MCQ Revision','rev');
    add('20:45','21:15','rev','Weekly Review + Pending Tasks ඊළඟ සතියට','rev');daily(false);
  }
  L.forEach((t,i)=>{t.id=date+'-'+i;t.date=date});
  BASE[date]={iso:date,w,wk,tasks:L};ORDER.push(date);
 }
})();

/* ---------- day label ---------- */
function dayKey(d){return DAYTYPE[dow(d)]}

/* ---------- time helpers (12-hour pieces <-> minutes) ---------- */
const endMin=t=>{let a=mins(t.t,t.ap),b=mins(t.e,t.ap2||t.ap);if(b<=a)b+=720;if(b<=a)b+=720;return b};
const startMin=t=>mins(t.t,t.ap);
function toPieces(m){m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mm=m%60,ap=h>=12?'pm':'am',h12=h%12===0?12:h%12;
  return {t:h12+':'+String(mm).padStart(2,'0'),ap}}
/* "HH:MM" 24h -> {t,ap} */
function from24(v){const [h,m]=v.split(':').map(Number);return toPieces(h*60+m)}
function to24(t,ap){const m=mins(t,ap);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function setSpan(o,a,b){const p=toPieces(a),q=toPieces(b);o.t=p.t;o.ap=p.ap;o.e=q.t;o.ap2=q.ap===p.ap?'':q.ap;return o}

/* ---------- merged plan: base plan + the person's own changes ----------
   st.edits[id] = {ti,d,date,t,e,ap,ap2}   changed title / day / time of a plan task
   st.hidden[id] = 1                       a plan task the person removed
   st.custom = [{id,date,s,ti,d,t,e,ap,ap2,k}]   tasks the person added                          */
function makePlan(st){
  st=st||{};const ed=st.edits||{},hid=st.hidden||{},cu=st.custom||[];
  const P={};ORDER.forEach(d=>{P[d]={iso:d,w:BASE[d].w,wk:BASE[d].wk,tasks:[]}});
  const put=t=>{if(P[t.date])P[t.date].tasks.push(t)};
  ORDER.forEach(d=>BASE[d].tasks.forEach(b=>{
    if(hid[b.id])return;
    const t=Object.assign({},b,{home:d}),e=ed[b.id];
    if(e){for(const k of ['ti','d','date','t','e','ap','ap2'])if(e[k]!==undefined)t[k]=e[k];
      if((e.date&&e.date!==d)||(e.t&&(e.t!==b.t||e.ap!==b.ap)))t.mv=1;
      if(e.ti!==undefined||e.d!==undefined)t.ed=1}
    put(t)}));
  cu.forEach(c=>{if(!hid[c.id])put(Object.assign({k:'now',cu:1,home:c.date},c))});
  ORDER.forEach(d=>{const L=P[d].tasks;
    L.forEach((t,i)=>{t._i=i});
    if(L.every(t=>t.ap&&t.e))L.sort((a,b)=>startMin(a)-startMin(b)||a._i-b._i);
    L.forEach((t,i)=>{t.id=t.id;t.date=d;
      t.h=(t.t&&t.e&&t.ap)?(endMin(t)-startMin(t))/60:0;t.clash=0;delete t._i});
    const T=L.filter(t=>t.ap&&t.e&&t.k!=='rest'&&t.k!=='buf');
    for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++)if(startMin(T[j])<endMin(T[i])&&startMin(T[i])<endMin(T[j])){T[i].clash=1;T[j].clash=1}
  });
  const ALL=ORDER.flatMap(d=>P[d].tasks);
  return {PLAN:P,ALL,CHECKABLE:ALL.filter(t=>!t.fx&&t.k!=='rest')};
}

/* ---------- streak + daily completion ----------
   A day "counts" when at least 60% of its tickable tasks are done. */
const STREAK_PCT=0.6;
function dayStat(P,iso,done){const L=P[iso].tasks.filter(t=>!t.fx&&t.k!=='rest');const a=L.filter(t=>done[t.id]).length;
  return {iso,n:L.length,a,p:L.length?a/L.length:0,ok:L.length>0&&a/L.length>=STREAK_PCT}}
function streakInfo(P,done,today){
  const last=today<START?START:today>END?END:today;let cur=0,best=0,run=0;
  for(let d=START;d<=last;d=isoAdd(d,1)){const s=dayStat(P,d,done);
    if(s.ok){run++;if(run>best)best=run}else if(d!==last){run=0}else{/* today not finished yet: keep the run alive */}}
  // current streak: walk back from today (today may still be in progress)
  let d=last;if(!dayStat(P,d,done).ok)d=isoAdd(d,-1);
  while(d>=START&&dayStat(P,d,done).ok){cur++;d=isoAdd(d,-1)}
  return {cur,best:Math.max(best,cur),todayOk:dayStat(P,last,done).ok}
}

/* the plan the app starts with */
let PLAN=BASE,ALL=ORDER.flatMap(d=>BASE[d].tasks),CHECKABLE=ALL.filter(t=>!t.fx&&t.k!=='rest');
function applyPlan(st){const r=makePlan(st);PLAN=r.PLAN;ALL=r.ALL;CHECKABLE=r.CHECKABLE}

export { makePlan, BASE, ORDER, SUBJ, KIND, START, END, PLAN_V, mins, isoAdd, dow, dayKey, dayStat, streakInfo, startMin, endMin };
