#!/usr/bin/env node
/**
 * 誌面テキストに実在の固有名詞が紛れ込んでいないか検査する。
 * 使い方: node tools/check.js [--update]
 *
 * トレースは実誌面を見ながら書くので、校名・ブランド名・サービス名を
 * うっかりそのまま残しやすい。ここではラテン文字の語だけを機械的に拾い、
 * tools/allow-words.txt（既知の一般語・ダミー語）に無いものを未知語として挙げる。
 *
 *  - 未知語が出たら、一般語なら --update で辞書に足す。固有名詞ならダミーに直す。
 *  - 和文の固有名詞はこの方法では拾えないので、TRACING.md のルール
 *    （ダミー学園／ダミー学科／ダミー 太郎…）を守ること。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DICT = path.join(__dirname, 'allow-words.txt');
const CATS = require('./cats.js');
const update = process.argv.includes('--update');

const allow = new Set(
  (fs.existsSync(DICT) ? fs.readFileSync(DICT, 'utf8') : '')
    .split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'))
);

const found = new Map();
for (const [, dir] of CATS) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter(f => f.endsWith('.html'))) {
    let s = fs.readFileSync(path.join(d, f), 'utf8');
    s = s.replace(/<style>[\s\S]*?<\/style>/g, '')
         .replace(/<script>[\s\S]*?<\/script>/g, '')
         .replace(/<[^>]+>/g, ' ');                 // タグと属性を落とす
    for (const w of s.match(/[A-Za-z][A-Za-z＋+\-.&]*/g) || []) {
      if (allow.has(w)) continue;
      if (!found.has(w)) found.set(w, new Set());
      found.get(w).add(`${dir}/${f}`);
    }
  }
}

if (!found.size) {
  console.log('未知の語なし。');
  process.exit(0);
}
if (update) {
  const add = [...found.keys()].sort();
  fs.appendFileSync(DICT, '\n' + add.join('\n') + '\n');
  console.log(`${add.length}語を辞書に追加しました: ${add.join(', ')}`);
  process.exit(0);
}
console.log('辞書にない語（固有名詞ならダミーに直す。一般語なら --update で辞書へ）');
for (const [w, files] of [...found].sort()) {
  console.log(`  ${w}  ←  ${[...files].slice(0, 4).join(', ')}${files.size > 4 ? ` ほか${files.size - 4}件` : ''}`);
}
process.exit(1);
