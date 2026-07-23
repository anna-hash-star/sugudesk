# exmore.jp コーポレートサイト

STUDIO から移行する exmore.jp を、**Next.js（静的書き出し）**で構築し、
**Cloudflare Pages（無料）**にデプロイするためのプロジェクトです。
既存の SuguDesk サイト（リポジトリ直下）とは独立していて、影響しません。

---

## ローカルで動かす

```bash
cd exmore
npm install
npm run dev      # http://localhost:3000
```

## 本番ビルド（静的書き出し）

```bash
npm run build    # out/ に静的HTMLが生成される
```

---

## Cloudflare Pages へのデプロイ手順（無料）

1. https://dash.cloudflare.com にアクセスし、無料アカウントを作成
2. 左メニュー **Workers & Pages → Create → Pages → Connect to Git**
3. このリポジトリ（`anna-hash-star/sugudesk`）を選択
4. ビルド設定を以下のように入力：

   | 項目 | 値 |
   |---|---|
   | Production branch | `main`（本番に使うブランチ） |
   | Framework preset | `Next.js (Static HTML Export)` |
   | **Root directory** | `exmore` ← ★ここが重要 |
   | Build command | `npm run build` |
   | Build output directory | `out` |

5. **Save and Deploy** → `xxxx.pages.dev` の仮URLで表示確認

> Root directory を `exmore` にすることで、リポジトリ直下の SuguDesk 側は
> ビルド対象から外れ、exmore サイトだけが公開されます。

---

## 独自ドメイン exmore.jp を接続（お名前.com → Cloudflare）

STUDIO 側のドメイン接続を外す前に、まず Cloudflare 側で表示OKを確認してください。

1. Cloudflare Pages プロジェクト → **Custom domains → Set up a domain** → `exmore.jp` を入力
2. Cloudflare が案内する手順に従う。推奨は **ネームサーバーごと Cloudflare に移す**方法：
   - Cloudflare の **Add a Site** で `exmore.jp` を追加（Freeプラン）
   - Cloudflare が指定する 2 つのネームサーバー（例：`xxx.ns.cloudflare.com`）を控える
   - **お名前.com の管理画面 → ドメイン → ネームサーバーの設定 → 「その他のサービス」**
     を選び、Cloudflare の 2 つの値に書き換えて保存
3. ネームサーバーの反映（数十分〜最大数時間）後、Cloudflare Pages が
   `exmore.jp` / `www.exmore.jp` を自動で紐付け、**SSL証明書も自動発行**
4. `https://exmore.jp` で表示を確認

### 切り替え時の注意（ダウンタイムを出さない）
- 先に Cloudflare Pages（`*.pages.dev`）で表示を確認してからドメインを切り替える
- 表示が確認できたら、最後に **STUDIO の Personal プラン（年¥14,280）を解約**

---

## コンテンツの差し替え

`pages/index.js` の上部にある `site` オブジェクトを編集すると、
文言・会社概要・サービス内容をまとめて変更できます。
`〔要差し替え〕` と書かれた箇所が、現サイトの実際の内容に置き換える対象です。

画像は `public/` に置き、`<img src="/ファイル名" />` で参照します。

### 代表写真の差し替え
`pages/index.js` の Message セクションにあるプレースホルダー部分に、
代表の写真を表示できます。`public/ceo.jpg` を置き、該当箇所を
`<img src="/ceo.jpg" alt="代表取締役 CEO 根来 杏奈" />` に差し替えてください。

### お問い合わせフォームの送信（要接続）
現在フォームは見た目のみで、送信先が未接続です。静的サイト（Cloudflare Pages）
なのでサーバー処理は持てないため、次のいずれかで送信を実装できます（いずれも無料枠あり）：

- **Cloudflare Pages Functions**（同じCloudflare内で完結・追加費用なし）
- **Formspree** や **Getform** などのフォームSaaS（`<form action="...">` を差し替えるだけ）

どれで進めるか決めていただければ、こちらで実装します。
