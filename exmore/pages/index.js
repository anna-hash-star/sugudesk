import Layout from '../components/Layout';
import Seo from '../components/Seo';
import { COMPANY, CAREERS_URL } from '../data/site';
import { NEWS_SORTED } from '../data/news';

export default function Home() {
  return (
    <Layout>
      <Seo
        title="株式会社exmore（エクスモア）｜Healthcare Design for Future Choices"
        description="株式会社exmore（エクスモア）は、医療・ヘルスケアの課題をテクノロジーと当事者視点で解決する医療DXスタートアップです。誰もが安心して医療にアクセスできる社会をつくります。"
        path="/"
      />

      {/* ---------- Hero（コンセプチュアル / 動的）---------- */}
      <section className="hero" id="top">
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__ring" /><span className="hero__ring" /><span className="hero__ring" />
          <span className="hero__orb hero__orb--1" />
          <span className="hero__orb hero__orb--2" />
          <span className="hero__orb hero__orb--3" />
          <span className="hero__grain" />
        </div>
        <div className="container hero__inner">
          <p className="hero__eyebrow">Healthcare Design for Future Choices</p>
          <h1 className="hero__title">
            誰もが安心して<span className="accent">医療にアクセスできる</span>社会をつくる。
          </h1>
          <p className="hero__lead">
            医療は、人と人のいとなみ。その大切な時間を守りながら、
            テクノロジーで新しい可能性を広げ、誰もが安心して
            医療にアクセスできる社会をつくります。
          </p>
          <div className="hero__actions">
            <a href="#about" className="btn btn--primary">私たちについて <span className="btn__arrow">→</span></a>
            <a href="#services" className="btn btn--ghost">事業を見る</a>
          </div>
        </div>
      </section>

      {/* ---------- What we do ---------- */}
      <section id="about" className="section">
        <div className="container">
          <p className="eyebrow">What we do</p>
          <h2 className="h2">人を、医療の真ん中に。</h2>
          <p className="lede">
            医療の現場には、人にしかできないことがたくさんあります。だからこそ私たちは、
            テクノロジーを活かして現場に余白を生み、医療者が人と向き合う時間を増やしていく。
            その積み重ねが、誰もが安心して医療にアクセスできる社会につながると信じています。
          </p>
          <div className="pillars">
            <div className="pillar reveal">
              <div className="pillar__ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"/></svg></div>
              <h3>人を、まんなかに</h3>
              <p>医療は人と人のいとなみ。向き合う時間を、何よりも大切にします。</p>
            </div>
            <div className="pillar reveal">
              <div className="pillar__ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v18M3 12h18"/></svg></div>
              <h3>テクノロジーで、余白を</h3>
              <p>現場の負担をテクノロジーで軽くし、本来の仕事に集中できる環境をつくります。</p>
            </div>
            <div className="pillar reveal">
              <div className="pillar__ic"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg></div>
              <h3>誰もが、選べる</h3>
              <p>情報や環境の差をこえて、一人ひとりが安心して知り、選べる状態へ。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="section section--soft">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h2 className="h2">事業内容</h2>
          <p className="lede">
            テクノロジーと人の力で、医療の現場と、はたらく人の健康を支えます。
            医療機関の課題に合わせた幅広い取り組みを行っています。
          </p>

          <div className="service reveal">
            <div>
              <span className="service__tag">医療機関向け AI</span>
              <h3>SuguDesk</h3>
              <p>
                医療機関向けのAI FAQチャット。診療時間・料金の目安・アクセスなど、患者さまからの
                問い合わせに24時間自動で回答します。患者さまの不安・疑問を解消しながら、
                受付・窓口業務の負担を軽減し、患者体験の向上を実現します。
              </p>
              <a href="https://www.sugudesk.com/" target="_blank" rel="noopener noreferrer" className="btn btn--primary">サービスサイトを見る <span className="btn__arrow">→</span></a>
            </div>
            <div className="service__media service__media--img">
              <img src="/solution-ai.jpg" alt="SuguDesk：医療機関向けAI FAQチャットのイメージ" width="1200" height="900" />
            </div>
          </div>

          <div className="service reveal">
            <div>
              <span className="service__tag">医療機関向け 採用代行</span>
              <h3>SuguDesk 採用代行</h3>
              <p>
                自社採用強化を狙った採用ページの作成、チャットを活用した自己応募の促進施策をご提案。
                その他、求人原稿の作成、媒体運用・スカウト送信、面接日程の調整、候補者へのリマインドまで、
                医療機関の採用まわりを、お困りごとに合わせて採用のプロフェッショナルが柔軟に支援します。
              </p>
              <a href="#contact" className="btn btn--ghost">お問い合わせ</a>
            </div>
            <div className="service__media service__media--img">
              <img src="/solution-recruit.jpg" alt="SuguDesk 採用代行：医療機関の採用まわりを支援するイメージ" width="1200" height="960" />
            </div>
          </div>

          <div className="service reveal">
            <div>
              <span className="service__tag">医療機関向け 業務代行</span>
              <h3>SuguDesk 業務代行</h3>
              <p>
                受付・問い合わせ、予約・事務、データ入力など、診療そのもの以外の業務をおまかせいただけます。
                現場の負担を軽くし、医療者が本来の仕事に集中できる体制づくりを支えます。必要な業務だけを月額で。
              </p>
              <a href="#contact" className="btn btn--ghost">お問い合わせ</a>
            </div>
            <div className="service__media service__media--img">
              <img src="/solution-bpo.jpg" alt="SuguDesk 業務代行：診療以外の業務を引き受けるイメージ" width="1200" height="900" />
            </div>
          </div>

          {/* 研修は現在主力ではないため「記載のみ」 */}
          <div className="more reveal">
            <span className="more__label">その他の取り組み</span>
            <ul className="more__list">
              <li>
                <b>ヘルスケアリテラシー研修（法人向け）</b>
                ——従業員のヘルスケアリテラシーを高める、オーダーメイド型の研修。
              </li>
            </ul>
            <p className="more__note">
              詳しくは<a href="#contact">お問い合わせ</a>ください。
            </p>
          </div>
        </div>
      </section>

      {/* ---------- News ---------- */}
      <section id="news" className="section section--soft">
        <div className="container">
          <p className="eyebrow">News</p>
          <h2 className="h2">ニュース</h2>
          <div className="news">
            {NEWS_SORTED.map((n) => {
              const href = n.external || `/news/${n.slug}/`;
              const ext = Boolean(n.external);
              return (
                <a key={n.slug} className="news__item" href={href}
                   target={ext ? '_blank' : undefined} rel={ext ? 'noreferrer' : undefined}>
                  <span className="news__thumb">
                    {n.cover
                      ? <img src={n.cover} alt="" loading="lazy" />
                      : <span className="news__thumb--ph" />}
                  </span>
                  <span className="news__date">{n.date}</span>
                  <span className="news__cat">{n.cat}</span>
                  <span className="news__title">{n.title}</span>
                  <span className="news__arrow">→</span>
                </a>
              );
            })}
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
              {COMPANY.map(([k, v]) => (
                <tr key={k}><th>{k}</th><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
          <a href="/message/" className="btn btn--ghost" style={{ marginTop: 30 }}>
            代表メッセージを読む <span className="btn__arrow">→</span>
          </a>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="section section--dark">
        <div className="container">
          <p className="eyebrow eyebrow--light">Contact</p>
          <h2 className="h2">お問い合わせ</h2>
          <div className="contact__grid">
            <div>
              <p className="lede">サービス導入・研修・取材など、お気軽にお問い合わせください。</p>
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
          <a className="ctacard" href={CAREERS_URL} target="_blank" rel="noopener noreferrer">
            <span><b>CAREERS</b><span>採用情報はこちら</span></span>
            <span className="arw">→</span>
          </a>
        </div>
      </section>
    </Layout>
  );
}
