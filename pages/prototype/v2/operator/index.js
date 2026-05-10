import Link from 'next/link';
import { clinics, candidates, operatorAlerts, agencies } from '../../../../lib/prototypeMockData';

const COLORS = {
  primary: '#2563a8',
  bg: '#f8f7f4',
  white: '#ffffff',
  text: '#1f2937',
  textLight: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export default function OperatorDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif' }}>
      <Header />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>オペレーションダッシュボード</h1>
        <p style={{ fontSize: 13, color: COLORS.textLight, margin: 0, marginBottom: 28 }}>2026年6月3日（火）</p>

        {/* タスク・アラート */}
        <Section title="今日のタスク・アラート">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {operatorAlerts.map((alert, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.white,
                  borderRadius: 8,
                  padding: '12px 16px',
                  border: `1px solid ${COLORS.border}`,
                  borderLeft: `4px solid ${alert.type === 'alert' ? COLORS.warning : COLORS.info}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: alert.type === 'alert' ? COLORS.warning : COLORS.info, textTransform: 'uppercase', marginRight: 10 }}>
                    {alert.type === 'alert' ? 'ALERT' : 'TASK'}
                  </span>
                  <strong>{alert.clinic}</strong>
                  <span style={{ color: COLORS.textLight, marginLeft: 10 }}>{alert.text}</span>
                </div>
                <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{alert.dueDate}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 院一覧 */}
        <Section title="担当院（全院横断）">
          <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={th}>院</th>
                  <th style={th}>業種</th>
                  <th style={th}>状態</th>
                  <th style={thRight}>応募</th>
                  <th style={thRight}>面接</th>
                  <th style={thRight}>採用</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((c) => {
                  const cs = candidates[c.id] || [];
                  const apps = cs.filter((x) => x.status === '応募').length;
                  const ints = cs.filter((x) => ['面接予定', '面接実施'].includes(x.status)).length;
                  const hires = cs.filter((x) => ['内定', '採用'].includes(x.status)).length;
                  return (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={td}><strong>{c.name}</strong></td>
                      <td style={td}>{c.specialty}</td>
                      <td style={td}><Badge text={c.status} /></td>
                      <td style={tdRight}>{apps}</td>
                      <td style={tdRight}>{ints}</td>
                      <td style={tdRight}>{hires}</td>
                      <td style={td}>
                        <Link href={`/prototype/v2/operator/clinic/${c.id}`}>
                          <span style={{ color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>院詳細 →</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 紹介会社サマリ */}
        <Section title="紹介会社サマリ">
          <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={th}>紹介会社</th>
                  <th style={thRight}>紹介数</th>
                  <th style={thRight}>書類通過</th>
                  <th style={thRight}>面接</th>
                  <th style={thRight}>採用</th>
                  <th style={thRight}>手数料合計</th>
                  <th style={th}>要望待ち</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((a) => (
                  <tr key={a.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={td}><strong>{a.name}</strong></td>
                    <td style={tdRight}>{a.metrics.introductions}</td>
                    <td style={tdRight}>{a.metrics.docPasses}</td>
                    <td style={tdRight}>{a.metrics.interviews}</td>
                    <td style={tdRight}>{a.metrics.hires}</td>
                    <td style={tdRight}>¥{a.metrics.totalFeePaid.toLocaleString()}</td>
                    <td style={td}>{a.requestHistory.filter((r) => r.status === '対応中').length > 0 ? `${a.requestHistory.filter((r) => r.status === '対応中').length}件` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '14px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>SuguDesk</span>
          <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 8 }}>Operations Console v2</span>
        </div>
        <Link href="/prototype/v2"><span style={{ fontSize: 12, color: COLORS.textLight, cursor: 'pointer' }}>← v2トップ</span></Link>
      </div>
    </header>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function Badge({ text }) {
  const colorMap = {
    'パイロット中': { bg: '#dcfce7', color: '#166534' },
    'ヒアリング待ち': { bg: '#fef3c7', color: '#92400e' },
  };
  const c = colorMap[text] || { bg: '#f3f4f6', color: '#374151' };
  return <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10 }}>{text}</span>;
}

const th = { padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' };
const thRight = { ...th, textAlign: 'right' };
const td = { padding: '12px 14px', fontSize: 13, color: COLORS.text };
const tdRight = { ...td, textAlign: 'right' };
