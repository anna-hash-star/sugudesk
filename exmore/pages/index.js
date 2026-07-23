import Head from 'next/head';

// ⚠️ このページは「たたき台」です。
// 〔要差し替え〕と書かれた箇所は、現在の exmore.jp の実際の文言・写真に置き換えてください。
// テキストは下の data オブジェクトをまとめて編集すればOKです。

const site = {
  title: 'exmore（エクスモア）',
  tagline: 'Healthcare Design for Future Choices',
  lead: '医療・ヘルスケアの現場を、テクノロジーとデザインで支える。',
  nav: [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#company', label: 'Company' },
    { href: '#contact', label: 'Contact' },
  ],
  about: {
    heading: '未来の選択肢を、デザインする。',
    body: [
      '〔要差し替え〕exmore は、医療・ヘルスケア領域の課題をテクノロジーとデザインの力で解決するスタートアップです。',
      '〔要差し替え〕現場のオペレーションから患者・利用者の体験まで、「より良い選択」ができる仕組みをつくります。',
    ],
  },
  services: [
    {
      title: 'SuguDesk',
      desc: '〔要差し替え〕クリニック向けのAI受付・チャット対応サービス。患者からの問い合わせを自動で対応し、スタッフの負担を軽減します。',
    },
    {
      title: '医療採用ブースター',
      desc: '〔要差し替え〕医療機関の採用を支援するサービス。求人・応募対応を効率化し、採用のミスマッチを減らします。',
    },
    {
      title: 'デザイン / 開発',
      desc: '〔要差し替え〕ヘルスケア領域に特化したWeb・プロダクトのデザインと開発を行います。',
    },
  ],
  company: [
    ['会社名', '〔要差し替え〕株式会社exmore'],
    ['所在地', '〔要差し替え〕東京都◯◯区◯◯ 0-0-0'],
    ['設立', '〔要差し替え〕20XX年X月'],
    ['代表者', '〔要差し替え〕代表取締役 ◯◯ ◯◯'],
    ['事業内容', '〔要差し替え〕ヘルスケア領域のプロダクト開発・デザイン'],
  ],
  contact: {
    heading: 'お問い合わせ',
    body: '〔要差し替え〕ご相談・お問い合わせはこちらから。',
    email: 'info@exmore.jp',
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${site.title}｜${site.tagline}`}</title>
        <meta name="description" content={site.lead} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
        <meta property="og:title" content={site.title} />
        <meta property="og:description" content={site.lead} />
        <meta property="og:type" content="website" />
      </Head>

      <header className="header">
        <div className="container header__inner">
          <a href="#top" className="logo">exmore</a>
          <nav className="nav">
            {site.nav.map((n) => (
              <a key={n.href} href={n.href}>{n.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <p className="hero__eyebrow">{site.tagline}</p>
            <h1 className="hero__title">{site.lead}</h1>
            <p className="hero__sub">
              〔要差し替え〕私たちは、医療・ヘルスケアの「これから」を、
              使う人にやさしいデザインとテクノロジーでつくります。
            </p>
            <a href="#contact" className="btn">お問い合わせ</a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section">
          <div className="container">
            <span className="section__label">About</span>
            <h2 className="section__title">{site.about.heading}</h2>
            {site.about.body.map((p, i) => (
              <p key={i} className="section__text">{p}</p>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section section--tint">
          <div className="container">
            <span className="section__label">Services</span>
            <h2 className="section__title">事業・サービス</h2>
            <div className="cards">
              {site.services.map((s) => (
                <div key={s.title} className="card">
                  <h3 className="card__title">{s.title}</h3>
                  <p className="card__text">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company */}
        <section id="company" className="section">
          <div className="container">
            <span className="section__label">Company</span>
            <h2 className="section__title">会社概要</h2>
            <table className="table">
              <tbody>
                {site.company.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section section--dark">
          <div className="container">
            <span className="section__label section__label--light">Contact</span>
            <h2 className="section__title">{site.contact.heading}</h2>
            <p className="section__text">{site.contact.body}</p>
            <a href={`mailto:${site.contact.email}`} className="btn btn--light">
              {site.contact.email}
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span className="logo">exmore</span>
          <p>© {new Date().getFullYear()} exmore. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
