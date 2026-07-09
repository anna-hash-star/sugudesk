#!/usr/bin/env python3
# 採用LPの自己完結プレビューHTMLを生成する。
# 使い方: npm run build && python3 scripts/build-recruit-preview.py
# 出力: docs/recruit-site-template/adeb-lp-preview.html
# （ビルド済みSSG HTMLを1ファイルに束ね、ページ遷移とチャットをバニラJSで再現。
#   Vercel等が使えない相手にもブラウザだけで見せられる。）

import base64
import glob
import json
import os
import re

css = open(glob.glob(".next/static/chunks/*.css")[0]).read()

MIME = {".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml"}


def inline_photo(match):
    # public/ 配下に実ファイルがあれば data URI で埋め込み、無ければタグごと除去してイラストを見せる
    src = match.group(1)
    local = "public" + src
    if os.path.exists(local):
        mime = MIME.get(os.path.splitext(local)[1].lower(), "application/octet-stream")
        b64 = base64.b64encode(open(local, "rb").read()).decode()
        return match.group(0).replace(f'src="{src}"', f'src="data:{mime};base64,{b64}"')
    return ""


def extract(path):
    html = open(path).read()
    start = html.index('<div id="__next">') + len('<div id="__next">')
    end = html.index('<script id="__NEXT_DATA__"')
    content = html[start:end].rstrip()
    assert content.endswith("</div>")
    content = content[: -len("</div>")]
    content = re.sub(r'<img[^>]*src="(/recruit-photos/[^"]+)"[^>]*/?>', inline_photo, content)
    return content


PAGES = {
    "r-top": ".next/server/pages/recruit.html",
    "r-flow": ".next/server/pages/recruit/flow.html",
    "r-entry": ".next/server/pages/recruit/entry.html",
    "r-nurse": ".next/server/pages/recruit/jobs/nurse.html",
    "r-assistant": ".next/server/pages/recruit/jobs/assistant.html",
}
sections = "".join(
    f'<div class="route{" active" if rid == "r-top" else ""}" id="{rid}">{extract(p)}</div>'
    for rid, p in PAGES.items()
)

# チャットのナレッジ（lib/recruit/clinics/adeb.js の faqs/chatScript と同期させること）
FAQS = [
    '看護助手は未経験歓迎・学歴不問で、医療資格は不要です。看護師も美容未経験で大丈夫——マニュアルが整っており、レーザー施術は基礎から研修します。',
    '個人ノルマはありません（求人票にも明記しています）。看護助手のインセンティブも個人ノルマと紐づくものではありません。「必要以上の美容治療は行わない」が当院のポリシーだからです。',
    '看護師は残業なしです（9:00〜18:00・実働8時間）。看護助手（正社員）は固定残業代5時間分の範囲が基本で、超過した場合は別途支給します。',
    'フォーム（1分）・チャット・お電話（050-8882-5880・採用担当：安田）のいずれでも応募できます。書類選考のうえ面接日程をご連絡し、面接で給与・シフト・研修内容をすべて明示します。',
    'あります。美容施術を社員価格で受けられます。自社開発のスキンケア「FLALU COSME」を扱っているので、治療からホームケアまでの提案も学べる環境です。',
]
CHAT = {
    "greeting": "こんにちは！AdeBクリニック採用相談です。匿名のままで大丈夫ですよ。気になることを選ぶか、自由に入力してください。",
    "chips": [
        {"label": "未経験でも大丈夫？", "i": 0},
        {"label": "ノルマはある？", "i": 1},
        {"label": "応募の流れは？", "i": 3},
        {"label": "社員割引はある？", "i": 4},
    ],
    "faqs": FAQS,
    "keywords": [
        [["未経験", "病棟", "美容経験", "資格", "初めて", "はじめて"], 0],
        [["ノルマ", "営業", "売上", "インセンティブ", "歩合"], 1],
        [["残業", "定時", "夜勤"], 2],
        [["流れ", "応募方法", "入職", "面接", "見学", "選考", "電話"], 3],
        [["割引", "社割", "化粧品", "FLALU", "フラル"], 4],
    ],
    "bridge": "応募はフォーム1分（履歴書不要）。お電話（050-8882-5880・採用担当：安田）でも受け付けています。",
    "fallback": "ご質問ありがとうございます。担当者から直接お答えしたいので、お電話（050-8882-5880・採用担当：安田）か、応募フォームの備考欄でお寄せください。チャットのまま他の質問も歓迎です。",
}

out = f"""<title>AdeBクリニック 採用LP プレビュー</title>
<style>
{css}
.rc-reveal {{ opacity: 1 !important; transform: none !important; }}
.route {{ display: none; }}
.route.active {{ display: block; }}
body.chat-open button[aria-label="採用相談チャットを開く"] {{ display: none !important; }}
.pv-note {{ background:#33282C; color:#fff; font-size:12px; padding:7px 14px; text-align:center;
  font-family:"Hiragino Kaku Gothic ProN","Hiragino Sans",sans-serif; }}
.pv-note b {{ color:#F1C7D2; }}
#pv-chat {{ display:none; }}
#pv-chat.open {{ display:flex; }}
</style>
<div class="pv-note"><b>プレビュー版</b>（実装コードの静的書き出し・実写写真反映済み）— ページ遷移・チャット・FAQは動作します。雇用形態タブ・フォーム送信・スクロール演出は実装版のみ。</div>
{sections}

<div id="pv-chat" class="theme-adeb fixed z-50 inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[380px] flex-col bg-white md:rounded-2xl shadow-2xl border border-rc-sand max-h-[85dvh] md:max-h-[600px]" style="flex-direction:column" role="dialog" aria-label="採用相談チャット">
  <div class="flex items-center gap-3 px-4 py-3 bg-rc-teal text-white md:rounded-t-2xl">
    <div class="flex-1 leading-tight">
      <div class="text-sm font-bold">採用相談チャット</div>
      <div class="text-[11px] text-white/80">匿名OK・24時間受付 — AdeBクリニック</div>
    </div>
    <button id="pv-chat-close" class="p-1 rounded hover:bg-white/15" aria-label="チャットを閉じる">✕</button>
  </div>
  <div id="pv-chat-log" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-rc-ivory" style="min-height:260px"></div>
  <form id="pv-chat-form" class="flex items-center gap-2 px-3 py-3 border-t border-rc-sand bg-white md:rounded-b-2xl">
    <input id="pv-chat-input" placeholder="質問を入力（匿名OK）" class="flex-1 text-sm rounded-full border border-rc-sand bg-rc-ivory px-4 py-2.5" aria-label="質問を入力" />
    <button type="submit" class="shrink-0 rounded-full bg-rc-teal text-white px-4 py-2.5 text-sm font-bold" aria-label="送信">→</button>
  </form>
</div>

<script>
var CHAT = {json.dumps(CHAT, ensure_ascii=False)};
var ROUTES = {{'/recruit':'r-top','/recruit/flow':'r-flow','/recruit/entry':'r-entry','/recruit/jobs/nurse':'r-nurse','/recruit/jobs/assistant':'r-assistant'}};
function go(path, hash) {{
  var id = ROUTES[path] || 'r-top';
  document.querySelectorAll('.route').forEach(function(r) {{ r.classList.toggle('active', r.id === id); }});
  if (hash) {{ var el = document.querySelector('#' + id + ' [id="' + hash + '"]'); if (el) {{ el.scrollIntoView(); return; }} }}
  window.scrollTo(0, 0);
}}
document.addEventListener('click', function(e) {{
  var a = e.target.closest('a');
  if (a) {{
    var href = a.getAttribute('href') || '';
    if (href.startsWith('/recruit')) {{ e.preventDefault(); var parts = href.split('#'); go(parts[0].split('?')[0], parts[1]); return; }}
    if (href === '#') {{ e.preventDefault(); return; }}
  }}
  var b = e.target.closest('button');
  if (b) {{
    var t = (b.textContent || '') + (b.getAttribute('aria-label') || '');
    if (/採用相談チャットを開く|チャットで相談|相談してみる|匿名で相談|チャットで質問|匿名チャットで相談|日程をチャットで相談|いまチャットで相談/.test(t)) {{ e.preventDefault(); openChat(); }}
  }}
}});
var chatEl = document.getElementById('pv-chat');
var logEl = document.getElementById('pv-chat-log');
var started = false;
function esc(s) {{ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }}
function addMsg(from, text) {{
  var div = document.createElement('div');
  div.innerHTML = from === 'user'
    ? '<div class="ml-auto max-w-[85%] w-fit rounded-2xl rounded-br-sm bg-rc-teal text-white px-4 py-2.5 text-sm leading-relaxed">' + esc(text) + '</div>'
    : '<div class="max-w-[90%] w-fit rounded-2xl rounded-bl-sm bg-white border border-rc-sand px-4 py-2.5 text-sm text-rc-ink leading-relaxed">' + esc(text) + '</div>';
  logEl.appendChild(div); logEl.scrollTop = logEl.scrollHeight;
}}
function addChips() {{
  var wrap = document.createElement('div'); wrap.className = 'flex flex-wrap gap-2 mt-1';
  CHAT.chips.forEach(function(c) {{
    var btn = document.createElement('button');
    btn.className = 'text-xs font-medium border border-rc-teal text-rc-teal bg-white rounded-full px-3.5 py-1.5';
    btn.textContent = c.label; btn.onclick = function() {{ answer(c.i, c.label); }};
    wrap.appendChild(btn);
  }});
  logEl.appendChild(wrap); logEl.scrollTop = logEl.scrollHeight;
}}
function addBridge() {{
  addMsg('bot', CHAT.bridge);
  var wrap = document.createElement('div'); wrap.className = 'flex flex-wrap gap-2 mt-1';
  var tour = document.createElement('button');
  tour.className = 'text-xs font-bold bg-rc-teal text-white rounded-full px-4 py-2';
  tour.textContent = '応募フォームへ'; tour.onclick = function() {{ closeChat(); go('/recruit/entry'); }};
  var more = document.createElement('button');
  more.className = 'text-xs font-medium border border-rc-sand text-rc-ink-soft bg-white rounded-full px-3.5 py-1.5';
  more.textContent = '他の質問をする'; more.onclick = function() {{ addMsg('bot', 'どうぞ！よくあるご質問はこちらです。'); addChips(); }};
  wrap.appendChild(tour); wrap.appendChild(more);
  logEl.appendChild(wrap); logEl.scrollTop = logEl.scrollHeight;
}}
function answer(i, userText) {{ addMsg('user', userText); addMsg('bot', CHAT.faqs[i]); addBridge(); }}
function openChat() {{
  chatEl.classList.add('open'); document.body.classList.add('chat-open');
  if (!started) {{ started = true; addMsg('bot', CHAT.greeting); addChips(); }}
}}
function closeChat() {{ chatEl.classList.remove('open'); document.body.classList.remove('chat-open'); }}
document.getElementById('pv-chat-close').onclick = closeChat;
document.getElementById('pv-chat-form').addEventListener('submit', function(e) {{
  e.preventDefault();
  var input = document.getElementById('pv-chat-input'); var text = input.value.trim();
  if (!text) return; input.value = '';
  var hit = null;
  CHAT.keywords.forEach(function(k) {{ if (hit === null && k[0].some(function(m) {{ return text.indexOf(m) !== -1; }})) hit = k[1]; }});
  if (hit !== null) {{ answer(hit, text); }} else {{ addMsg('user', text); addMsg('bot', CHAT.fallback); addBridge(); }}
}});
</script>
"""

path = "docs/recruit-site-template/adeb-lp-preview.html"
open(path, "w").write(out)
print("written:", path, f"{os.path.getsize(path) / 1024:.0f} KB")
