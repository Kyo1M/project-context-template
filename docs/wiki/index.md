---
type: wiki
title: プロジェクト概要
date: {{TODAY}}
status: active
topics: [overview]
tags: []
summary: プロジェクトの「いま」（目的・前提・進行・主な決定・未解決論点）と、このリポジトリの歩き方
---

# {{PROJECT_NAME}}

このファイルは、プロジェクトの「いま」を 1 枚で把握するための生きたコンテキストです。詳しすぎる資料にせず、次に参加する人が最低限知るべきことだけを残します。更新は `meeting-minutes` skill が差分案を出し、承認後に反映します。

## 概要

{{PROJECT_SUMMARY}}

## ステークホルダー

{{STAKEHOLDERS}}

## 前提

- 対象範囲:
- 対象外:
- 重要な制約:

## 進行

| 要素 | 内容 |
|------|------|
| 現状（いまどうなっているか） | |
| 課題（何に困っているか） | |
| 体制（誰が何を担うか） | |
| スケジュール（いつまでに何を出すか） | |
| 定例（曜日・参加者） | |
| 議事録を作る人 | |
| タスクのツール | なし（表のみ）／GitHub Issue（リポジトリ: <org>/<repo>、Project: <URL>）／外部ボード（Teams ボード等） のいずれか。一覧と状態は `tasks/index.md` |
| メンバー | 名前: GitHub ID（GitHub Issue を使う案件だけ） |

## 主な決定

前提・定義・対象範囲・体制を変えた決定だけを時系列で残します（決定の正本は議事録の「決定事項」と `docs/decisions/`。ここは方針転換を追うための一覧）。

| 日付 | 決定 | 効く先 | 出典 |
|------|------|--------|------|

## 用語

| 用語 | 定義 |
|------|------|

## 未解決論点

-

## 直近更新

- {{TODAY}}: 初期セットアップ

## 主要トピック

継続的に議論される topic を以下に追加していく。各 topic は `docs/wiki/topics/<slug>.md` にハブページを持つ。

<!-- 例:
- [onboarding](./topics/onboarding.md) — オンボーディング機能関連
- [pricing-model](./topics/pricing-model.md) — 価格モデル設計
-->

## このリポジトリの歩き方

| 知りたいこと | 見る場所 |
|--------------|----------|
| これまでの会議で何を話した？ | `docs/minutes/` |
| 何がすでに決まっている？ | 上の「主な決定」→ `docs/decisions/` |
| いま開いているタスクと状態 | `tasks/index.md`（タスク台帳） |
| タスクの要件・仕様 | `tasks/yyyymmdd_<slug>.md` |
| あるトピックの全経緯 | `docs/wiki/topics/<slug>.md` |
| クライアント向け資料 | `docs/deliverables/` |
| AI 壁打ちの過去ログ | `docs/explorations/` |
| 議事録・台帳・決定の型 | `docs/guide/project-ops-guide.md` |
| LLM 用全体索引 | `llms.txt` |

運用ルールの詳細は [AGENTS.md](../../AGENTS.md) を参照。
