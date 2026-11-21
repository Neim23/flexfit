const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
// exercise pools: [name, type]
const EX={
body:{push:['Push-ups','Pike push-ups','Diamond push-ups'],pull:['Doorframe rows','Superman holds','Towel rows'],legs:['Bodyweight squats','Reverse lunges','Glute bridges','Step-ups'],core:['Plank','Dead bugs','Mountain climbers'],cardio:['Jumping jacks','High knees','Burpees']},
db:{push:['Dumbbell bench press','Overhead press','Dumbbell flyes'],pull:['One-arm dumbbell row','Bent-over row','Dumbbell curls'],legs:['Goblet squats','Romanian deadlift','Walking lunges','Dumbbell calf raises'],core:['Russian twists','Plank','Dumbbell woodchops'],cardio:['Dumbbell swings','Thrusters','Jump rope']},
gym:{push:['Barbell bench press','Incline press','Cable fly'],pull:['Lat pulldown','Seated cable row','Face pulls'],legs:['Back squat','Leg press','Romanian deadlift','Leg curl'],core:['Cable crunch','Hanging knee raise','Plank'],cardio:['Rowing machine','Treadmill intervals','Assault bike']}};
const SR={strength:[['4','5-6'],['4','5'],['5','3-5']],lean:[['3','12-15'],['3','12'],['4','10-12']],stamina:[['3','15-20'],['3','20'],['4','20-25']]};
const SPLIT={push:['Upper push','push','core'],pull:['Upper pull','pull','core'],legs:['Lower body','legs','core'],full:['Full body','full','core'],cardio:['Cardio and core','cardio','core']};
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const LAYOUT={2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,4,5],6:[0,1,2,3,4,5]};
const KINDS={2:['full','full'],3:['full','full','full'],4:['push','legs','pull','full'],5:['push','legs','pull','full','cardio'],6:['push','legs','pull','push','legs','cardio']};
function build(goal,exp,eq,n){
  const pool=EX[eq],[sets,reps]=SR[goal][exp],kinds=KINDS[n].slice();
  if(goal==='stamina')kinds[kinds.length-1]='cardio';
  const used={};
  const pick=t=>{const a=pool[t];used[t]=(used[t]||0);return a[used[t]++%a.length]};
  const out=DAYS.map(()=>null);
  LAYOUT[n].forEach((d,i)=>{
    const k=kinds[i],items=[];
    const add=(t,s,r)=>items.push([pick(t),s+' × '+r]);
    if(k==='full'){add('push',sets,reps);add('pull',sets,reps);add('legs',sets,reps);}
    else if(k==='cardio'){add('cardio','4','40s on / 20s off');add('legs','3',reps);}
    else{add(k,sets,reps);add(k,sets,reps);if(k==='legs')add('legs',sets,reps);}
    items.push([pick('core'),'3 × '+(goal==='stamina'?'45s':'30s hold or 12')]);
    out[d]={title:{push:'Push',pull:'Pull',legs:'Legs',full:'Full body',cardio:'Cardio mix'}[k],items};
  });
  return out;
}
const LAB={strength:'strength',lean:'lean',stamina:'stamina'},EL=['beginner','intermediate','advanced'],EQ={body:'bodyweight',db:'dumbbells',gym:'full gym'};
function render(){
  const f=new FormData($('#bform')),n=+$('#days').value;
  $('#dout').textContent=n;
  const goal=f.get('goal'),exp=+f.get('exp'),eq=f.get('eq'),plan=build(goal,exp,eq,n);
  $('#summary').textContent=`${n} sessions · ${LAB[goal]} · ${EL[exp]} · ${EQ[eq]}`;
  $('#plan').innerHTML=plan.map((p,i)=>p?`<div class="day on" role="listitem"><h4>${DAYS[i]}</h4><strong>${p.title}</strong><ul>${p.items.map(x=>`<li>${x[0]}<b>${x[1]}</b></li>`).join('')}</ul></div>`
    :`<div class="day rest" role="listitem"><h4>${DAYS[i]}</h4><strong>Rest</strong><p>Walk, stretch, recover.</p></div>`).join('');
}
$('#bform').addEventListener('input',render);render();
// counters + reveal
function count(el){const t=+el.dataset.count;if(RM){el.textContent=t;return}let i=0;const h=setInterval(()=>{i++;el.textContent=Math.round(t*(1-Math.pow(1-i/28,3)));if(i>=28)clearInterval(h)},50)}
// streak
const sd=$('#sdays');['M','T','W','T','F','S','S','M','T','W','T','F','S','S'].forEach((d,i)=>{const s=document.createElement('span');s.textContent=d;if(i%7===6)s.classList.add('off');s.dataset.i=i;sd.appendChild(s)});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const t=e.target;
  if(t.dataset.count)count(t);
  if(t.id==='sdays')[...t.children].forEach((c,i)=>setTimeout(()=>c.classList.add('in'),RM?0:i*90));
  if(t.dataset.w)t.style.width=t.dataset.w+'%';
}),{threshold:.3});
$$('[data-count],#sdays,[data-w]').forEach(e=>io.observe(e));
// hero rep counter in sync with the 6s ring loop
const reps=$('#reps');if(reps){const run=()=>{let r=0;const t=setInterval(()=>{reps.textContent=++r;if(r>=12)clearInterval(t)},250);reps.textContent=0};if(RM)reps.textContent=12;else{run();setInterval(run,7000)}}
// pricing toggle
$$('.toggle button').forEach(b=>b.addEventListener('click',()=>{$$('.toggle button').forEach(x=>x.setAttribute('aria-pressed',x===b));const k=b.dataset.p;$$('[data-m]').forEach(s=>s.textContent=s.dataset[k])}));
