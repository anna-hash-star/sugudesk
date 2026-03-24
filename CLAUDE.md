# SuguDesk - ビジネスコンテキスト

## 会社概要
- **事業内容**: 医療・歯科クリニック向けAIソリューション（2ブランド展開）
- **成長戦略**: SaaSで顧客基盤・業務知見を蓄積 → AI BPOで単価向上・事業拡大

## ブランド・サービス
| ブランド | 事業 | フェーズ | サイト |
|---|---|---|---|
| **SuguDesk（スグデスク）** | AIチャットボット分析SaaS | 短期・現在 | https://www.sugudesk.com/ |
| **クラウド事務長** | AI BPO（電話対応代行、予約管理、事務代行など） | 中期 | https://cloud-jimucho.studio.site/ |

## プロダクト構成
- **分析ダッシュボード** (`/[client]`): クライアントごとのチャットボット分析画面
- **チャットインターフェース** (`/chat/[id]`): Dify埋め込みチャット（chat.sugudesk.com経由）
- **経営管理ダッシュボード** (`/management`): 社内用の経営管理画面

## 技術スタック
- Next.js / React / Google Sheets API / Dify / Recharts

## 現在のクライアント
1. ルナレディースクリニック（lunaladies）- ダッシュボード＋チャット
2. AdeB（adeb）- ダッシュボード
3. 泉崎審美歯科・ファミリー歯科（izumisaki）- ダッシュボード
4. 細木病院（hosogihospital）- ダッシュボード
5. みかさ美容クリニック（mikasa）- ダッシュボード

## ビジネスデータの場所
- `business/strategy.json` - 経営戦略・ビジョン・KPI
- `business/clients.json` - 顧客管理・営業パイプライン
- `business/product-roadmap.json` - プロダクトロードマップ
- `business/financials.json` - 財務データ
- `business/meeting-notes/` - 会議メモ・決定事項

## Claude Codeへの指示
- 経営データを更新する際は、該当するJSONファイルを直接編集してください
- 新しい会議メモは `business/meeting-notes/YYYY-MM-DD-title.md` の形式で作成してください
- KPIや財務データの分析を求められたら、JSONデータを読み込んで分析・レポートを生成してください
- プロダクト改善の提案は、現在のクライアントデータと市場動向に基づいて行ってください
