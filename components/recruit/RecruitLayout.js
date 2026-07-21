import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { clinic, tourDetail } from '../../lib/recruit/site-data';

// 見学を実施しないクリニック（tourDetail が null）では見学系の導線・文言を出さない
export const hasTour = Boolean(tourDetail);
import { ChatProvider, useRecruitChat } from './ChatWidget';
import ChatWidgetLoader from './ChatWidgetLoader';
import Illust from './Illust';

// ビジュアル枠。src（実写パス）があれば写真を表示し、
// 画像が未配置・読み込み失敗のときは scene のイラストに自動フォールバックする。
// 実写は public/recruit-photos/ にデータ側（clinic.photos）のファイル名で置くだけ。
export function Photo({ label, scene, src, ratio = 'aspect-[4/3]', className = '' }) {
  const [imgOk, setImgOk] = useState(Boolean(src));
  return (
    <div
      className={`group/photo relative overflow-hidden rounded-xl bg-gradient-to-br from-rc-teal-soft via-rc-sand to-rc-ivory ${ratio} ${className}`}
      role="img"
      aria-label={label}
    >
      {/* イラストは実写が無い/読めないときだけ表示（実写が読めるときは重ねない＝ちらつき防止） */}
      {scene && !imgOk && (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover/photo:scale-[1.04]">
          <Illust scene={scene} />
        </div>
      )}
      {src && imgOk && (
        <img
          src={src}
          alt=""
          onError={() => setImgOk(false)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-[1.04]"
        />
      )}
      {imgOk ? null : (
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[13px] text-rc-teal-dark/70 font-medium bg-white/60 rounded-full px-2 py-0.5 backdrop-blur-sm">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <circle cx="12" cy="13" r="3.75" />
        </svg>
        {label}
      </div>
      )}
    </div>
  );
}

// AdeB正式ロゴ（クライアント提供のSVG）。読み込めない場合は簡易ワードマークにフォールバック。
function AdeBLogo() {
  const [logoOk, setLogoOk] = useState(true);
  if (!logoOk) {
    return (
      <span className="text-[21px] font-bold tracking-tight" style={{ color: '#E72459', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        AdeB Clinic
      </span>
    );
  }
  return (
    <img
      src="/recruit-photos/adeb-logo.svg"
      alt="AdeB Clinic"
      onError={() => setLogoOk(false)}
      className="h-9 md:h-12 w-auto"
    />
  );
}

function HeaderNav() {
  const { openChat } = useRecruitChat();
  const nav = [
    { label: '数字で見る', href: '/recruit#stats' },
    { label: '職種', href: '/recruit#jobs' },
    { label: 'スタッフの声', href: '/recruit#voice' },
    { label: hasTour ? '見学・応募の流れ' : '応募の流れ', href: '/recruit/flow' },
    { label: 'FAQ', href: '/recruit#faq' },
  ];
  return (
    <header className="sticky top-0 z-30 bg-rc-ivory/90 backdrop-blur border-b border-rc-sand">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 md:px-6 h-[4.5rem]">
        <Link href="/recruit" className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0">
          {clinic.logoMark === 'adeb' ? (
            <>
              <AdeBLogo />
              <span className="rc-mincho text-[15px] md:text-[22px] leading-none text-rc-ink whitespace-nowrap">
                {clinic.shortName}<span className="text-rc-teal">採用サイト</span>
              </span>
            </>
          ) : (
            <>
              <span className="rc-mincho text-lg font-semibold text-rc-teal-dark tracking-wide">{clinic.shortName}</span>
              <span className="text-[13px] tracking-[0.12em] text-rc-ink-soft font-medium mt-1">採用サイト</span>
            </>
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-5 ml-auto" aria-label="メイン">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className="text-[15px] text-rc-ink-soft hover:text-rc-teal transition-colors">
              {n.label}
            </Link>
          ))}
          {!clinic.chatWidget && (
            <button
              onClick={() => openChat()}
              className="text-[15px] font-bold text-rc-teal border border-rc-teal rounded-full px-4 py-1.5 hover:bg-rc-teal-soft transition-colors"
            >
              チャットで相談
            </button>
          )}
          <Link
            href="/recruit/entry"
            className="text-[15px] font-bold bg-rc-teal text-white rounded-full px-5 py-2 hover:bg-rc-teal-dark transition-colors shadow-sm"
          >
            応募する
          </Link>
        </nav>
        <Link
          href="/recruit/entry"
          className="md:hidden ml-auto shrink-0 text-[14px] font-bold bg-rc-teal text-white rounded-full px-3.5 py-2 whitespace-nowrap"
        >
          応募する
        </Link>
      </div>
    </header>
  );
}

function StickyBar() {
  const { openChat } = useRecruitChat();
  return (
    <div className={`md:hidden fixed bottom-0 inset-x-0 z-30 grid gap-px bg-rc-sand border-t border-rc-sand ${clinic.chatWidget ? 'grid-cols-1' : 'grid-cols-2'}`} role="navigation" aria-label="応募・相談">
      <Link href="/recruit/entry" className="bg-rc-teal text-white text-center text-[16px] font-bold py-4 active:bg-rc-teal-dark">
        応募する
      </Link>
      {!clinic.chatWidget && (
        <button onClick={() => openChat()} className="bg-white text-rc-teal text-center text-[16px] font-bold py-4 active:bg-rc-teal-soft">
          チャットで相談
        </button>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-rc-teal-dark text-white/90 mt-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pb-28 md:pb-12">
        <div className="rc-mincho text-lg">{clinic.name}</div>
        <p className="text-[16px] text-white/60 mt-2">{clinic.address}／{clinic.station}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-[15px]">
          <Link href="/recruit/flow" className="hover:text-white">{hasTour ? '見学・応募の流れ' : '応募の流れ'}</Link>
          <Link href="/recruit/entry" className="hover:text-white">エントリー</Link>
          <a href={clinic.patientSiteUrl} className="hover:text-white">患者さま向けサイト</a>
        </div>
      </div>
    </footer>
  );
}

export default function RecruitLayout({ children, title, description }) {
  const pageTitle = title ? `${title}｜${clinic.shortName} 採用サイト` : `${clinic.shortName} 採用サイト｜${clinic.tagline}`;
  return (
    <div className={clinic.themeClass || undefined}>
      <ChatProvider>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={description || clinic.lead} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* 採用サイト専用ファビコン（クライアント提供のAdeB正式ロゴ・透過PNG）。
              SuguDesk本体の favicon.png を同じ key で上書きする。
              clinic.favicon を設定すればクリニックごとに差し替え可能。 */}
          <link rel="icon" type="image/png" href={clinic.favicon || '/recruit-photos/adeb-favicon.png'} key="favicon" />
          <link rel="apple-touch-icon" href={clinic.favicon || '/recruit-photos/adeb-favicon.png'} />
          {/* OGP：求人媒体・SNS・LINEでシェアされたときの見え方（og:imageは実写撮影後に追加） */}
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={description || clinic.lead} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={`${clinic.shortName} 採用サイト`} />
          <meta name="twitter:card" content="summary" />
        </Head>
        <div className="min-h-screen bg-rc-ivory text-rc-ink antialiased">
          <HeaderNav />
          <main>{children}</main>
          <Footer />
          <StickyBar />
        </div>
        <ChatWidgetLoader />
      </ChatProvider>
    </div>
  );
}
