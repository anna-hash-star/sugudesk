import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RecruitLayout, { Photo, hasTour } from '../../../components/recruit/RecruitLayout';
import { useRecruitChat, ChatIcon } from '../../../components/recruit/ChatWidget';
import { Reveal } from '../../../components/recruit/Reveal';
import { clinic, jobs, voices } from '../../../lib/recruit/site-data';

// Google しごと検索（Google for Jobs）向けの JobPosting 構造化データ。
// 採用サイト単体でも「職種名＋地域」の検索結果に求人枠で露出できる集客施策。
function buildJobPostingJsonLd(job) {
  const typeMap = { '常勤': 'FULL_TIME', '正社員': 'FULL_TIME', 'パート': 'PART_TIME' };
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: `${job.title}（${clinic.name}）`,
    description: `${job.catch} ${job.summary}`,
    datePosted: clinic.postedAt,
    employmentType: job.employmentTypes.map(e => typeMap[e.type] || 'OTHER'),
    hiringOrganization: {
      '@type': 'MedicalOrganization',
      name: clinic.name,
      sameAs: clinic.patientSiteUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', streetAddress: clinic.address, addressCountry: 'JP' },
    },
    directApplyEnabled: true,
  };
}

export function getStaticPaths() {
  return {
    paths: jobs.map(j => ({ params: { job: j.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const job = jobs.find(j => j.slug === params.job);
  return { props: { slug: job.slug } };
}

function JobCta({ job }) {
  const { openChat } = useRecruitChat();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href={`/recruit/entry?job=${job.slug}`}
        className="bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
        {job.pending ? `${job.title}の求人について問い合わせる` : `${job.title}に応募する`}
      </Link>
      {/* 職種コンテキストを引き継いでチャット起動 */}
      <button onClick={() => openChat(job.title)}
        className="inline-flex items-center gap-2 border-2 border-rc-teal text-rc-teal font-bold text-[16px] rounded-full px-6 py-3 hover:bg-rc-teal-soft transition-colors">
        <ChatIcon className="w-4 h-4" /> この職種について質問する
      </button>
    </div>
  );
}

export default function JobPage({ slug }) {
  const job = jobs.find(j => j.slug === slug);
  const voice = voices.find(v => v.id === job.voiceId);
  const [typeIndex, setTypeIndex] = useState(0);
  const employment = job.employmentTypes[typeIndex];

  return (
    <RecruitLayout title={`${job.title} 募集要項`} description={job.summary}>
      <Head>
        {job.employmentTypes.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingJsonLd(job)) }}
          />
        )}
      </Head>
      {/* 職種ヒーロー */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-10">
        <nav className="mb-6" aria-label="パンくず">
          <Link href="/recruit" className="inline-flex items-center gap-1.5 text-[15px] font-bold text-rc-teal hover:text-rc-teal-dark transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" /></svg>
            採用トップへ戻る
          </Link>
          <span className="text-[14px] text-rc-ink-soft ml-3">／ {job.title}</span>
        </nav>
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="rc-mincho text-3xl md:text-4xl font-semibold">{job.title}</h1>
              <div className="flex gap-1.5">
                {job.pending ? (
                  <span className="text-[13px] font-bold text-rc-ink-soft bg-rc-sand rounded px-2 py-1">求人準備中</span>
                ) : (
                  job.employmentTypes.map(e => (
                    <span key={e.type} className="text-[13px] font-bold text-rc-teal bg-rc-teal-soft rounded px-2 py-1">{e.type}</span>
                  ))
                )}
              </div>
            </div>
            <p className="rc-mincho text-xl md:text-[22px] text-rc-teal-dark mt-4 leading-relaxed">{job.catch}</p>
            <p className="text-[16px] leading-7 text-rc-ink-soft mt-4 max-w-xl">{job.summary}</p>
            <div className="mt-7">
              <JobCta job={job} />
            </div>
          </div>
          <Reveal delay={150}>
            <Photo label={`${job.title}の職場`} scene={job.scene} src={job.photo} ratio="aspect-[4/3]" className="shadow-lg shadow-rc-teal/10" />
          </Reveal>
        </div>
      </section>

      {/* 1日の流れ */}
      <section className="bg-white border-y border-rc-sand">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="rc-mincho text-2xl font-semibold mb-8">1日の流れ</h2>
          <ol className="relative border-l-2 border-rc-teal-soft ml-3 space-y-6">
            {job.day.map(d => (
              <li key={d.time} className="pl-6 relative">
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-rc-teal" aria-hidden="true" />
                <span className="text-[15px] font-bold text-rc-teal mr-3" style={{ fontVariantNumeric: 'tabular-nums' }}>{d.time}</span>
                <span className="text-[16px]">{d.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* この職種の先輩の声 */}
      {voice && (
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="rc-mincho text-2xl font-semibold mb-6">この職種の先輩</h2>
          <div className="rounded-2xl bg-white border border-rc-sand p-6 md:p-8 grid md:grid-cols-[160px_1fr] gap-6">
            <Photo label={voice.photoLabel} scene={voice.scene} src={voice.photo} ratio="aspect-square" />
            <div>
              <div className="text-[14px] text-rc-ink-soft">{voice.role}・{voice.years}</div>
              <p className="text-[16px] leading-7 mt-3">{voice.reason}</p>
              <p className="text-[15px] text-rc-ink-soft leading-relaxed mt-3">{voice.gap}</p>
            </div>
          </div>
        </section>
      )}

      {/* 募集要項：職安法の明示9項目（2024年4月改正対応）を内蔵 */}
      <section className="bg-white border-y border-rc-sand">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="rc-mincho text-2xl font-semibold">募集要項</h2>
            {job.employmentTypes.length > 1 && (
              <div className="flex rounded-full bg-rc-ivory border border-rc-sand p-1" role="tablist" aria-label="雇用形態">
                {job.employmentTypes.map((e, i) => (
                  <button
                    key={e.type}
                    role="tab"
                    aria-selected={typeIndex === i}
                    onClick={() => setTypeIndex(i)}
                    className={`text-[15px] font-bold rounded-full px-5 py-1.5 transition-colors ${
                      typeIndex === i ? 'bg-rc-teal text-white' : 'text-rc-ink-soft hover:text-rc-teal'
                    }`}
                  >
                    {e.type}
                  </button>
                ))}
              </div>
            )}
          </div>
          {employment ? (
            <>
              <table className="w-full text-[16px]">
                <tbody>
                  {Object.entries(employment.requirements).map(([k, v]) => (
                    <tr key={k} className="border-b border-rc-sand">
                      <th className="text-left align-top py-4 pr-4 w-32 md:w-40 font-bold text-rc-teal-dark text-[15px]">{k}</th>
                      <td className="py-4 leading-7 text-rc-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[13px] text-rc-ink-soft mt-4">
                ※ 記載の労働条件は職業安定法に基づく明示事項です。面接時に書面でも交付します。
              </p>
            </>
          ) : (
            <div className="rounded-xl bg-rc-teal-soft border border-rc-teal/30 p-6">
              <p className="text-[17px] font-bold text-rc-teal">募集要項は現在準備中です</p>
              <p className="text-[16px] leading-7 mt-2">{job.pendingNote}</p>
              {clinic.phone && (
                <p className="text-[16px] mt-3">
                  お問い合わせ：<a href={`tel:${clinic.phone}`} className="font-bold text-rc-teal" style={{ fontVariantNumeric: 'tabular-nums' }}>{clinic.phone}</a>（{clinic.recruitContact}）／チャット・フォームでも受け付けています。
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* クロージング */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <p className="rc-mincho text-xl text-rc-teal-dark mb-6">
          {hasTour ? '迷っているなら、見学からで大丈夫です。' : '迷っているなら、チャットで聞くだけでも大丈夫です。'}
        </p>
        <div className="flex justify-center">
          <JobCta job={job} />
        </div>
        <div className="mt-10">
          <Link href="/recruit" className="inline-flex items-center gap-1.5 text-[16px] font-bold text-rc-teal border-2 border-rc-teal rounded-full px-6 py-2.5 hover:bg-rc-teal-soft transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" /></svg>
            採用トップへ戻る
          </Link>
        </div>
      </section>
    </RecruitLayout>
  );
}
