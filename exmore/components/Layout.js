import { useEffect, useState } from 'react';
import { NAV, CAREERS_URL } from '../data/site';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  // スクロール表示アニメ（全ページ共通）
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
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

  const linkProps = (n) =>
    n.type === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a href="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand__mark" />exmore
          </a>
          <nav className={`nav ${open ? 'open' : ''}`}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} {...linkProps(n)} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
            <a href="/#contact" className="nav__cta" onClick={() => setOpen(false)}>お問い合わせ</a>
          </nav>
          <button className="nav-toggle" aria-label="メニュー" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {children}

      <footer className="footer">
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
              {NAV.map((n) => (
                <a key={n.href} href={n.href} {...linkProps(n)}>{n.label}</a>
              ))}
              <a href="/#contact">お問い合わせ</a>
            </nav>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} 株式会社exmore（エクスモア）All rights reserved.</span>
            <span>Healthcare Design for Future Choices</span>
          </div>
        </div>
      </footer>
    </>
  );
}
