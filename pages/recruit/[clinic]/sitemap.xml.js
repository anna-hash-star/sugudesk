import { getClinicBundle } from '../../../lib/recruit/clinics';

// クリニックごとのサイトマップ。例: https://www.sugudesk.com/recruit/adeb/sitemap.xml
// Search Console（URLプレフィックス プロパティ）に、このURLを「サイトマップ」から送信する。
// URL は本番の公開ドメイン（NEXT_PUBLIC_SITE_URL）基準で絶対URLにする。
function buildUrls(slug, bundle, siteUrl) {
  const base = `${siteUrl}/recruit/${slug}`;
  const paths = ['', '/flow', '/entry', ...bundle.jobs.map(j => `/jobs/${j.slug}`)];
  return paths.map(p => base + p);
}

export async function getServerSideProps({ params, res }) {
  const slug = params.clinic;
  const bundle = getClinicBundle(slug);
  if (!bundle) {
    res.statusCode = 404;
    res.end();
    return { props: {} };
  }
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sugudesk.com').replace(/\/$/, '');
  const urls = buildUrls(slug, bundle, siteUrl);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
