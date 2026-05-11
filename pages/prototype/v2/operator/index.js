import Link from 'next/link';
import { useState } from 'react';
import { clinics, candidates, operatorAlerts, agencies, agencyMetricsByClinic, clinicRequests, REQUEST_TYPES } from '../../../../lib/prototypeMockData';

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

        {/* 院長依頼キュー（チャット駆動UXからの依頼） */}
        <Section title="院長からの依頼キュー（チャット駆動）">
          <ClinicRequestsQueue />
        </Section>

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

        {/* 紹介会社 × 院 マトリクス（院別管理） */}
        <Section title="紹介会社 × 院 実績マトリクス">
          <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={th}>紹介会社</th>
                  {clinics.filter((c) => Object.keys(agencyMetricsByClinic[c.id] || {}).length > 0).map((c) => (
                    <th key={c.id} colSpan={3} style={{ ...th, textAlign: 'center', borderLeft: `1px solid ${COLORS.border}` }}>{c.name}</th>
                  ))}
                </tr>
                <tr style={{ background: '#fafafa', borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={th}></th>
                  {clinics.filter((c) => Object.keys(agencyMetricsByClinic[c.id] || {}).length > 0).map((c) => (
                    <>
                      <th key={`${c.id}-i`} style={{ ...thRight, fontSize: 10, borderLeft: `1px solid ${COLORS.border}` }}>紹介</th>
                      <th key={`${c.id}-h`} style={{ ...thRight, fontSize: 10 }}>採用</th>
                      <th key={`${c.id}-r`} style={{ ...thRight, fontSize: 10 }}>成約率</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agencies.map((a) => (
                  <tr key={a.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={td}>
                      <strong>{a.name}</strong>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>担当: {a.contactPerson} / 料率 {a.feeRate}%</div>
                    </td>
                    {clinics.filter((c) => Object.keys(agencyMetricsByClinic[c.id] || {}).length > 0).map((c) => {
                      const m = agencyMetricsByClinic[c.id]?.[a.id];
                      if (!m) return (
                        <>
                          <td key={`${c.id}-i`} style={{ ...tdRight, color: COLORS.textMuted, borderLeft: `1px solid ${COLORS.border}` }}>-</td>
                          <td key={`${c.id}-h`} style={{ ...tdRight, color: COLORS.textMuted }}>-</td>
                          <td key={`${c.id}-r`} style={{ ...tdRight, color: COLORS.textMuted }}>-</td>
                        </>
                      );
                      const rate = m.introductions > 0 ? Math.round(m.hires / m.introductions * 100) : 0;
                      return (
                        <>
                          <td key={`${c.id}-i`} style={{ ...tdRight, borderLeft: `1px solid ${COLORS.border}` }}>{m.introductions}</td>
                          <td key={`${c.id}-h`} style={tdRight}>{m.hires}</td>
                          <td key={`${c.id}-r`} style={{ ...tdRight, fontWeight: 600, color: rate >= 20 ? COLORS.warning : COLORS.text }}>{rate}%</td>
                        </>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 8 }}>
            ※ 詳細（要望履歴・手数料・平均返信日数等）は各院の「院詳細 → 紹介会社管理」タブで確認できます
          </div>
        </Section>
      </main>
    </div>
  );
}

function ClinicRequestsQueue() {
  const [filter, setFilter] = useState('all');
  const [requests, setRequests] = useState(clinicRequests);

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const newCount = requests.filter((r) => r.status === '新規').length;
  const inProgressCount = requests.filter((r) => r.status === 'AI下書き作成中' || r.status === '対応中').length;

  const updateStatus = (id, newStatus) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <FilterChip label={`全て（${requests.length}）`} active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterChip label={`🆕 新規（${newCount}）`} active={filter === '新規'} onClick={() => setFilter('新規')} color={COLORS.warning} />
        <FilterChip label={`▶ 対応中（${inProgressCount}）`} active={filter === '対応中'} onClick={() => setFilter('対応中')} color={COLORS.info} />
        <FilterChip label="✓ 完了" active={filter === '完了'} onClick={() => setFilter('完了')} color={COLORS.success} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}>該当する依頼はありません</div>
        ) : (
          filtered.map((r, i) => {
            const typeInfo = REQUEST_TYPES[r.type] || { icon: '📌', label: 'その他' };
            return (
              <div key={r.id} style={{ padding: 16, borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : 'none', borderLeft: `4px solid ${r.priority === 'high' ? COLORS.danger : r.status === '新規' ? COLORS.warning : COLORS.info}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{typeInfo.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight }}>{typeInfo.label}</span>
                      <strong style={{ fontSize: 13 }}>{r.clinicName}</strong>
                      {r.priority === 'high' && <span style={{ fontSize: 10, padding: '2px 6px', background: '#fee2e2', color: COLORS.danger, borderRadius: 4, fontWeight: 700 }}>HIGH</span>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{r.summary}</div>
                    <div style={{ fontSize: 12, color: COLORS.textLight, padding: 8, background: COLORS.bg, borderRadius: 4, marginBottom: 6 }}>{r.detail}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>依頼受信：{r.requestedAt}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, minWidth: 130 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12, background: r.status === '新規' ? '#fef3c7' : r.status === '完了' ? '#dcfce7' : '#dbeafe', color: r.status === '新規' ? '#92400e' : r.status === '完了' ? '#166534' : '#1e40af' }}>{r.status}</span>
                    {r.status === '新規' && (
                      <button onClick={() => updateStatus(r.id, '対応中')} style={{ ...mini, background: COLORS.primary, color: 'white', border: 'none' }}>対応開始</button>
                    )}
                    {(r.status === '対応中' || r.status === 'AI下書き作成中') && (
                      <button onClick={() => updateStatus(r.id, '完了')} style={{ ...mini, background: COLORS.success, color: 'white', border: 'none' }}>完了にする</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: `1px solid ${active ? (color || COLORS.primary) : COLORS.border}`, background: active ? (color || COLORS.primary) : COLORS.white, color: active ? 'white' : COLORS.text, borderRadius: 16, cursor: 'pointer' }}>
      {label}
    </button>
  );
}

const mini = { padding: '5px 12px', fontSize: 11, fontWeight: 600, borderRadius: 4, cursor: 'pointer' };

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
