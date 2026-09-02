#!/bin/sh
# 書き出し後の定型処理：固有名詞の検査 → 一覧とカタログの再生成 → 型レベルの自動退避
set -e
cd "$(dirname "$0")/.."
node tools/check.js
node tools/build.js
node tools/catalog.js
node tools/retire.js | tail -1
