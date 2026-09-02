#!/usr/bin/env node
/**
 * CATALOG.md を各HTMLから生成する。
 * 使い方: node tools/catalog.js
 * 見出し・ラベル・構造の特徴をHTMLから機械的に抽出するので、
 * ファイルを足したら再実行すれば一覧が追随する。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const CATS = require('./cats.js');

const txt = (s) => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const pick = (src, cls) => {
  const m = src.match(new RegExp(`<div class="${cls}"[^>]*>([\\s\\S]*?)</div>`));
  return m ? txt(m[1]) : '';
};

function features(src) {
  const f = [];
  if (/<!-- traced:/.test(src)) f.push('**トレース**');
  const size = src.match(/\.page\{[^}]*?width:(\d+)px;height:(\d+)px/);
  const wide = size && +size[1] > 1000;
  if (wide) f.push('見開き');

  const full = /class="ph[^"]*"\s+style="left:0;top:0;width:(794|1588)px;height:1123px/.test(src);
  if (full) f.push('全面写真');
  if (/background:#1a1a1a/.test(src) && /\.bg\{position:absolute;inset:0/.test(src)) f.push('黒ベタ');
  else if (/\.bg\{position:absolute;inset:0;background:#6b6b6b/.test(src)) f.push('濃色ベタ');
  else if (/width:794px;height:(1[2-9]\d|[2-9]\d\d)px;background:#6b6b6b/.test(src)) f.push('濃色の帯');
  if (/background:#f0f0f0/.test(src) && /height:1123px;background:#f0f0f0/.test(src)) f.push('地色パネル');

  if (/<table/.test(src)) f.push('表');
  if (/>GRAPH/.test(src)) f.push('グラフ枠');
  if (/border-radius:50%/.test(src) && />(GRAPH)/.test(src)) f.push('円グラフ');
  if (/>(CAMPUS )?MAP|WORLD MAP/.test(src)) f.push('地図');
  if (/>QR</.test(src)) f.push('QR');
  if (/>SCREEN</.test(src)) f.push('画面イメージ');
  if (/writing-mode:vertical/.test(src)) f.push('縦組み');
  const col = src.match(/column-count:(\d)/);
  if (col) f.push(`本文${col[1]}段組み`);
  if (/\.qa|content:"Q"/.test(src)) f.push('Q&A');
  if (/STEP|\.st \.n|\.fl \.n/.test(src) && /\bSTEP\b/.test(src)) f.push('ステップ');
  if (/border-radius:50%;background:#1a1a1a|\.d\{[^}]*border-radius:50%/.test(src)) f.push('タイムライン');
  if (/\.tag|flex-wrap:wrap/.test(src) && /<span>ダミー/.test(src)) f.push('タグ列');

  const photos = (src.match(/class="ph[ "]/g) || []).length + (src.match(/class="im"/g) || []).length
    + (src.match(/<div class="im">/g) || []).length;
  f.push(`図版${photos}点`);
  return f;
}

let out = `# レイアウトカタログ

このファイルは \`node tools/catalog.js\` が各HTMLから自動生成する。手で編集しない。

「特徴」はHTMLから機械的に抽出したもの（版面の地色・表やグラフの有無・段組み・図版点数など）。
型を選ぶときは、カテゴリー → 見出し → 特徴 の順に絞り込んでから該当ファイルを読むこと。

`;

let total = 0;
for (const [label, dir] of CATS) {
  const files = fs.existsSync(path.join(ROOT, dir))
    ? fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.html')).sort()
    : [];
  if (!files.length) continue;
  out += `## ${label} \`${dir}/\`（${files.length}種）\n\n| id | 見出し | 特徴 |\n|---|---|---|\n`;
  for (const file of files) {
    const src = fs.readFileSync(path.join(ROOT, dir, file), 'utf8');
    const id = file.replace(/\.html$/, '');
    const h = pick(src, 'h1') || pick(src, 'ttl') || pick(src, 'vt') || pick(src, 'q')
      || pick(src, 'en') || pick(src, 'logo') || pick(src, 'msg') || '—';
    const eye = pick(src, 'eye') || pick(src, 'cat') || pick(src, 'en') || pick(src, 'no');
    const head = eye ? `${h}<br><small>${eye}</small>` : h;
    out += `| ${id} | ${head} | ${features(src).join('・')} |\n`;
    total++;
  }
  out += '\n';
}
out += `---\n\n合計 ${total}種。\n`;

fs.writeFileSync(path.join(ROOT, 'CATALOG.md'), out);
console.log(`CATALOG.md を生成しました（${total}種）`);
