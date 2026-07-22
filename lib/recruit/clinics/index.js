// クリニック・レジストリ。URL の [clinic] セグメントでどのクリニックを表示するか決める。
// クリニックを増やすときは、ここに import と CLINICS への1行追加をするだけ。
//   例) import * as komorebi from './komorebi';  →  CLINICS に komorebi: toBundle('komorebi', komorebi)
import * as adeb from './adeb';
import * as luna from './luna';

// getStaticProps でそのまま props に渡せるよう、プレーンなオブジェクトに整形する。
// （import * の名前空間オブジェクトは直列化で警告が出るため、明示的に組み直す。
//   undefined は Next の props で不可なので、任意項目は null に落とす。）
function toBundle(slug, m) {
  return {
    slug,
    clinic: m.clinic,
    stats: m.stats ?? [],
    director: m.director ?? null,
    policies: m.policies ?? null,
    signature: m.signature ?? null,
    jobs: m.jobs ?? [],
    voices: m.voices ?? [],
    support: m.support ?? null,
    flowSteps: m.flowSteps ?? [],
    tourDetail: m.tourDetail ?? null,
    hasTour: Boolean(m.tourDetail),
    faqs: m.faqs ?? [],
    chatScript: m.chatScript ?? null,
  };
}

export const CLINICS = {
  adeb: toBundle('adeb', adeb),
  luna: toBundle('luna', luna),
};

export const CLINIC_SLUGS = Object.keys(CLINICS);

export function getClinicBundle(slug) {
  return CLINICS[slug] || null;
}
