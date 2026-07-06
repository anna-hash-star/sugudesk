import Head from 'next/head';
import Link from 'next/link';
import { clinic } from '../../lib/recruit/site-data';
import { ChatProvider, useRecruitChat } from './ChatWidget';

// 実写写真の差し替え前提プレースホルダー。
// 本番では <img> / next/image に置き換える（素材写真は使わず必ず院内で撮影する）。
export function Photo({ label, ratio = 'aspect-[4/3]', className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-rc-teal-soft via-rc-sand to-rc-ivory ${ratio} ${className}`}
      role="img"
      aria-label={`写真プレースホルダー：${label}`}
    >
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0F6E63 0 1px, transparent 1px 12px)' }} />
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] text-rc-teal-dark/70 font-medium">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <circle cx="12" cy="13" r="3.75" />
        </svg>
        {label}
      </div>
    </div>
  );
}

function HeaderNav() {
  const { openChat } = useRecruitChat();
  const nav = [
    { label: '数字で見る', href: '/recruit#stats' },
    { label: '職種', href: '/recruit#jobs' },
    { label: 'スタッフの声', href: '/recruit#voice' },
    { label: '見学・応募の流れ', href: '/recruit/flow' },
    { label: 'FAQ', href: '/recruit#faq' },
  ];
  return (
    <header className="sticky top-0 z-30 bg-rc-ivory/90 backdrop-blur border-b border-rc-sand">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 md:px-6 h-16">
        <Link href="/recruit" className="flex items-baseline gap-2 shrink-0">
          <span className="rc-mincho text-lg font-semibold text-rc-teal-dark tracking-wide">{clinic.shortName}</span>
          <span className="text-[10px] tracking-[0.2em] text-rc-ink-soft font-medium">RECRUIT</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 ml-auto" aria-label="メイン">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className="text-[13px] text-rc-ink-soft hover:text-rc-teal transition-colors">
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => openChat()}
            className="text-[13px] font-bold text-rc-teal border border-rc-teal rounded-full px-4 py-1.5 hover:bg-rc-teal-soft transition-colors"
          >
            チャットで相談
          </button>
          <Link
            href="/recruit/entry"
            className="text-[13px] font-bold bg-rc-teal text-white rounded-full px-5 py-2 hover:bg-rc-teal-dark transition-colors shadow-sm"
          >
            応募する
          </Link>
        </nav>
        <Link
          href="/recruit/entry"
          className="md:hidden ml-auto text-[13px] font-bold bg-rc-teal text-white rounded-full px-4 py-2"
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
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-2 gap-px bg-rc-sand border-t border-rc-sand" role="navigation" aria-label="応募・相談">
      <Link href="/recruit/entry" className="bg-rc-teal text-white text-center text-sm font-bold py-4 active:bg-rc-teal-dark">
        応募する
      </Link>
      <button onClick={() => openChat()} className="bg-white text-rc-teal text-center text-sm font-bold py-4 active:bg-rc-teal-soft">
        チャットで相談
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-rc-teal-dark text-white/90 mt-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pb-28 md:pb-12">
        <div className="rc-mincho text-lg">{clinic.name}</div>
        <p className="text-sm text-white/60 mt-2">{clinic.address}／{clinic.station}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-[13px]">
          <Link href="/recruit/flow" className="hover:text-white">見学・応募の流れ</Link>
          <Link href="/recruit/entry" className="hover:text-white">エントリー</Link>
          <a href={clinic.patientSiteUrl} className="hover:text-white">患者さま向けサイト</a>
        </div>
        <p className="text-[11px] text-white/40 mt-8">{clinic.corporation}（採用に関する情報は本サイトに集約しています）</p>
      </div>
    </footer>
  );
}

export default function RecruitLayout({ children, title, description }) {
  const pageTitle = title ? `${title}｜${clinic.shortName} 採用サイト` : `${clinic.shortName} 採用サイト｜${clinic.tagline}`;
  return (
    <ChatProvider>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || clinic.lead} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-rc-ivory text-rc-ink antialiased">
        <HeaderNav />
        <main>{children}</main>
        <Footer />
        <StickyBar />
      </div>
    </ChatProvider>
  );
}
