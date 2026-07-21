import Link from 'next/link';
import RecruitLayout, { Photo } from '../../../components/recruit/RecruitLayout';
import { useRecruitChat, ChatIcon } from '../../../components/recruit/ChatWidget';
import { useClinic } from '../../../lib/recruit/clinic-context';
import { CLINIC_SLUGS, getClinicBundle } from '../../../lib/recruit/clinics';

function FlowBody() {
  const { clinic, flowSteps, tourDetail, hasTour, slug } = useClinic();
  const { openChat } = useRecruitChat();
  const base = `/recruit/${slug}`;
  const pageTitle = hasTour ? '見学・応募の流れ' : '応募の流れ';
  return (
    <>
      <section className="max-w-3xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-12">
        <nav className="mb-6" aria-label="パンくず">
          <Link href={base} className="inline-flex items-center gap-1.5 text-[15px] font-bold text-rc-teal hover:text-rc-teal-dark transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" /></svg>
            採用トップへ戻る
          </Link>
          <span className="text-[14px] text-rc-ink-soft ml-3">／ {pageTitle}</span>
        </nav>
        <h1 className="rc-mincho text-3xl md:text-4xl font-semibold">{pageTitle}</h1>
        <p className="text-[17px] leading-8 text-rc-ink-soft mt-4">
          {hasTour
            ? '応募より先に、まず職場を見てほしいと考えています。見学は選考ではありません——評価もメモも取りません。入職まで最短2週間です。'
            : '応募はフォーム1分・お電話でもOK。面接では条件をすべて明示し、院内のご案内も行います。ミスマッチをなくすための場だと考えてください。'}
        </p>

        <ol className="mt-10 space-y-4">
          {flowSteps.map(s => (
            <li key={s.step} className={`rounded-xl border p-6 ${s.chat ? 'bg-rc-teal-soft border-rc-teal/40' : 'bg-white border-rc-sand'}`}>
              <div className="flex items-baseline gap-3">
                <span className={`text-[13px] tracking-[0.2em] font-bold ${s.chat ? 'text-rc-teal' : 'text-rc-ink-soft'}`}>{s.step}</span>
                <h2 className="font-bold text-[17px]">{s.title}</h2>
              </div>
              <p className="text-[16px] text-rc-ink-soft leading-7 mt-2">{s.text}</p>
              {s.chat && !clinic.chatWidget && (
                <button onClick={() => openChat()}
                  className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal">
                  <ChatIcon className="w-4 h-4" /> いまチャットで相談する
                </button>
              )}
            </li>
          ))}
        </ol>
      </section>

      {hasTour && (
        <section className="bg-white border-y border-rc-sand">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
            <h2 className="rc-mincho text-2xl font-semibold">見学当日の流れ</h2>
            <p className="text-[15px] text-rc-ink-soft mt-2">私服OK・手ぶらでどうぞ（見学は選考ではありません）。</p>
            <div className="grid md:grid-cols-[1fr_240px] gap-8 mt-8 items-start">
              <ol className="relative border-l-2 border-rc-teal-soft ml-3 space-y-6">
                {tourDetail.map(d => (
                  <li key={d.time} className="pl-6 relative">
                    <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-rc-teal" aria-hidden="true" />
                    <div className="text-[14px] font-bold text-rc-teal" style={{ fontVariantNumeric: 'tabular-nums' }}>{d.time}〜</div>
                    <h3 className="font-bold text-[17px] mt-0.5">{d.title}</h3>
                    <p className="text-[15px] text-rc-ink-soft leading-6 mt-1">{d.text}</p>
                  </li>
                ))}
              </ol>
              <Photo label="院内見学の様子" scene="clinic" ratio="aspect-[3/4]" />
            </div>
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <p className="rc-mincho text-xl text-rc-teal-dark">
          {hasTour ? '見学だけで終わっても、まったく問題ありません。' : '聞くだけで終わっても、まったく問題ありません。'}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href={hasTour ? `${base}/entry?mode=tour` : `${base}/entry`}
            className="bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
            {hasTour ? '見学を予約する' : '応募する（1分）'}
          </Link>
          {!clinic.chatWidget && (
            <button onClick={() => openChat()}
              className="inline-flex items-center gap-2 border-2 border-rc-teal text-rc-teal font-bold text-[16px] rounded-full px-6 py-3 hover:bg-rc-teal-soft transition-colors">
              <ChatIcon className="w-4 h-4" />
              {hasTour ? '日程をチャットで相談' : 'まずチャットで相談'}
            </button>
          )}
        </div>
      </section>
    </>
  );
}

export function getStaticPaths() {
  return { paths: CLINIC_SLUGS.map(clinic => ({ params: { clinic } })), fallback: false };
}

export function getStaticProps({ params }) {
  const bundle = getClinicBundle(params.clinic);
  if (!bundle) return { notFound: true };
  return { props: { bundle } };
}

export default function FlowPage({ bundle }) {
  const pageTitle = bundle.hasTour ? '見学・応募の流れ' : '応募の流れ';
  return (
    <RecruitLayout bundle={bundle} title={pageTitle} description="応募前の見学もOK。応募〜面接〜入職の流れをご案内します。">
      <FlowBody />
    </RecruitLayout>
  );
}
