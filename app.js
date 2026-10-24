const W = 17, H = 13, TILE = 48;
const canvas = document.querySelector('#dungeon');
const ctx = canvas.getContext('2d');

const enemyTypes = {
  heat: { name: '熱だまり', glyph: '熱', color: '#e66c4d', hp: 7, atk: 3, note: '舗装や建物に熱が蓄積し、周囲より気温が高くなる都市の現象。' },
  noise: { name: '情報の霧', glyph: '？', color: '#8b72c8', hp: 6, atk: 2, note: '断片的な情報が重なると、確かな事実を見分けにくくなる。' },
  jam: { name: '交通の結び目', glyph: '詰', color: '#df9e38', hp: 9, atk: 3, note: '移動が一点に集中し、流れが遅くなっている状態。動きは遅いが頑丈。' },
  bloom: { name: '繁茂の芽', glyph: '芽', color: '#4c9d69', hp: 5, atk: 2, note: '条件がそろった場所で急速に広がる生物の集団。' },
  echo: { name: '反響する見出し', glyph: '響', color: '#428ca4', hp: 8, atk: 3, note: '入力した現実の出来事が、迷宮の中で形を持ったもの。' }
};

const categoryThemes = {
  community: { floor: '#345847', floor2: '#3b6350', wall: '#17382e', accent: '#f1c75b', type: 'bloom', label: '人の気配が迷宮を満たしている' },
  climate: { floor: '#40584e', floor2: '#49645a', wall: '#193932', accent: '#f08a5d', type: 'heat', label: '気温のゆらぎを感じる' },
  mobility: { floor: '#3c5053', floor2: '#445b5e', wall: '#192f34', accent: '#efb84d', type: 'jam', label: '遠くで交通の音が響いている' },
  science: { floor: '#374f59', floor2: '#405c67', wall: '#172f38', accent: '#79d8cf', type: 'noise', label: '未知の観測信号が漂っている' }
};

let game;
let autoNews = [];
let selectedSeed = null;
const $ = s => document.querySelector(s);
const els = {
  hpText: $('#hpText'), hpBar: $('#hpBar'), bellyText: $('#bellyText'), bellyBar: $('#bellyBar'),
  floor: $('#floorLabel'), place: $('#placeLabel'), turn: $('#turnValue'), message: $('#message'), messageIcon: $('#messageIcon'),
  team: $('#teamList'), teamCount: $('#teamCount'), note: $('#currentNote'), species: $('#speciesCount'), log: $('#activityLog'),
  observe: $('#observeButton'), flare: $('#flareButton'), observeCd: $('#observeCooldown'), flareCd: $('#flareCooldown'),
  flash: $('#floorFlash'), damage: $('#damageLayer'), weather: $('#weatherText')
};

function rand(n) { return Math.floor(Math.random() * n); }
function key(x, y) { return `${x},${y}`; }
function dist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
function esc(v) { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function isModalOpen() { return !!document.querySelector('.modal.open'); }

function savedSeed() {
  try { return JSON.parse(localStorage.getItem('reality-dungeon-seed')) || null; } catch { return null; }
}

async function loadAutomaticNews() {
  try {
    const response = await fetch(`data/news.json?v=${Date.now()}`);
    if (!response.ok) throw new Error('feed unavailable');
    const data = await response.json();
    const allowed = new Set(Object.keys(categoryThemes));
    const unsafe = /死亡|死者|殺害|逮捕|容疑|事件|事故|災害|地震|津波|豪雨|洪水|火災|戦争|攻撃|侵攻|空爆|負傷|被害|訃報|感染|倒産|不祥事|虐待|遺体|行方不明|防衛|軍事|がん|余命/;
    const badSource = /Vietnam\.vn|BigGo/i;
    autoNews = (Array.isArray(data.items) ? data.items : []).filter(n => n && n.title && n.url && !unsafe.test(n.title) && !badSource.test(n.source || '')).slice(0, 24).map(n => ({
      title: String(n.title).slice(0, 80), place: String(n.source || '国内ニュース').slice(0, 30),
      category: allowed.has(n.category) ? n.category : 'community', fact: String(n.summary || n.title).slice(0, 180),
      source: String(n.url), publishedAt: n.publishedAt || '', automatic: true
    }));
  } catch { autoNews = []; }
  renderAutomaticNews();
}

function renderAutomaticNews() {
  const list = $('#autoNewsList'), status = $('#autoNewsStatus');
  list.innerHTML = '';
  status.textContent = autoNews.length ? `自動収集 ${autoNews.length}件` : '現在、収集データを準備中です';
  if (!autoNews.length) {
    const p = document.createElement('p'); p.className = 'modal-lead'; p.textContent = '初回の自動収集後にここへ表示されます。下の入力も利用できます。'; list.appendChild(p); return;
  }
  autoNews.slice(0, 10).forEach((news, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'auto-news-item';
    const date = news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }) : 'NEW';
    const cat = { community: '地域', climate: '環境', mobility: '交通', science: '科学' }[news.category];
    const meta = document.createElement('span'); meta.textContent = `${date} · ${cat}`;
    const title = document.createElement('b'); title.textContent = news.title;
    const source = document.createElement('small'); source.textContent = news.place;
    b.append(meta, title, source);
    b.addEventListener('click', () => { selectedSeed = autoNews[i]; localStorage.removeItem('reality-dungeon-seed'); closeModal('newsModal'); startGame(); setMessage(`「${selectedSeed.title}」を調査します。`, '◎'); });
    list.appendChild(b);
  });
}

function startGame(rotateNews = false) {
  const manual = savedSeed();
  if (rotateNews && autoNews.length) { selectedSeed = autoNews[rand(autoNews.length)]; localStorage.removeItem('reality-dungeon-seed'); }
  if (!selectedSeed && !manual && autoNews.length) {
    const day = Number(new Date().toISOString().slice(0, 10).replaceAll('-', ''));
    selectedSeed = autoNews[day % autoNews.length];
  }
  const seed = selectedSeed || manual || null;
  game = {
    floor: 1, turn: 0, ended: false, map: [], rooms: [], seen: new Set(), enemies: [], items: [], stairs: null,
    player: { x: 0, y: 0, hp: 24, maxHp: 24, belly: 100, attack: 4 },
    team: [], known: new Set(), kills: 0, observeCd: 0, flareCd: 0, seed,
    logs: []
  };
  generateFloor();
  addLog('調査開始', '今日の迷宮へ入りました');
  setMessage('光っている階段を探してください。', '◆');
  updateUI();
}

function generateFloor() {
  game.map = Array.from({ length: H }, () => Array(W).fill(0));
  game.rooms = [];
  game.seen = new Set();
  const attempts = 80;
  for (let i = 0; i < attempts && game.rooms.length < 6; i++) {
    const w = 3 + rand(4), h = 3 + rand(3), x = 1 + rand(W - w - 2), y = 1 + rand(H - h - 2);
    const room = { x, y, w, h, cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2) };
    if (game.rooms.some(r => x < r.x + r.w + 1 && x + w + 1 > r.x && y < r.y + r.h + 1 && y + h + 1 > r.y)) continue;
    game.rooms.push(room);
    carveRoom(room);
  }
  if (game.rooms.length < 3) return generateFloor();
  for (let i = 1; i < game.rooms.length; i++) connect(game.rooms[i - 1], game.rooms[i]);
  const first = game.rooms[0], last = game.rooms[game.rooms.length - 1];
  game.player.x = first.cx; game.player.y = first.cy;
  game.stairs = { x: last.cx, y: last.cy };
  game.enemies = []; game.items = [];
  game.team.forEach((a, i) => { a.x = first.cx + (i % 2 ? -1 : 1); a.y = first.cy + (i > 1 ? 1 : 0); });
  const enemyCount = 4 + game.floor * 2;
  for (let i = 0; i < enemyCount; i++) {
    const pos = randomOpen(1);
    const possible = ['heat', 'noise', 'jam', 'bloom'];
    let type = possible[rand(possible.length)];
    if (game.seed && i === 0) type = 'echo';
    else if (game.seed && Math.random() < .38) type = categoryThemes[game.seed.category].type;
    const base = enemyTypes[type];
    const bonus = game.floor - 1;
    game.enemies.push({ ...pos, type, hp: base.hp + bonus * 2, maxHp: base.hp + bonus * 2, atk: base.atk + Math.floor(bonus / 2), observed: false, id: crypto.randomUUID?.() || `${Date.now()}-${i}` });
  }
  for (let i = 0; i < 3 + game.floor; i++) game.items.push({ ...randomOpen(0), type: i % 3 === 0 ? 'food' : 'memo' });
  reveal();
  const theme = themeNow();
  els.weather.textContent = game.seed ? theme.label : '迷宮は入るたびに姿を変えます';
  els.floor.textContent = `${game.floor}F`;
  els.place.textContent = game.seed ? `${game.seed.place}の迷宮` : '今日の迷宮';
  showFloorFlash(`${game.floor}F`);
}

function carveRoom(r) { for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) game.map[y][x] = 1; }
function connect(a, b) {
  let x = a.cx, y = a.cy;
  if (Math.random() < .5) {
    while (x !== b.cx) { game.map[y][x] = 1; x += Math.sign(b.cx - x); }
    while (y !== b.cy) { game.map[y][x] = 1; y += Math.sign(b.cy - y); }
  } else {
    while (y !== b.cy) { game.map[y][x] = 1; y += Math.sign(b.cy - y); }
    while (x !== b.cx) { game.map[y][x] = 1; x += Math.sign(b.cx - x); }
  }
  game.map[b.cy][b.cx] = 1;
}

function randomOpen(skipRooms = 0) {
  const rooms = game.rooms.slice(skipRooms);
  for (let tries = 0; tries < 100; tries++) {
    const r = rooms[rand(rooms.length)], p = { x: r.x + rand(r.w), y: r.y + rand(r.h) };
    if (!occupied(p.x, p.y) && key(p.x, p.y) !== key(game.stairs.x, game.stairs.y) && dist(p, game.player) > 3) return p;
  }
  return { x: game.rooms[1].cx, y: game.rooms[1].cy };
}

function occupied(x, y, ignore) {
  if (game.player.x === x && game.player.y === y && ignore !== game.player) return true;
  if (game.enemies.some(e => e !== ignore && e.x === x && e.y === y)) return true;
  return game.team.some(a => a !== ignore && a.x === x && a.y === y);
}

function isFloor(x, y) { return x >= 0 && y >= 0 && x < W && y < H && game.map[y][x] === 1; }

function movePlayer(dx, dy) {
  if (game.ended || isModalOpen()) return;
  const nx = game.player.x + dx, ny = game.player.y + dy;
  if (!isFloor(nx, ny)) { setMessage('そこは壁です。別の道を探しましょう。', '■'); return; }
  const enemy = game.enemies.find(e => e.x === nx && e.y === ny);
  if (enemy) {
    hitEnemy(enemy, game.player.attack, '通常攻撃');
  } else {
    const old = { x: game.player.x, y: game.player.y };
    const ally = game.team.find(a => a.x === nx && a.y === ny);
    if (ally) { ally.x = old.x; ally.y = old.y; }
    else if (occupied(nx, ny)) return;
    game.player.x = nx; game.player.y = ny;
    if (!ally) followPlayer(old);
    collectItem();
    if (nx === game.stairs.x && ny === game.stairs.y) { descend(); return; }
  }
  finishPlayerTurn();
}

function followPlayer(old) {
  let target = old;
  game.team.forEach(a => {
    const prev = { x: a.x, y: a.y };
    if (isFloor(target.x, target.y) && !occupied(target.x, target.y, a)) { a.x = target.x; a.y = target.y; }
    target = prev;
  });
}

function waitTurn() { if (!game.ended && !isModalOpen()) { setMessage('周囲の様子をうかがった。', '…'); finishPlayerTurn(); } }

function observe() {
  if (game.ended || isModalOpen() || game.observeCd > 0) return;
  const targets = game.enemies.filter(e => dist(e, game.player) <= 5).sort((a, b) => dist(a, game.player) - dist(b, game.player));
  if (!targets.length) { setMessage('観測できる敵が近くにいません。', '？'); return; }
  const e = targets[0]; e.observed = true; game.observeCd = 5;
  const t = enemyTypes[e.type];
  setMessage(`${t.name}を観測。倒せば仲間になります。`, '◎');
  showNote(e);
  hitEnemy(e, 2, '観測');
  finishPlayerTurn();
}

function flare() {
  if (game.ended || isModalOpen() || game.flareCd > 0) return;
  const targets = game.enemies.filter(e => dist(e, game.player) <= 2);
  if (!targets.length) { setMessage('信号弾が届く範囲に敵がいません。', '！'); return; }
  game.flareCd = 7;
  targets.slice().forEach(e => hitEnemy(e, 5, '信号弾'));
  setMessage(`信号弾！ 周囲の${targets.length}体を照らした。`, '✦');
  finishPlayerTurn();
}

function hitEnemy(enemy, amount, source) {
  enemy.hp -= amount;
  floatNumber(enemy.x, enemy.y, amount);
  const t = enemyTypes[enemy.type];
  showNote(enemy);
  addLog(source, `${t.name}に${amount}ダメージ`);
  if (enemy.hp <= 0) defeatEnemy(enemy);
  else setMessage(`${t.name}に ${amount} ダメージ。`, '⚡');
}

function defeatEnemy(enemy) {
  const idx = game.enemies.indexOf(enemy), t = enemyTypes[enemy.type];
  if (idx >= 0) game.enemies.splice(idx, 1);
  game.kills++; game.known.add(enemy.type);
  if (enemy.observed && game.team.length < 3) {
    game.team.push({ type: enemy.type, name: t.name, hp: 10, maxHp: 10, x: enemy.x, y: enemy.y });
    setMessage(`${t.name}を理解した。調査隊に加わった！`, '＋');
    addLog('仲間', `${t.name}が調査隊に加わった`);
  } else {
    setMessage(`${t.name}を静めた。`, '✓');
  }
  if (game.kills % 3 === 0) {
    game.player.maxHp += 2; game.player.hp = Math.min(game.player.maxHp, game.player.hp + 5); game.player.attack++;
    addLog('成長', '観測レベルが上がり、攻撃とHPが増えた');
  }
}

function collectItem() {
  const i = game.items.findIndex(v => v.x === game.player.x && v.y === game.player.y);
  if (i < 0) return;
  const item = game.items.splice(i, 1)[0];
  if (item.type === 'food') {
    game.player.belly = Math.min(100, game.player.belly + 30);
    setMessage('携帯食を見つけた。おなかが30回復。', '●'); addLog('発見', '携帯食でおなかを回復');
  } else {
    const before = game.player.hp; game.player.hp = Math.min(game.player.maxHp, game.player.hp + 6);
    floatNumber(game.player.x, game.player.y, game.player.hp - before, true);
    setMessage('救護メモを発見。HPが回復した。', '＋'); addLog('発見', '救護メモでHPを回復');
  }
}

function finishPlayerTurn() {
  game.turn++;
  game.player.belly = Math.max(0, game.player.belly - 1);
  if (game.player.belly === 0) damagePlayer(1, '空腹');
  allyTurn();
  enemyTurn();
  game.observeCd = Math.max(0, game.observeCd - 1); game.flareCd = Math.max(0, game.flareCd - 1);
  reveal(); updateUI();
}

function allyTurn() {
  game.team.forEach(a => {
    const adjacent = game.enemies.find(e => dist(e, a) === 1);
    if (adjacent) { hitEnemy(adjacent, 2, a.name); return; }
    const nearby = game.enemies.slice().sort((x, y) => dist(x, a) - dist(y, a))[0];
    const target = nearby && dist(nearby, a) <= 4 ? nearby : game.player;
    stepToward(a, target);
  });
}

function enemyTurn() {
  game.enemies.slice().forEach(e => {
    if (!game.enemies.includes(e) || game.ended) return;
    const ally = game.team.find(a => dist(a, e) === 1);
    if (dist(e, game.player) === 1) { damagePlayer(e.atk, enemyTypes[e.type].name); return; }
    if (ally) { damageAlly(ally, e.atk, e); return; }
    if (e.type === 'jam' && game.turn % 2 === 1) return;
    if (dist(e, game.player) <= 7) stepToward(e, game.player);
    else if (Math.random() < .45) {
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]], d = dirs[rand(4)], nx = e.x+d[0], ny=e.y+d[1];
      if (isFloor(nx,ny) && !occupied(nx,ny,e)) { e.x=nx;e.y=ny; }
    }
  });
}

function stepToward(actor, target) {
  const options = [
    { x: actor.x + Math.sign(target.x - actor.x), y: actor.y },
    { x: actor.x, y: actor.y + Math.sign(target.y - actor.y) }
  ].sort((a,b)=>dist(a,target)-dist(b,target));
  const p = options.find(v => isFloor(v.x,v.y) && !occupied(v.x,v.y,actor));
  if (p) { actor.x=p.x; actor.y=p.y; }
}

function damagePlayer(amount, source) {
  game.player.hp = Math.max(0, game.player.hp - amount); floatNumber(game.player.x, game.player.y, amount);
  addLog('被害', `${source}から${amount}ダメージ`);
  if (game.player.hp <= 0) endGame(false);
}

function damageAlly(ally, amount, enemy) {
  ally.hp -= amount; floatNumber(ally.x, ally.y, amount);
  if (ally.hp <= 0) {
    game.team.splice(game.team.indexOf(ally), 1);
    addLog('離脱', `${ally.name}は調査隊から離れた`);
    setMessage(`${ally.name}は安全な場所へ退避した。`, '！');
  } else addLog('被害', `${ally.name}が${enemyTypes[enemy.type].name}から${amount}ダメージ`);
}

function descend() {
  if (game.floor >= 3) { endGame(true); return; }
  game.floor++;
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + 6);
  game.team.forEach(a => a.hp = Math.min(a.maxHp, a.hp + 4));
  addLog('進行', `${game.floor}Fへ到達。HPを少し回復`);
  setMessage(`${game.floor}Fへ。敵が少し強くなります。`, '▼');
  generateFloor(); updateUI();
}

function endGame(win) {
  game.ended = true;
  $('#resultEyebrow').textContent = win ? 'RESCUE COMPLETE' : 'EXPEDITION FAILED';
  $('#resultMark').textContent = win ? '✓' : '×';
  $('#resultTitle').textContent = win ? '現実の断片を持ち帰りました' : 'いったん拠点へ戻ります';
  $('#resultCopy').textContent = win ? '現象を倒すだけでなく、観測して仲間にしたことが今回の調査記録になります。' : '迷宮は次回も形を変えます。敵を避け、携帯食と救護メモを使ってください。';
  $('#resultStats').innerHTML = `<div><b>${game.turn}</b><span>ターン</span></div><div><b>${game.kills}</b><span>観測した現象</span></div><div><b>${game.team.length}</b><span>仲間</span></div>`;
  setTimeout(() => openModal('resultModal'), 350);
}

function reveal() {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (Math.hypot(x-game.player.x,y-game.player.y) <= 4.2) game.seen.add(key(x,y));
  const room = game.rooms.find(r => game.player.x>=r.x && game.player.x<r.x+r.w && game.player.y>=r.y && game.player.y<r.y+r.h);
  if (room) for (let y=room.y-1;y<=room.y+room.h;y++) for(let x=room.x-1;x<=room.x+room.w;x++) game.seen.add(key(x,y));
}

function visible(p) { return Math.hypot(p.x-game.player.x,p.y-game.player.y) <= 4.5; }
function themeNow() { return categoryThemes[game.seed?.category] || categoryThemes.community; }

function draw() {
  if (!game) return requestAnimationFrame(draw);
  const theme = themeNow(), now = performance.now();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let y=0;y<H;y++) for(let x=0;x<W;x++) {
    const seen = game.seen.has(key(x,y)), floor = game.map[y][x] === 1;
    ctx.fillStyle = floor ? ((x+y)%2 ? theme.floor : theme.floor2) : theme.wall;
    ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
    if (floor && seen) {
      ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(x*TILE+5,y*TILE+5,3,3);ctx.fillRect(x*TILE+33,y*TILE+28,2,2);
    }
    if (!seen) {ctx.fillStyle='rgba(4,18,14,.73)';ctx.fillRect(x*TILE,y*TILE,TILE,TILE);}
  }
  if (game.seen.has(key(game.stairs.x,game.stairs.y))) drawStairs(game.stairs, theme.accent, now);
  game.items.forEach(i => { if (game.seen.has(key(i.x,i.y))) drawItem(i); });
  game.enemies.forEach(e => { if (visible(e)) drawCreature(e, false, now); });
  game.team.forEach(a => drawCreature(a, true, now));
  drawPlayer(now);
  requestAnimationFrame(draw);
}

function drawStairs(p, color, now) {
  const x=p.x*TILE,y=p.y*TILE,pulse=(Math.sin(now/260)+1)/2;
  ctx.fillStyle=`rgba(255,220,100,${.12+pulse*.13})`;ctx.beginPath();ctx.arc(x+24,y+24,19+pulse*3,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=4;ctx.lineCap='round';
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+13+i*5,y+33-i*6);ctx.lineTo(x+34,y+33-i*6);ctx.stroke();}
  ctx.fillStyle='#fff3b0';ctx.font='700 9px "DM Mono"';ctx.textAlign='center';ctx.fillText('EXIT',x+24,y+12);
}

function drawItem(i) {
  const x=i.x*TILE+24,y=i.y*TILE+25;
  ctx.save();ctx.shadowColor='rgba(255,220,100,.7)';ctx.shadowBlur=10;ctx.fillStyle=i.type==='food'?'#f3c957':'#9ce0c0';ctx.beginPath();ctx.roundRect(x-10,y-9,20,18,6);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#21473b';ctx.font='800 10px sans-serif';ctx.textAlign='center';ctx.fillText(i.type==='food'?'食':'＋',x,y+4);ctx.restore();
}

function drawCreature(c, ally, now) {
  const t=enemyTypes[c.type],x=c.x*TILE+24,y=c.y*TILE+27,bob=Math.sin(now/260+c.x)*1.6;
  ctx.save();ctx.translate(x,y+bob);ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=5;ctx.shadowOffsetY=4;
  ctx.fillStyle=ally?'#54bd83':t.color;ctx.beginPath();ctx.roundRect(-15,-15,30,28,10);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#fff';ctx.font='900 13px "Noto Sans JP"';ctx.textAlign='center';ctx.fillText(t.glyph,0,4);
  if (!ally && c.observed) {ctx.strokeStyle='#ffe77a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ffe77a';ctx.font='900 10px sans-serif';ctx.fillText('◎',13,-13);}
  ctx.restore();
  const ratio=Math.max(0,c.hp/c.maxHp);ctx.fillStyle='rgba(10,24,20,.7)';ctx.fillRect(x-14,y+18,28,3);ctx.fillStyle=ally?'#8df0ae':'#ff9a75';ctx.fillRect(x-14,y+18,28*ratio,3);
}

function drawPlayer(now) {
  const x=game.player.x*TILE+24,y=game.player.y*TILE+25,bob=Math.sin(now/230)*1.4;
  ctx.save();ctx.translate(x,y+bob);ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=7;ctx.shadowOffsetY=4;ctx.fillStyle='#f5f0d9';ctx.beginPath();ctx.roundRect(-16,-17,32,31,11);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#1d7058';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#1d7058';ctx.beginPath();ctx.arc(-6,-2,2.4,0,Math.PI*2);ctx.arc(6,-2,2.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(0,10);ctx.lineTo(5,7);ctx.stroke();ctx.fillStyle='#f1c957';ctx.beginPath();ctx.moveTo(-13,-15);ctx.lineTo(0,-24);ctx.lineTo(13,-15);ctx.fill();ctx.restore();
}

function floatNumber(x,y,n,heal=false) {
  if (!n) return;
  const div=document.createElement('div');div.className=`float-number${heal?' heal':''}`;div.textContent=`${heal?'+':'−'}${n}`;div.style.left=`${(x+.5)/W*100}%`;div.style.top=`${(y+.45)/H*100}%`;els.damage.appendChild(div);setTimeout(()=>div.remove(),750);
}

function showNote(enemy) {
  const t=enemyTypes[enemy.type];game.known.add(enemy.type);
  const source = enemy.type==='echo' && game.seed ? `<a href="${esc(game.seed.source)}" target="_blank" rel="noopener">${game.seed.automatic?'ニュース':'入力した情報'}の出典を開く ↗</a>` : '';
  const fact = enemy.type==='echo' && game.seed ? esc(game.seed.fact) : t.note;
  els.note.innerHTML=`<div class="note-icon" style="background:${t.color}">${t.glyph}</div><div><b>${t.name}</b><p>${fact}</p>${source}</div>`;
}

function updateUI() {
  const p=game.player;els.hpText.textContent=`${p.hp} / ${p.maxHp}`;els.hpBar.style.width=`${p.hp/p.maxHp*100}%`;els.bellyText.textContent=`${p.belly} / 100`;els.bellyBar.style.width=`${p.belly}%`;els.turn.textContent=game.turn;els.floor.textContent=`${game.floor}F`;els.species.textContent=`${game.known.size}種`;
  els.observe.disabled=game.observeCd>0;els.flare.disabled=game.flareCd>0;els.observeCd.textContent=game.observeCd?`あと${game.observeCd}ターン`:'使用可';els.flareCd.textContent=game.flareCd?`あと${game.flareCd}ターン`:'使用可';
  els.teamCount.textContent=`${game.team.length+1} / 4`;
  els.team.innerHTML=`<div class="team-member"><div class="creature-icon" style="background:#1b6b54">観</div><div><b>フィールド観測員</b><small>リーダー</small><div class="mini-hp"><i style="width:${p.hp/p.maxHp*100}%"></i></div></div></div>`+game.team.map(a=>{const t=enemyTypes[a.type];return `<div class="team-member"><div class="creature-icon" style="background:${t.color}">${t.glyph}</div><div><b>${t.name}</b><small>理解した現象</small><div class="mini-hp"><i style="width:${a.hp/a.maxHp*100}%"></i></div></div></div>`}).join('');
}

function addLog(kind,text){game.logs.unshift({turn:game.turn,kind,text});game.logs=game.logs.slice(0,20);els.log.innerHTML=game.logs.map(l=>`<div class="log-item"><b>T${String(l.turn).padStart(2,'0')} · ${esc(l.kind)}</b>${esc(l.text)}</div>`).join('');}
function setMessage(text,icon='◆'){els.message.textContent=text;els.messageIcon.textContent=icon;}
function showFloorFlash(text){els.flash.textContent=text;els.flash.classList.add('show');setTimeout(()=>els.flash.classList.remove('show'),550);}
function openModal(id){const m=document.getElementById(id);m.classList.add('open');m.setAttribute('aria-hidden','false');}
function closeModal(id){const m=document.getElementById(id);m.classList.remove('open');m.setAttribute('aria-hidden','true');}

document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>{const [x,y]=b.dataset.move.split(',').map(Number);movePlayer(x,y);}));
document.querySelector('[data-wait]').addEventListener('click',waitTurn);
els.observe.addEventListener('click',observe);els.flare.addEventListener('click',flare);
$('#helpButton').addEventListener('click',()=>openModal('helpModal'));$('#newsButton').addEventListener('click',()=>openModal('newsModal'));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
$('#restartButton').addEventListener('click',()=>startGame(true));$('#resultRestart').addEventListener('click',()=>{closeModal('resultModal');startGame(true);});
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m && m.id!=='resultModal')closeModal(m.id);}));

$('#newsForm').addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(e.currentTarget);const seed={title:d.get('title').trim(),place:d.get('place').trim(),category:d.get('category'),fact:d.get('fact').trim(),source:d.get('source').trim()};
  try { const u=new URL(seed.source); if(!['http:','https:'].includes(u.protocol)) throw new Error(); } catch { e.currentTarget.querySelector('[name="source"]').setCustomValidity('http または https のURLを入力してください');e.currentTarget.reportValidity();return; }
  selectedSeed=seed;localStorage.setItem('reality-dungeon-seed',JSON.stringify(seed));closeModal('newsModal');startGame();setMessage(`「${seed.title}」から迷宮が生まれました。`,'◎');addLog('現実接続',seed.title);
});
$('#newsForm [name="source"]').addEventListener('input', e => e.target.setCustomValidity(''));

window.addEventListener('keydown',e=>{
  if(isModalOpen())return;const k=e.key.toLowerCase(),moves={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
  if(moves[k]){e.preventDefault();movePlayer(...moves[k]);}else if(k==='q')observe();else if(k==='e')flare();else if(k===' '){e.preventDefault();waitTurn();}
});

async function bootstrap(){await loadAutomaticNews();startGame();draw();if(!localStorage.getItem('reality-dungeon-tutorial')){openModal('helpModal');localStorage.setItem('reality-dungeon-tutorial','seen');}}
bootstrap();
