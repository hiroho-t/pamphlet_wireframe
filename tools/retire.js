#!/usr/bin/env node
/**
 * トレースが増えた分だけ、型レベル（オリジナル制作）のファイルを自動で引退させる。
 * 使い方: node tools/retire.js [--dry]
 *
 * ルール（判断を挟まない・何度実行しても同じ状態に収束する）
 *  - カテゴリーごとに
 *      基準本数 = いまカテゴリーにある型レベル + すでに _legacy にある本数
 *      残す本数 = 基準本数 − トレース済みの本数
 *    になるよう、型レベルを id の大きい順に `_legacy/<cat>/` へ退避する
 *    （後から機械的に量産したものほど先に消える）
 *  - 退避しすぎていたら _legacy から戻す（自己修復する）
 *  - カテゴリーが全部トレースになった時点で、型レベルはそのカテゴリーから無くなる
 *    （そこから先はトレースを足した分だけカテゴリーの総数が増える。
 *     見開きは spread/ にしか入らないので、他カテゴリーを置き換えるには
 *     単ページの誌面（表紙・裏表紙・中扉・募集要項・1ページ完結の学科紹介など）を
 *     そのカテゴリーへトレースする必要がある）
 *  - `_legacy/` は cats.js に無いので index.html にも CATALOG.md にも出ない
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CATS = require('./cats.js');
const dry = process.argv.includes('--dry');
const ls = (d) => fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.html')).sort() : [];
const isTraced = (f) => /<!-- traced:/.test(fs.readFileSync(f, 'utf8'));

let out = 0, back = 0;
for (const [, dir] of CATS) {
  const live = path.join(ROOT, dir), legacy = path.join(ROOT, '_legacy', dir);
  if (!fs.existsSync(live)) continue;
  const traced = [], original = [];
  for (const f of ls(live)) (isTraced(path.join(live, f)) ? traced : original).push(f);
  const shelved = ls(legacy);
  const baseline = original.length + shelved.length;
  const keep = Math.max(0, baseline - traced.length);

  if (original.length > keep) {
    const victims = original.slice(keep);
    if (!dry) fs.mkdirSync(legacy, { recursive: true });
    for (const f of victims) {
      console.log(`${dry ? '[dry] ' : ''}退避  ${dir}/${f}`);
      if (!dry) fs.renameSync(path.join(live, f), path.join(legacy, f));
      out++;
    }
  } else if (original.length < keep) {
    const revive = shelved.slice(0, keep - original.length);
    for (const f of revive) {
      console.log(`${dry ? '[dry] ' : ''}復帰  ${dir}/${f}`);
      if (!dry) fs.renameSync(path.join(legacy, f), path.join(live, f));
      back++;
    }
  }
}
console.log(`${dry ? '（試算）' : ''}退避 ${out}本 / 復帰 ${back}本`);
