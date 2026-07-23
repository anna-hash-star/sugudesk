import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { NEWS, NEWS_ARTICLES } from '../../data/news';

export async function getStaticPaths() {
  return {
    paths: NEWS_ARTICLES.map((n) => ({ params: { slug: n.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const item = NEWS.find((n) => n.slug === params.slug) || null;
  return { props: { item } };
}

export default function NewsArticle({ item }) {
  if (!item) return null;
  return (
    <Layout>
      <Seo
        title={`${item.title}｜ニュース｜株式会社exmore`}
        description={item.title}
        path={`/news/${item.slug}/`}
        type="article"
      />

      <section className="pagehead">
        <div className="container">
          <p className="eyebrow">News</p>
          <p className="article__meta">
            <span className="news__cat">{item.cat}</span>
            <span className="article__date">{item.date}</span>
          </p>
          <h1 className="article__title">{item.title}</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {item.cover && (
            <img className="article__cover" src={item.cover} alt="" width="1200" height="675" />
          )}
          <article className="article">
            {item.body.map((b, i) => {
              if (b.h2) return <h2 key={i} className="article__h2">{b.h2}</h2>;
              if (b.q) return <p key={i} className="article__q">── {b.q}</p>;
              if (b.img) return (
                <figure key={i} className="article__figure">
                  <img src={b.img} alt={b.cap || ''} loading="lazy" />
                  {b.cap && <figcaption>{b.cap}</figcaption>}
                </figure>
              );
              return <p key={i} className="article__p">{b.p}</p>;
            })}
          </article>
          <div style={{ marginTop: 44 }}>
            <a href="/#news" className="btn btn--ghost">← ニュース一覧へ</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
