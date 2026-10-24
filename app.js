const cards = [
  {id:'silkroad',title:'シルクロード',year:'2世紀 BCE–',type:'交易・交流',symbol:'路',cost:1,color:'#7b583c',tags:['交易','文化'],effect:'影響力 +2。カードを1枚引く。',fact:'シルクロードは単一の道ではなく、東アジア・中央アジア・地中海世界を結んだ交易路網だった。物品だけでなく宗教・技術・疫病も移動した。',mechanic:'交流は選択肢と影響力を増やす一方、危機も運びうる。',source:'https://education.nationalgeographic.org/resource/silk-road/',influence:2,draw:1},
  {id:'magna',title:'マグナ・カルタ',year:'1215',type:'制度・法',symbol:'法',cost:2,color:'#594f69',tags:['制度','権利'],effect:'安定 +2。相手が〈権力〉なら影響力 +2。',fact:'1215年のマグナ・カルタは当初、イングランド王と反乱諸侯の和平文書だったが、後世には統治者も法に拘束されるという理念の象徴になった。',mechanic:'権力を法で制限する動きは、強権への対抗として力を得る。',source:'https://www.parliament.uk/magnacarta/',influence:1,stability:2,counter:'権力'},
  {id:'littleice',title:'小氷期',year:'c. 1300–1850',type:'気候・環境',symbol:'氷',cost:2,color:'#4d6870',tags:['環境','危機'],effect:'双方の安定 −1。環境への備えがない相手はさらに −1。',fact:'小氷期は特に北大西洋地域で寒冷傾向が見られた時期を指す。開始・終了時期や影響は地域により異なり、単純な全球同時現象ではない。',mechanic:'環境変化への備えの有無が、社会の被害を左右する。',source:'https://www.britannica.com/science/Little-Ice-Age',influence:1,bothStability:-1,punishMissing:['環境',-1]},
  {id:'plague',title:'黒死病',year:'1347–1351',type:'疫病・社会',symbol:'疫',cost:3,color:'#514d3f',tags:['危機','労働'],effect:'双方の安定 −2。知識が多い側は被害を1軽減。',fact:'14世紀の黒死病はヨーロッパ、北アフリカ、西アジアを含む広域で甚大な人口損失を引き起こし、労働・社会・宗教に長期的影響を与えた。',mechanic:'疫病は全員を傷つけるが、蓄積した知識が被害を和らげる。',source:'https://www.britannica.com/event/Black-Death',influence:1,bothStability:-2,crisis:true},
  {id:'printing',title:'活版印刷',year:'c. 1450',type:'技術・情報',symbol:'印',cost:2,color:'#725936',tags:['知識','思想'],effect:'知識 +2。次に使う〈思想〉の影響力 +2。',fact:'ヨハネス・グーテンベルクがヨーロッパで実用化した金属活字と印刷機の体系は、書物の複製速度と流通規模を大きく変えた。',mechanic:'情報を複製する技術が、その後の思想普及を加速させる。',source:'https://www.britannica.com/technology/printing-press',influence:2,knowledge:2,setup:'思想'},
  {id:'columbian',title:'コロンブス交換',year:'1492–',type:'生態・交流',symbol:'交',cost:3,color:'#5d714d',tags:['交易','生態'],effect:'影響力 +4、安定 −1。双方が1枚引く。',fact:'1492年以降、旧世界と新世界の間で作物、家畜、人間、病原体が大規模に移動した。利益と人口増加だけでなく、先住民社会への壊滅的な疫病も伴った。',mechanic:'巨大な交換は成長を生むが、その利益と被害は対称ではない。',source:'https://www.britannica.com/event/Columbian-exchange',influence:4,stability:-1,draw:1,enemyDraw:1},
  {id:'reformation',title:'宗教改革',year:'1517–',type:'思想・宗教',symbol:'改',cost:3,color:'#64484a',tags:['思想','権利'],effect:'知識 +1、影響力 +4、双方の安定 −1。',fact:'16世紀の宗教改革は西方キリスト教世界を分裂させ、宗教だけでなく教育・政治・国家形成にも大きな変化をもたらした。',mechanic:'広まった思想は大きな影響を生むが、既存秩序も揺さぶる。',source:'https://www.britannica.com/event/Reformation',influence:4,knowledge:1,stability:-1,enemyStability:-1},
  {id:'company',title:'オランダ東インド会社',year:'1602',type:'制度・交易',symbol:'商',cost:3,color:'#655233',tags:['交易','権力'],effect:'影響力 +3。〈交易〉連鎖ならさらに +2。',fact:'1602年設立のオランダ東インド会社（VOC）は、株式による資本調達を行い、交易だけでなく条約締結や軍事行動も担った。',mechanic:'企業制度と国家権力の結合を、強力だが危うい交易カードとして表す。',source:'https://www.britannica.com/topic/Dutch-East-India-Company',influence:3,tagBonus:['交易',2]},
  {id:'science',title:'科学革命',year:'16–17世紀',type:'知識・思想',symbol:'理',cost:3,color:'#405d68',tags:['知識','思想'],effect:'知識 +3。知識5以上なら影響力 +4。',fact:'16～17世紀のヨーロッパでは、観察・実験・数学を重視する自然研究が進展し、宇宙観や知識の方法が大きく変化した。',mechanic:'知識は蓄積してこそ、社会を動かす影響力になる。',source:'https://www.britannica.com/science/Scientific-Revolution',influence:1,knowledge:3,knowledgeThreshold:[5,3]},
  {id:'steam',title:'蒸気機関の改良',year:'1760s–',type:'技術・産業',symbol:'蒸',cost:4,color:'#514d49',tags:['技術','産業'],effect:'影響力 +5。次ターンの時代力 +1。',fact:'ジェームズ・ワットらによる蒸気機関の改良は燃料効率と用途を広げ、工場・鉱山・交通の機械化を加速させた。',mechanic:'動力の革新は一度の得点だけでなく、次の行動能力を増やす。',source:'https://www.britannica.com/technology/steam-engine',influence:5,nextEnergy:1},
  {id:'haiti',title:'ハイチ革命',year:'1791–1804',type:'革命・権利',symbol:'解',cost:4,color:'#75433c',tags:['権利','革命'],effect:'影響力 +6、安定 −2。相手の〈権力〉で強化。',fact:'ハイチ革命は奴隷化された人々が主導した革命で、1804年に独立国家ハイチが成立した。近代史上、奴隷反乱から国家独立へ至った画期的事例である。',mechanic:'抑圧的な権力が蓄積するほど、解放革命の歴史的影響が増す。',source:'https://www.britannica.com/topic/Haitian-Revolution',influence:6,stability:-2,enemyTagScale:['権力',1]},
  {id:'telegraph',title:'電信網',year:'1844–',type:'技術・情報',symbol:'電',cost:2,color:'#3c5d69',tags:['技術','知識'],effect:'知識 +1、影響力 +3。次の解決で先手。',fact:'1844年、ワシントン—ボルチモア間でモールスの電信が実演された。電信網は情報伝達を輸送速度から切り離した。',mechanic:'情報速度の優位を、次ターンの先手として表現する。',source:'https://www.loc.gov/collections/samuel-morse-papers/articles-and-essays/invention-of-the-telegraph/',influence:3,knowledge:1,initiative:true},
  {id:'meiji',title:'明治維新',year:'1868',type:'制度・近代化',symbol:'新',cost:4,color:'#694842',tags:['制度','技術'],effect:'知識 +2、安定 +1。タグ3種以上なら影響力 +6。',fact:'1868年前後の明治維新は、幕府体制から中央集権国家への政治変革と、その後の制度・軍事・教育・産業の急速な再編につながった。',mechanic:'複数分野を組み合わせた制度変革ほど、大きな影響を得る。',source:'https://www.britannica.com/event/Meiji-Restoration',influence:2,knowledge:2,stability:1,diversityThreshold:[3,4]},
  {id:'influenza',title:'1918年インフルエンザ',year:'1918–1920',type:'疫病・社会',symbol:'熱',cost:3,color:'#5e5544',tags:['危機','社会'],effect:'双方の安定 −2。知識3以上なら自分は1回復。',fact:'1918～1920年のインフルエンザ・パンデミックは世界規模で広がり、第一次世界大戦下の移動や情報環境とも重なって甚大な被害を出した。',mechanic:'疫病の衝撃と、公衆衛生知識による回復力を同時に表す。',source:'https://www.cdc.gov/flu-pandemic/about/1918-pandemic-h1n1.html',influence:2,bothStability:-2,knowledgeHeal:[3,1]},
  {id:'bretton',title:'ブレトンウッズ体制',year:'1944',type:'制度・経済',symbol:'協',cost:3,color:'#555d48',tags:['制度','交易'],effect:'安定 +2、影響力 +3。双方が安定なら +2。',fact:'1944年のブレトンウッズ会議は戦後の国際通貨秩序を構想し、IMFと世界銀行につながる制度を生んだ。',mechanic:'安定した参加者同士の協調は、制度の影響をより大きくする。',source:'https://www.britannica.com/event/Bretton-Woods-Conference',influence:3,stability:2,mutualStable:[6,2]},
  {id:'greenrev',title:'緑の革命',year:'1940s–1960s',type:'技術・農業',symbol:'穂',cost:3,color:'#557047',tags:['技術','環境'],effect:'安定 +3、影響力 +2。環境連鎖なら知識 +1。',fact:'高収量品種、灌漑、肥料などの導入は各地で穀物生産を増加させた一方、環境負荷や地域間格差などの問題も伴った。',mechanic:'食料供給による安定と、持続可能性という両面を持たせる。',source:'https://www.britannica.com/event/green-revolution',influence:2,stability:3,tagKnowledge:['環境',1]},
  {id:'oilshock',title:'第一次石油危機',year:'1973',type:'資源・経済',symbol:'油',cost:3,color:'#584a31',tags:['危機','交易'],effect:'相手の安定 −2。相手の〈産業〉で被害増加。',fact:'1973年の石油危機では、OAPECによる禁輸と価格上昇が石油輸入国の経済・エネルギー政策に大きな衝撃を与えた。',mechanic:'化石燃料依存が高いほど、資源ショックの被害が大きくなる。',source:'https://history.state.gov/milestones/1969-1976/oil-embargo',influence:2,enemyStability:-2,enemyTagDamage:['産業',1]},
  {id:'internet',title:'インターネット標準化',year:'1983',type:'技術・情報',symbol:'網',cost:4,color:'#3f6170',tags:['技術','知識'],effect:'知識 +3、2枚引く。知識7以上なら影響力 +5。',fact:'1983年、ARPANETがTCP/IPへ移行したことは、異なるネットワークを相互接続する現在のインターネット形成における重要な節目となった。',mechanic:'ネットワーク効果を、知識と選択肢が急増する終盤カードにする。',source:'https://www.internetsociety.org/internet/history-internet/brief-history-internet/',influence:1,knowledge:3,draw:2,knowledgeThreshold:[7,4]}
];

const newsPresets={
  society:{type:'現在・社会',symbol:'社',color:'#675367',tags:['制度','社会'],cost:1,effect:'安定 +1、影響力 +1。',influence:1,stability:1,mechanic:'地域や制度の小さな変化を、社会の安定と継続的な影響として扱う。'},
  science:{type:'現在・研究',symbol:'研',color:'#41616b',tags:['知識','科学'],cost:1,effect:'知識 +2。',influence:1,knowledge:2,mechanic:'新しい観測や研究成果を、将来の連鎖に使える知識として蓄積する。'},
  technology:{type:'現在・技術',symbol:'技',color:'#496572',tags:['技術','知識'],cost:2,effect:'知識 +1、影響力 +2。',influence:2,knowledge:1,mechanic:'実用化された小さな技術変化を、情報と影響の広がりとして表す。'},
  environment:{type:'現在・環境',symbol:'環',color:'#55704f',tags:['環境','社会'],cost:1,effect:'安定 +1。〈環境〉連鎖なら影響力 +2。',influence:1,stability:1,tagBonus:['環境',1],mechanic:'地域の観測や保全活動を、環境変化への備えとして積み重ねる。'},
  economy:{type:'現在・経済',symbol:'経',color:'#6e5b3b',tags:['交易','社会'],cost:2,effect:'影響力 +2。カードを1枚引く。',influence:2,draw:1,mechanic:'価格・店舗・交通などの変化を、人と物の流れを変える小さな交易として扱う。'},
  culture:{type:'現在・文化',symbol:'文',color:'#73514d',tags:['文化','社会'],cost:1,effect:'影響力 +2。',influence:2,mechanic:'催事や作品、地域活動を、価値観を共有する文化的影響として残す。'}
};
function loadNewsCards(){try{const stored=JSON.parse(localStorage.getItem('chronicle-news-cards')||'[]');if(Array.isArray(stored))stored.filter(c=>c&&c.isNews&&c.title&&c.source).slice(-20).forEach(c=>cards.push(c))}catch(error){console.warn('Saved news cards could not be loaded.',error)}}
loadNewsCards();

const worlds=[
  {name:'交易網の拡大',effect:'〈交易〉カードの影響力 +1',tag:'交易',bonus:1},
  {name:'知識への渇望',effect:'〈知識〉使用時、知識 +1',tag:'知識',knowledge:1},
  {name:'旧秩序の動揺',effect:'〈権利〉と〈革命〉の影響力 +1',tags:['権利','革命'],bonus:1},
  {name:'資源の逼迫',effect:'コスト4は影響力 +2、安定 −1',highCost:true},
  {name:'国際協調',effect:'〈制度〉使用時、安定 +1',tag:'制度',stability:1}
];
const ids=['playerHand','enemyHand','playerInfluence','enemyInfluence','playerStability','enemyStability','playerKnowledge','enemyKnowledge','turnNumber','actionValue','actionPips','playerPlayed','enemyPlayed','chronicleStrip','worldState','worldEffect','factView','battleLog','resultModal','resultTitle','resultText','resultSeal'];
const els=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
let state;

function escapeHTML(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}

function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function buildDeck(){return shuffle([...cards,...cards.map((c,i)=>({...c,uid:`${c.id}-${i}`}))])}
function drawCards(side,count){for(let i=0;i<count;i++){if(!state.deck.length)state.deck=buildDeck();side.hand.push(state.deck.pop())}}
function newGame(){
  state={turn:1,energy:3,player:{influence:0,stability:10,knowledge:0,tags:[],hand:[],nextEnergy:0,initiative:false},enemy:{influence:0,stability:10,knowledge:0,tags:[],hand:[],nextEnergy:0,initiative:false},deck:buildDeck(),world:worlds[0],history:[],locked:false};
  drawCards(state.player,5);drawCards(state.enemy,5);
  if(!state.player.hand.some(c=>c.cost<=3)){state.player.hand[0]=cards.find(c=>c.cost===1)}
  els.battleLog.innerHTML='<p><time>序章</time>二つの年代記が、同じ世界の未来を巡って競い始めた。</p>';
  resetPlayed();els.resultModal.classList.remove('visible');els.resultModal.setAttribute('aria-hidden','true');render();showFact(cards[4]);
}
function render(){
  ['player','enemy'].forEach(who=>{els[`${who}Influence`].textContent=state[who].influence;els[`${who}Stability`].textContent=Math.max(0,state[who].stability);els[`${who}Knowledge`].textContent=state[who].knowledge});
  els.turnNumber.textContent=state.turn;els.actionValue.textContent=state.energy;els.actionPips.innerHTML=Array.from({length:5},(_,i)=>`<i class="${i<state.energy?'active':''}"></i>`).join('');
  els.worldState.textContent=state.world.name;els.worldEffect.textContent=state.world.effect;
  document.querySelectorAll('.era-track span').forEach((e,i)=>e.classList.toggle('active',i===Math.min(3,Math.floor((state.turn-1)/3))));renderHand();renderEnemyHand();renderChronicle();
}
function cardHTML(card,index){const disabled=card.cost>state.energy;return `<button class="history-card ${disabled?'unaffordable':''}" style="--card-color:${card.color}" data-index="${index}" ${disabled?'aria-disabled="true"':''}><div class="card-art" data-symbol="${escapeHTML(card.symbol)}"><span class="card-cost">${card.cost}</span><span class="card-year">${escapeHTML(card.year)}</span></div><div class="card-body"><span class="card-type">${escapeHTML(card.type)}</span><strong class="card-title">${escapeHTML(card.title)}</strong><p class="card-effect">${escapeHTML(card.effect)}</p></div><div class="card-footer"><div class="tags">${card.tags.map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div><span class="fact-button">${card.isNews?'出典':'史実'} ↗</span></div></button>`}
function renderHand(){els.playerHand.innerHTML=state.player.hand.map(cardHTML).join('');els.playerHand.querySelectorAll('.history-card').forEach(button=>{const index=Number(button.dataset.index);button.addEventListener('mouseenter',()=>showFact(state.player.hand[index]));button.addEventListener('focus',()=>showFact(state.player.hand[index]));button.addEventListener('click',e=>{showFact(state.player.hand[index]);if(e.target.closest('.fact-button'))return;if(state.player.hand[index].cost<=state.energy)playTurn(index);else logEntry('選択不可',`「${state.player.hand[index].title}」には時代力が足りない。`)})})}
function renderEnemyHand(){els.enemyHand.innerHTML=state.enemy.hand.slice(0,5).map((_,i)=>`<div class="card-back" style="--i:${i}"></div>`).join('')}
function renderChronicle(){if(!state.history.length){els.chronicleStrip.innerHTML='<span class="chronicle-empty">歴史はまだ、何も刻んでいない。</span>';return}els.chronicleStrip.innerHTML=state.history.slice(-12).map((h,i)=>`${i?'<i class="chronicle-link"></i>':''}<span class="chronicle-node" style="--node-color:${h.color}" title="${h.title}">${h.symbol}</span>`).join('')}
function showFact(card){els.factView.innerHTML=`<div class="fact-year">${escapeHTML(card.year)}</div><div class="fact-symbol">${escapeHTML(card.symbol)}</div><span class="fact-type">${escapeHTML(card.type)}</span><h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(card.fact)}</p><div class="mechanic"><span>ゲームへの変換</span><p>${escapeHTML(card.mechanic)}</p></div><a href="${escapeHTML(card.source)}" target="_blank" rel="noreferrer">出典を確認 ↗</a>`}
function chooseEnemyCard(){const energy=Math.min(5,3+state.enemy.nextEnergy+Math.floor((state.turn-1)/4));const options=state.enemy.hand.map((card,index)=>({card,index})).filter(x=>x.card.cost<=energy);if(!options.length)return 0;options.forEach(o=>{o.score=o.card.influence+(o.card.stability&&state.enemy.stability<6?o.card.stability*.8:0)+(o.card.knowledge&&state.enemy.knowledge<5?o.card.knowledge*.5:0)+Math.random()*2});options.sort((a,b)=>b.score-a.score);return options[0].index}
function hasTag(side,tag){return side.tags.includes(tag)}function countTag(side,tag){return side.tags.filter(t=>t===tag).length}function diversity(side){return new Set(side.tags).size}
function resolveCard(card,self,other,opponentCard){
  let influence=card.influence||0;const notes=[];const prior=[...self.tags];
  if(card.tags.some(t=>prior.includes(t))){influence++;notes.push('連鎖 +1')}
  if((state.world.tag&&card.tags.includes(state.world.tag))||(state.world.tags&&card.tags.some(t=>state.world.tags.includes(t)))){influence+=state.world.bonus||0;self.knowledge+=state.world.knowledge||0;self.stability+=state.world.stability||0;notes.push('世界情勢')}
  if(state.world.highCost&&card.cost===4){influence+=2;self.stability--;notes.push('資源逼迫')}
  if(self.pendingTag&&card.tags.includes(self.pendingTag)){influence+=2;notes.push(`${self.pendingTag}への布石 +2`);self.pendingTag=null}
  self.knowledge+=card.knowledge||0;self.stability+=card.stability||0;other.stability+=card.enemyStability||0;
  if(card.bothStability){self.stability+=card.bothStability;other.stability+=card.bothStability}
  if(card.crisis&&self.knowledge>other.knowledge){self.stability++;notes.push('知識で軽減')}
  if(card.counter&&opponentCard.tags.includes(card.counter)){influence+=2;notes.push('対抗 +2')}
  if(card.tagBonus&&prior.includes(card.tagBonus[0])){influence+=card.tagBonus[1];notes.push(`${card.tagBonus[0]}連鎖 +${card.tagBonus[1]}`)}
  if(card.knowledgeThreshold&&self.knowledge>=card.knowledgeThreshold[0]){influence+=card.knowledgeThreshold[1];notes.push(`知識蓄積 +${card.knowledgeThreshold[1]}`)}
  if(card.punishMissing&&!hasTag(other,card.punishMissing[0])){other.stability+=card.punishMissing[1];notes.push('備えなし')}
  if(card.enemyTagScale){const n=countTag(other,card.enemyTagScale[0]);influence+=n*card.enemyTagScale[1];if(n)notes.push(`反動 +${n}`)}
  if(card.enemyTagDamage){const n=countTag(other,card.enemyTagDamage[0]);other.stability-=n*card.enemyTagDamage[1];if(n)notes.push(`依存被害 −${n}`)}
  if(card.diversityThreshold&&diversity(self)>=card.diversityThreshold[0]){influence+=card.diversityThreshold[1];notes.push(`多分野改革 +${card.diversityThreshold[1]}`)}
  if(card.mutualStable&&self.stability>=card.mutualStable[0]&&other.stability>=card.mutualStable[0]){influence+=card.mutualStable[1];notes.push(`協調 +${card.mutualStable[1]}`)}
  if(card.knowledgeHeal&&self.knowledge>=card.knowledgeHeal[0]){self.stability+=card.knowledgeHeal[1];notes.push('公衆衛生で回復')}
  if(card.tagKnowledge&&prior.includes(card.tagKnowledge[0]))self.knowledge+=card.tagKnowledge[1];
  if(card.setup)self.pendingTag=card.setup;if(card.nextEnergy)self.nextEnergy+=card.nextEnergy;if(card.initiative)self.initiative=true;
  self.influence+=influence;self.tags.push(...card.tags);if(card.draw)drawCards(self,card.draw);if(card.enemyDraw)drawCards(other,card.enemyDraw);return{influence,notes}
}
function playTurn(playerIndex){
  if(state.locked)return;state.locked=true;const playerCard=state.player.hand.splice(playerIndex,1)[0];const enemyIndex=chooseEnemyCard();const enemyCard=state.enemy.hand.splice(enemyIndex,1)[0];state.energy-=playerCard.cost;
  showPlayed(els.playerPlayed,playerCard);setTimeout(()=>showPlayed(els.enemyPlayed,enemyCard),280);
  const playerFirst=state.player.initiative||(!state.enemy.initiative&&Math.random()>.5);state.player.initiative=false;state.enemy.initiative=false;
  setTimeout(()=>{const first=playerFirst?[playerCard,state.player,state.enemy,enemyCard]:[enemyCard,state.enemy,state.player,playerCard];const second=playerFirst?[enemyCard,state.enemy,state.player,playerCard]:[playerCard,state.player,state.enemy,enemyCard];const firstResult=resolveCard(...first),secondResult=resolveCard(...second);const playerResult=playerFirst?firstResult:secondResult,enemyResult=playerFirst?secondResult:firstResult;state.history.push(playerCard,enemyCard);logEntry(`第${state.turn}ターン`,`あなたは「${playerCard.title}」で影響力 +${playerResult.influence}${playerResult.notes.length?`（${playerResult.notes.join('・')}）`:''}。相手は「${enemyCard.title}」で +${enemyResult.influence}。`);floatGain(els.playerInfluence,`+${playerResult.influence}`);floatGain(els.enemyInfluence,`+${enemyResult.influence}`);clampState();render();showFact(playerCard);const result=checkResult();if(result){setTimeout(()=>showResult(result),850);return}setTimeout(nextTurn,900)},650)
}
function showPlayed(element,card){element.className=`${element.id==='playerPlayed'?'played-card player-played':'played-card enemy-played'} resolved`;element.style.setProperty('--card-color',card.color);element.innerHTML=`<span class="played-symbol">${card.symbol}</span><div class="played-copy"><span>${card.year} · ${card.type}</span><strong>${card.title}</strong></div>`}
function resetPlayed(){els.playerPlayed.className='played-card player-played empty';els.playerPlayed.innerHTML='<span>あなたの選択</span>';els.enemyPlayed.className='played-card enemy-played empty';els.enemyPlayed.innerHTML='<span>相手の選択</span>'}
function nextTurn(){state.turn++;const base=Math.min(5,3+Math.floor((state.turn-1)/4));state.energy=Math.min(5,base+state.player.nextEnergy);state.player.nextEnergy=0;state.enemy.nextEnergy=0;drawCards(state.player,Math.max(0,5-state.player.hand.length));drawCards(state.enemy,Math.max(0,5-state.enemy.hand.length));if(!state.player.hand.some(c=>c.cost<=state.energy))state.energy=Math.min(5,Math.min(...state.player.hand.map(c=>c.cost)));if((state.turn-1)%3===0){state.world=worlds[Math.min(worlds.length-1,Math.floor((state.turn-1)/3))];logEntry('世界情勢',`「${state.world.name}」が始まった。${state.world.effect}。`)}resetPlayed();state.locked=false;render()}
function clampState(){['player','enemy'].forEach(s=>{state[s].stability=Math.min(15,state[s].stability);state[s].knowledge=Math.max(0,state[s].knowledge)})}
function checkResult(){if(state.player.influence>=20||state.enemy.stability<=0)return'win';if(state.enemy.influence>=20||state.player.stability<=0)return'lose';if(state.turn>=12)return state.player.influence>=state.enemy.influence?'win':'lose';return null}
function showResult(result){const win=result==='win';els.resultSeal.textContent=win?'勝':'敗';els.resultTitle.textContent=win?'あなたの歴史が残った':'歴史の主導権を失った';els.resultText.textContent=win?'出来事を連鎖させ、次の時代を切り開いた。':'別の連鎖を試せば、歴史の流れは変えられる。';els.resultModal.classList.add('visible');els.resultModal.setAttribute('aria-hidden','false')}
function logEntry(time,text){const p=document.createElement('p'),label=document.createElement('time');label.textContent=time;p.append(label,document.createTextNode(text));els.battleLog.prepend(p);while(els.battleLog.children.length>7)els.battleLog.lastElementChild.remove()}
function floatGain(target,text){const r=target.getBoundingClientRect(),span=document.createElement('span');span.className='floating-number';span.textContent=text;span.style.left=`${r.left}px`;span.style.top=`${r.top}px`;document.body.append(span);setTimeout(()=>span.remove(),1000)}
document.getElementById('helpButton').addEventListener('click',()=>{document.getElementById('helpModal').classList.add('visible');document.getElementById('helpModal').setAttribute('aria-hidden','false')});
document.getElementById('newsButton').addEventListener('click',()=>{const modal=document.getElementById('newsModal');modal.classList.add('visible');modal.setAttribute('aria-hidden','false')});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{const m=document.getElementById(b.dataset.close);m.classList.remove('visible');m.setAttribute('aria-hidden','true')}));
document.getElementById('restartButton').addEventListener('click',newGame);
const newsForm=document.getElementById('newsForm');newsForm.elements.date.value=new Date().toISOString().slice(0,10);
newsForm.addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(newsForm),preset=newsPresets[data.get('category')];let source;
  try{source=new URL(String(data.get('source')));if(!['http:','https:'].includes(source.protocol))throw new Error('protocol')}catch(error){document.getElementById('newsError').textContent='確認できる http または https の出典URLを入力してください。';return}
  const card={...preset,id:`news-${Date.now()}`,uid:`news-${Date.now()}`,title:String(data.get('title')).trim(),year:String(data.get('date')),fact:String(data.get('summary')).trim(),source:source.href,isNews:true};
  if(!card.title||!card.fact){document.getElementById('newsError').textContent='見出しと確認できた事実を入力してください。';return}
  cards.push(card);state.player.hand.unshift(card);const stored=cards.filter(c=>c.isNews).slice(-20);localStorage.setItem('chronicle-news-cards',JSON.stringify(stored));
  showFact(card);render();logEntry('現在の史料',`「${card.title}」を出典付きカードとして年代記に加えた。`);document.getElementById('newsError').textContent='';document.getElementById('newsModal').classList.remove('visible');document.getElementById('newsModal').setAttribute('aria-hidden','true');newsForm.reset();newsForm.elements.date.value=new Date().toISOString().slice(0,10);
});
newGame();
