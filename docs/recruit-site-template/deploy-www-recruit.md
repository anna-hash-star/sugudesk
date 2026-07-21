# 採用サイトを www.sugudesk.com/recruit/&lt;clinic&gt; で公開する手順

採用サイト（`/recruit/[clinic]`）を、マーケLP（www.sugudesk.com）配下のサブディレクトリ
`www.sugudesk.com/recruit/adeb` などとして配信する構成（Next.js マルチゾーン）。
URLは本体ドメインのまま＝SEOは www.sugudesk.com に集約される。

## 全体像

```
[ www.sugudesk.com (LPプロジェクト) ]
   /recruit/:path*  --(Vercel Rewrite/透過プロキシ)-->  [ 採用専用デプロイ ]
                                                          /recruit/adeb, /recruit/_next, ...
```

- 採用専用デプロイは `anna-hash-star/sugudesk` を配信する **専用Vercelプロジェクト**（内部は
  リライト対象外なので www 経由では出ない）。
- 採用側は `assetPrefix=/recruit`＋画像/faviconも `/recruit/…` に寄せてあるので、
  LP側のリライトは **`/recruit/:path*` 1本だけ**でページ・JS/CSS・画像すべてまかなえる。

---

## 1. 採用専用Vercelプロジェクト（当社作業）

- リポジトリ：`anna-hash-star/sugudesk`／ブランチ：`main`（本番反映後）
- **Environment Variables** に以下を設定：

| Key | Value | 用途 |
|-----|-------|------|
| `RECRUIT_DEPLOY` | `1` | `assetPrefix=/recruit`（_next を /recruit 配下へ） |
| `NEXT_PUBLIC_ASSET_BASE` | `/recruit` | 画像・favicon を /recruit 配下へ |
| `NEXT_PUBLIC_SITE_URL` | `https://www.sugudesk.com` | canonical を本体ドメインに固定 |

- デプロイ後の本番URL（例 `https://sugudesk-recruit.vercel.app`）を控える → 次章のリライト先に使う。
- この `*.vercel.app` は直接リンクしない（canonical で www に集約されるので重複扱いにならない）。

## 2. LP（www.sugudesk.com）側にリライトを追加（LPリポジトリ側の設定）

LPプロジェクトの `vercel.json` に次を追加（`<recruit-deploy>` は 1章のURL）：

```json
{
  "rewrites": [
    { "source": "/recruit", "destination": "https://<recruit-deploy>.vercel.app/recruit" },
    { "source": "/recruit/:path*", "destination": "https://<recruit-deploy>.vercel.app/recruit/:path*" }
  ]
}
```

- これは**リダイレクトではなく透過プロキシ**。ブラウザURLは `www.sugudesk.com/recruit/adeb` のまま。
- ページ・`/recruit/_next/*`・`/recruit/recruit-photos/*` すべてこの1パターンに収まる。

## 3. 動作確認

- `https://www.sugudesk.com/recruit/adeb` → AdeB採用トップ（ファビコン＝AdeBロゴ）
- 求人・応募フォーム・スタッフの声などが崩れず表示され、画像も出る
- ページのソースで `<link rel="canonical" href="https://www.sugudesk.com/recruit/adeb">` になっている
- `https://www.sugudesk.com/recruit`（クリニック名なし）→ 404
- 右下のSuguDeskチャットバブル・応募フォーム送信が動く

## クリニックを増やすとき

1. `lib/recruit/clinics/<slug>.js` を作る（`adeb.js` をひな形に）
2. `lib/recruit/clinics/index.js` に import＋`CLINICS` へ1行追加
3. 採用デプロイを再デプロイ → `www.sugudesk.com/recruit/<slug>` が生える
   （LP側のリライトは触らなくてよい）

## 補足（既知の挙動）

- ページ間のクライアント遷移は、サブディレクトリ配信の都合で**フルページ遷移（都度読み込み）**に
  なる。5ページ規模の採用サイトでは体感差はほぼなく、SEO（クローラが見る静的リンク）は
  すべて `www.sugudesk.com/recruit/…` で正しいので影響なし。
