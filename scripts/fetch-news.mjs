import { mkdir, readFile, writeFile } from 'node:fs/promises';

const feeds = [
  { category: 'community', query: '地域 イベント OR 開業 OR 取り組み when:2d' },
  { category: 'science', query: '研究 発見 OR 実験 OR 開発 when:2d' },
  { category: 'mobility', query: '鉄道 OR バス 新設 OR 開通 OR 運行 when:2d' },
  { category: 'climate', query: '環境 生き物 OR 観測 OR 季節 when:2d' }
].map(feed => ({
  ...feed,
  url: `https://news.google.com/rss/search?q=${encodeURIComponent(feed.query)}&hl=ja&gl=JP&ceid=JP:ja`
}));

const excluded = /死亡|死者|殺害|逮捕|容疑|事件|事故|災害|地震|津波|豪雨|洪水|火災|戦争|攻撃|侵攻|空爆|負傷|被害|訃報|感染|倒産|不祥事|虐待|遺体|行方不明|防衛|軍事|がん|余命/;
const excludedSource = /Vietnam\.vn|BigGo/i;

function decode(value = '') {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(x?[0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n.replace(/^x/i, ''), /^x/i.test(n) ? 16 : 10)))
    .replace(/&([a-z]+);/gi, (_, n) => entities[n] ?? `&${n};`)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(xml, name) {
  return decode(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '');
}

function isoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: { 'user-agent': 'RealityDungeonNewsBot/1.0 (+https://temesotejam.github.io/2026_10_24/)' },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`${response.status} ${feed.url}`);
  const xml = await response.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => {
    const body = match[1];
    const rawTitle = tag(body, 'title');
    const source = tag(body, 'source') || rawTitle.split(' - ').at(-1) || 'ニュース提供元';
    const title = rawTitle.endsWith(` - ${source}`) ? rawTitle.slice(0, -(source.length + 3)) : rawTitle;
    return {
      id: tag(body, 'guid') || tag(body, 'link'), title, summary: title,
      url: tag(body, 'link'), source, category: feed.category,
      publishedAt: isoDate(tag(body, 'pubDate'))
    };
  });
}

const settled = await Promise.allSettled(feeds.map(fetchFeed));
const unique = new Map();
for (const result of settled) {
  if (result.status !== 'fulfilled') { console.warn(result.reason?.message || result.reason); continue; }
  for (const item of result.value) {
    if (!item.title || !item.url || excluded.test(item.title) || excludedSource.test(item.source)) continue;
    const fingerprint = item.title.replace(/[\s　「」『』【】]/g, '').toLowerCase();
    if (!unique.has(fingerprint)) unique.set(fingerprint, item);
  }
}

const items = [...unique.values()]
  .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  .slice(0, 24);

if (!items.length) {
  const previous = JSON.parse(await readFile('data/news.json', 'utf8').catch(() => '{"items":[]}'));
  if (previous.items?.length) { console.log('No fresh items; keeping the previous feed.'); process.exit(0); }
  throw new Error('All news feeds failed or returned no suitable items.');
}

await mkdir('data', { recursive: true });
await writeFile('data/news.json', `${JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2)}\n`);
console.log(`Saved ${items.length} news items.`);
