import Head from 'next/head';
import { useEffect, useState } from 'react';

/* =========================================================================
   コンテンツはこの data にまとまっています。文言・会社情報・ニュースは
   ここを編集すれば反映されます（現 exmore.jp の内容を反映済み）。
   ========================================================================= */
const NAV = [
  { href: '#about', label: '私たちについて' },
  { href: '#services', label: '事業内容' },
  { href: '#news', label: 'ニュース' },
  { href: '#company', label: '会社情報' },
  { href: '#careers', label: '採用情報' },
];

const NEWS = [
  { date: '2026.07.07', cat: 'お知らせ', title: 'シードラウンドにて資金調達を実施しました', href: 'https://prtimes.jp/main/html/rd/p/000000005.000157081.html' },
  { date: '2026.05.23', cat: '導入事例', title: '【エバラ食品さま】多様な社員に寄り添う、オーダーメイド型のヘルスケア研修を導入', href: '#news' },
  { date: '2025.11.03', cat: '受賞', title: '「病院経営イノベーションピッチ」にてPoC賞を受賞しました', href: '#news' },
];

export default function Home() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    // IntersectionObserver 非対応時は全表示にフォールバック
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>株式会社exmore｜Healthcare Design for Future Choices</title>
        <meta name="description" content="誰もが安心して医療にアクセスできる社会をつくる。exmoreは医療・ヘルスケアの課題を、テクノロジーと当事者視点で解決する医療DXスタートアップです。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
        <meta property="og:title" content="株式会社exmore" />
        <meta property="og:description" content="誰もが安心して医療にアクセスできる社会をつくる。" />
        <meta property="og:type" content="website" />
      </Head>

      {/* ---------- Header ---------- */}
      <header className="header">
        <div className="container header__inner">
          <a href="#top" className="brand" onClick={() => setOpen(false)}>
            <span className="brand__mark" />exmore
          </a>
          <nav className={`nav ${open ? 'open' : ''}`}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
            ))}
            <a href="#contact" className="nav__cta" onClick={() => setOpen(false)}>お問い合わせ</a>
          </nav>
          <button className="nav-toggle" aria-label="メニュー" onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="hero">
          <span className="hero__blob hero__blob--1" />
          <span className="hero__blob hero__blob--2" />
          <div className="container hero__grid">
            <div>
              <p className="hero__eyebrow">Healthcare Design for Future Choices</p>
              <h1 className="hero__title">
                誰もが安心して<br />
                <span className="accent">医療にアクセスできる</span><br />
                社会をつくる。
              </h1>
              <p className="hero__lead">
                不妊治療の経験から生まれた、ヘルスケアの仕組みづくり。
                わたしたちは医療機関・地域社会と連携し、一人ひとりが将来まで
                希望を抱ける世界を目指します。
              </p>
              <div className="hero__actions">
                <a href="#about" className="btn btn--primary">私たちについて <span className="btn__arrow">→</span></a>
                <a href="#services" className="btn btn--ghost">事業を見る</a>
              </div>
            </div>

            {/* SuguDesk を象徴するチャットカード */}
            <div className="hero__visual">
              <div className="hero__card reveal">
                <h3>SuguDesk｜AI FAQチャット</h3>
                <p>クリニックの問い合わせを24時間サポート</p>
                <div className="chatline"><span className="dot" /><span className="bubble">診療時間を教えてください</span></div>
                <div className="chatline me"><span className="bubble">平日 9:00〜18:30／土曜 9:00〜13:00 です。</span></div>
                <div className="chatline"><span className="dot" /><span className="bubble">初診で必要な持ち物は？</span></div>
                <div className="chatline me"><span className="bubble">保険証・マイナンバーカードをお持ちください。</span></div>
                <div className="hero__stats">
                  <div className="hero__stat"><b>24h</b><span>自動対応</span></div>
                  <div className="hero__stat"><b>受付</b><span>業務効率化</span></div>
                  <div className="hero__stat"><b>安心</b><span>患者体験</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- What we do ---------- */}
        <section id="about" className="section">
          <div className="container">
            <p className="eyebrow">What we do</p>
            <h2 className="h2">「知る」「向き合う」「選ぶ」を、<br />テクノロジーで支える。</h2>
            <p className="lede">
              医療と仕事、からだとこころ、キャリアとライフイベント。本来つながっているべきものが
              分断され、知る機会や選択肢に気づけないまま時間だけが過ぎていく——。
              だからこそ私たちは、仕組みとテクノロジーで、誰もが安心して医療にアクセスできる社会をつくります。
            </p>
            <div className="pillars">
              <div className="pillar reveal">
                <div className="pillar__ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v18M3 12h18"/></svg></div>
                <h3>知る</h3>
                <p>正しい医療情報とヘルスリテラシーを、必要な人へ届く形で提供します。</p>
              </div>
              <div className="pillar reveal">
                <div className="pillar__ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0zM12 8v4l3 2"/></svg></div>
                <h3>向き合う</h3>
                <p>医療機関のノンコア業務を効率化し、患者と向き合う時間を取り戻します。</p>
              </div>
              <div className="pillar reveal">
                <div className="pillar__ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg></div>
                <h3>選ぶ</h3>
                <p>当事者視点から、一人ひとりが将来を前向きに選択できる仕組みをつくります。</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="section section--soft">
          <div className="container">
            <p className="eyebrow">Services</p>
            <h2 className="h2">事業内容</h2>
            <p className="lede">医療DXと人材育成の両面から、ヘルスケアの課題を解決します。</p>

            <div className="service reveal">
              <div>
                <span className="service__tag">医療機関向け DX</span>
                <h3>SuguDesk</h3>
                <p>
                  医療機関向けのAI FAQチャット。診療時間・料金の目安・アクセスなど、患者さまからの
                  問い合わせに24時間自動で回答します。患者さまの不安・疑問を解消しながら、
                  受付・窓口業務の負担を軽減し、患者体験の向上を実現します。
                </p>
                <a href="#contact" className="btn btn--primary">サービスの詳細 <span className="btn__arrow">→</span></a>
              </div>
              <div className="service__media"><h4>SuguDesk<br />AI FAQ Chat</h4></div>
            </div>

            <div className="service reveal">
              <div>
                <span className="service__tag">法人向け 研修</span>
                <h3>ヘルスケアリテラシー研修</h3>
                <p>
                  従業員の「知る・鍛える・支える」をヘルスケアの視点から支援。企業ごとに設計する
                  オーダーメイド型の研修で、生理・妊活・不妊治療・female領域などをテーマに、
                  一人ひとりが自分らしく働き続けられる組織づくりを支えます。
                </p>
                <a href="#contact" className="btn btn--ghost">お問い合わせ</a>
              </div>
              <div className="service__media service__media--soft"><h4>Healthcare<br />Literacy Program</h4></div>
            </div>
          </div>
        </section>

        {/* ---------- Founder message ---------- */}
        <section className="section">
          <div className="container">
            <p className="eyebrow">Message</p>
            <h2 className="h2">「もっと早く知っていたら」を、<br />なくしたい。</h2>
            <div className="founder">
              <div className="founder__photo reveal">
                <img src="/ceo.jpg" alt="代表取締役 CEO 根来 杏奈" width="1000" height="1200" />
              </div>
              <div className="founder__body reveal">
                <p>
                  「もっと早く知っていたら」「時間を巻き戻せたら」——人生の中で、そう感じる瞬間は
                  きっと誰にでもあると思います。私にとってそれは、自分に不妊治療が必要だと知った日でした。
                </p>
                <p>
                  からだのこと、キャリア、家族、将来の選択。本来つながっているべきものが分断され、
                  知る機会や選択肢に気づけないまま時間だけが過ぎていく。「医療・ヘルスケア」という
                  テーマは、それが特に顕著だと感じています。
                </p>
                <p>
                  だからこそ、わたしたちは「知る」「向き合う」「選ぶ」を支える仕組みを、
                  テクノロジーと当事者視点からつくっています。からだと未来、医療と日常、ライフとキャリア。
                  すべてが繋がり、誰もが安心して生活できる社会をめざします。
                </p>
                <div className="founder__sign">
                  <b>代表取締役 CEO　根来 杏奈</b>
                  <small>
                    大手総合人材会社、SHIFT、STORESにてBtoB営業・営業企画・人材育成・営業マネージャーを経験。
                    自身のPCOS、夫の男性不妊という不妊治療の経験を通じ、ヘルスケア・医療にまつわる
                    社会課題の解決を決意し起業。
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- News ---------- */}
        <section id="news" className="section section--soft">
          <div className="container">
            <p className="eyebrow">News</p>
            <h2 className="h2">ニュース</h2>
            <div className="news">
              {NEWS.map((n) => (
                <a key={n.title} className="news__item" href={n.href} target={n.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <span className="news__date">{n.date}</span>
                  <span className="news__cat">{n.cat}</span>
                  <span className="news__title">{n.title}</span>
                  <span className="news__arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Company ---------- */}
        <section id="company" className="section">
          <div className="container">
            <p className="eyebrow">Company</p>
            <h2 className="h2">会社概要</h2>
            <table className="table">
              <tbody>
                <tr><th>会社名</th><td>株式会社exmore</td></tr>
                <tr><th>設立</th><td>2024年12月13日</td></tr>
                <tr><th>所在地</th><td>東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル 2F-C</td></tr>
                <tr><th>代表者</th><td>代表取締役 CEO　根来 杏奈</td></tr>
                <tr><th>資本金等</th><td>約3,100万円（資本準備金を含む）</td></tr>
                <tr><th>事業内容</th><td>医療DXサービス、教育・研修サービス、その他コンサルティング</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="section section--dark">
          <div className="container">
            <p className="eyebrow eyebrow--light">Contact</p>
            <h2 className="h2">お問い合わせ</h2>
            <div className="contact__grid">
              <div>
                <p className="lede">
                  サービス導入・研修・取材など、お気軽にお問い合わせください。
                </p>
                <p className="contact__note">
                  ご返信に3営業日ほどお時間をいただいております。3営業日を過ぎても返信がない場合は、
                  お手数ですが再度お問い合わせをお願いいたします。
                </p>
              </div>
              {/* ⚠️ 送信先バックエンドは未接続。README の「フォーム送信」を参照 */}
              <form className="form" onSubmit={(e) => { e.preventDefault(); alert('送信機能は接続待ちです（README参照）'); }}>
                <div className="field"><label>会社名<span className="req">*</span></label><input required placeholder="株式会社●●" /></div>
                <div className="field"><label>お名前<span className="req">*</span></label><input required placeholder="山田 太郎" /></div>
                <div className="field"><label>メールアドレス<span className="req">*</span></label><input type="email" required placeholder="xxx@example.com" /></div>
                <div className="field"><label>電話番号</label><input placeholder="000-0000-0000" /></div>
                <div className="field"><label>お問い合わせ内容<span className="req">*</span></label><textarea required placeholder="詳しい内容をご記入ください" /></div>
                <label className="form__agree"><input type="checkbox" required /> プライバシーポリシーに同意して送信する</label>
                <button className="btn btn--primary form__submit" type="submit">この内容で送信する →</button>
              </form>
            </div>
          </div>
        </section>

        {/* ---------- CTA cards ---------- */}
        <section className="section">
          <div className="container ctacards">
            <a className="ctacard" href="#contact">
              <span><b>CONTACT</b><span>お問い合わせはこちらから</span></span>
              <span className="arw">→</span>
            </a>
            <a className="ctacard" href="#careers">
              <span><b>CAREERS</b><span>採用情報はこちら</span></span>
              <span className="arw">→</span>
            </a>
          </div>
        </section>
      </main>

      {/* ---------- Careers anchor + Footer ---------- */}
      <footer id="careers" className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <span className="brand brand--light"><span className="brand__mark" />exmore</span>
              <p style={{ maxWidth: 320, marginTop: 14, fontSize: 13.5 }}>
                誰もが安心して医療にアクセスできる社会をつくる。このビジョンに共感いただける
                メンバーを募集しています。
              </p>
            </div>
            <nav className="footer__nav">
              {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
              <a href="#contact">お問い合わせ</a>
            </nav>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} exmore, Inc. All rights reserved.</span>
            <span>Healthcare Design for Future Choices</span>
          </div>
        </div>
      </footer>
    </>
  );
}
