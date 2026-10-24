const cards=[
  {id:'printing',title:'活版印刷',year:'c. 1450',symbol:'印',type:'技術',tags:['複製','知識'],cost:0,color:'#765d3c',text:'次に使う〈知識〉カードを2回発動する。',fact:'グーテンベルクがヨーロッパで発展させた金属活字と印刷機の体系は、書物の複製速度と流通規模を大きく変えた。',mechanism:'情報を安価に複製する働きを、次の知識効果の複製として表現。',source:'https://www.britannica.com/technology/printing-press',effect:'printing'},
  {id:'science',title:'科学的方法',year:'17世紀–',symbol:'理',type:'知識',tags:['観測','証拠'],cost:1,color:'#3f6874',text:'証拠を2得て、カードを1枚引く。',fact:'観察、仮説、実験、検証を組み合わせる科学的方法は、主張を再現可能な証拠へ結びつける枠組みとなった。',mechanism:'検証可能な知識を「証拠」として蓄え、産業カードの威力へ変える。',source:'https://www.britannica.com/science/scientific-method',effect:'science'},
  {id:'telegraph',title:'電信網',year:'1844–',symbol:'電',type:'通信',tags:['通信','速度'],cost:1,color:'#376b78',text:'カードを2枚引き、勢いを1得る。',fact:'1844年、モールスはワシントン—ボルチモア間の電信線でメッセージを送り、情報伝達を輸送速度から切り離した。',mechanism:'情報の高速化を手札補充と行動の勢いに変換。',source:'https://www.loc.gov/collections/samuel-morse-papers/articles-and-essays/invention-of-the-telegraph/',effect:'telegraph'},
  {id:'steam',title:'蒸気機関',year:'1760s–',symbol:'蒸',type:'産業',tags:['動力','攻撃'],cost:2,color:'#65564b',text:'7ダメージ。証拠と勢いをすべて消費して威力を上げる。',fact:'ワットらによる蒸気機関の改良は燃料効率と用途を広げ、工場、鉱山、交通の機械化を加速させた。',mechanism:'蓄積した知識とネットワークを、まとまった動力へ変換するフィニッシャー。',source:'https://www.britannica.com/technology/steam-engine',effect:'steam'},
  {id:'assembly',title:'組立ライン',year:'1913–',symbol:'組',type:'産業',tags:['標準化','連続'],cost:2,color:'#665453',text:'4ダメージを2回。勢い2以上なら3回攻撃。',fact:'移動式組立ラインは作業工程を細分化・同期し、大量生産の速度と規模を大きく変えた。',mechanism:'同じ工程の反復を複数回攻撃として表現。',source:'https://www.britannica.com/technology/assembly-line',effect:'assembly'},
  {id:'rule-law',title:'法の支配',year:'長期的形成',symbol:'法',type:'制度',tags:['防御','権利'],cost:1,color:'#58654f',text:'防御を7得る。恒久制度があればさらに3。',fact:'法の支配は、権力の行使も公に定められた法と手続きに拘束されるという統治原理である。',mechanism:'予測可能な手続きが恣意的な攻撃を受け止める防御になる。',source:'https://www.un.org/ruleoflaw/what-is-the-rule-of-law/',effect:'ruleLaw'},
  {id:'vaccination',title:'予防接種計画',year:'1796–',symbol:'防',type:'公衆衛生',tags:['防御','回復'],cost:1,color:'#52705f',text:'防御を5得て、耐久力を3回復する。',fact:'ワクチン接種は個人の発症や重症化を防ぐだけでなく、集団的な感染症対策の重要な柱になった。',mechanism:'被害を未然に防ぐ働きを、防御と小回復で表現。',source:'https://www.who.int/health-topics/vaccines-and-immunization',effect:'vaccination'},
  {id:'bookkeeping',title:'複式簿記',year:'15世紀–',symbol:'簿',type:'知識',tags:['資源','計算'],cost:1,color:'#6c5d3f',text:'行動力を2得て、カードを1枚引く。この戦闘では再使用しない。',fact:'複式簿記は取引を対応する借方・貸方として記録し、資産と負債の把握を体系化した。',mechanism:'資源の見通しを良くすることで、使える行動力を増やす。',source:'https://www.britannica.com/topic/double-entry-bookkeeping',effect:'bookkeeping',exhaust:true},
  {id:'library',title:'公共図書館',year:'1850–',symbol:'書',type:'恒久制度',tags:['知識','公開'],cost:2,color:'#4d6670',text:'常設。各ターン最初の〈知識〉カードで追加ドロー。',fact:'19世紀以降の公共図書館制度は、書籍と情報へのアクセスを私的所有から公共サービスへ広げた。',mechanism:'知識カードから継続的に追加選択肢を得る恒久制度。',source:'https://www.parliament.uk/about/living-heritage/transformingsociety/private-lives/yourcountry/overview/librariesact/',effect:'library',institution:true},
  {id:'standards',title:'国際標準',year:'1947–',symbol:'標',type:'恒久制度',tags:['標準化','通信'],cost:2,color:'#4e646c',text:'常設。〈通信〉カードのコストが1下がる。',fact:'共通の技術標準は、異なる組織や地域の製品・通信・手続きを相互運用しやすくする。',mechanism:'共通規格による接続費用の低下を通信カードのコスト軽減にする。',source:'https://www.iso.org/about-us.html',effect:'standards',institution:true},
  {id:'container',title:'コンテナ輸送',year:'1956–',symbol:'箱',type:'通信',tags:['物流','勢い'],cost:2,color:'#4c6671',text:'6ダメージを与え、勢いを2得る。',fact:'標準化された海上コンテナは積み替えを効率化し、港湾・鉄道・道路を結ぶ物流網を変えた。',mechanism:'標準化された流れを即時攻撃と次の産業カード用の勢いに変える。',source:'https://www.britannica.com/technology/containerization',effect:'container'},
  {id:'internet',title:'TCP/IP',year:'1983',symbol:'網',type:'通信',tags:['接続','知識'],cost:2,color:'#3c6d7d',text:'カードを3枚引き、証拠を1得る。',fact:'ARPANETのTCP/IP移行は、異なるネットワークを共通規約で接続するインターネット形成の重要な節目となった。',mechanism:'ネットワーク効果を大きな手札補充として表現。',source:'https://www.internetsociety.org/internet/history-internet/brief-history-internet/',effect:'internet'},
  {id:'open-data',title:'オープンデータ',year:'21世紀',symbol:'開',type:'知識',tags:['公開','証拠'],cost:1,color:'#446c72',text:'防御を4得て、証拠を1得る。',fact:'オープンデータの取り組みは、政府や組織が保有するデータを再利用可能な形式で公開し、検証と新しい利用を促す。',mechanism:'透明性が攻撃への耐性と、次の技術に使える証拠を同時に生む。',source:'https://opendatacharter.net/principles/',effect:'openData'}
];

const intents=[
  {title:'記録への攻撃',glyph:'7',text:'次のターン、7ダメージ',attack:7},
  {title:'文脈の切断',glyph:'4+',text:'4ダメージ＋ノイズを混入',attack:4,noise:1},
  {title:'自己正当化',glyph:'盾',text:'敵が防御を8得る',shield:8},
  {title:'大量削除',glyph:'10',text:'次のターン、10ダメージ',attack:10},
  {title:'偽りの接続',glyph:'5+',text:'5ダメージ＋ノイズ2枚',attack:5,noise:2},
  {title:'完全消去',glyph:'14',text:'次のターン、14ダメージ',attack:14}
];

const echoPresets={
  research:{type:'知識',symbol:'研',color:'#47727d',cost:0,text:'証拠を1得て、カードを1枚引く。戦闘中1回。',effect:'echoResearch',tags:['現実','研究'],exhaust:true},
  infrastructure:{type:'通信',symbol:'路',color:'#536c76',cost:1,text:'勢いを1、防御を3得る。',effect:'echoInfrastructure',tags:['現実','接続']},
  community:{type:'地域',symbol:'街',color:'#687155',cost:1,text:'防御を5得る。',effect:'echoCommunity',tags:['現実','地域']},
  policy:{type:'知識',symbol:'策',color:'#596956',cost:1,text:'防御を4、証拠を1得る。',effect:'echoPolicy',tags:['現実','制度']}
};

const $=id=>document.getElementById(id);let state;let comboTimer;
function escapeHTML(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function loadEchoes(){try{const list=JSON.parse(localStorage.getItem('paradox-echoes')||'[]');return Array.isArray(list)?list.filter(c=>c&&c.custom&&c.title&&c.source).slice(-6):[]}catch{return[]}}
function initialState(){const starterIds=['printing','science','telegraph','steam','rule-law'],starter=starterIds.map(id=>cards.find(c=>c.id===id));const rest=cards.filter(c=>!starterIds.includes(c.id));return{turn:1,hp:30,maxHp:30,block:0,energy:3,evidence:0,momentum:0,enemyHp:42,enemyMax:42,enemyBlock:0,intent:0,hand:[...starter],drawPile:shuffle([...rest,...loadEchoes()]),discard:[],institutions:[],repeatKnowledge:false,libraryUsed:false,log:[],ended:false,locked:false,cardsPlayed:0,damageDone:0}}
function startGame(){state=initialState();addLog('接続開始','1450年、1844年、1983年の記録をつなぎ、検閲者を不安定化させる。');render();showDetail(state.hand[0]);$('resultModal').classList.remove('visible');$('resultModal').setAttribute('aria-hidden','true')}

function effectiveCost(card){if(state.institutions.some(c=>c.id==='standards')&&card.type==='通信')return Math.max(0,card.cost-1);return card.cost}
function render(){renderStats();renderIntent();renderHand();renderInstitutions();renderLog();renderTimeline()}
function renderStats(){$('enemyHpText').textContent=`${Math.max(0,state.enemyHp)} / ${state.enemyMax}`;$('enemyHpBar').style.width=`${Math.max(0,state.enemyHp)/state.enemyMax*100}%`;$('playerHpText').textContent=`${Math.max(0,state.hp)} / ${state.maxHp}`;$('playerHpBar').style.width=`${Math.max(0,state.hp)/state.maxHp*100}%`;$('blockValue').textContent=state.block;$('evidenceValue').textContent=state.evidence;$('momentumValue').textContent=state.momentum;$('energyValue').textContent=state.energy;$('energyPips').innerHTML=Array.from({length:Math.max(3,state.energy)},(_,i)=>`<i class="${i<state.energy?'active':''}"></i>`).join('')}
function renderIntent(){const intent=intents[Math.min(state.intent,intents.length-1)];$('intentGlyph').textContent=intent.glyph;$('intentTitle').textContent=intent.title;$('intentText').textContent=intent.text}
function renderTimeline(){const anchors=document.querySelectorAll('.anchor');anchors[0].classList.toggle('restored',state.enemyHp<=42);anchors[1].classList.toggle('restored',state.enemyHp<=28);anchors[2].classList.toggle('restored',state.enemyHp<=14)}
function renderInstitutions(){const slots=[...state.institutions];while(slots.length<3)slots.push(null);$('institutionSlots').innerHTML=slots.map(card=>card?`<span class="institution-card">${escapeHTML(card.title)}</span>`:'<i>空き</i>').join('')}
function cardText(card){if(card.id==='steam'){const total=7+state.evidence*2+state.momentum;return`${total}ダメージ（証拠${state.evidence}・勢い${state.momentum}を消費）`}if(card.id==='assembly'&&state.momentum>=2)return'4ダメージを3回（勢い2を消費）';return card.text}
function renderHand(){$('hand').innerHTML=state.hand.map((card,index)=>{const cost=effectiveCost(card),disabled=cost>state.energy||(card.institution&&state.institutions.length>=3);return`<button class="game-card ${disabled?'disabled':''}" data-index="${index}" style="--accent:${card.color}"><div class="card-art"><span class="cost">${cost}</span><span class="card-symbol">${escapeHTML(card.symbol)}</span></div><div class="card-copy"><small>${escapeHTML(card.type)}</small><h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(cardText(card))}</p></div><div class="card-tags">${card.tags.map(t=>`<i>${escapeHTML(t)}</i>`).join('')}</div></button>`}).join('');$('hand').querySelectorAll('.game-card').forEach(button=>{const index=Number(button.dataset.index),card=state.hand[index];button.addEventListener('mouseenter',()=>showDetail(card));button.addEventListener('focus',()=>showDetail(card));button.addEventListener('click',()=>playCard(index))})}
function renderLog(){$('combatLog').innerHTML=state.log.map(entry=>`<p><time>${escapeHTML(entry.time)}</time>${escapeHTML(entry.text)}</p>`).join('')}
function showDetail(card){const custom=card.custom,noise=card.effect==='noise';$('cardDetail').innerHTML=`<div class="detail-year">${escapeHTML(noise?'異常':custom?card.year:card.year)}</div><div class="detail-symbol">${escapeHTML(card.symbol)}</div><span class="detail-type">${escapeHTML(card.type)} · ${custom?'REALITY ECHO':noise?'PARADOX':'HISTORICAL MECHANISM'}</span><h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(card.fact||card.text)}</p><div class="mechanism"><span>カード能力への変換</span><p>${escapeHTML(card.mechanism||card.text)}</p></div>${card.source?`<a href="${escapeHTML(card.source)}" target="_blank" rel="noreferrer">出典を確認 ↗</a>`:''}`}

function drawCards(count){for(let i=0;i<count;i++){if(!state.drawPile.length){state.drawPile=shuffle(state.discard);state.discard=[]}if(state.drawPile.length)state.hand.push(state.drawPile.pop())}}
function playCard(index){if(state.ended||state.locked)return;const card=state.hand[index];if(!card)return;const cost=effectiveCost(card);if(cost>state.energy){message('行動力が足りません');return}if(card.institution&&state.institutions.length>=3){message('恒久制度は3枚までです');return}state.energy-=cost;state.hand.splice(index,1);state.cardsPlayed++;showDetail(card);const repeat=state.repeatKnowledge&&card.type==='知識';if(repeat){state.repeatKnowledge=false;showCombo(`活版印刷 × ${card.title}`)}applyCard(card);if(repeat)applyCard(card,true);if(state.institutions.some(c=>c.id==='library')&&card.type==='知識'&&!state.libraryUsed){state.libraryUsed=true;drawCards(1);showCombo('公共図書館：追加ドロー')}if(card.institution)state.institutions.push(card);else if(!card.exhaust&&card.effect!=='noise')state.discard.push(card);render();if(state.enemyHp<=0)finish(true)}
function applyCard(card,repeated=false){switch(card.effect){
  case'printing':state.repeatKnowledge=true;showCombo('次の知識カードを複製');break;
  case'science':state.evidence+=2;drawCards(1);break;
  case'telegraph':drawCards(2);state.momentum++;break;
  case'steam':{const damage=7+state.evidence*2+state.momentum;dealDamage(damage);if(state.evidence||state.momentum)showCombo(`証拠と勢いを動力へ：${damage}`);state.evidence=0;state.momentum=0;break}
  case'assembly':{const hits=state.momentum>=2?3:2;for(let i=0;i<hits;i++)dealDamage(4);if(hits===3){state.momentum-=2;showCombo('連続生産：3回攻撃')}break}
  case'ruleLaw':state.block+=7+(state.institutions.length?3:0);break;
  case'vaccination':state.block+=5;state.hp=Math.min(state.maxHp,state.hp+3);break;
  case'bookkeeping':state.energy+=2;drawCards(1);showCombo('資源を再計算：行動力 +2');break;
  case'container':dealDamage(6);state.momentum+=2;break;
  case'internet':drawCards(3);state.evidence++;break;
  case'openData':state.block+=4;state.evidence++;break;
  case'echoResearch':state.evidence++;drawCards(1);break;
  case'echoInfrastructure':state.momentum++;state.block+=3;break;
  case'echoCommunity':state.block+=5;break;
  case'echoPolicy':state.block+=4;state.evidence++;break;
  case'noise':showCombo('ノイズを除去');break;
  case'library':case'standards':break;
}}
function dealDamage(amount){const blocked=Math.min(state.enemyBlock,amount),actual=amount-blocked;state.enemyBlock-=blocked;state.enemyHp-=actual;state.damageDone+=actual;floatNumber($('enemyCore'),`−${actual}`);const core=$('enemyCore');core.classList.remove('hit');void core.offsetWidth;core.classList.add('hit');addLog(`第${state.turn}ターン`,`${actual}ダメージ。検閲者の整合性を崩した。`)}
function endTurn(){if(state.ended||state.locked)return;state.locked=true;state.discard.push(...state.hand.filter(c=>c.effect!=='noise'));state.discard.push(...state.hand.filter(c=>c.effect==='noise'));state.hand=[];renderHand();setTimeout(enemyAction,420)}
function enemyAction(){state.enemyBlock=0;const intent=intents[Math.min(state.intent,intents.length-1)];if(intent.attack){const absorbed=Math.min(state.block,intent.attack),damage=intent.attack-absorbed;state.hp-=damage;floatNumber(document.querySelector('.portrait'),`−${damage}`);addLog(`敵・第${state.turn}ターン`,`${intent.title}。防御${absorbed}、被害${damage}。`)}if(intent.shield){state.enemyBlock=intent.shield;addLog(`敵・第${state.turn}ターン`,`検閲者が防御${intent.shield}を得た。`)}if(intent.noise){for(let i=0;i<intent.noise;i++)state.discard.push(makeNoise());addLog('異常混入',`デッキへノイズ${intent.noise}枚が入った。`)}state.block=0;if(state.hp<=0){render();finish(false);return}setTimeout(nextTurn,450)}
function nextTurn(){state.turn++;state.intent=Math.min(state.intent+1,intents.length-1);state.energy=3;state.libraryUsed=false;drawCards(5+(state.institutions.some(c=>c.id==='library')?1:0));state.locked=false;message(`第${state.turn}ターン。敵の次行動を確認してください。`);render()}
function makeNoise(){return{id:`noise-${Date.now()}-${Math.random()}`,title:'文脈ノイズ',year:'PARADOX',symbol:'?',type:'異常',tags:['除去'],cost:1,color:'#59444f',text:'行動力1を使って除去する。放置すると再び山札へ戻る。',fact:'検閲者が混入させた、史実ではない断片。',mechanism:'デッキの回転を悪化させる妨害カード。',effect:'noise',exhaust:true}}
function message(text){$('battleMessage').textContent=text}
function addLog(time,text){state.log.unshift({time,text});state.log=state.log.slice(0,12)}
function showCombo(text){clearTimeout(comboTimer);$('comboBanner').textContent=text;$('comboBanner').classList.add('visible');comboTimer=setTimeout(()=>$('comboBanner').classList.remove('visible'),1100)}
function floatNumber(target,text){const rect=target.getBoundingClientRect(),el=document.createElement('span');el.className='damage-number';el.textContent=text;el.style.left=`${rect.left+rect.width/2}px`;el.style.top=`${rect.top+rect.height/3}px`;document.body.append(el);setTimeout(()=>el.remove(),900)}
function finish(win){state.ended=true;$('resultSymbol').textContent=win?'✓':'×';$('resultTitle').textContent=win?'時間軸を修復しました':'アーカイブが消去されました';$('resultText').textContent=win?'個々の史実ではなく、複製・通信・検証・動力という仕組みをつないだ結果です。':'敵の次行動を見て、防御を確保してからコンボを組み直してください。';$('resultStats').innerHTML=`<span>${state.turn}ターン</span><span>${state.cardsPlayed}枚使用</span><span>${state.damageDone}ダメージ</span>`;openModal('resultModal')}

function openModal(id){$(id).classList.add('visible');$(id).setAttribute('aria-hidden','false')}function closeModal(id){$(id).classList.remove('visible');$(id).setAttribute('aria-hidden','true');if(id==='helpModal')localStorage.setItem('paradox-tutorial','seen')}
$('endTurnButton').addEventListener('click',endTurn);$('helpButton').addEventListener('click',()=>openModal('helpModal'));$('echoButton').addEventListener('click',()=>openModal('echoModal'));$('restartButton').addEventListener('click',startGame);document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>closeModal(button.dataset.close)));
const echoForm=$('echoForm');echoForm.elements.date.value=new Date().toISOString().slice(0,10);echoForm.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(echoForm);let url;try{url=new URL(String(data.get('source')));if(!['http:','https:'].includes(url.protocol))throw new Error()}catch{$('echoError').textContent='確認できる http または https のURLを入力してください。';return}const preset=echoPresets[data.get('category')],card={...preset,id:`echo-${Date.now()}`,custom:true,title:String(data.get('title')).trim(),year:String(data.get('date')),fact:String(data.get('fact')).trim(),source:url.href,mechanism:'現在の小さな事実を、今回の戦闘だけを助ける控えめな反響として扱う。'};if(!card.title||!card.fact){$('echoError').textContent='見出しと確認できた事実を入力してください。';return}const saved=[...loadEchoes(),card].slice(-6);localStorage.setItem('paradox-echoes',JSON.stringify(saved));state.discard.push(card);showDetail(card);addLog('現実の反響',`「${card.title}」を次の山札へ加えた。`);$('echoError').textContent='';closeModal('echoModal');echoForm.reset();echoForm.elements.date.value=new Date().toISOString().slice(0,10);showCombo('現実の反響をデッキへ追加');renderLog()});
startGame();if(!localStorage.getItem('paradox-tutorial'))setTimeout(()=>openModal('helpModal'),250);
