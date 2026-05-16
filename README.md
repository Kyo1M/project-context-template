# project-context-template

プロジェクトごとの情報（議事録・決定事項・タスク・思考メモ・恒久ナレッジ・クライアント説明資料・AI 壁打ち成果物）を一元管理するための **GitHub Template Repository**。

人間は普通の Markdown を直接書き、LLM は `AGENTS.md` / `llms.txt` / トピックハブから全体を一括把握できる **二層構造** で運用する。Karpathy の LLM-wiki 思想と llms.txt / AGENTS.md 規約を取り込んでいる。

---

## このテンプレの目的

- プロジェクトごとに同じ構造のコンテキスト・リポジトリを即座に立ち上げる
- 議事メモ → 議事録 → 決定事項 / タスクの派生を一貫した規約で記録する
- LLM が「これまでの経緯」「現在の決定」「未解決論点」を一括把握できる索引層を備える
- 過去の議論の振り返りと AI 壁打ちによる今後の方針検討を、同じリポジトリ内で完結させる

---

## 採用手順（Use this template）

### 1. テンプレからリポジトリを生成

1. GitHub の本リポジトリページで **「Use this template」** ボタンをクリック
2. 新規リポジトリ名: `{project}-context` を推奨（例: `acme-onboarding-context`）
3. ローカルに `git clone`

### 2. 初期セットアップ（手動・5 分）

すべて手動。スクリプトは同梱していない。

#### a. プロジェクト情報の埋め込み

`AGENTS.md` を開き、以下のプレースホルダを実値に置換:

| プレースホルダ | 内容 |
|----------------|------|
| `{{PROJECT_NAME}}` | プロジェクト名（例: Acme Onboarding） |
| `{{PROJECT_SUMMARY}}` | プロジェクトの 1〜3 行概要 |
| `{{STAKEHOLDERS}}` | 主要関係者（箇条書きでロール付き） |

#### b. プロジェクト概要ファイルの初期化

`docs/wiki/index.md` を開き、`{{PROJECT_NAME}}` `{{PROJECT_SUMMARY}}` `{{STAKEHOLDERS}}` を置換。`{{TODAY}}` は当日の `YYYY-MM-DD` に置き換える。

「主要トピック」欄は空のまま開始してよい（運用しながら `docs/wiki/topics/` を増やす）。

#### c. CI 用 npm パッケージのインストール（任意・ローカル lint したい場合のみ）

```bash
cd scripts && npm install
```

CI 上では Actions が自動で `npm ci` するので、ローカル lint を回したい場合のみ実行。

#### d. リポジトリ Settings

- 必要に応じて Branch protection を main に設定し、`lint` Actions の green を必須に
- このテンプレ自体を再びテンプレ化したい場合のみ、Settings → Template repository を有効化

### 3. 運用開始

`AGENTS.md` を開きながら Claude Code（または好みの AI コーディングエージェント）を起動すれば、規約に沿ったファイル生成が可能。

---

## ディレクトリ構造（早見表）

```
docs/
├── minutes/        議事録（_drafts/ に議事メモ）
├── decisions/      決定事項（ADR）
├── memo/           思考メモ
├── wiki/
│   ├── index.md    プロジェクト概要・歩き方
│   └── topics/     トピック横串ハブ
├── deliverables/   クライアント説明資料（HTML 主軸）
└── explorations/   AI 壁打ち成果物（HTML 主軸）
tasks/              重いタスク（日常タスクは GitHub Issues）
llms.txt            LLM 向け全体索引
AGENTS.md           LLM 運用契約（真実の源）
CLAUDE.md           AGENTS.md を参照する短いリダイレクト
```

詳細と「どこに何を書くか」のフローチャートは `AGENTS.md` 参照。

---

## 命名規約（早見表）

```
yyyymmdd_<kebab-case-slug>.{md,html}
```

- `20260517_onboarding-kickoff.md`
- `20260530_pricing-model-decision.md`
- `20260601_onboarding-overview.html`

日本語タイトルは frontmatter `title:` に記載する（ファイル名は ASCII のみ）。

---

## frontmatter 規約（早見表）

すべての MD / HTML ファイルは先頭に以下の YAML を持つ:

```yaml
---
type: minutes | decision | memo | wiki | task | deliverable | exploration | topic
title: <日本語タイトル>
date: YYYY-MM-DD
status: draft | active | superseded | archived | done | cancelled
topics: []
tags: []
derived_from: []     # 派生元ファイルへのリポジトリ相対パス
related: []
---
```

HTML はファイル先頭に同じ内容を HTML コメント (`<!-- --- ... --- -->`) で埋め込む。種別ごとの追加フィールドは `AGENTS.md` 参照。

---

## 日常運用フロー

| 状況 | やること |
|------|----------|
| 会議中 | `docs/minutes/_drafts/yyyymmdd_<topic>-memo.md` に走り書き |
| 会議後 | Claude に「議事録化して」と依頼 → `minutes/` に正式版、`decisions/` `tasks/` にドラフトが派生 |
| 何かを決めた時 | Claude に「ADR 化して」と依頼 → `decisions/` にファイル生成 |
| 過去を振り返りたい時 | Claude に「`<topic>` の経緯を振り返って」と依頼 |
| 方針を考えたい時 | Claude に「`<topic>` を壁打ちしたい」と依頼 → `explorations/` に HTML 出力 |
| クライアント資料を作りたい時 | Claude に「`<topic>` のスライド作って」と依頼 → `deliverables/` に HTML 出力 |

---

## 自動化（CI）

- **frontmatter lint** — `scripts/lint-frontmatter.ts` が必須フィールド・type 列挙値・ファイル名規約を検証
- **dead link 検出** — `lychee-action` が MD/HTML 内のリンク切れを検出

PR でいずれかが落ちた場合は frontmatter を修正してから再 push。

---

## カスタマイズ

- **タスク管理ツール**: テンプレ標準は GitHub Issues。Linear / Notion / Jira 等に差し替える場合は `AGENTS.md` の「ディレクトリの選び方」表を書き換える
- **新規 skill 追加**: プロジェクト固有の skill が必要になったら `.claude/skills/` を作って配置（Claude Code が自動認識）
- **`record-decision` / `retrospect-topic` の skill 化**: AGENTS.md の prose 指示が安定化し、複数プロジェクトで再利用したくなったら skill に昇格

---

## 参考

- [Karpathy LLM-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [llms.txt 規約](https://llmstxt.org/)
- [AGENTS.md 規約](https://agents.md/)
