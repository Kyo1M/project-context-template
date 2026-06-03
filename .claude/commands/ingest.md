# /ingest — ナレッジ取り込みスキル

議事録または調査メモを読み込んで `docs/` 配下のナレッジを更新します。

## 使い方

```
/ingest docs/minutes/yyyymmdd_title.md
```

## 処理内容

引数で渡されたファイルを読み込み、以下の手順で `docs/` 配下のナレッジを更新してください。

### 手順

1. **ファイルを読んで内容を解析する**
   - 意思決定事項を抽出する
   - 言及されているトピックを特定する
   - 技術的な知見・調査結果を抽出する

2. **`docs/decisions/` を更新する**
   - 意思決定ごとに `yyyymmdd_slug.md` を作成または更新する
   - frontmatter を付与する:
     ```yaml
     ---
     type: decision
     title: （日本語タイトル）
     date: YYYY-MM-DD
     status: active
     topics: []
     tags: []
     drivers: []
     alternatives_considered: []
     derived_from: [（元ファイルパス）]
     related: []
     ---
     ```
   - 既存記事に追記する場合は最新情報を先頭に、古い情報は保持する

3. **`docs/wiki/topics/` を更新する**
   - 関連するトピックハブページ `yyyymmdd_slug.md` を作成または更新する
   - frontmatter を付与する:
     ```yaml
     ---
     type: topic
     title: （日本語タイトル）
     date: YYYY-MM-DD
     status: active
     slug: （topic slug）
     summary: （1行要約）
     topics: []
     tags: []
     derived_from: []
     related: []
     ---
     ```
   - 既存記事と矛盾する情報があれば `[要確認]` タグをつけてフラグを立てる

4. **`docs/wiki/index.md` を更新する**
   - プロジェクトの現在の状況を反映する
   - 新規トピックハブがあればリンクを追加する

5. **`llms.txt` を更新する**
   - 新規作成・更新したファイルのエントリを追加・更新する
   - 各エントリは `- [パス](./パス): タイトル — 1行要約` の形式

### 重要なルール

- `docs/minutes/` のファイルは書き換えない（immutable sources）
- 事実として確認できない情報はナレッジに書かない
- 矛盾を発見した場合は最新情報を優先し、古い記述に `[要確認: YYYY-MM-DD]` を付ける

### 完了後の報告

更新したファイルの一覧（新規作成 / 更新）を報告してください。

### コミット

コミット時はコミットメッセージをユーザに提示し、承認を得てから実行する。
