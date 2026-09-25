---
type: exploration
title: project-context-template 改訂設計（タスク台帳・議事録フロー・skill の更新）
date: "2026-09-25"
status: draft
topics: []
tags: [template, task-ledger, meeting-minutes, skills]
prompt: analysis-template-dev で育ったタスク台帳・議事録フローを project-context-template のハーネスと meeting-minutes skill に取り込む設計。現状確認 → 修正設計 → 合意後に実装
outcome: open
derived_from: []
related: []
---

# project-context-template 改訂設計（タスク台帳・議事録フロー・skill の更新）

analysis-template-dev で 9 月に育った「タスク台帳を正本にし、議事録の表は当日の記録に絞る」運用と、それを回す議事録・タスク起票・タスク整理の手順を、project-context-template のハーネス（AGENTS.md・雛形・lint）と、Kyo1M/skills の `meeting-minutes` skill に取り込む。新設する skill は `task-breakdown` と `task-issue` の 2 つで、いずれも規約駆動（対象リポジトリの AGENTS.md から置き場と型を読む）にする。実装は 5 単位に分け、合意後に P1 から着手する。

## 1. 現状確認

### 1-1. 関係する 4 リポジトリ

| リポジトリ | 役割 | 情報管理の現在地（2026-09-25） |
|---|---|---|
| `project-context-template`（本リポジトリ、Kyo1M） | 汎用のプロジェクト情報管理テンプレート。Claude Code / Codex 前提 | 議事録・決定・メモ・wiki・topics・deliverables・explorations・`tasks/`。タスクは 1 件 1 ファイル。一覧・状態を持つ場所が無い |
| `dxb-data-ai-workflow-context`（Kyo1M） | 本テンプレートの実運用 1 件目（5 月〜） | 議事録 75・決定 35・`tasks/` 47 件（active 24・done 11・superseded 12）。状態が各タスクの冒頭と wiki 冒頭の「現在地」に分散し、週次の実施予定をタスクファイルで代用している |
| `analysis-project-template`（dxb-tech） | DXB 分析案件向け配布テンプレート。GitHub Copilot Chat 前提 | 議事録 6 列表・タスク登録の下書き・重い決定の判定・wiki 差分承認まで実装済み。台帳は無い（`docs/tasks/` は分量のある要件の置き場のみ） |
| `analysis-template-dev`（dxb-tech） | 上記テンプレートの開発プロジェクト自身の情報管理 | 9/18 にタスク台帳 `docs/tasks/index.md` を新設し運用中。`/task-issue`・`/task-breakdown` を試験中。テンプレート側へは未反映（#23） |

### 1-2. 本テンプレートの現状と、実運用で出ている困りごと

現行の `AGENTS.md` は、構造・命名・frontmatter・Git 運用・推奨ワークフロー 7 本（議事録／決定記録／振り返り／壁打ち／資料作成／トピックハブ／llms.txt）・推奨 skill 表を 1 ファイルに持つ。`meeting-minutes` skill は規約駆動で、議事録（担当・アクション・期限の 3 列表）を作り、規約に派生先があれば決定と `tasks/` のドラフトを 1 件 1 ファイルで起こす。

実運用リポジトリ（dxb-data-ai-workflow-context）では次が起きている。

- タスクの一覧が無い。24 件の active タスクを把握するには各ファイルの冒頭を順に読むしかなく、AGENTS.md に「個別タスクは冒頭に最新状態を置く」「更新は議事録 → タスク冒頭 → 現在地 → 索引の順」という後付けの規則が増えた。
- 状態が 2 か所以上にある。タスク冒頭の「実行状態」表と wiki 冒頭の「現在地」（長文化）と llms.txt の Open Tasks が同じことを別々に持つ。
- 「今週やること」の置き場が無く、`20260905_weekly-execution-plan.md`・`20260911_weekly-execution-plan.md` のような週次計画をタスクファイルとして作っている。
- 会議外（チャット・壁打ち）で出たタスクの出自が残らない。
- 議事録から起こすタスクの粒度が定まらず、細かい行動まで 1 件 1 ファイルになる。

analysis-template-dev の台帳設計（9/18）が挙げた困りごと 3 つ（会議外のタスクの置き場が無い、開いているタスクの全体が見えない、議事録・詳細・Issue の紐付けが散らばる）と同じ問題である。

### 1-3. analysis-template-dev で育った仕組み

| 仕組み | 内容 | 本テンプレートでの現状 |
|---|---|---|
| タスク台帳 `docs/tasks/index.md` | 進行中／完了の 2 節。列は ID・タスク・担当・期限・親・出典・詳細・状態（完了節は状態の代わりに完了日）。ID は `#n`（Issue）／`yyyymmdd-#`（起票前）。状態は 未登録／表のみ／登録済み／進行中／完了。出典は 議事録 行 n／チャット／壁打ち／Issue 直接 | 無い |
| 議事録のネクストアクション表 | 5 列（#・担当・アクション・期限・登録先）。会議当日の記録で以後更新しない。子タスクはサブ番号（`2-1`、`#6-1`、2 段まで）。担当・期限は「未定」（「要確認」は会議日・参加者が不明なときだけ） | 3 列（担当・アクション・期限） |
| 前回からの進捗 | GitHub Issue を使う案件だけ。前回会議日以降に動いた Issue を 完了／更新／新規 の 3 群で 1 行ずつ載せ、台帳へ一方向に写す。Issue・Project 側は読むだけで書き換えない | 無い |
| タスク登録の下書き | 議事録末尾に、表の全行を「見出し＝アクション、本文＝出典・台帳・担当・期限・登録先（＋親・詳細）・概要 2〜3 行」で置く。起票は `/task-issue` か人 | 無い（`tasks/` にファイルを起こす） |
| 保存前の確認 | 未定の担当・期限／親の提案／登録先を空欄にする提案／`docs/tasks/` の status done の提案 を 1 回の質問にまとめる | 質問は日付と人物だけ |
| 重い決定の判定 | 前提・定義・対象範囲・体制を変える決定だけファイル化。理由 1 文を添える。既存の決定ファイル（llms.txt の Decisions 全件）と突き合わせ、再確認なら新規にしない。内容が変わるなら superseded | 決定はすべてドラフト化 |
| wiki index の「進行」表 | 現状／課題／提案手法／体制／スケジュール／タスクのツール／メンバー（`名前: GitHub ID`）。「主な決定」表（日付・決定・効く先・出典）。差分案を出して承認後に反映 | 概要・ステークホルダー・歩き方・主要トピックのみ。実運用では「現在地」節が長文化 |
| 承認レベルの分け | 自動で反映してよい: 議事録・台帳・llms.txt・下書き。承認してから: 決定ファイル・wiki | 派生はすべてドラフト、commit で人が確定 |
| `/task-breakdown` | 壁打ちで `docs/tasks/yyyymmdd_<slug>.md`（目的／背景／やること／完了条件／判断の観点／制約／未確定事項。frontmatter `issue:`）を作る。Issue 番号を入口にしたときはファイルと Issue 側の食い違いを表で見せる更新モード | 無い |
| `/task-issue` | 下書き・`docs/tasks/`・自由記述を入口に、登録計画（タイトル・担当・親・期限・Project フィールド）を承認後、Issue 作成 → Sub-issue → Project 取り込み → 台帳の書き戻し。gh が無ければ貼れる文面を出す | 無い |
| `scripts/task-ledger-status.sh` | Issue と Project の現在値を台帳の行の形で出す（読むだけ）。org・Project 番号・リポジトリ名がハードコード | 無い |
| §14 正本と転写先の同期表 | 型を変えるときに直す先を表で持つ | 無い |

analysis-template-dev には未マージの PR #44（AGENTS.md の縮小。議事録・台帳の型の正本を `docs/guide/project-ops-guide.md` 3-7 節へ、Git 運用の詳細を `docs/guide/git-guide.md` へ移す）があり、トークン消費を理由に「AGENTS.md は要点、正本はガイド」へ寄せている。本設計もこの向きに揃える。

### 1-4. skill の置き場と Claude Code 対応

- `meeting-minutes` は `~/Developer/Skills/meeting-minutes/SKILL.md`（Kyo1M/skills）にあり、`~/.claude/skills/` と `~/.agents/skills/` に symlink 済み。規約駆動なので、AGENTS.md に台帳の型があるリポジトリでは台帳を読める設計に拡張できる。
- analysis-template-dev の `/task-issue`・`/task-breakdown` は Copilot 専用の `.github/prompts/*.prompt.md` で、Claude Code から呼べない。analysis-template-dev の #40（テンプレートを Claude Code でも使えるようにする）は未着手。本設計で作る規約駆動 skill は、analysis-template-dev の AGENTS.md §9 も読めるので、#40 の検証材料になる。

## 2. 設計方針

1. **タスクの一覧と状態は台帳が持つ。** 議事録の表は当日の記録で以後更新しない。個別のタスクファイルは「Issue や下書きの本文に収まらない要件・仕様」だけに絞る。
2. **GitHub Issue は任意のツール。** 案件が wiki の「タスクのツール」行で選ぶ。Issue・Project 側は AI が読むだけで書き換えない（起票は `task-issue` の承認後だけ）。
3. **AGENTS.md は契約と要点、型の正本は `docs/guide/project-ops-guide.md`。** 議事録の構成・表の型・台帳の型・下書きの型・決定の判定基準・wiki 差分の範囲をガイドに置き、AGENTS.md はガイドを指す。skill は Step 0 で AGENTS.md → ガイドの順に読む。
4. **skill は規約駆動のまま Kyo1M/skills に置く。** テンプレートに skill 実体を持ち込まない（同名 skill は 1 実装）。台帳の無いリポジトリでは現行どおり動く。
5. **既存の型は温存し、追加中心にする。** 決定ファイルの ADR 4 節、`topics:` とトピックハブ、frontmatter lint、`tasks/` の位置は変えない。実運用リポジトリの移行（47 件の台帳化）は本設計の範囲外で、別作業にする。

## 3. 変更設計

### 3-1. テンプレート（project-context-template）

| # | ファイル | 変更 |
|---|---|---|
| A1 | `AGENTS.md` | ディレクトリ表の `tasks/` を「タスク台帳 `tasks/index.md`（一覧と状態）と、分量のある要件・仕様（1 タスク 1 ファイル）」に変更。「細かい日常タスク → GitHub Issues」の行を「タスクのツール（wiki 進行表で選ぶ）」に変更。frontmatter の `task` の必須 `assignee:`・`due:` を任意にし、`issue:` を追加。推奨ワークフロー 1（議事録）の出力を「議事録（5 列表・前回からの進捗・下書き）・台帳追記・決定案（重い決定のみ）・llms.txt・wiki 差分」に書き換え、詳細はガイドへ委ねる。推奨ワークフロー 2（決定記録）に重い／軽いの基準と「主な決定」表を追加。新節「タスク管理」（承認レベル・Issue は読むだけ・台帳とガイドへの参照）を追加し、`task-breakdown`・`task-issue` の起動条件を書く。推奨 skill 表を現行の自作 skill（meeting-minutes・task-breakdown・task-issue・grill-me・brainstorming・writing-plans・deck-outline・html-slide-deck・deck-critique）に更新し、obra/superpowers・mattpocock への参照を外す。「正本と転写先の同期ルール」表を新設（小さく）。初期セットアップのヒアリング項目に タスクのツール・メンバー（GitHub ID）・議事録を作る人・定例 を追加 |
| A2 | `tasks/index.md`（新設） | 台帳の雛形。frontmatter（`type: task`）、凡例（ID・出典・状態）、空の「進行中」「完了」表 |
| A3 | `docs/wiki/index.md` | 「進行」表（現状／課題／体制／スケジュール／タスクのツール／メンバー／議事録を作る人／定例）、「主な決定」表、「未解決論点」「直近更新」を追加。「歩き方」「主要トピック」は維持 |
| A4 | `docs/guide/project-ops-guide.md`（新設） | 型の正本。1 どこに何があるか／2 議事録を作ると出るもの／3 タスクのツールと動線（analysis-template-dev 3 節を汎用化。親子の付け方・GitHub Issue と Project の運用を含む）／4 議事録とタスク台帳の型（議事録の構成・5 列表・台帳・下書き・決定の判定基準・wiki 差分の範囲）／5 議事録のフォルダ分け（`docs/minutes/<定例スラグ>/` を許容）／6 棚卸し（仮置き: 四半期ごと、90 日更新無しの行を候補に） |
| A5 | `llms.txt` | 「Open Tasks」を台帳へのリンク 1 行に変更（個別列挙しない）。「Guide」節を追加。「Decisions は全件、Recent Minutes は直近 5 件」の規則を書く |
| A6 | `README.md` | 早見表・日常運用フローを台帳前提に更新。`task-breakdown`・`task-issue` を追加 |
| A7 | `scripts/lint-frontmatter.ts` | `docs/guide/*.md` をファイル名規則の対象外にする（`index.md` と同じ扱い）。`docs/superpowers/` を lint 対象外にする（brainstorming・writing-plans の既定の置き場のため。仮置き） |
| A8 | `scripts/task-ledger-status.sh`（移植、任意） | org・Project・リポジトリを wiki の「タスクのツール」行から読む形に直して移植。P5 として後回し |

### 3-2. skill（Kyo1M/skills）

| # | skill | 変更 |
|---|---|---|
| B1 | `meeting-minutes`（更新） | Step 0 のプロファイル項目に 台帳の場所・タスクのツール・前回からの進捗（gh の要否）・決定一覧（llms.txt）・wiki 差分の範囲・承認レベル を追加し、AGENTS.md が指すガイドを読む。Step 3 の議事録構成に 前回からの進捗・5 列表・タスク登録の下書き を追加（規約に型があるときだけ）。Step 4 の派生を「台帳追記（自動）・決定判定（承認）・llms.txt（自動）・wiki 差分（承認）」に変更し、保存前の確認を 1 回にまとめる。台帳の無いリポジトリでは現行の振る舞いを維持 |
| B2 | `task-breakdown`（新設） | analysis-template-dev の `/task-breakdown` を規約駆動に書き直す。置き場（`tasks/`）・台帳・タスクのツールは Step 0 で AGENTS.md とガイドから読む。Issue は読むだけ |
| B3 | `task-issue`（新設） | analysis-template-dev の `/task-issue` を規約駆動に書き直す。登録計画の承認前に書き込み系コマンドを打たない。Project の単一選択フィールドは Project にあるものだけ列にする（軸・優先度の固定値を持たない）。gh が無ければ貼れる文面を出す |
| B4 | `README.md`・`scripts/link-skills.sh` | 管理表に 2 件を追記し、symlink を配る |

### 3-3. 範囲外・後追い

- dxb-data-ai-workflow-context への適用（47 件の台帳化、週次計画ファイルの扱い、wiki「現在地」の圧縮）は別作業。本設計の P1〜P4 が入ったあとに移行手順を別途書く。
- analysis-project-template（Copilot 側）への反映は dxb-tech の #23・#40 で扱う。本設計の skill が analysis-template-dev の AGENTS.md §9 を読んで動くかは P2 の検証で 1 回試すだけにする。
- Copilot 用の `.github/prompts/` は本テンプレートに置かない。

## 4. 実装単位

| 単位 | 内容 | リポジトリ | 検証 | 依存 |
|---|---|---|---|---|
| P1 | テンプレートの型（A1・A2・A3・A5・A6・A7） | project-context-template | `npm run lint --prefix scripts` が通る。Use this template 相当で作った空リポジトリに台帳・進行表・ガイドの参照がある | なし |
| P2 | `meeting-minutes` の更新（B1） | Skills | 本テンプレートから作った試用リポジトリで、議事メモ 1 本から 5 列表・台帳追記・下書き・決定判定・wiki 差分が出る。dxb-data-ai-workflow-context の `_drafts/` のメモ 1 本でも同じ（ブランチ上で dry-run、コミットしない）。台帳の無い kyo1M-business で現行どおり動く | P1（型の正本） |
| P3 | `task-breakdown`・`task-issue` の新設（B2・B3・B4） | Skills | 試用リポジトリで、下書き 1 件から「計画だけ」で登録計画が出る。gh 無しで貼れる文面が出る。`task-breakdown` で `tasks/yyyymmdd_<slug>.md` が型どおりに出て台帳の詳細列にリンクが入る | P1 |
| P4 | 運用ガイド（A4）と README の仕上げ | project-context-template | 案件の PM がガイドを読んで「どこに何があるか」「議事録を作ると何が出るか」を答えられる（`deck-critique` 相当の読み合わせを 1 回） | P1〜P3 |
| P5 | `task-ledger-status.sh` の移植（A8） | project-context-template | GitHub Issue を使う試用リポジトリで台帳の行の形が出る | P1・P3。任意 |

P1 と P4 は同じブランチでもよいが、ガイドの実文言は skill を動かしてから直す箇所が出るため、P1 では型だけ書き、P4 で文言を仕上げる。

## 5. 確認したこと（2026-09-25 回答）

1. **台帳の置き場**: `tasks/index.md`（現行の `tasks/` のまま）。
2. **型の正本の置き場**: AGENTS.md は要点、型の正本は `docs/guide/project-ops-guide.md`。
3. **決定ファイルの見出し**: 現行の ADR 4 節（Context／Decision／Consequences／Alternatives Considered）を維持（仮置き。実運用の決定 35 件がこの形のため。3 節に揃える場合は見出しだけ変える）。
4. **`task-breakdown`・`task-issue` の置き場**: Kyo1M/skills の汎用 skill。
5. **`docs/superpowers/` の扱い**: lint 対象外にして残す。
6. **追加の指示**: 本リポジトリはプロジェクト情報管理用のテンプレートで、analysis 系は分析プロジェクト用。移植時に分析固有のドキュメント・フロー（分析設計書・テーブル定義・SQL・Copilot プロンプト等）を持ち込まず、不要な文書やフローを残さない。

## 6. 前提と未確定

- 前提: 本テンプレートの利用者は Claude Code / Codex。Copilot 利用者は analysis-project-template を使う。
- 前提: 台帳を Issue から更新するのは議事録作成時（`meeting-minutes`）と `task-ledger-status.sh`（読むだけ）で、GitHub Actions による書き戻しは持たない（bot コミットが PR 確定と衝突するため。analysis-template-dev の 9/15 設計と同じ）。
- 未確定: `meeting-minutes` の 1 回の出力が増えるので、トークン消費が増える。P2 の dry-run で消費量を見て、増加が大きければ「前回からの進捗」と「下書き」を別 skill に分ける。
- 未確定: 棚卸しの閾値（90 日）は仮置き。
