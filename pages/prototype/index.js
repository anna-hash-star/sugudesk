import { useState } from 'react';
import Link from 'next/link';
import { clinics, candidates, operatorAlerts } from '../../lib/prototypeMockData';

const COLORS = {
  primary: '#2563a8',
  bg: '#f8f7f4',
  white: 'white',
  text: '#333',
  textLight: '#666',
  textMuted: '#999',
  border: '#e5e5e5',
  success: '#10b981',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#3b82f6',
};

export default function PrototypeDashboard() {
  return (
    <Layout activeClinicId={null}>
      <div style={{ padding: '32px 40px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 8 }}>
          オペレーションダッシュボード
        </h1>
        <p style={{ fontSize: 14, color: COLORS.textLight, margin: 0, marginBottom: 32 }}>
          2026年6月3日（火）
        </p>

        {/* 今日のタスク */}
        <Section title="今日のタスク・アラート">
          {operatorAlerts.map((alert, i) => (
            <div
              key={i}
              style={{
                background: COLORS.white,
                borderRadius: 8,
                padding: '14px 20px',
                marginBottom: 8,
                border: `1px solid ${COLORS.border}`,
                borderLeft: `4px solid ${alert.type === 'alert' ? COLORS.warning : COLORS.info}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: alert.type === 'alert' ? COLORS.warning : COLORS.info,
                    textTransform: 'uppercase',
                    marginRight: 12,
                  }}
                >
                  {alert.type === 'alert' ? 'ALERT' : 'TASK'}
                </span>
                <span style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>
                  {alert.clinic}
                </span>
                <span style={{ fontSize: 14, color: COLORS.textLight, marginLeft: 12 }}>
                  {alert.text}
                </span>
              </div>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{alert.dueDate}</span>
            </div>
          ))}
        </Section>

        {/* 今月の集計 */}
        <Section title="今月の集計（全院）">
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={thStyle}>院</th>
                  <th style={thStyle}>業種</th>
                  <th style={thStyle}>ステータス</th>
                  <th style={thStyleRight}>応募</th>
                  <th style={thStyleRight}>面接</th>
                  <th style={thStyleRight}>採用</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((c) => {
                  const cards = candidates[c.id] || [];
                  const apps = cards.filter((x) => x.status === '応募').length;
                  const intvs = cards.filter((x) => ['面接予定', '面接実施'].includes(x.status)).length;
                  const hires = cards.filter((x) => x.status === '採用' || x.status === '内定').length;
                  return (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </td>
                      <td style={tdStyle}>{c.specialty}</td>
                      <td style={tdStyle}>
                        <StatusBadge status={c.status} />
                      </td>
                      <td style={tdStyleRight}>{apps}</td>
                      <td style={tdStyleRight}>{intvs}</td>
                      <td style={tdStyleRight}>{hires}</td>
                      <td style={tdStyle}>
                        <Link href={`/prototype/clinic/${c.id}`}>
                          <span style={{ color: COLORS.primary, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                            院詳細を開く →
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* クイックアクション */}
        <Section title="クイックアクション">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <ActionCard
              title="新規スカウト生成"
              description="AIで業種別・条件別にスカウト文面を生成"
              href="/prototype/clinic/luna_ladies?tab=scout"
            />
            <ActionCard
              title="月次レポート確認"
              description="院ごとのROIレポートをAI生成・編集"
              href="/prototype/clinic/luna_ladies?tab=report"
            />
            <ActionCard
              title="案件進捗の確認"
              description="候補者ステータスをカンバンで管理"
              href="/prototype/clinic/luna_ladies?tab=kanban"
            />
          </div>
        </Section>
      </div>
    </Layout>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: 0, marginBottom: 16 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    'パイロット中': { bg: '#dcfce7', color: '#166534' },
    'ヒアリング待ち': { bg: '#fef3c7', color: '#92400e' },
    '本契約': { bg: '#dbeafe', color: '#1e40af' },
  };
  const c = colorMap[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        fontSize: 12,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 12,
      }}
    >
      {status}
    </span>
  );
}

function ActionCard({ title, description, href }) {
  return (
    <Link href={href}>
      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: '20px 24px',
          minWidth: 240,
          flex: 1,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: COLORS.textLight }}>{description}</div>
      </div>
    </Link>
  );
}

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.textLight,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
const thStyleRight = { ...thStyle, textAlign: 'right' };
const tdStyle = { padding: '14px 16px', fontSize: 14, color: COLORS.text };
const tdStyleRight = { ...tdStyle, textAlign: 'right' };

export function Layout({ children, activeClinicId }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg, fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif' }}>
      <Sidebar activeClinicId={activeClinicId} />
      <main style={{ flex: 1, marginLeft: 240 }}>{children}</main>
    </div>
  );
}

function Sidebar({ activeClinicId }) {
  return (
    <aside
      style={{
        width: 240,
        background: COLORS.white,
        borderRight: `1px solid ${COLORS.border}`,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        padding: '24px 0',
      }}
    >
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>SuguDesk</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Operations Console</div>
      </div>

      <nav>
        <SidebarLink href="/prototype" label="ダッシュボード" active={!activeClinicId} />
        <div
          style={{
            padding: '24px 24px 8px',
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          院一覧
        </div>
        {clinics.map((c) => (
          <SidebarLink
            key={c.id}
            href={`/prototype/clinic/${c.id}`}
            label={c.name}
            active={activeClinicId === c.id}
            small
          />
        ))}
      </nav>

      <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24, fontSize: 11, color: COLORS.textMuted }}>
        プロトタイプ環境
        <br />
        モックデータで動作中
      </div>
    </aside>
  );
}

function SidebarLink({ href, label, active, small }) {
  return (
    <Link href={href}>
      <div
        style={{
          padding: small ? '8px 24px' : '10px 24px',
          fontSize: small ? 13 : 14,
          fontWeight: active ? 600 : 500,
          color: active ? COLORS.primary : COLORS.text,
          background: active ? '#eff6ff' : 'transparent',
          borderLeft: active ? `3px solid ${COLORS.primary}` : '3px solid transparent',
          cursor: 'pointer',
        }}
      >
        {label}
      </div>
    </Link>
  );
}
