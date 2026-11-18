/* Generated from the app plan builder (core.js) — the same schedule + edits logic the app uses. */
const START='2026-11-19', END='2027-02-28';
/* PLAN_V: bump whenever the plan builder changes task order, so ticks / edits saved for the old plan
   are not attached to different tasks of the new one (task ids are date-index). */
const PLAN_V=6;
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
const DAYTYPE={1:['SFT පාඩම්','sft'],2:['ICT පාඩම් + පන්ති','ict'],3:['ET පාඩම් + ICT Day Papers','et'],4:['Diploma පාඩම් + ICT Daily Quiz','dip'],5:['Development 01 + Diploma Live','hex'],6:['ET / SFT / Diploma පන්ති','mix'],0:['Development 02 + ICT Daily Quiz','hex']};

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

/* === Nima Schedule V6 · 2026-11-19 → 2027-02-28 ===
   Live classes are the only things with a time. Weekly date-bound work (class recordings, Day Paper review,
   Development, assignments, the Daily Quiz) has no time. Lesson work is not in here: it lives in the subject
   folders and is done in order, at the person's own pace, on that subject's day. */
const BASE={},ORDER=[];
(function build(){
 let thu=0;
 const minutes=s=>{const p=s.split(':').map(Number);return p[0]*60+p[1]};
 const clock=m=>{const h=Math.floor(m/60)%24;return {t:(h%12||12)+':'+String(m%60).padStart(2,'0'),ap:h>=12?'pm':'am'}};
 for(let date=START;date<=END;date=isoAdd(date,1)){
  const w=dow(date),wk=Math.floor(diff(START,date)/7)+1,L=[];
  const task=(s,ti,k)=>L.push({s,ti,k:k||'now',h:0});
  const live=(a,b,s,ti)=>{const x=clock(minutes(a)),y=clock(minutes(b));
    L.push({s,ti,k:'cls',fx:1,t:x.t,ap:x.ap,e:y.t,ap2:y.ap===x.ap?'':y.ap,h:(minutes(b)-minutes(a))/60})};
  if(w===1){
    task('sft','සිකුරාදා SFT Online Class Recording + Notes');
  }else if(w===2){
    live('15:00','17:00','ict','ICT Physical Class (Lesson 04) + Day Paper MCQ 10');
    task('ict','අද Day Paper පිළිතුරු, ලකුණු සහ short explanations');
    live('19:30','21:30','ict','ICT Online Class (Lesson 04)');
  }else if(w===3){
    task('et','ET Online Class Recording — කොටස 1');
  }else if(w===4){
    task('dip',thu++===0?'Lesson 08 Software Engineering ආරම්භය + notes':'Lesson 08 Software Engineering / Deadline Assignment');
    task('et','ET Online Class Recording — කොටස 2');
  }else if(w===5){
    task('hex','Development 01 — Hexora / Client Projects');
    task('hex','Development 01 — Features / Backend / Integration');
    task('hex','Development 01 — Testing, GitHub, Bug Fixing');
    live('19:00','23:00','dip','Diploma Software Engineering Live Class');
  }else if(w===6){
    live('07:00','09:30','et','ET Physical Class — Unit 06');
    live('10:00','12:00','sft','SFT Physical Class — Unit 01 + 03 + MCQ 7');
    task('et','ET අද උගන්වපු Theory + Class Notes');
    task('et','ET අද ගණන් + App + Short Notes / Flash Cards');
    task('sft','SFT අද උගන්වපු Theory + ගණන්');
    task('sft','SFT අද ගණන් App එකට + Short Notes');
    task('sft','SFT අද Flash Cards');
    task('sft','SFT MCQ 7 විවරණ + ලකුණු; ලබන සතියේ discuss');
    live('20:00','23:00','dip','Diploma Live Class (ET Online Recording Wed/Thu)');
  }else if(w===0){
    task('hex','Development 02 — Personal Apps / A/L Tech Notes');
    task('hex','Development 02 — SFT / ET / ICT Quiz Apps');
    task('hex','Development 02 — Testing / GitHub / Bugs');
    task('asg','Diploma Assignments + Lesson 08 Notes / Deadline Check');
    task('rev','Weekly Review + Pending Tasks ඊළඟ සතියට','rev');
  }
  task('ict','Daily Quiz #'+(110+diff(START,date))+' (MCQ 5) — Telegram පිළිතුරු + short explanation','daily');
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
   A day "counts" when at least 60% of its tickable work is done. cdn[iso] = lesson-folder tasks finished that
   day; they count as done work of that day (added to both sides). */
const STREAK_PCT=0.6;
function dayStat(P,iso,done,cdn){const L=P[iso].tasks.filter(t=>!t.fx&&t.k!=='rest'),x=(cdn&&+cdn[iso])||0;
  const a=L.filter(t=>done[t.id]).length+x,n=L.length+x;
  return {iso,n,a,p:n?a/n:0,ok:n>0&&a/n>=STREAK_PCT}}
function streakInfo(P,done,today,cdn){
  const last=today<START?START:today>END?END:today;let cur=0,best=0,run=0;
  for(let d=START;d<=last;d=isoAdd(d,1)){const s=dayStat(P,d,done,cdn);
    if(s.ok){run++;if(run>best)best=run}else if(d!==last){run=0}else{/* today not finished yet: keep the run alive */}}
  // current streak: walk back from today (today may still be in progress)
  let d=last;if(!dayStat(P,d,done,cdn).ok)d=isoAdd(d,-1);
  while(d>=START&&dayStat(P,d,done,cdn).ok){cur++;d=isoAdd(d,-1)}
  return {cur,best:Math.max(best,cur),todayOk:dayStat(P,last,done,cdn).ok}
}

/* the plan the app starts with */
let PLAN=BASE,ALL=ORDER.flatMap(d=>BASE[d].tasks),CHECKABLE=ALL.filter(t=>!t.fx&&t.k!=='rest');
function applyPlan(st){const r=makePlan(st);PLAN=r.PLAN;ALL=r.ALL;CHECKABLE=r.CHECKABLE}

export { makePlan, BASE, ORDER, SUBJ, KIND, START, END, PLAN_V, mins, isoAdd, dow, dayKey, dayStat, streakInfo, startMin, endMin };
