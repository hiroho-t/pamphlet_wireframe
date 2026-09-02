# pamphlet-wireframe

学校案内パンフレットのワイヤーフレーム レイアウトテンプレート集（Claude Code スキル）。

A4縦（794×1123px）と見開き（1588×1123px）の2サイズ。白・黒・グレーのみ、テキストはすべてダミー。ブラウザからそのままPDF化できる。

## インストール

各端末で1回だけ。

```bash
git clone https://github.com/hiroho-t/pamphlet_wireframe.git ~/.claude/skills/pamphlet-wireframe
```

`~/.claude/skills/` に置くと、プロジェクトを問わず全セッションで使える。

## 更新

```bash
cd ~/.claude/skills/pamphlet-wireframe && git pull
```

## 一覧を見る

- Web：https://hiroho-t.github.io/pamphlet_wireframe/
- ローカル：`node tools/serve.js` を実行して http://localhost:8123/ を開く（`index.html` を直接開くとサムネイルのiframeが読めない）

## 収録

| カテゴリ | 数 |
|---|---|
| `cover/` 表紙 | 8 |
| `toc/` 目次 | 6 |
| `section/` 中扉 | 6 |
| `message/` 学長メッセージ | 6 |
| `about/` 学校紹介・特色 | 8 |
| `department/` 学科・コース紹介 | 10 |
| `curriculum/` カリキュラム | 7 |
| `class/` 授業・実習・教員 | 7 |
| `student/` 在学生インタビュー | 8 |
| `campuslife/` キャンパスライフ | 7 |
| `facility/` 施設・キャンパス | 6 |
| `career/` 進路・就職 | 8 |
| `og/` 卒業生 | 6 |
| `license/` 資格・免許 | 5 |
| `support/` 学費・奨学金 | 6 |
| `admission/` 入試 | 6 |
| `opencampus/` オープンキャンパス | 5 |
| `access/` アクセス・学校概要 | 5 |
| `backcover/` 裏表紙 | 5 |
| `spread/` 見開き | 8 |

合計 133種。型の一覧と選び方は [SKILL.md](SKILL.md) を参照。

## 開発

HTMLを追加・削除したら、一覧ページを作り直す。

```bash
node tools/build.js
```

`tools/build.js` の `CATS` がカテゴリーの並び順とラベルを持っている。サムネイルの縦横比は各カテゴリー1ファイル目の `.page` の実寸から自動で読む。

新規ファイルは `tools/mk.sh` の `mk` 関数で作れる（共通のボイラープレートを巻いて出力する）。

```bash
source tools/mk.sh
mk cover/cover-009 <<'EOF'
  .ttl{position:absolute;left:56px;top:900px;font-size:40px;font-weight:800;color:#1a1a1a}
@@@
    <div class="ph" style="left:0;top:0;width:794px;height:860px">MAIN IMAGE</div>
    <div class="ttl">ダミーのキャッチコピー</div>
EOF
```

見開きは `mk spread/spread-009 1588 1123` のようにサイズを渡す。

## 注意

参考にした実物パンフレットのスクリーンショットは他社の著作物のため、このリポジトリには含めない（`.gitignore` で画像を除外している）。
