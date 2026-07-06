import { useEffect, useRef, useState } from 'react';

// スクロールで入ってきたらフェードイン。delay(ms)でスタガー。
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`rc-reveal ${className}`} style={{ '--rc-delay': `${delay}ms` }}>
      {children}
    </Tag>
  );
}

// 数字のカウントアップ（「38.5」「92」等の文字列を受け、表示時にアニメーション）
export function CountUp({ value, duration = 1100 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const el = ref.current;
    const target = parseFloat(value);
    if (!el || Number.isNaN(target)) return;
    const decimals = (String(value).split('.')[1] || '').length;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setDisplay(value); return; }

    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay((target * eased).toFixed(decimals));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{display}</span>;
}
