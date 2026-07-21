// 採用サイトを www.sugudesk.com/recruit 配下（別ドメインのサブディレクトリ）へリライトで
// 配信する場合、画像・favicon などのルート参照（/recruit-photos/… や /favicon.png）も
// /recruit 配下に収める必要がある。採用デプロイでは NEXT_PUBLIC_ASSET_BASE=/recruit を渡すと
// 自動で前置される。通常の開発・プレビュー（ルート配信）では空文字なので影響しない。
export const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE || '';

export function asset(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path) || /^data:/i.test(path)) return path; // 外部URL・data URIはそのまま
  return ASSET_BASE + path;
}
