# {{PROJECT_NAME}} Context

このリポジトリは {{PROJECT_NAME}} に関するプロジェクト情報（議事録・決定事項・タスク・思考メモ・恒久ナレッジ・クライアント説明資料・AI 壁打ち成果物）を一元管理する **コンテキスト・リポジトリ** です。

人間は通常の Markdown を直接書きます。LLM はこの AGENTS.md と `llms.txt`、`docs/wiki/topics/` のトピックハブから全体を一括把握できるよう、二層構造で運用します。

---

## プロジェクト初期セットアップフロー

> このセクションは、テンプレからリポジトリが生成された直後の **初回セットアップ専用** です。セットアップ完了後はセクションごと削除してください（手順 6 で AI が提案します）。

### AI への起動条件

AI（Claude Code 等）は、以下のいずれかに該当する場合、ユーザーへ「初期セットアップを実施しましょうか？」と自発的に確認してください:

- `AGENTS.md` / `README.md` / `docs/wiki/index.md` / `llms.txt` の中に `{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}` `{{TODAY}}` 等のプレースホルダが残っている
- ユーザーが「セットアップしたい」「初期セットアップ」「setup」「初期化」等と発話

### セットアップ手順（AI が実行）

**1. ユーザーから以下を収集する**（まとめて or 順番に）:

| 項目 | 用途 |
|------|------|
| プロジェクト名 | `{{PROJECT_NAME}}` の置換値 |
| プロジェクト概要（1〜3 行） | `{{PROJECT_SUMMARY}}` の置換値 |
| 主要ステークホルダー | `{{STAKEHOLDERS}}` の置換値（ロール + 名前で箇条書き化） |
| 初期トピック（任意） | `docs/wiki/topics/<slug>.md` の作成対象 |

**2. プレースホルダを置換する。** 対象ファイル:

- `AGENTS.md`（`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}`）
- `README.md`（タイトル等で参照していれば）
- `docs/wiki/index.md`（`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}` `{{TODAY}}`）
- `llms.txt`（`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}`）

`{{TODAY}}` は当日の `YYYY-MM-DD`。

**3. 初期トピックハブを作成（任意）。** 手順 1 で初期トピックが指定された場合のみ:

各 topic ごとに `docs/wiki/topics/<slug>.md` を作成。frontmatter:

```yaml
---
type: topic
slug: <slug>
title: <日本語タイトル>
summary: <1行サマリー>
date: <today>
status: active
topics: [<slug>]
tags: []
---
```

本文は以下の空テンプレ:

```markdown
# <日本語タイトル>

## 関連議事録
（後続の議事録 frontmatter で `topics: [<slug>]` を設定すると、このハブに追加されます）

## 決定事項
## 関連メモ
## クライアント説明資料
## 壁打ち / 探索
## オープンな未解決論点
```

**4. lint を実行して frontmatter が全て正常か確認する:**

```bash
npm install --prefix scripts   # 初回のみ
npm run lint --prefix scripts
```

エラーが出たら修正してから次へ。

**5. このセクション（`## プロジェクト初期セットアップフロー`）を `AGENTS.md` から削除する旨をユーザーに提案する。** 同意を得たら削除。

**6. 初回コミットを提案する:**

```bash
git add -A
git commit -m "Initialize project context for <PROJECT_NAME>"
git push
```

**7. ユーザーに案内する:**

> セットアップ完了です。最初の議事録は `docs/minutes/_drafts/yyyymmdd_<topic>-memo.md` から書き始めると良いです。普段の運用は AGENTS.md の「推奨ワークフロー」を参照してください。

### 手動セットアップ（AI を使わない場合）

上記 1〜2 を手作業で行う。対象プレースホルダは grep で検出可能:

```bash
grep -r "{{" --include="*.md" --include="*.txt" --include="*.html" .
```

---

## プロジェクト概要

> **{{PROJECT_NAME}}**
>
> {{PROJECT_SUMMARY}}

### ステークホルダー

{{STAKEHOLDERS}}

> テンプレ採用後、`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}` を実値に置換してください。

---

## ディレクトリ構造

```
docs/
├── minutes/        議事録（_drafts/ に議事メモ）
├── decisions/      決定事項（ADR 形式）
├── memo/           思考メモ・走り書き
├── wiki/
│   ├── index.md    プロジェクト概要・歩き方
│   └── topics/     トピック横串ハブ（種別をまたいで関連ファイルを集約）
├── deliverables/   クライアント向け説明資料（HTML 主軸）
└── explorations/   AI 壁打ち成果物・複数案比較・プロトタイプ（HTML 主軸）
tasks/              重いタスク（議論を伴う・複数日かかる）。日常タスクは GitHub Issues
llms.txt            LLM 向け全体索引（要約 + リンク集）
```

ディレクトリの選び方:

| 書きたいもの | 行き先 |
|--------------|--------|
| 会議中の走り書き | `docs/minutes/_drafts/` |
| 整形された議事録 | `docs/minutes/` |
| 何かを決めた記録 | `docs/decisions/` |
| アイデア・問い・暫定的な思考 | `docs/memo/` |
| 恒久的に参照したいナレッジ | `docs/wiki/` |
| トピックの横串まとめ（自動 or 手動） | `docs/wiki/topics/` |
| クライアントに見せる資料・スライド・レポート | `docs/deliverables/` |
| 複数案比較・インタラクティブ探索・壁打ち出力 | `docs/explorations/` |
| 議論を伴う重いタスク | `tasks/` |
| 細かい日常タスク・bug report | GitHub Issues（テンプレでは Issues、運用時は Linear 等へ差し替え可） |

---

## 命名規約

すべてのコンテンツファイルは:

```
yyyymmdd_<kebab-case-slug>.{md,html}
```

- 日付プレフィックス: `yyyymmdd`（区切り無し 8 桁）
- セパレータ: `_`（日付とスラグの境界）
- スラグ: ASCII 英小文字 + 数字 + `-`（kebab-case）
- 日本語タイトルは frontmatter `title:` に記載する（ファイル名には入れない）

例:
- `docs/minutes/20260517_onboarding-kickoff.md`
- `docs/decisions/20260520_tech-stack-nextjs.md`
- `docs/deliverables/20260530_onboarding-overview.html`

---

## frontmatter スキーマ

すべての MD ファイルは先頭に YAML frontmatter を持ちます。HTML ファイルはファイル先頭に同じ内容を HTML コメントで埋め込みます。

### 共通必須フィールド

```yaml
---
type: minutes | decision | memo | wiki | task | deliverable | exploration | topic
title: 任意の日本語タイトル
date: YYYY-MM-DD
status: draft | active | superseded | archived | done | cancelled
topics: []           # トピックスラグの配列。docs/wiki/topics/<slug>.md と対応
tags: []             # 自由タグ
derived_from: []     # 派生元ファイルのリポジトリ相対パス（議事録 → 決定/タスク）
related: []          # 横の関連ファイル
---
```

### HTML への埋め込み

```html
<!--
---
type: deliverable
title: オンボーディング機能 概要説明
date: 2026-05-30
status: active
topics: [onboarding]
tags: []
derived_from: [docs/minutes/20260517_onboarding-kickoff.md]
related: []
audience: client
format: slide
---
-->
<!DOCTYPE html>
...
```

### 種別ごとの追加フィールド

| type | 必須追加 | 任意追加 |
|------|----------|----------|
| `minutes` | `attendees: []`, `meeting_type: kickoff/review/sync/...` | `recording: path`, `transcript: path` |
| `decision` | — | `drivers: []`, `alternatives_considered: []`, `supersedes: []` |
| `task` | `assignee:`, `due:` | `priority: high/mid/low`, `parent_topic:` |
| `memo` | — | `mood: explore/reflect/...` |
| `wiki` | `summary:` | `visual: path-to-html` |
| `topic` | `slug:`, `summary:` | `owner:` |
| `deliverable` | `audience: client/internal/...`, `format: slide/report/dashboard` | `source_prompt: path-or-inline` |
| `exploration` | `prompt: ...`, `outcome: open/promoted/discarded` | `promoted_to: path-to-decision` |

決定事項（ADR）本文は H2 で `## Context` `## Decision` `## Consequences` `## Alternatives Considered` を推奨。

---

## 推奨ワークフロー

### 1. 議事録作成フロー

**会議中:**
- `docs/minutes/_drafts/yyyymmdd_<topic>-memo.md` に走り書き。frontmatter は最低限（`type: minutes`、`status: draft`、`topics`）でよい。
- 録音 / 文字起こしがあれば、同 `_drafts/` に `yyyymmdd_<topic>-transcript.txt` 等で併置。

**会議直後:**
- ユーザーが「議事録化して」「メモを整えて」と依頼したら、既存の議事録作成 skill を使用する。
- 入力: `_drafts/` のメモ（+ あれば transcript）
- 出力1: 整形された正式議事録を `docs/minutes/yyyymmdd_<topic>.md` に作成（frontmatter 完備、`derived_from: [元のメモパス]`）
- 出力2: 議事録内の決定事項を抽出 → `docs/decisions/yyyymmdd_<slug>.md` ドラフトとして作成（`derived_from: [議事録パス]`）
- 出力3: アクションアイテムを抽出 → `tasks/yyyymmdd_<slug>.md` ドラフトとして作成（`derived_from: [議事録パス]`、`assignee` `due` を埋める）

**派生抽出の判断:**
- 重い/議論を伴うタスクは `tasks/` ファイル化、細かい日常タスクは GitHub Issue として提案する。
- 派生はすべて **ドラフト生成のみ**。人間がレビューして commit する。

### 2. 決定事項記録（record-decision 相当）

ユーザーが「これを決定として記録」「ADR にして」と依頼した場合:

1. ファイル `docs/decisions/yyyymmdd_<slug>.md` を作成
2. frontmatter:
   ```yaml
   ---
   type: decision
   title: <日本語タイトル>
   date: <today>
   status: active
   topics: [...]
   tags: []
   derived_from: [<元議事録 or 議論ログのパス>]   # 会話文脈から推定
   related: []
   drivers: [...]
   alternatives_considered: [...]
   ---
   ```
3. 本文構成:
   ```markdown
   ## Context
   なぜ判断が必要になったか、背景

   ## Decision
   何を決めたか

   ## Consequences
   この判断によって生じる帰結（良い面・悪い面）

   ## Alternatives Considered
   検討した別案と却下理由
   ```
4. 関連トピックハブ（`docs/wiki/topics/<slug>.md`）に追記する（後述「トピックハブ更新」）

### 3. 振り返り（retrospect-topic 相当）

ユーザーが「`<topic>` について振り返りたい」「`<topic>` の経緯を教えて」と依頼した場合:

1. `docs/wiki/topics/<slug>.md` を起点に読み込む（無ければトピックハブ更新を先に行う）
2. ハブから参照されている関連ファイルを **時系列で** 読み込む（議事録 → 決定 → メモ → 成果物）
3. 出力構成:
   ```markdown
   ## 経緯（時系列）
   - yyyy-mm-dd: 議事録 X（要点1行）
   - yyyy-mm-dd: 決定 Y（要点1行）

   ## これまでの主要な決定
   - ...

   ## 未解決論点
   - ...

   ## 次に壁打ちすべき論点候補
   - ...
   ```
4. 出力先（オプション）: `docs/explorations/yyyymmdd_<topic>-retrospective.html` として HTML 保存。会話内表示のみでも可。
5. 「未解決論点 X について壁打ちしますか？」と橋渡しする。

### 4. AI 壁打ち（brainstorming）

ユーザーが「`<topic>` について壁打ちしたい」「方針を考えたい」と依頼した場合:

1. 既存の `superpowers:brainstorming` skill を起動
2. 関連コンテキストをロード: `docs/wiki/topics/<slug>.md` + 直近の関連議事録 / メモ
3. 探索結果は HTML として `docs/explorations/yyyymmdd_<slug>-brainstorm.html` に保存
   - frontmatter:
     ```yaml
     type: exploration
     prompt: <ユーザーの依頼概要>
     outcome: open    # 後で promoted / discarded に更新
     ```
4. 方針が定まったら `record-decision` フローに進み、`exploration` の frontmatter を `outcome: promoted` + `promoted_to: docs/decisions/...` に更新する。

### 5. クライアント説明資料作成

ユーザーが「`<topic>` のスライド作って」「クライアント説明資料を」と依頼した場合:

1. 既存の HTML スライド作成 skill を起動
2. 関連コンテキストをロード: 関連議事録 / 決定事項 / wiki
3. 出力: `docs/deliverables/yyyymmdd_<slug>-slides.html` （または `report.html` / `dashboard.html`）
   - frontmatter（HTML コメント内）:
     ```yaml
     type: deliverable
     audience: client
     format: slide
     derived_from: [docs/decisions/..., docs/minutes/...]
     source_prompt: <生成プロンプトの要約>
     ```
4. HTML は基本「生成物」と捉え、diff の辛さは「再生成 + レビュー」で吸収する。

### 6. トピックハブ更新

`docs/wiki/topics/<slug>.md` は、ある topic に関わる種別をまたいだ関連ファイルを横串で集約するハブ。

ユーザーが「トピックハブを更新して」と依頼した場合、または新規ファイル commit 時に LLM が必要と判断した場合:

1. リポジトリ全体を走査し、frontmatter の `topics:` に `<slug>` を含むファイルを集める
2. `docs/wiki/topics/<slug>.md` を以下の構造で（再）生成:
   ```markdown
   ---
   type: topic
   slug: <slug>
   title: <日本語タイトル>
   summary: <1行サマリー>
   date: <最終更新日>
   status: active
   topics: [<slug>]
   tags: []
   ---

   # <日本語タイトル>

   ## 関連議事録
   - [yyyy-mm-dd <title>](../../minutes/yyyymmdd_xxx.md)
   - ...

   ## 決定事項
   - [yyyy-mm-dd <title>](../../decisions/yyyymmdd_xxx.md)
   - ...

   ## 関連メモ
   - ...

   ## クライアント説明資料
   - ...

   ## 壁打ち / 探索
   - ...

   ## 完了タスク
   - ...

   ## オープンな未解決論点
   - ...
   ```
3. `status: superseded` / `done` / `cancelled` のものは末尾の「過去」セクションへ移動する。

### 7. llms.txt 更新

`llms.txt` はリポジトリ全体の LLM 向け索引（[llmstxt.org](https://llmstxt.org/) 規約）。

ユーザーが「llms.txt を更新して」と依頼した場合:

1. リポジトリ内の全コンテンツファイルを走査
2. 種別ごとにファイルパス + 1〜2行サマリー（title + 要点）を集約
3. `llms.txt` を以下の構造で生成:
   ```
   # <PROJECT_NAME> Context

   <PROJECT_SUMMARY>

   ## Decisions
   - [docs/decisions/yyyymmdd_xxx.md] <title> — <summary>

   ## Wiki
   - [docs/wiki/xxx.md] <title> — <summary>

   ## Topics
   - [docs/wiki/topics/xxx.md] <title> — <summary>

   ## Recent Minutes
   - [docs/minutes/yyyymmdd_xxx.md] <title> — <summary>

   ## Open Tasks
   - [tasks/yyyymmdd_xxx.md] <title> — <assignee> / <due>
   ```

---

## 推奨 skill 一覧

このリポジトリの運用で活用が推奨される skill とトリガーです。実体は基本的にユーザーグローバル（`~/.claude/skills/`）に存在することを前提とします。

| skill | トリガー例 | 用途 |
|-------|-----------|------|
| 議事録作成（既存） | 「議事録化して」「メモを整えて」 | 議事メモ → 正式議事録 + 派生抽出 |
| HTML スライド作成（既存） | 「スライド作って」「説明資料を」 | `docs/deliverables/` への HTML 生成 |
| `superpowers:brainstorming` | 「壁打ちしたい」「方針を考えたい」 | AI との発散的探索 |
| `grill-me` | 「設計を詰めたい」「決定する前に詰めて」 | 設計判断の徹底議論 |
| `superpowers:writing-plans` | 「実装プランを書いて」 | 大きな施策の計画書 |
| `superpowers:subagent-driven-development` | 「並列で進めて」 | 独立した複数タスクの並行実行 |

`record-decision` / `retrospect-topic` などはこの AGENTS.md の prose 指示で運用します。差分が育ってきた段階で skill 化を検討します。

---

## プロジェクト固有の指示

（このセクションに、各プロジェクト固有の用語・原則・注意事項・人物リスト・外部リソース等を追記してください）

<!-- e.g.
- 用語: 「顧客」は B2B の法人顧客を指す。エンドユーザーは「ユーザー」と表記
- 原則: 価格に関する決定は必ず @kobayashi の承認が必要
- 外部リソース: 設計図は Figma の <URL>、契約書は Drive の <URL>
-->

---

## 参考

- [Karpathy LLM-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — LLM 用知識ベース思想の起点
- [llms.txt 規約](https://llmstxt.org/) — LLM 用全体索引のフォーマット
- [AGENTS.md 規約](https://agents.md/) — AI エージェント向け運用契約の標準
