import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { clinic, faqs, chatScript } from '../../lib/recruit/site-data';

// どのページ・セクションからでもチャットを開けるようにContextで公開する
const ChatContext = createContext({ openChat: () => {} });
export const useRecruitChat = () => useContext(ChatContext);

function BotIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5h.01M12 10.5h.01M16 10.5h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { from: 'bot'|'user', text, chips?, bridge? }
  const [input, setInput] = useState('');
  const logRef = useRef(null);

  const openChat = (contextLabel) => {
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

      {/* フローティング起動ボタン（全ページ常駐） */}
      {!open && (
        <button
          onClick={() => openChat()}
          className="rc-pulse fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 rounded-full bg-rc-teal text-white pl-4 pr-5 py-3 shadow-lg shadow-rc-teal/30 hover:bg-rc-teal-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal focus-visible:ring-offset-2"
          aria-label="採用相談チャットを開く"
        >
          <BotIcon />
          <span className="text-sm font-bold">採用相談</span>
        </button>
      )}

      {/* チャットパネル */}
      {open && (
        <div
          className="fixed z-50 inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[380px] flex flex-col bg-white md:rounded-2xl shadow-2xl border border-rc-sand max-h-[85dvh] md:max-h-[600px]"
          role="dialog"
          aria-label="採用相談チャット"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-rc-teal text-white md:rounded-t-2xl">
            <BotIcon />
            <div className="flex-1 leading-tight">
              <div className="text-sm font-bold">採用相談チャット</div>
              <div className="text-[11px] text-white/80">匿名OK・24時間受付 — {clinic.shortName}</div>
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
                      ? 'ml-auto max-w-[85%] w-fit rounded-2xl rounded-br-sm bg-rc-teal text-white px-4 py-2.5 text-sm leading-relaxed'
                      : 'max-w-[90%] w-fit rounded-2xl rounded-bl-sm bg-white border border-rc-sand px-4 py-2.5 text-sm text-rc-ink leading-relaxed'
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
                        className="text-xs font-medium border border-rc-teal text-rc-teal bg-white rounded-full px-3.5 py-1.5 hover:bg-rc-teal-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
                {m.bridge && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    <Link
                      href="/recruit/entry?mode=tour"
                      className="text-xs font-bold bg-rc-teal text-white rounded-full px-4 py-2 hover:bg-rc-teal-dark transition-colors"
                    >
                      見学を予約する
                    </Link>
                    <button
                      onClick={askMore}
                      className="text-xs font-medium border border-rc-ink-soft/40 text-rc-ink-soft bg-white rounded-full px-3.5 py-1.5 hover:border-rc-teal hover:text-rc-teal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-teal"
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
              className="flex-1 text-sm rounded-full border border-rc-sand bg-rc-ivory px-4 py-2.5 focus:outline-none focus:border-rc-teal focus:ring-1 focus:ring-rc-teal"
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
