import Layout from '../components/Layout';
import Seo from '../components/Seo';
import { CAREERS_URL } from '../data/site';

export default function Message() {
  return (
    <Layout>
      <Seo
        title="代表メッセージ｜株式会社exmore"
        description="「もっと早く知っていたら」をなくしたい。株式会社exmore 代表取締役CEO 根来杏奈からのメッセージ。当事者としての経験から、誰もが安心して医療にアクセスできる社会を目指します。"
        path="/message"
        type="profile"
      />

      {/* ページヘッダー */}
      <section className="pagehead">
        <div className="container">
          <p className="eyebrow">Message</p>
          <h1 className="pagehead__title">代表メッセージ</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="msg">
            <div className="msg__aside">
              <div className="msg__photo reveal">
                <img src="/ceo.jpg" alt="代表取締役 CEO 根来 杏奈" width="1000" height="1200" />
              </div>
              <div className="msg__name reveal">
                <b>代表取締役 CEO</b>
                <span>根来 杏奈</span>
              </div>
            </div>

            <div className="msg__body reveal">
              <p className="msg__lead">「もっと早く知っていたら」「時間を巻き戻せたら」</p>
              <p>
                人生の中で、そう感じる瞬間はきっと誰にでもあると思います。
                私にとってそれは、自分に不妊治療が必要だと知った日でした。
              </p>
              <p>
                からだのこと、キャリア、家族、将来の選択。本来つながっているべきものが分断され、
                知る機会や選択肢に気づけないまま、時間だけが過ぎていく。
                「医療・ヘルスケア」というテーマは、それが特に顕著だと思っています。
              </p>
              <p>
                そして、地域や環境によって、その&ldquo;届きやすさ&rdquo;は大きく異なる。
                そんな構造そのものに課題を感じました。
              </p>
              <p>
                だからこそ、わたしたちは「知る」「向き合う」「選ぶ」を支える仕組みを、
                テクノロジーと当事者視点からつくっています。
              </p>
              <p>
                からだと未来、医療と日常、ライフとキャリア。すべてが繋がり、
                誰もが安心して生活できる社会をめざします。
              </p>

              <div className="msg__profile">
                <h2>プロフィール</h2>
                <p>
                  大手総合人材会社、SHIFT、STORESにてBtoB営業・営業企画・人材育成・営業マネージャーを経験。
                  自身のPCOS、夫の男性不妊という不妊治療の経験を通じ、ヘルスケア・医療にまつわる
                  社会課題の解決を決意し、株式会社exmoreを創業。
                </p>
              </div>

              <div className="msg__actions">
                <a href="/#contact" className="btn btn--primary">お問い合わせ <span className="btn__arrow">→</span></a>
                <a href={CAREERS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  採用情報を見る
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
