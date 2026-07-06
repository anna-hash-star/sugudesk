import Link from 'next/link';
import RecruitLayout, { Photo } from '../../components/recruit/RecruitLayout';
import { useRecruitChat } from '../../components/recruit/ChatWidget';
import { flowSteps, tourDetail } from '../../lib/recruit/site-data';

export default function FlowPage() {
  const { openChat } = useRecruitChat();
  return (
    <RecruitLayout title="見学・応募の流れ" description="見学は30分・私服OK・履歴書不要。入職まで最短2週間の流れをご案内します。">
      <section className="max-w-3xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-12">
        <nav className="text-[12px] text-rc-ink-soft mb-6" aria-label="パンくず">
          <Link href="/recruit" className="hover:text-rc-teal">採用トップ</Link>
          <span className="mx-2">/</span>
          <span>見学・応募の流れ</span>
        </nav>
        <h1 className="rc-mincho text-3xl md:text-4xl font-semibold">見学・応募の流れ</h1>
        <p className="text-[15px] leading-8 text-rc-ink-soft mt-4">
          応募より先に、まず職場を見てほしいと考えています。見学は選考ではありません——評価もメモも取りません。入職まで最短2週間です。
        </p>

        <ol className="mt-10 space-y-4">
          {flowSteps.map(s => (
            <li key={s.step} className={`rounded-xl border p-6 ${s.chat ? 'bg-rc-teal-soft border-rc-teal/40' : 'bg-white border-rc-sand'}`}>
              <div className="flex items-baseline gap-3">
                <span className={`text-[11px] tracking-[0.2em] font-bold ${s.chat ? 'text-rc-teal' : 'text-rc-ink-soft'}`}>{s.step}</span>
                <h2 className="font-bold text-[16px]">{s.title}</h2>
              </div>
              <p className="text-[14px] text-rc-ink-soft leading-7 mt-2">{s.text}</p>
              {s.chat && (
                <button onClick={() => openChat()}
                  className="mt-3 text-[13px] font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal">
                  💬 いまチャットで相談する
                </button>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white border-y border-rc-sand">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="rc-mincho text-2xl font-semibold">見学当日の30分</h2>
          <p className="text-[13px] text-rc-ink-soft mt-2">私服OK・履歴書不要・手ぶらでどうぞ。</p>
          <div className="grid md:grid-cols-[1fr_240px] gap-8 mt-8 items-start">
            <ol className="relative border-l-2 border-rc-teal-soft ml-3 space-y-6">
              {tourDetail.map(d => (
                <li key={d.time} className="pl-6 relative">
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-rc-teal" aria-hidden="true" />
                  <div className="text-[12px] font-bold text-rc-teal" style={{ fontVariantNumeric: 'tabular-nums' }}>{d.time}〜</div>
                  <h3 className="font-bold text-[15px] mt-0.5">{d.title}</h3>
                  <p className="text-[13px] text-rc-ink-soft leading-6 mt-1">{d.text}</p>
                </li>
              ))}
            </ol>
            <Photo label="院内見学の様子" ratio="aspect-[3/4]" />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <p className="rc-mincho text-xl text-rc-teal-dark">見学だけで終わっても、まったく問題ありません。</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/recruit/entry?mode=tour"
            className="bg-rc-teal text-white font-bold text-[15px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
            見学を予約する
          </Link>
          <button onClick={() => openChat()}
            className="border-2 border-rc-teal text-rc-teal font-bold text-[14px] rounded-full px-6 py-3 hover:bg-rc-teal-soft transition-colors">
            💬 日程をチャットで相談
          </button>
        </div>
      </section>
    </RecruitLayout>
  );
}
