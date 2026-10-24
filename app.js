const canvas = document.querySelector('#garden');
const ctx = canvas.getContext('2d');
const gameCard = document.querySelector('#gameCard');
const hint = document.querySelector('#gardenHint');
const thought = document.querySelector('#thought');
const memoryList = document.querySelector('#memoryList');
const bondFill = document.querySelector('#bondFill');
const bondValue = document.querySelector('#bondValue');
const evolutionText = document.querySelector('#evolutionText');
const overlay = document.querySelector('#evolutionOverlay');
const starRow = [...document.querySelectorAll('#starRow i')];

const state = {
  width: 1000, height: 700, time: 0, pointer: { x: 500, y: 330 },
  rain: true, rainStrength: .65, targetRain: .65, bond: 12, memories: 0,
  evolved: false, flowers: [], ripples: [], motes: [], hearts: [], audio: false,
  weatherIndex: 0, lastAction: 0
};

const memories = {
  pet: ['ルゥは目を細め、あなたの指先の温度を覚えた。', '撫でられた場所に、小さな星の模様が灯った。'],
  rain: ['空から落ちた一粒を、ルゥがおいしそうに飲みこんだ。', '水たまりの底で、忘れられた雨の歌が響いた。'],
  seed: ['置かれた種のそばで、ルゥは朝まで眠ることにした。', '新しい芽が、ルゥの呼吸に合わせて揺れている。']
};

function resize() {
  const rect = gameCard.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  state.width = rect.width; state.height = rect.height;
}

function lerp(a, b, t) { return a + (b - a) * t; }
function rand(a, b) { return a + Math.random() * (b - a); }
function roundRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}

function gradientSky() {
  const g = ctx.createLinearGradient(0, 0, 0, state.height);
  const warmth = 1 - state.rainStrength;
  g.addColorStop(0, warmth > .5 ? '#34495a' : '#182d3a');
  g.addColorStop(.55, warmth > .5 ? '#6f7668' : '#315256');
  g.addColorStop(1, '#253e38');
  ctx.fillStyle = g; ctx.fillRect(0, 0, state.width, state.height);
  const glow = ctx.createRadialGradient(state.width * .73, state.height * .18, 1, state.width * .73, state.height * .18, state.width * .42);
  glow.addColorStop(0, `rgba(238,208,145,${.24 * warmth})`); glow.addColorStop(1, 'rgba(238,208,145,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, state.width, state.height);
}

function drawHills() {
  const h = state.height;
  ctx.fillStyle = 'rgba(21,50,49,.8)'; ctx.beginPath(); ctx.moveTo(0, h*.43);
  ctx.bezierCurveTo(state.width*.18,h*.31,state.width*.3,h*.48,state.width*.47,h*.36);
  ctx.bezierCurveTo(state.width*.66,h*.23,state.width*.78,h*.44,state.width,h*.3); ctx.lineTo(state.width,h); ctx.lineTo(0,h); ctx.fill();
  ctx.fillStyle = '#18362f'; ctx.beginPath(); ctx.moveTo(0,h*.57);
  ctx.bezierCurveTo(state.width*.19,h*.44,state.width*.34,h*.59,state.width*.53,h*.49);
  ctx.bezierCurveTo(state.width*.72,h*.39,state.width*.83,h*.54,state.width,h*.46); ctx.lineTo(state.width,h); ctx.lineTo(0,h); ctx.fill();
  for (let i=0;i<18;i++) {
    const x = (i * 83) % (state.width + 80) - 30;
    const y = h * (.42 + .075*Math.sin(i*2.1));
    ctx.save(); ctx.translate(x,y); ctx.rotate(Math.sin(i)*.16); ctx.fillStyle = i%2 ? '#234f43' : '#2c5a49';
    ctx.beginPath(); ctx.ellipse(-3,-22,5,25,.15,0,Math.PI*2); ctx.ellipse(5,-16,4,19,-.25,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
}

function drawPond() {
  const cx = state.width*.53, cy = state.height*.7;
  const g = ctx.createRadialGradient(cx,cy,5,cx,cy,state.width*.35);
  g.addColorStop(0,'rgba(87,146,135,.55)'); g.addColorStop(.72,'rgba(35,78,70,.85)'); g.addColorStop(1,'rgba(21,51,44,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(cx,cy,state.width*.43,state.height*.2,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(180,220,200,.12)'; ctx.lineWidth=1;
  for(let i=0;i<4;i++){ ctx.beginPath(); ctx.ellipse(cx+Math.sin(i)*35,cy+i*8,state.width*(.18+i*.05),22+i*7,0,0,Math.PI*2); ctx.stroke(); }
  state.ripples.forEach((r) => { ctx.globalAlpha = Math.max(0,1-r.life); ctx.strokeStyle='#b8ded1'; ctx.beginPath(); ctx.ellipse(r.x,r.y,r.life*28,r.life*8,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;r.life+=.018; });
  state.ripples=state.ripples.filter(r=>r.life<1);
}

function drawPlants() {
  const baseY=state.height*.73;
  for(let i=0;i<24;i++){
    const x=((i*97+37)%Math.max(1,state.width)); const y=baseY+35*Math.sin(i*3.2);
    const sway=Math.sin(state.time*.0015+i)*5; ctx.strokeStyle=i%3?'#53765b':'#73906a';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x,y+55);ctx.quadraticCurveTo(x+sway,y+25,x+sway*.5,y);ctx.stroke();
    ctx.fillStyle=i%4?'#466f55':'#7f9870';ctx.beginPath();ctx.ellipse(x+sway*.7-5,y+20,9,4,-.5,0,Math.PI*2);ctx.ellipse(x+sway*.5+5,y+31,8,3,.6,0,Math.PI*2);ctx.fill();
  }
  state.flowers.forEach(f=>{
    const age=Math.min(1,(state.time-f.born)/800); const y=f.y+22*(1-age);
    ctx.strokeStyle='#75966d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x,f.y+28);ctx.quadraticCurveTo(f.x+5,y+12,f.x,y);ctx.stroke();
    ctx.fillStyle=f.color; for(let p=0;p<5;p++){const a=p*Math.PI*2/5;ctx.beginPath();ctx.ellipse(f.x+Math.cos(a)*6*age,y+Math.sin(a)*6*age,5*age,3*age,a,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#f2d68a';ctx.beginPath();ctx.arc(f.x,y,2.5*age,0,Math.PI*2);ctx.fill();
  });
}

function drawCreature() {
  const cx=state.width*.53, base=state.height*.59;
  const bob=Math.sin(state.time*.0025)*4; const blink=(state.time%4800)>4550;
  const lookX=Math.max(-4,Math.min(4,(state.pointer.x-cx)/70)); const lookY=Math.max(-2,Math.min(3,(state.pointer.y-base)/100));
  ctx.save();ctx.translate(cx,base+bob);
  const aura=ctx.createRadialGradient(0,0,5,0,0,state.evolved?110:70);aura.addColorStop(0,state.evolved?'rgba(142,222,196,.22)':'rgba(235,211,145,.09)');aura.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(0,0,state.evolved?110:70,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(7,24,24,.25)';ctx.beginPath();ctx.ellipse(0,70,70,17,0,0,Math.PI*2);ctx.fill();
  const body=ctx.createRadialGradient(-19,-22,5,0,8,82);body.addColorStop(0,state.evolved?'#d6dfb8':'#d8d2ae');body.addColorStop(.68,state.evolved?'#93b797':'#9bac8c');body.addColorStop(1,'#597369');
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-56,8);ctx.bezierCurveTo(-54,-42,-29,-69,0,-69);ctx.bezierCurveTo(38,-70,59,-38,57,9);ctx.bezierCurveTo(55,56,35,72,0,72);ctx.bezierCurveTo(-35,72,-58,51,-56,8);ctx.fill();
  // leaf ears
  ctx.save();ctx.rotate(-.1+Math.sin(state.time*.001)*.03);ctx.fillStyle=state.evolved?'#8ac5a4':'#738f72';ctx.beginPath();ctx.moveTo(-28,-56);ctx.bezierCurveTo(-72,-104,-71,-137,-50,-139);ctx.bezierCurveTo(-22,-128,-17,-91,-17,-65);ctx.fill();ctx.strokeStyle='rgba(229,222,170,.26)';ctx.beginPath();ctx.moveTo(-29,-66);ctx.quadraticCurveTo(-48,-101,-51,-127);ctx.stroke();ctx.restore();
  ctx.save();ctx.rotate(.1-Math.sin(state.time*.0012)*.03);ctx.fillStyle=state.evolved?'#7fb99c':'#6b856d';ctx.beginPath();ctx.moveTo(27,-57);ctx.bezierCurveTo(68,-106,67,-137,47,-141);ctx.bezierCurveTo(20,-129,16,-91,16,-65);ctx.fill();ctx.strokeStyle='rgba(229,222,170,.26)';ctx.beginPath();ctx.moveTo(29,-66);ctx.quadraticCurveTo(47,-101,48,-129);ctx.stroke();ctx.restore();
  // face
  ctx.fillStyle='#172b2b';
  if(blink){ctx.fillRect(-28+lookX,-18+lookY,17,2);ctx.fillRect(11+lookX,-18+lookY,17,2);}else{ctx.beginPath();ctx.ellipse(-19+lookX,-18+lookY,7,10,0,0,Math.PI*2);ctx.ellipse(19+lookX,-18+lookY,7,10,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e8d58f';ctx.beginPath();ctx.arc(-17+lookX,-21+lookY,2,0,Math.PI*2);ctx.arc(21+lookX,-21+lookY,2,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#526e64';ctx.beginPath();ctx.moveTo(-4,2);ctx.quadraticCurveTo(0,6,4,2);ctx.quadraticCurveTo(0,10,-4,2);ctx.fill();
  ctx.strokeStyle='rgba(43,69,62,.65)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,7,12,.25,Math.PI-.25);ctx.stroke();
  ctx.fillStyle='rgba(226,156,139,.15)';ctx.beginPath();ctx.ellipse(-34,2,11,6,0,0,Math.PI*2);ctx.ellipse(34,2,11,6,0,0,Math.PI*2);ctx.fill();
  if(state.evolved){ctx.fillStyle='#e7cf85';for(let i=0;i<7;i++){const a=i*Math.PI*2/7+state.time*.00015;ctx.beginPath();ctx.arc(Math.cos(a)*43,Math.sin(a)*51,1.8,0,Math.PI*2);ctx.fill();}}
  ctx.restore();
  state.hearts.forEach(h=>{const life=(state.time-h.born)/1200;ctx.globalAlpha=Math.max(0,1-life);ctx.fillStyle='#edc78d';ctx.font=`${16+life*9}px serif`;ctx.fillText('♡',h.x+Math.sin(life*8)*10,h.y-life*80);ctx.globalAlpha=1;});
  state.hearts=state.hearts.filter(h=>state.time-h.born<1200);
}

function drawRain() {
  state.rainStrength=lerp(state.rainStrength,state.targetRain,.025);
  if(state.rainStrength<.03)return;
  ctx.strokeStyle=`rgba(188,225,222,${.16+state.rainStrength*.18})`;ctx.lineWidth=1;
  for(let i=0;i<70*state.rainStrength;i++){
    const x=(i*137+state.time*.13)%(state.width+80)-40;const y=(i*83+state.time*.42)%(state.height+70)-70;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y+18);ctx.stroke();
  }
}

function drawMotes(){
  if(state.motes.length<30)state.motes.push({x:rand(0,state.width),y:rand(0,state.height*.7),s:rand(.5,2),p:rand(0,9)});
  state.motes.forEach(m=>{m.y-=.05;ctx.globalAlpha=.22+.25*Math.sin(state.time*.001+m.p);ctx.fillStyle='#e9d28b';ctx.beginPath();ctx.arc(m.x+Math.sin(state.time*.0007+m.p)*8,m.y,m.s,0,Math.PI*2);ctx.fill();if(m.y<0)m.y=state.height*.7;});ctx.globalAlpha=1;
}

function render(t){state.time=t;gradientSky();drawHills();drawRain();drawPond();drawPlants();drawCreature();drawMotes();requestAnimationFrame(render);}

function addMemory(type) {
  state.memories=Math.min(5,state.memories+1); state.bond=Math.min(100,state.bond+rand(9,15));
  bondFill.style.width=`${state.bond}%`;bondValue.textContent=Math.round(state.bond);
  starRow.forEach((s,i)=>s.classList.toggle('filled',i<state.memories));
  evolutionText.textContent=state.memories<5?`あと ${5-state.memories} つの記憶`:'変化の時が来た';
  const text=memories[type][Math.min(1,state.memories>3?1:0)];thought.textContent=`「${type==='pet'?'あたたかい。もう一度、して。':type==='rain'?'この雨、ずっと前にも知っていた気がする。':'ここから何が生まれるの？'}」`;
  const article=document.createElement('article');article.className='memory active';article.innerHTML=`<time>たった今</time><p>${text}</p>`;memoryList.prepend(article);
  [...memoryList.children].slice(2).forEach(el=>el.remove());
  if(state.memories===5&&!state.evolved)setTimeout(evolve,700);
}

function tone(freq=520){if(!state.audio)return;const AudioCtx=window.AudioContext||window.webkitAudioContext;state.audioCtx??=new AudioCtx();const o=state.audioCtx.createOscillator();const g=state.audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.08,state.audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,state.audioCtx.currentTime+.7);o.connect(g).connect(state.audioCtx.destination);o.start();o.stop(state.audioCtx.currentTime+.75);}

function act(type){
  const now=performance.now();if(now-state.lastAction<350)return;state.lastAction=now;
  const cx=state.width*.53,cy=state.height*.55;
  if(type==='pet'){for(let i=0;i<4;i++)state.hearts.push({x:cx+rand(-35,35),y:cy+rand(-10,35),born:state.time+rand(-200,100)});hint.textContent='ルゥは、くすぐったそうに笑った。';tone(620);}
  if(type==='rain'){state.targetRain=state.targetRain>.5?.05:.8;document.querySelector('#weatherName').textContent=state.targetRain>.5?'庭を満たす雨':'雲間の光';document.querySelector('#weatherIcon').textContent=state.targetRain>.5?'☂':'☀';for(let i=0;i<5;i++)state.ripples.push({x:rand(state.width*.25,state.width*.8),y:rand(state.height*.65,state.height*.82),life:0});hint.textContent=state.targetRain>.5?'雨が、庭の古い記憶を起こしている。':'雲がほどけ、光が降りてきた。';tone(470);}
  if(type==='seed'){state.flowers.push({x:rand(state.width*.2,state.width*.83),y:rand(state.height*.66,state.height*.8),born:state.time,color:Math.random()>.5?'#d7b780':'#9bbca6'});hint.textContent='土の下で、小さな鼓動が始まった。';tone(700);}
  addMemory(type);
}

function evolve(){state.evolved=true;overlay.classList.add('visible');overlay.setAttribute('aria-hidden','false');document.querySelector('#formName').textContent='星雨の姿';document.querySelector('#portrait').style.background='radial-gradient(circle, #a9d5ad, #3e6d5d 58%, #172e35)';thought.textContent='「聞こえるよ。この庭に降った、ぜんぶの雨の音。」';tone(820);setTimeout(()=>tone(1020),180);}

document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>act(button.dataset.action)));
document.querySelector('#continueButton').addEventListener('click',()=>{overlay.classList.remove('visible');overlay.setAttribute('aria-hidden','true');hint.textContent='新しい姿のルゥが、光る耳を揺らしている。';});
document.querySelector('#soundButton').addEventListener('click',(e)=>{state.audio=!state.audio;e.currentTarget.textContent=state.audio?'♫':'♪';e.currentTarget.style.color=state.audio?'#e9c77d':'';if(state.audio)tone(660);});
canvas.addEventListener('pointermove',(e)=>{const r=canvas.getBoundingClientRect();state.pointer.x=e.clientX-r.left;state.pointer.y=e.clientY-r.top;});
canvas.addEventListener('pointerdown',(e)=>{const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;state.ripples.push({x,y,life:0});if(Math.hypot(x-state.width*.53,y-state.height*.55)<110)act('pet');});
window.addEventListener('resize',resize);resize();requestAnimationFrame(render);
