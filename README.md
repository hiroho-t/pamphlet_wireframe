# pamphlet-wireframe

学校案内パンフレット／学生募集要項のワイヤーフレーム レイアウトテンプレート集（Claude Code スキル）。

A4縦（794×1123px）と見開き（1588×1123px）の2サイズ、**510種**。白・黒・グレーのみ、テキストはすべてダミー。ブラウザからそのままPDF化できる。

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
- 型の一覧（テキスト）：[CATALOG.md](CATALOG.md)

## 収録

| カテゴリ | 数 |
|---|---|
| `cover/` 表紙 | 32 |
| `toc/` 目次 | 18 |
| `section/` 中扉 | 18 |
| `message/` 学長メッセージ | 16 |
| `about/` 学校紹介・特色 | 30 |
| `department/` 学科・コース紹介 | 45 |
| `curriculum/` カリキュラム | 28 |
| `class/` 授業・実習・教員 | 30 |
| `student/` 在学生インタビュー | 32 |
| `campuslife/` キャンパスライフ | 28 |
| `facility/` 施設・キャンパス | 21 |
| `career/` 進路・就職 | 26 |
| `og/` 卒業生 | 14 |
| `works/` 作品・成果 | 12 |
| `global/` 国際交流・留学 | 10 |
| `license/` 資格・免許 | 16 |
| `support/` 学費・奨学金 | 18 |
| `admission/` 入試 | 20 |
| `opencampus/` オープンキャンパス | 14 |
| `access/` アクセス・学校概要 | 12 |
| `faq/` よくある質問 | 10 |
| `backcover/` 裏表紙 | 12 |
| `spread/` 見開き | 30 |
| `guidelines/` 募集要項 | 18 |

合計 510種。型の選び方は [SKILL.md](SKILL.md)、型の一覧は [CATALOG.md](CATALOG.md) を参照。

## 開発

HTMLを追加・削除したら、一覧ページとカタログを作り直す。

```bash
node tools/build.js && node tools/catalog.js
```

| ファイル | 役割 |
|---|---|
| `tools/cats.js` | カテゴリーの並び順とラベル。ここを編集すれば両方に反映される |
| `tools/build.js` | `index.html`（サムネイル一覧）を生成。縦横比は各HTMLの `.page` 実寸から自動判定 |
| `tools/catalog.js` | `CATALOG.md`（テキストの型一覧）を生成。見出しと構造の特徴をHTMLから抽出する |
| `tools/serve.js` | ローカル確認用サーバー |
| `tools/mk.sh` | 共通ボイラープレートを巻いて1枚書き出す `mk` 関数 |

新規ファイルは `mk` で作れる。

```bash
source tools/mk.sh
mk cover/cover-033 <<'EOF'
  .ttl{position:absolute;left:56px;top:900px;font-size:40px;font-weight:800;color:#1a1a1a}
@@@
    <div class="ph" style="left:0;top:0;width:794px;height:860px">MAIN IMAGE</div>
    <div class="ttl">ダミーのキャッチコピー</div>
EOF
```

見開きは `mk spread/spread-031 1588 1123` のようにサイズを渡す。

## 注意

参考にした実物パンフレットのスクリーンショットは他社の著作物のため、このリポジトリには含めない（`.gitignore` で画像を除外している）。収録しているのはレイアウトの型のみで、テキスト・写真はすべてダミーに置き換えてある。
