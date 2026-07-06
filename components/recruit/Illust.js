// 実写差し替え前提のシーンイラスト。テーマのCSS変数で着色されるため、
// クリニックテーマ（ティール/ローズ等）を切り替えると自動で馴染む。
// 本番では同じ枠に <img> を入れるだけでよい（Photo コンポーネント側で置換）。

const skin = '#EAC7AE';
const hair = '#453338';

function Figure({ x, y, s = 1, top = 'var(--color-rc-teal)', coat = false, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* 体 */}
      <rect x="-26" y="28" width="52" height="86" rx="22" fill={top} />
      {coat && (
        <path d="M -30 30 Q -30 24 -22 24 L -12 26 L -12 116 L -30 116 Z M 30 30 Q 30 24 22 24 L 12 26 L 12 116 L 30 116 Z" fill="#FFFFFF" />
      )}
      {/* 頭 */}
      <circle cx="0" cy="0" r="20" fill={skin} />
      {/* 髪（シニヨン） */}
      <path d="M -20 -2 A 20 20 0 0 1 20 -2 L 20 -8 A 20 20 0 0 0 -20 -8 Z" fill={hair} />
      <path d="M -20 -3 Q -22 8 -16 12 L -16 -6 Z" fill={hair} />
      <circle cx="16" cy="-16" r="7" fill={hair} />
    </g>
  );
}

function Plant({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 0 Q -14 -26 -4 -46 Q 4 -26 4 -4 Z" fill="var(--color-rc-teal)" opacity="0.55" />
      <path d="M 2 0 Q 16 -20 26 -34 Q 16 -10 6 0 Z" fill="var(--color-rc-teal)" opacity="0.4" />
      <path d="M -2 0 Q -20 -12 -30 -24 Q -16 -6 -4 2 Z" fill="var(--color-rc-teal)" opacity="0.35" />
      <path d="M -12 0 L 12 0 L 8 26 L -8 26 Z" fill="var(--color-rc-sand)" />
    </g>
  );
}

function Arch({ x, y, w, h, fill = 'var(--color-rc-teal-soft)' }) {
  return <path d={`M ${x} ${y + h} L ${x} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`} fill={fill} />;
}

const scenes = {
  // スタッフが並ぶ受付前（ヒーロー用）
  staff: (
    <>
      <Arch x={70} y={40} w={120} h={220} />
      <Arch x={230} y={70} w={90} h={190} fill="var(--color-rc-sand)" />
      <Figure x={150} y={130} s={1.05} />
      <Figure x={250} y={142} s={0.95} top="#FFFFFF" flip />
      <Plant x={352} y={262} s={1.15} />
      <rect x="0" y="252" width="400" height="48" fill="var(--color-rc-sand)" opacity="0.6" />
    </>
  ),
  // 院長（白衣）
  director: (
    <>
      <circle cx="200" cy="120" r="95" fill="var(--color-rc-teal-soft)" />
      <Figure x={200} y={110} s={1.35} coat />
      <Plant x={60} y={272} s={1.2} />
      <rect x="0" y="258" width="400" height="42" fill="var(--color-rc-sand)" opacity="0.6" />
    </>
  ),
  // 施術室（ベッド＋照射機器）
  treatment: (
    <>
      <Arch x={250} y={40} w={110} h={220} />
      <rect x="40" y="182" width="200" height="34" rx="17" fill="#FFFFFF" />
      <rect x="52" y="216" width="14" height="46" rx="6" fill="var(--color-rc-sand)" />
      <rect x="214" y="216" width="14" height="46" rx="6" fill="var(--color-rc-sand)" />
      <circle cx="76" cy="172" r="13" fill="var(--color-rc-teal-soft)" />
      {/* 照射機器のアーム */}
      <rect x="300" y="120" width="12" height="140" rx="6" fill="var(--color-rc-teal-dark)" />
      <path d="M 306 128 Q 250 96 206 140" stroke="var(--color-rc-teal-dark)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <circle cx="204" cy="144" r="14" fill="var(--color-rc-teal)" />
      <Figure x={160} y={110} s={0.9} />
      <rect x="0" y="256" width="400" height="44" fill="var(--color-rc-sand)" opacity="0.6" />
    </>
  ),
  // カウンセリング（対面）
  counsel: (
    <>
      <Arch x={150} y={36} w={100} h={224} />
      <rect x="130" y="190" width="140" height="16" rx="8" fill="var(--color-rc-sand)" />
      <rect x="188" y="206" width="14" height="56" rx="6" fill="var(--color-rc-sand)" />
      <rect x="150" y="176" width="44" height="10" rx="4" fill="#FFFFFF" />
      <Figure x={96} y={128} s={0.95} top="#FFFFFF" />
      <Figure x={302} y={128} s={0.95} flip />
      <rect x="0" y="256" width="400" height="44" fill="var(--color-rc-sand)" opacity="0.6" />
    </>
  ),
  // 受付・事務（デスク＋モニター）
  clerk: (
    <>
      <Arch x={40} y={44} w={110} h={216} />
      <rect x="120" y="196" width="220" height="18" rx="9" fill="var(--color-rc-sand)" />
      <rect x="230" y="150" width="66" height="44" rx="6" fill="var(--color-rc-teal-dark)" />
      <rect x="256" y="194" width="12" height="12" fill="var(--color-rc-sand)" />
      <Figure x={176} y={126} s={0.95} />
      <Plant x={356} y={196} s={0.9} />
      <rect x="0" y="256" width="400" height="44" fill="var(--color-rc-sand)" opacity="0.6" />
    </>
  ),
  // AdeBクリニック受付の再現（木ルーバーの天蓋・白い円形カウンター・ピンクのリング床・ロゴ）
  adebReception: (
    <>
      {/* 天井（ダーク）と間接照明 */}
      <rect x="0" y="0" width="400" height="66" fill="#332D2B" />
      <path d="M 0 66 Q 90 46 180 60 L 180 66 Z" fill="#F7EFE4" opacity="0.9" />
      {/* 放射状の木ルーバー */}
      {Array.from({ length: 17 }).map((_, i) => {
        const x1 = 200 + (i - 8) * 4;
        const x2 = 200 + (i - 8) * 22;
        return <path key={i} d={`M ${x1} 0 L ${x2} 96`} stroke="#E3C48F" strokeWidth="7" strokeLinecap="round" />;
      })}
      {/* ルーバーの冠（垂直スラット帯） */}
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={`c${i}`} x={68 + i * 12.5} y={92 + (i % 2) * 5} width="7" height={26 - (i % 2) * 6} rx="2" fill="#DDB97F" />
      ))}
      <rect x="64" y="118" width="286" height="5" rx="2.5" fill="#C9A264" />
      {/* 受付の白壁とロゴ */}
      <path d="M 96 130 Q 96 122 108 122 L 292 122 Q 304 122 304 130 L 304 216 L 96 216 Z" fill="#FDFBF9" />
      <path d="M 176 152 L 188 170 L 164 170 Z" fill="#EA4E74" />
      <circle cx="176" cy="166" r="4" fill="#FDFBF9" />
      <text x="196" y="164" fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fontWeight="bold" fill="#EA4E74">AdeB</text>
      <text x="196" y="177" fontFamily="Helvetica, Arial, sans-serif" fontSize="9" fill="#F0879F">Clinic</text>
      {/* ピンクのリング床 */}
      <ellipse cx="200" cy="242" rx="130" ry="26" fill="#EA4E74" opacity="0.85" />
      {/* 円形カウンター（白・下端に光の帯） */}
      <path d="M 78 208 Q 200 176 322 208 L 322 244 Q 200 270 78 244 Z" fill="#F3EDE2" />
      <path d="M 78 208 Q 200 176 322 208 L 322 216 Q 200 186 78 216 Z" fill="#FFFFFF" />
      <rect x="150" y="150" width="34" height="24" rx="3" fill="#E9E2D6" opacity="0" />
      {/* 木の床 */}
      <rect x="0" y="258" width="400" height="42" fill="#EBD3A4" />
      <g stroke="#DCBE86" strokeWidth="1.5">
        <line x1="0" y1="272" x2="400" y2="272" /><line x1="0" y1="286" x2="400" y2="286" />
        <line x1="60" y1="258" x2="52" y2="300" /><line x1="180" y1="258" x2="174" y2="300" /><line x1="300" y1="258" x2="296" y2="300" />
      </g>
    </>
  ),
  // 院内（受付カウンターとペンダントライト）
  clinic: (
    <>
      <Arch x={250} y={50} w={110} h={210} />
      <line x1="120" y1="0" x2="120" y2="74" stroke="var(--color-rc-teal-dark)" strokeWidth="3" />
      <path d="M 104 74 L 136 74 L 128 96 L 112 96 Z" fill="var(--color-rc-teal)" />
      <line x1="200" y1="0" x2="200" y2="54" stroke="var(--color-rc-teal-dark)" strokeWidth="3" />
      <path d="M 184 54 L 216 54 L 208 76 L 192 76 Z" fill="var(--color-rc-teal)" />
      <path d="M 30 200 Q 30 184 46 184 L 240 184 Q 256 184 256 200 L 256 262 L 30 262 Z" fill="#FFFFFF" />
      <rect x="30" y="184" width="226" height="12" rx="6" fill="var(--color-rc-teal-soft)" />
      <Plant x={300} y={262} s={1.3} />
      <rect x="0" y="260" width="400" height="40" fill="var(--color-rc-sand)" opacity="0.6" />
    </>
  ),
};

export default function Illust({ scene = 'staff' }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <rect width="400" height="300" fill="var(--color-rc-ivory)" />
      <circle cx="330" cy="40" r="70" fill="var(--color-rc-teal-soft)" opacity="0.7" />
      <circle cx="40" cy="250" r="50" fill="var(--color-rc-teal-soft)" opacity="0.5" />
      {scenes[scene] || scenes.staff}
    </svg>
  );
}
