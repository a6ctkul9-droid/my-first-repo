# かすみがうら市 ゴミ収集 LINE 自動通知

A地区のゴミ収集日を判定し、収集がある日の朝 **7:00（JST）** に LINE へ通知します。

## ファイル構成

```
my-first-repo/
├── report.html              # 通知デザインのプレビュー
├── data/
│   ├── schedule-a.json      # A地区の収集日データ
│   └── gomi-types.json      # 品目ごとの出し方
├── src/
│   ├── schedule.ts          # 日付判定
│   ├── message.ts           # LINE メッセージ生成
│   └── line.ts              # LINE Push API
├── scripts/
│   └── notify.ts            # エントリポイント
└── .github/workflows/
    └── gomi-notify.yml      # 毎朝 7:00 自動実行
```

## ローカルで試す

```bash
npm install

# 今日（JST）の判定結果を表示（送信しない）
npm run notify:dry-run

# 特定の日を指定
npm run notify -- --dry-run --date 2026-08-25
npm run notify -- --dry-run --date 2026-08-27
```

収集がない日は `LINE notification will be skipped.` と表示されます。

## LINE セットアップ（初回のみ）

1. [LINE Developers](https://developers.line.biz/) で Messaging API チャネルを作成
2. チャネルの **Channel access token（長期）** を発行
3. 自分の LINE アカウントを友だち追加
4. Webhook またはログから **ユーザー ID** を取得

## GitHub Actions セットアップ

リポジトリの **Settings → Secrets and variables → Actions** に以下を登録:

| Secret | 内容 |
|--------|------|
| `LINE_CHANNEL_ACCESS_TOKEN` | チャネルアクセストークン |
| `LINE_USER_ID` | 自分のユーザー ID |

登録後、Actions タブから **Gomi Notify** ワークフローを手動実行してテストできます。

- `dry_run: true` — メッセージ内容のみ確認
- `date: 2026-08-25` — 特定日でテスト

## カレンダーデータの更新

収集カレンダーは **半年ごと**（4〜9月 / 10〜3月）に市が更新します。

1. [市公式 ごみ収集カレンダー](https://www.city.kasumigaura.lg.jp/page/page010047.html) から A・C地区 PDF を確認
2. [`data/schedule-a.json`](data/schedule-a.json) の `schedule` に日付を追加
3. デザイン確認は [`report.html`](report.html) で

## 通知ルール

- **通知時刻**: 毎朝 7:00（JST）
- **出し方の期限**: 午前 8:00 までに集積所へ
- **収集がない日**: LINE 通知は送らない
- **祝日**: 通常どおり収集（スキップなし）
