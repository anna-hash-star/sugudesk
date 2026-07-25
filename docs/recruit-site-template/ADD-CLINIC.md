# 新しいクリニックの採用サイトを追加する（ランブック）

`www.sugudesk.com/recruit/<slug>` を1つ増やす手順。**上から順に進めれば量産できる**。
入力情報は `CLINIC-INTAKE.md`（ヒアリング項目）で集める。データの書き方は `lib/recruit/clinics/_template.js` を丸ごとコピーして使う。

> 記法：`<slug>` はURLに入る英小文字ID（例 `adeb`, `luna`）。既存の `adeb.js` / `luna.js` を実例として参照。

---

## 1. データファイルを作る
- `lib/recruit/clinics/_template.js` を `lib/recruit/clinics/<slug>.js` にコピー。
- ヒアリング内容を各項目に流し込む（`clinic` / `stats` / `director` / `jobs` / `voices` / `diagnosis` / `faqs` / `support` / `flowSteps`）。
- 未確定項目はコメントで「要確認」と明記。写真・電話・法人名など後追いでも可。

## 2. レジストリに登録
`lib/recruit/clinics/index.js` に2箇所追記：
```js
import * as <slug> from './<slug>';         // 上部の import 群に追加
// CLINICS 内に1行追加：
<slug>: toBundle('<slug>', <slug>),
```
※ データに新しいトップレベル項目を増やした場合は `toBundle()` にも同名で追加する。

## 3. テーマ色
`styles/globals.css` に `.theme-<slug>` を追加し、`--color-rc-*` を差し替え。
- 主色 `--color-rc-teal` は **白文字が 4.5:1 を満たす濃さ**にする（ボタン等で白抜き文字を使うため）。
- `--color-rc-teal-soft` / `sand` / `ivory` は淡い面、`ink` / `ink-soft` は本文色。
- データ側で `themeClass: 'theme-<slug>'` を設定。女性向け等で装飾を出すなら `heroDecor: 'soft-pink'`。

## 4. 写真・ロゴ
- `public/recruit-photos/` に配置。命名例：`<slug>-hero.jpg` / `<slug>-director.jpg` / `<slug>-<院名>.jpg`。
- **高解像度の原本は最適化してから使う**（大きすぎると重い）：
  ```bash
  node -e "require('sharp')('IN.JPG').rotate().resize({width:1600,withoutEnlargement:true}).jpeg({quality:80,mozjpeg:true}).toFile('public/recruit-photos/<slug>-hero.jpg')"
  ```
- データの `photos.hero` / `photos.director` / `gallery[].src` / `signature.image` からパス参照。未配置ならイラスト表示になる。
- ロゴ：横組みなら `logo`、マークのみなら `markIcon`、ファビコンは `favicon`（正方形ロゴ or マーク）。

## 5. 応募導線・チャット
- 応募：`applyForm.endpoint`（自作フォーム／Apps Script）か `applyFormUrl`（Googleフォーム）。電話応募を出さないなら `applyByPhone: false`。
- チャット：SuguDesk 常駐バブルを出すなら `chatWidget: { src, key }`。無しなら `chatWidget: {}`（**未設定にしない**＝旧内蔵チャットが出る）。

## 6. ローカル確認
```bash
next dev            # → http://localhost:<port>/recruit/<slug>
next build          # 型・ルート生成の確認（成功で ● /recruit/<slug> 等が出る）
```
- スクショは Playwright（chromium: `/opt/pw-browsers/`）。トップ・職種・応募の流れ・スマホ幅を確認。
- 配布用に1枚HTMLのプレビューが要れば `scripts/build-recruit-preview.py` を参考にクリニック用へ調整。

## 7. 公開（本番 = main）
- **ユーザーの「公開して」を得てから**実施。
- 通常は feature ブランチを main へマージ。
- 既存クリニックだけの小改修を、未公開クリニックを巻き込まず入れたいときは、その**コミットだけ cherry-pick**：
  ```bash
  git fetch origin main && git checkout -B main origin/main
  git cherry-pick <commit>
  next build            # 確認
  git push origin main
  git checkout <feature-branch>   # 作業ブランチに戻る
  ```
- 反映は Vercel（sugudesk-recruit が main 追従）。数分で `www.sugudesk.com/recruit/<slug>`。

## 8. 計測（GA4）
- データに `gaId: 'G-XXXXXXXXXX'` を設定するだけで、そのクリニックのみ gtag を読み込む（SPA遷移も page_view 送信）。
- 本番反映後、GA4 リアルタイムで該当URLを開いて確認。

## 9. Search Console（クリニックごと）
- **URLプレフィックス プロパティ**を作成：`https://www.sugudesk.com/recruit/<slug>/`。
- 認証：**GA連携が最短**（同じGoogleアカウント）。ダメならメタタグ（`RecruitLayout` にクリニック単位で埋め込み可）。
- サイトマップ送信：`https://www.sugudesk.com/recruit/<slug>/sitemap.xml`（自動生成済み。Search Console では `sitemap.xml` を入力）。
- 補足：`robots.txt` はドメイン直下（LP側管轄）。`/recruit/` がブロックされていないか確認。

---

## 仕上げチェックリスト
- [ ] `<slug>.js` 作成／`index.js` に登録
- [ ] `.theme-<slug>` 追加（主色コントラスト OK）
- [ ] 写真・ロゴ・ファビコン配置（最適化済み）
- [ ] 応募導線（applyForm or applyFormUrl）／チャット設定
- [ ] `next build` 成功・スクショ確認（PC/スマホ）
- [ ] プレビューをクライアント確認 →「公開して」
- [ ] main へ反映・本番表示確認
- [ ] GA（gaId）／Search Console（プロパティ＋サイトマップ）
