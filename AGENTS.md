# {{PROJECT_NAME}} Context

このリポジトリは {{PROJECT_NAME}} に関するプロジェクト情報（議事録・決定事項・タスク・思考メモ・恒久ナレッジ・クライアント説明資料・AI 壁打ち成果物）を一元管理する **コンテキスト・リポジトリ** です。

人間は通常の Markdown を直接書きます。LLM はこの AGENTS.md と `llms.txt`、`docs/wiki/index.md`、`docs/wiki/topics/` のトピックハブから全体を一括把握できるよう、二層構造で運用します。

このファイルは契約と要点だけを持ちます。議事録・ネクストアクション表・タスク台帳・タスクファイル・決定ファイル・wiki 差分の **型の正本は `docs/guide/project-ops-guide.md`** です。`meeting-minutes` skill はそのガイドの型に従って動きます。タスクの一覧と状態はこのリポジトリの台帳で持ち、GitHub Issue などの外部のタスク管理ツールとは連携しません。

---

## プロジェクト初期セットアップフロー

> このセクションは、テンプレからリポジトリが生成された直後の **初回セットアップ専用** です。セットアップ完了後はセクションごと削除してください（手順 6 で AI が提案します）。

### AI への起動条件

AI（Claude Code 等）は、以下のいずれかに該当する場合、ユーザーへ「初期セットアップを実施しましょうか？」と自発的に確認してください:

- `AGENTS.md` / `README.md` / `docs/wiki/index.md` / `llms.txt` / `tasks/index.md` / `docs/guide/project-ops-guide.md` の中に `{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}` `{{TODAY}}` 等のプレースホルダが残っている
- ユーザーが「セットアップしたい」「初期セットアップ」「setup」「初期化」等と発話

### セットアップ手順（AI が実行）

**1. ユーザーから以下を収集する**（まとめて or 順番に。資料があれば先に受け取り、読み取れた内容の確認から入る）:

| 項目 | 用途 |
|------|------|
| プロジェクト名 | `{{PROJECT_NAME}}` の置換値 |
| プロジェクト概要（1〜3 行） | `{{PROJECT_SUMMARY}}` の置換値 |
| 主要ステークホルダー | `{{STAKEHOLDERS}}` の置換値（ロール + 名前で箇条書き化） |
| 前提（対象範囲・対象外・重要な制約） | `docs/wiki/index.md`「前提」 |
| 進行（現状・課題・体制・スケジュール） | `docs/wiki/index.md`「進行」表 |
| 定例（曜日・参加者）、議事録を作る人 | `docs/wiki/index.md`「進行」表 |
| 初期トピック（任意） | `docs/wiki/topics/<slug>.md` の作成対象 |

聞き取れなかった項目は空欄のまま残し、「未解決論点」に「〜を聞く」を 1 行置く（「要確認」の空行を作らない）。

**2. プレースホルダを置換する。** 対象ファイル:

- `AGENTS.md`（`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}`）
- `README.md`（タイトル等で参照していれば）
- `docs/wiki/index.md`（`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}` `{{TODAY}}`。手順 1 の前提・進行の各行も埋める）
- `llms.txt`（`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}`）
- `tasks/index.md`・`docs/guide/project-ops-guide.md`（`{{TODAY}}`）

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

> セットアップ完了です。最初の議事録は `docs/minutes/_drafts/yyyymmdd_<topic>-memo.md` から書き始めると良いです。普段の運用は AGENTS.md の「推奨ワークフロー」と `docs/guide/project-ops-guide.md` を参照してください。分析案件なら、使うテーブルの定義を `table-definition` skill で整理すると、集計の前提（粒度・キー・注意点）が wiki に残ります。

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
├── minutes/        議事録（_drafts/ に議事メモ。定例ごとのサブフォルダ可）
├── decisions/      決定事項（ADR 形式。前提・定義・対象範囲・体制を変える重い決定だけ）
├── memo/           思考メモ・走り書き
├── wiki/
│   ├── index.md    プロジェクトの「いま」（目的・前提・進行・主な決定・未解決論点・直近更新）と歩き方
│   └── topics/     トピック横串ハブ（種別をまたいで関連ファイルを集約）
├── guide/
│   └── project-ops-guide.md  運用ガイド（議事録・タスク台帳・決定・wiki の型の正本）
├── deliverables/   クライアント向け説明資料（HTML 主軸）
└── explorations/   AI 壁打ち成果物・複数案比較・プロトタイプ（HTML 主軸）
tasks/
├── index.md        タスク台帳（タスクの一覧と状態の正本）
└── yyyymmdd_<slug>.md  分量のある要件・仕様（1 タスク 1 ファイル。台帳の 1 行に収まらないものだけ）
llms.txt            LLM 向け全体索引（要約 + リンク集）
```

ディレクトリの選び方:

| 書きたいもの | 行き先 |
|--------------|--------|
| 会議中の走り書き | `docs/minutes/_drafts/` |
| 整形された議事録 | `docs/minutes/`（定例が複数あれば `docs/minutes/<定例スラグ>/`） |
| 何かを決めた記録 | 議事録の「決定事項」。前提・定義・対象範囲・体制を変える決定だけ `docs/decisions/` |
| アイデア・問い・暫定的な思考 | `docs/memo/` |
| 恒久的に参照したいナレッジ | `docs/wiki/` |
| トピックの横串まとめ（自動 or 手動） | `docs/wiki/topics/` |
| クライアントに見せる資料・スライド・レポート | `docs/deliverables/` |
| 複数案比較・インタラクティブ探索・壁打ち出力 | `docs/explorations/` |
| 会議で出たアクション、会議外で出たタスク | `tasks/index.md`（台帳）。議事録作成時は AI が追記、会議外は人が 1 行足す |
| 台帳の 1 行に収まらない要件・仕様 | `tasks/yyyymmdd_<slug>.md`（AI と壁打ちして作る。ワークフロー 3） |
| 設計書・実装計画（`brainstorming`・`writing-plans` skill の出力） | `docs/superpowers/`（lint 対象外）。設計書に基づいて実装し、完了したら削除する（経緯は git 履歴と PR に残る） |

---

## 命名規約

すべてのコンテンツファイルは:

```
yyyymmdd_<kebab-case-slug>.{md,html}
```

- 日付プレフィックス: `yyyymmdd`（区切り無し 8 桁）。議事録・決定は会議日、タスクファイルは作成日
- セパレータ: `_`（日付とスラグの境界）
- スラグ: ASCII 英小文字 + 数字 + `-`（kebab-case）
- 日本語タイトルは frontmatter `title:` に記載する（ファイル名には入れない）
- 例外: `docs/wiki/index.md`・`docs/wiki/topics/<slug>.md`・`docs/guide/*.md`・`tasks/index.md` は日付プレフィックス無し（長期的な集約ページのため）

例:
- `docs/minutes/20260517_onboarding-kickoff.md`
- `docs/decisions/20260520_tech-stack-nextjs.md`
- `tasks/20260528_onboarding-curriculum.md`
- `docs/deliverables/20260530_onboarding-overview.html`

---

## frontmatter スキーマ

すべての MD ファイルは先頭に YAML frontmatter を持ちます。HTML ファイルはファイル先頭に同じ内容を HTML コメントで埋め込みます。

### 共通必須フィールド

```yaml
---
type: minutes | decision | memo | wiki | task | deliverable | exploration | topic
title: 任意の日本語タイトル
date: "YYYY-MM-DD"   # 引用符付き（YAML が日付型に変換するのを防ぐ）
status: draft | active | superseded | archived | done | cancelled
topics: []           # トピックスラグの配列。docs/wiki/topics/<slug>.md と対応
tags: []             # 自由タグ
derived_from: []     # 派生元ファイルのリポジトリ相対パス（議事録 → 決定/タスク）
related: []          # 横の関連ファイル
---
```

`status` の使い分け: `minutes` は `draft` 始まり、`decision`・`wiki`・`task` は `active` 始まり。`superseded` は後の決定で置き換えた `decision`（古いファイルは消さない）と、置き換わった資料・タスク。`done` は台帳で完了にしたタスクのファイル（`meeting-minutes` skill が提案し、承認後に直す）。`cancelled` は見送ったタスクのファイル。

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
| `task` | — | `assignee:`, `due:`, `priority: high/mid/low`, `parent_topic:`（担当・期限・状態の正本は `tasks/index.md`。ファイル側には書かなくてよい） |
| `memo` | — | `mood: explore/reflect/...` |
| `wiki` | `summary:` | `visual: path-to-html` |
| `topic` | `slug:`, `summary:` | `owner:` |
| `deliverable` | `audience: client/internal/...`, `format: slide/report/dashboard` | `source_prompt: path-or-inline` |
| `exploration` | `prompt: ...`, `outcome: open/promoted/discarded` | `promoted_to: path-to-decision` |

`tasks/index.md`（台帳）も `type: task` です。決定事項（ADR）本文は H2 で `## Context` `## Decision` `## Consequences` `## Alternatives Considered`（型は運用ガイド 4-4。別案がメモに無ければ `## Alternatives Considered` は省く）。

---

## Git 運用ルール

このリポジトリでファイルを作成・編集する際、AI（Claude Code 等）は必ず本ルールに従ってください。

### 基本原則

- **`main` で直接作業しない**。`main` は常に他ブランチからのマージ先として保つ
- **1 作業 = 1 ブランチ**（議事録作成、決定事項記録、wiki 更新、AGENTS 修正など、まとまった単位ごと）
- **コミットの区切りは skill 1 回の成果物**（`meeting-minutes` なら議事録・台帳・決定・`llms.txt`・wiki をまとめて 1 コミット）。同じセッションで続けてタスクファイルを作るとき、まだ push していなければ同じブランチ・同じ PR に含めてよい
- **コミットメッセージは案を提示してユーザー確認後に commit**
- **適宜 push**（最初の commit 時に `-u` 付き、以降は区切りで）
- **マージ / PR は明示的に依頼があるまで実行しない**。議事録・台帳・決定・wiki の確定は PR の差分確認とマージで行う（セルフマージ可）

### ブランチ命名規約

```
<type>/<yyyymmdd>-<short-slug>
```

- `<type>` は frontmatter の `type` に揃える。`chore` は AGENTS.md / README.md / scripts 等の運用ファイル更新用。
  - `minutes` / `decision` / `memo` / `wiki` / `task` / `deliverable` / `exploration` / `chore`
- `<yyyymmdd>` は作業開始日
- `<short-slug>` は ASCII kebab-case（ファイル命名規約と同じ）

例:
- `minutes/20260517-onboarding-kickoff`
- `decision/20260520-tech-stack`
- `task/20260528-issue-batch`
- `chore/20260517-update-agents`

### 作業フロー（AI が毎回実行）

1. **ブランチ状態確認**
   ```bash
   git rev-parse --abbrev-ref HEAD
   ```
2. **`main` 上の場合** — `main` の更新を取り込んでから新ブランチへ:
   ```bash
   git pull --ff-only
   git checkout -b <type>/<yyyymmdd>-<slug>
   ```
3. **作業実施** — ファイル作成 / 編集
4. **lint 実行**（コンテンツファイルを変更した場合）:
   ```bash
   npm run lint --prefix scripts
   ```
5. **`git status` / `git diff --cached` を確認した上で、コミットメッセージ案をユーザーに提示**
   - 例: 「以下のメッセージで commit します。よろしいですか？\n\n`[minutes] Add onboarding kickoff (2026-05-17)`」
6. **ユーザー確認後に commit**
7. **push 提案** — 初回 commit は `git push -u origin <branch>`、以降の commit は区切りごとに `git push` を提案
8. **作業区切りでマージ / PR の希望を確認** — 「`main` に直接マージしますか？ それとも PR を作りますか？」を尋ね、依頼があるまで実行しない

### コミットメッセージ規約

- 1 行目（subject）: 60〜72 字以内の要約。日本語 / 英語どちらでも可。種別プレフィックス推奨（`[minutes]` / `[decision]` / `[task]` / `[wiki]` / `[chore]` 等）
- 2 行目: 空行
- 3 行目以降（body, 任意）: 変更理由・派生関係（`Derived-from: docs/minutes/...`）・補足

### 例外

- **初期セットアップ**（`プロジェクト初期セットアップフロー` セクション）はテンプレ生成直後の 1 回限りなので `main` 上で実行してよい。完了後は本ルールを厳守
- **軽微な typo / 1 行修正** で、ユーザーが「`main` で直接修正して」と明示した場合のみ `main` 直接編集可

---

## 推奨ワークフロー

### 1. 議事録作成フロー

**会議中:**
- `docs/minutes/_drafts/yyyymmdd_<topic>-memo.md` に走り書き。形式は自由（frontmatter は無くてよい。`_drafts/` は lint の対象外）。
- 録音 / 文字起こしがあれば、同 `_drafts/` に `yyyymmdd_<topic>-transcript.txt` 等で併置。文字起こしだけだと途中の議論が落ちるので、自分で取ったメモも一緒に渡す。

**会議直後:**
- ユーザーが「議事録化して」「メモを整えて」と依頼したら、`meeting-minutes` skill を使用する。1 回の実行で次が出る（型はすべて運用ガイド 4 節）:

| 出るもの | 反映 |
|---|---|
| 議事録 `docs/minutes/yyyymmdd_<topic>.md`（概要・決定事項・確認事項・ネクストアクション表・議事内容・メモ。`derived_from: [元のメモパス]`） | 自動。保存前に「保存前の確認」（未定の担当・期限／親の提案／台帳の状態の変更／タスクファイルの `status: done`）を 1 回だけ聞く |
| タスク台帳 `tasks/index.md` への追記（表の全行。ID `T-<n>`、状態 `未着手`）と、会議で報告された着手・完了の反映 | 追記は自動、状態の変更は保存前の確認で承認 |
| 決定ファイルの案（前提・定義・対象範囲・体制を変える重い決定だけ。理由付き） | 承認してから保存 |
| `llms.txt` の追記（Recent Minutes・Decisions） | 自動 |
| `docs/wiki/index.md` の差分案（直近更新・進行・主な決定・未解決論点・用語） | 承認してから反映 |

**派生の判断:**
- タスクは台帳の行として残す（1 件 1 ファイルにしない）。分量のある要件・仕様が要るときだけ `tasks/yyyymmdd_<slug>.md` を作る（ワークフロー 3）。
- 議事録・台帳・決定・`llms.txt`・wiki をまとめて 1 コミットにし、PR で確定する。

### 2. 決定事項記録（record-decision 相当）

ユーザーが「これを決定として記録」「ADR にして」と依頼した場合、または議事録作成で重い決定と判定された場合:

1. `llms.txt` の「Decisions」（全件）と突き合わせ、同じ決定が既にあれば新規ファイルにせず「既存の決定ファイル `<パス>` の再確認」と伝える。内容が変わる決定なら、既存ファイルを `status: superseded` にして新しいファイルを作る
2. ファイル `docs/decisions/yyyymmdd_<slug>.md` を作成（型は運用ガイド 4-4。本文は `## Context` `## Decision` `## Consequences` `## Alternatives Considered`、`derived_from` に元議事録）
3. `docs/wiki/index.md`「主な決定」表に 1 行（日付・決定・効く先・出典）を差分案として出し、承認後に追記
4. `llms.txt` の「Decisions」に 1 行追記
5. 関連トピックハブ（`docs/wiki/topics/<slug>.md`）に追記する（後述「トピックハブ更新」）

### 3. タスク管理（台帳・タスクファイル）

タスクの一覧と状態は `tasks/index.md`（台帳）が持ち、議事録のネクストアクション表は会議当日の記録として以後書き換えない。型は運用ガイド 3 節・4-3・4-7。

| 場面 | やること |
|---|---|
| 会議で出たアクション | `meeting-minutes` skill が台帳に追記する（上記 1） |
| 会議外（チャット・壁打ち）で出たタスク | 人が台帳の進行中節に 1 行足す（ID は通し番号の次、出典 `チャット`／`壁打ち`＋日付） |
| 着手・完了・見送り | 担当者が台帳の状態を直す（着手で `進行中`、完了は完了日を書いて完了節へ、見送りはタスク名の末尾に「（見送り）」を付けて完了節へ）。会議で報告されたものは議事録作成時にも AI が提案する |
| 「タスクを整理したい」「T-n を詳細化したい」「子タスクに分けたい」 | 下の手順で `tasks/yyyymmdd_<slug>.md` を作る |
| 「いま開いているタスクは？」 | 台帳の進行中節を読む |

タスクファイルを作る手順（AI が担当者と壁打ちする）:

1. 台帳の該当行・出典の議事録（そのテーマの「議事内容」）・`docs/wiki/index.md` の進行表を読む。同じテーマのタスクファイルが既にあれば、新規に作らず更新として進める。
2. 運用ガイド 4-7 の節（目的・背景・やること・完了条件・判断の観点・制約・未確定事項）を 1 問ずつ聞いて固める。根拠を添えた提案はしてよいが、未合意の「やること」「完了条件」を確定させない。議事録・会話に無い担当・期限・事実を作らない。
3. ファイルの全文を見せて承認を取ってから保存し、台帳の該当行の「詳細」列にリンクを足す（行が無ければ進行中節に 1 行足す）。
4. 「やること」を子タスクとして台帳に載せるかを聞き、載せる項目は子の行（親はこのファイルを指す行）を足して、項目の末尾に `（T-n）` を付ける。

### 4. 振り返り（retrospect-topic 相当）

ユーザーが「`<topic>` について振り返りたい」「`<topic>` の経緯を教えて」と依頼した場合:

1. `docs/wiki/topics/<slug>.md` を起点に読み込む（無ければトピックハブ更新を先に行う）
2. ハブから参照されている関連ファイルを **時系列で** 読み込む（議事録 → 決定 → メモ → 成果物）。台帳の該当行も読む
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

### 5. AI 壁打ち（brainstorming / grill-me）

ユーザーが「`<topic>` について壁打ちしたい」「方針を考えたい」と依頼した場合:

1. 前提を疑う深掘りなら `grill-me` skill、設計まで進めるなら `brainstorming` skill を起動
2. 関連コンテキストをロード: `docs/wiki/index.md` + `docs/wiki/topics/<slug>.md` + 直近の関連議事録 / メモ
3. 探索結果は `docs/explorations/yyyymmdd_<slug>-brainstorm.{md,html}` に保存
   - frontmatter:
     ```yaml
     type: exploration
     prompt: <ユーザーの依頼概要>
     outcome: open    # 後で promoted / discarded に更新
     ```
4. 方針が定まったら「2. 決定事項記録」に進み、`exploration` の frontmatter を `outcome: promoted` + `promoted_to: docs/decisions/...` に更新する。壁打ちで出たタスクは台帳に 1 行足す（出典 `壁打ち`＋日付）。

### 6. クライアント説明資料作成

ユーザーが「`<topic>` のスライド作って」「クライアント説明資料を」と依頼した場合:

1. `deck-outline` skill で構成 md を固め、`html-slide-deck` skill で `.dc.html` を生成し、`deck-critique` skill で批評する
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

### 7. トピックハブ更新

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

   ## タスク（要件ファイル）
   - ...

   ## オープンな未解決論点
   - ...
   ```
3. `status: superseded` / `done` / `cancelled` のものは末尾の「過去」セクションへ移動する。

### 8. llms.txt 更新

`llms.txt` はリポジトリ全体の LLM 向け索引（[llmstxt.org](https://llmstxt.org/) 規約）。議事録作成時は `meeting-minutes` skill が追記する。ユーザーが「llms.txt を更新して」と依頼した場合:

1. リポジトリ内の全コンテンツファイルを走査
2. 種別ごとにファイルパス + 1〜2行サマリー（title + 要点）を集約
3. `llms.txt` を以下の構造で生成:
   ```
   # <PROJECT_NAME> Context

   <PROJECT_SUMMARY>

   ## 運用契約
   - [AGENTS.md] ... / [docs/guide/project-ops-guide.md] ...

   ## Wiki
   - [docs/wiki/index.md] <title> — <summary>

   ## Topics
   - [docs/wiki/topics/xxx.md] <title> — <summary>

   ## Decisions（全件）
   - [docs/decisions/yyyymmdd_xxx.md] <title> — <summary>

   ## Recent Minutes（直近 5 件程度）
   - [docs/minutes/yyyymmdd_xxx.md] <title> — <summary>

   ## Deliverables
   - ...

   ## Open Tasks
   - [tasks/index.md] タスク台帳（個別列挙しない）
   ```

---

## 推奨 skill 一覧

このリポジトリの運用で使う skill とトリガーです。実体は [Kyo1M/skills](https://github.com/Kyo1M/skills) にあり、`~/.claude/skills/`（Claude Code）と `~/.agents/skills/`（Codex）に symlink で配置されている前提です。skill はいずれも規約駆動で、この AGENTS.md と `docs/guide/project-ops-guide.md` から置き場と型を読んで動きます。

| skill | トリガー例 | 用途 |
|-------|-----------|------|
| `meeting-minutes` | 「議事録化して」「メモを整えて」 | `_drafts/` → 議事録 + 台帳追記 + 決定案 + `llms.txt` + wiki 差分（ワークフロー 1） |
| `grill-me` | 「壁打ちしたい」「論点を整理したい」「プランを精査して」 | 前提を疑う批判的壁打ち。論点整理 md を残す（ワークフロー 5） |
| `brainstorming` | 「設計を固めたい」「方針を考えたい」 | 対話で要件と設計を固め `docs/superpowers/specs/` に設計書（ワークフロー 5。実装が完了したら削除） |
| `writing-plans` | 「実装プランを書いて」 | 設計書から実装計画を作る |
| `deck-outline` → `html-slide-deck` → `deck-critique` | 「スライド作って」「説明資料を」「資料をレビューして」 | 構成 md → `.dc.html` → 批評（ワークフロー 6） |
| `table-definition` | 「テーブル定義を整理したい」「定義書を取り込んで」 | 分析案件だけ。使うテーブルを 1 論理テーブル 1 YAML（`docs/tables/`）と wiki「データ」表に整理する。置き場は初回実行時に承認後に追加 |

`record-decision` / `retrospect-topic` / トピックハブ更新 / `llms.txt` 更新はこの AGENTS.md の prose 指示で運用します。差分が育ってきた段階で skill 化を検討します。

---

## 正本と転写先の同期ルール

同じ内容を意図して複数箇所に持つものは、正本を先に直してから転写先に写します。

| 正本 | 転写先 | 同期するとき |
|------|--------|--------------|
| `docs/guide/project-ops-guide.md` 3・4 節（タスクの持ち方・議事録の構成・ネクストアクション表・台帳・決定の判定・wiki 差分の範囲・保存前の確認・タスクファイルの型） | 本ファイル「推奨ワークフロー」1〜3 の要約／`tasks/index.md` の凡例／`llms.txt`・`README.md` の説明 | 列・ID・状態の値・番号の規則・判定基準を変えたとき |
| 本ファイル「frontmatter スキーマ」 | `scripts/lint-frontmatter.ts` の `VALID_TYPES`・`VALID_STATUSES`・`REQUIRED_FIELDS` | type・status・必須フィールドを変えたとき |
| 本ファイル「ディレクトリ構造」 | `README.md` の早見表／`docs/wiki/index.md`「歩き方」 | ディレクトリを増減したとき |

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
