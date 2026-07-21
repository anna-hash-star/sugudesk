import { useEffect } from 'react';
import { useClinic } from '../../lib/recruit/clinic-context';

// SuguDesk 採用チャットウィジェットのローダー。clinic.chatWidget が設定されているときだけ、
// 公式スニペットと同じ <script src=... data-widget-key=...> を1度だけ body に挿入する。
export default function ChatWidgetLoader() {
  const { clinic } = useClinic();
  useEffect(() => {
    const w = clinic.chatWidget;
    if (!w || !w.src || !w.key) return;
    if (document.querySelector(`script[data-widget-key="${w.key}"]`)) return;
    const s = document.createElement('script');
    s.src = w.src;
    s.async = true;
    s.setAttribute('data-widget-key', w.key);
    document.body.appendChild(s);
  }, [clinic]);
  return null;
}
