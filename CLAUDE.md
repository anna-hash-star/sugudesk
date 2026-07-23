# SuguDesk リポジトリ ガイド（Claude 用）

このリポジトリには複数のものが同居しています。中心的な作業対象は **採用サイト量産プラットフォーム（/recruit）** です。

## 採用サイト・プラットフォーム（最重要）

`www.sugudesk.com/recruit/<clinic>` で公開する、**クリニックごとの採用サイト**を量産する仕組み。
1クリニック＝データファイル1枚を足すだけで増やせる設計になっています。

### 新しいクリニックを追加するとき
**必ず `docs/recruit-site-template/ADD-CLINIC.md`（ランブック）に従ってください。**
データ雛形は `lib/recruit/clinics/_template.js`、ヒアリング項目は `docs/recruit-site-template/CLINIC-INTAKE.md`。

### アーキテクチャ要点
- **データ**：`lib/recruit/clinics/<slug>.js`（`clinic`, `stats`, `director`, `jobs`, `voices`, `diagnosis`, `faqs` などを export）。
- **登録**：`lib/recruit/clinics/index.js` に `import * as <slug>` と `CLINICS` へ1行追加するだけ。`toBundle()` が全項目を props 用に整形する（項目を増やしたら toBundle にも追加）。
- **ルーティング**：`pages/recruit/[clinic]/`（`index.js` トップ／`flow.js`／`entry.js`／`jobs/[job].js`／`sitemap.xml.js`）。`getStaticPaths` が `CLINIC_SLUGS` × 職種を列挙。
- **表示**：`components/recruit/RecruitLayout.js` が `ClinicProvider` でデータを配布。各セクションは `useClinic()` で参照。
- **テーマ色**：`styles/globals.css` の `.theme-<slug>` で `--color-rc-*` を差し替え。クリニック側は `themeClass: 'theme-<slug>'`。主色は白文字が 4.5:1 を満たす濃さにする。
- **写真**：`public/recruit-photos/<slug>-*.jpg`。高解像度原本は sharp で ~1600px / JPEG q80 に最適化して配置（`clinic.photos` / `gallery` / `signature.image` から参照）。未配置でもイラストに自動フォールバック。
- **配信（マルチゾーン）**：LP（www.sugudesk.com）が `/recruit/*` を採用デプロイ（Vercel: sugudesk-recruit、main 追従）へ rewrite。採用ビルドは `RECRUIT_DEPLOY=1` で `assetPrefix:'/recruit'`。canonical は `NEXT_PUBLIC_SITE_URL` 基準。

### クリニック単位の主なスイッチ（`clinic` オブジェクト）
- `applyForm.endpoint`（自作フォーム＝Apps Script）か `applyFormUrl`（Googleフォーム）で応募導線。両方あれば applyForm 優先。
- `applyByPhone: false` … 「お電話でも応募できます」等の電話応募文言を消す。
- `chatWidget: {src,key}` … SuguDesk 常駐チャット（右下バブル）。`{}` = チャット無し。**未設定は旧・内蔵チャットが出るので原則使わない**。
- `diagnosis` … 相性診断（マッチ度チェック）。あるとセクション＋ナビが自動表示。
- `heroDecor: 'soft-pink'` … ファーストビューの淡いピンク装飾＋浮遊する円。
- `gaId` … GA4 測定ID（そのクリニックだけ gtag を読み込む）。
- `logo` / `markIcon` / `favicon` / `logoMark` … ロゴ・ファビコン。

## デプロイの決まり
- 通常は **feature ブランチで実装 → プレビュー確認**。本番反映（main へマージ）は**ユーザーの明示指示（「公開して」）が必要**。
- **AdeB のような“公開中クリニック”だけの小改修**（GA・サイトマップ等）を、未公開の他クリニックを巻き込まず本番へ入れたいときは、その**コミットだけ main に cherry-pick** して push（作業後は feature ブランチに戻る）。
- サイトマップは `…/recruit/<clinic>/sitemap.xml` が自動生成される。Search Console は**クリニックごとに URLプレフィックス プロパティ**（`https://www.sugudesk.com/recruit/<clinic>/`）を作り、認証は GA連携かメタタグ。

## 確認・プレビュー
- ローカル：`next dev` → `http://localhost:<port>/recruit/<clinic>`。スクショは Playwright（chromium: `/opt/pw-browsers/`）。
- 配布用の自己完結プレビュー（1枚HTML）：`scripts/build-recruit-preview.py` を参考に、ビルド済みSSGを1ファイルへ束ねる方式。

## 品質メモ
- コピーは「優しさ押し」を避け、具体的な安心材料で書く（過度な情緒表現はクライアントが嫌がる）。
- 相性診断は「採用確度」ではなく「相性の目安」。結果を保証しない旨を明記する。
- 装飾は控えめ・医療機関の清潔感を優先。派手グラデ／虹色／ハート／過剰装飾は避ける。
