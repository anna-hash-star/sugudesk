import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useClinic } from '../../lib/recruit/clinic-context';

// どのページ・セクションからでもチャットを開けるようにContextで公開する
const ChatContext = createContext({ openChat: () => {} });
export const useRecruitChat = () => useContext(ChatContext);

// 吹き出しアイコン（絵文字の代わりに全ページで使う共有SVG）
export function ChatIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5h.01M12 10.5h.01M16 10.5h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
const BotIcon = ChatIcon;

// SuguDeskウィジェットをベストエフォートで開く。
// ウィジェットは loader.iife.js を読み込んでから非同期にマウントされるため、
// クリック直後だと要素/グローバルがまだ無いことがある。そこで tryOpenSuguDeskWithRetry で
// 短時間ポーリングしながら開くのを試みる。正式な開くAPIが分かれば
// clinic.chatWidget.openGlobal（例:"sugudesk.open"）や launcherSelector を設定すると確実。
// どうしても開けない場合は false を返し、呼び出し側は従来の内蔵パネルにフォールバックします。

// document配下＋各要素の shadowRoot も再帰的に querySelector する（ウィジェットが
// Shadow DOM 内にランチャーを描画するケースに対応）。
function deepQuery(selectors, root = document) {
  for (const sel of selectors) {
    let el = null;
    try { el = root.querySelector(sel); } catch (e) {}
    if (el) return el;
  }
  const hosts = root.querySelectorAll ? root.querySelectorAll('*') : [];
  for (const h of hosts) {
    if (h.shadowRoot) {
      const found = deepQuery(selectors, h.shadowRoot);
      if (found) return found;
    }
  }
  return null;
}

// 実際のポインタ操作に近いイベントを送る（.click() だけでは反応しないウィジェット対策）
function fireClick(el) {
  try {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
      const Ctor = type.startsWith('pointer') && typeof PointerEvent === 'function' ? PointerEvent : MouseEvent;
      el.dispatchEvent(new Ctor(type, { bubbles: true, cancelable: true, view: window }));
    });
  } catch (e) {
    try { el.click(); } catch (e2) {}
  }
}

function tryOpenSuguDeskOnce(cfg = {}) {
  if (typeof window === 'undefined') return false;
  // 1) 設定されたグローバル関数パス（例: "sugudesk.open"）
  if (cfg.openGlobal) {
    let obj = window;
    for (const p of cfg.openGlobal.split('.')) obj = obj && obj[p];
    if (typeof obj === 'function') { try { obj(); return true; } catch (e) {} }
  }
  // 2) よくあるグローバル（open/show/toggle/expand 関数 or それ自体が関数）
  for (const n of ['sugudesk', 'SuguDesk', 'Sugudesk', 'SUGUDESK', '__sugudesk__', '$sugudesk', 'SugudeskWidget', 'sugudeskWidget']) {
    const g = window[n];
    if (!g) continue;
    for (const m of ['open', 'show', 'toggle', 'expand', 'maximize']) {
      if (typeof g[m] === 'function') { try { g[m](); return true; } catch (e) {} }
    }
    if (typeof g === 'function') { try { g('open'); return true; } catch (e) {} }
  }
  // 3) ランチャー要素を探してクリック（設定 or 一般的な手がかり／Shadow DOMも探索）
  const selectors = [cfg.launcherSelector, '[data-sugudesk-launcher]', '[data-widget-key] button',
    '[id*="sugudesk" i] button', 'button[id*="sugudesk" i]', 'button[class*="sugudesk" i]',
    '[class*="sugudesk" i] button', '[class*="sugudesk" i] [role="button"]',
    '[id*="sugudesk" i] [role="button"]'].filter(Boolean);
  const el = deepQuery(selectors);
  if (el) { fireClick(el); return true; }
  // 4) 名前で見つからないとき：画面隅に固定表示された小さなランチャーバブルを推定してクリック。
  //    本番ではSuguDeskのバブルが唯一の隅固定要素になるので、セレクタ未設定でも当たりやすい。
  const corner = findCornerLauncher();
  if (corner) { fireClick(corner); return true; }
  return false;
}

// 画面の下隅に固定表示された、丸に近い小さな要素（＝チャットのランチャーバブル）を推定する。
// 右下→左下の順に優先。自前ウィジェット要素は除外。曖昧回避のため候補が複数でも最も隅の1つを返す。
function findCornerLauncher() {
  if (typeof document === 'undefined') return null;
  const vw = window.innerWidth, vh = window.innerHeight;
  const cands = [];
  document.querySelectorAll('div,button,a,[role="button"]').forEach(el => {
    if (el.closest('[data-rc-widget]')) return; // 自前のチャットUIは対象外
    let s;
    try { s = getComputedStyle(el); } catch (e) { return; }
    if (s.position !== 'fixed' && s.position !== 'sticky') return;
    if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.width > 100 || r.height < 40 || r.height > 100) return; // バブルらしい小ささ
    if (Math.abs(r.width - r.height) > 24) return; // 概ね正方形/円
    const nearBottom = r.bottom > vh - 150 && r.top > vh * 0.55;
    const nearLeft = r.left < 48, nearRight = r.right > vw - 48;
    if (!nearBottom || !(nearLeft || nearRight)) return;
    cands.push({ el, right: nearRight, dist: Math.min(nearRight ? vw - r.right : r.left, vh - r.bottom), z: parseInt(s.zIndex, 10) || 0 });
  });
  if (!cands.length) return null;
  // 末端要素のみ（親コンテナを除外）
  const leaves = cands.filter(c => !cands.some(o => o.el !== c.el && c.el.contains(o.el)));
  const pool = leaves.length ? leaves : cands;
  // 右下を優先、その中で最も隅（distが小さい）・zの高いもの
  pool.sort((a, b) => (b.right - a.right) || (a.dist - b.dist) || (b.z - a.z));
  return pool[0].el;
}

// ウィジェットのマウントを待ちつつ最大 timeout ミリ秒まで開くのを試みる。
// 開けたら onOpened() を呼ぶ。開けなければ onFail() を呼ぶ（内蔵パネルへフォールバック）。
function tryOpenSuguDeskWithRetry(cfg, onOpened, onFail, timeout = 3500) {
  if (tryOpenSuguDeskOnce(cfg)) { onOpened && onOpened(); return; }
  const start = Date.now();
  const iv = setInterval(() => {
    if (tryOpenSuguDeskOnce(cfg)) { clearInterval(iv); onOpened && onOpened(); return; }
    if (Date.now() - start > timeout) { clearInterval(iv); onFail && onFail(); }
  }, 250);
}

export function ChatProvider({ children }) {
  const { clinic, faqs, chatScript, slug } = useClinic();
  const base = `/recruit/${slug}`;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { from: 'bot'|'user', text, chips?, bridge? }
  const [input, setInput] = useState('');
  const logRef = useRef(null);

  const openPanel = (contextLabel) => {
    setOpen(true);
    setMessages(prev => {
      if (prev.length > 0) return prev;
      const first = [{ from: 'bot', text: chatScript.greeting, chips: chatScript.chips }];
      if (contextLabel) {
        first.push({ from: 'bot', text: `「${contextLabel}」についてのご質問も、そのまま入力いただけます。` });
      }
      return first;
    });
  };

  const openChat = (contextLabel) => {
    // SuguDeskウィジェット導入時はそのバブルだけを開く（マウント待ちで最大数秒リトライ）。
    // 見つからない場合でも、旧・内蔵の静的チャットは出さない（常設のSuguDeskバブルで対応するため）。
    if (clinic.chatWidget) {
      tryOpenSuguDeskWithRetry(clinic.chatWidget, () => {}, () => {});
      return;
    }
    openPanel(contextLabel);
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, open]);

  const answerWith = (faqIndex, userText) => {
    const faq = faqs[faqIndex];
    setMessages(prev => [
      ...prev,
      { from: 'user', text: userText },
      { from: 'bot', text: faq.a },
      { from: 'bot', text: chatScript.bridge, bridge: true },
    ]);
  };

  const handleChip = (chip) => answerWith(chip.faqIndex, chip.label);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    const hit = chatScript.keywords.find(k => k.match.some(m => text.includes(m)));
    if (hit) {
      answerWith(hit.faqIndex, text);
    } else {
      setMessages(prev => [
        ...prev,
        { from: 'user', text },
        { from: 'bot', text: chatScript.fallback, bridge: true },
      ]);
    }
  };

  const askMore = () => {
    setMessages(prev => [
      ...prev,
      { from: 'bot', text: 'どうぞ！よくあるご質問はこちらです。', chips: chatScript.chips },
    ]);
  };

  return (
    <ChatContext.Provider value={{ openChat }}>
      {children}

      {/* フローティング起動ボタン（全ページ常駐）。SuguDeskウィジェット導入時は二重表示を避けて隠す */}
      {!open && !clinic.chatWidget && (
        <button
          onClick={() => openChat()}
          className="rc-pulse fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 rounded-full bg-rc-teal text-white pl-4 pr-5 py-3 shadow-lg shadow-rc-teal/30 hover:bg-rc-teal-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal focus-visible:ring-offset-2"
          aria-label="採用相談チャットを開く"
        >
          <BotIcon />
          <span className="text-[16px] font-bold">採用相談</span>
        </button>
      )}

      {/* チャットパネル（旧・内蔵の静的チャット）。SuguDeskウィジェット導入時は一切表示しない */}
      {open && !clinic.chatWidget && (
        <div
          className="fixed z-50 inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[380px] flex flex-col bg-white md:rounded-2xl shadow-2xl border border-rc-sand max-h-[85dvh] md:max-h-[600px]"
          role="dialog"
          aria-label="採用相談チャット"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-rc-teal text-white md:rounded-t-2xl">
            <BotIcon />
            <div className="flex-1 leading-tight">
              <div className="text-[16px] font-bold">採用相談チャット</div>
              <div className="text-[13px] text-white/80">匿名OK・24時間受付 — {clinic.shortName}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="チャットを閉じる"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={logRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-rc-ivory">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={
                    m.from === 'user'
                      ? 'ml-auto max-w-[85%] w-fit rounded-2xl rounded-br-sm bg-rc-teal text-white px-4 py-2.5 text-[16px] leading-relaxed'
                      : 'max-w-[90%] w-fit rounded-2xl rounded-bl-sm bg-white border border-rc-sand px-4 py-2.5 text-[16px] text-rc-ink leading-relaxed'
                  }
                >
                  {m.text}
                </div>
                {m.chips && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {m.chips.map(chip => (
                      <button
                        key={chip.key}
                        onClick={() => handleChip(chip)}
                        className="text-[14px] font-medium border border-rc-teal text-rc-teal bg-white rounded-full px-3.5 py-1.5 hover:bg-rc-teal-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
                {m.bridge && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    <Link
                      href={chatScript.bridgeCta?.href || `${base}/entry`}
                      className="text-[14px] font-bold bg-rc-teal text-white rounded-full px-4 py-2 hover:bg-rc-teal-dark transition-colors"
                    >
                      {chatScript.bridgeCta?.label || '応募フォームへ'}
                    </Link>
                    <button
                      onClick={askMore}
                      className="text-[14px] font-medium border border-rc-ink-soft/40 text-rc-ink-soft bg-white rounded-full px-3.5 py-1.5 hover:border-rc-teal hover:text-rc-teal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal"
                    >
                      他の質問をする
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-3 border-t border-rc-sand bg-white md:rounded-b-2xl">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="質問を入力（匿名OK）"
              className="flex-1 text-[16px] rounded-full border border-rc-sand bg-rc-ivory px-4 py-2.5 focus:outline-none focus:border-rc-teal focus:ring-1 focus:ring-rc-teal"
              aria-label="質問を入力"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-rc-teal text-white p-2.5 hover:bg-rc-teal-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal"
              aria-label="送信"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </ChatContext.Provider>
  );
}
