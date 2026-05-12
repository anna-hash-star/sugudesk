import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  clinics,
  candidates,
  todayActions,
  monthlyReports,
  interviewArtifacts,
  STATUSES,
  agencies,
  agencyMetricsByClinic,
  agencyRequestsByClinic,
  mediaMetricsByClinic,
  funnelByClinic,
  jobPostingsByClinic,
  jobPostingDetails,
  jobPostingExtended,
  corporations,
  facilities,
  scoutTemplates,
  monthlyScoutStats,
  retentionKPI,
} from '../../../../lib/prototypeMockData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LineChart, Line, CartesianGrid, Legend, PieChart, Pie } from 'recharts';

const COLORS = {
  primary: '#2563a8',
  primaryDark: '#1e4d80',
  primaryLight: '#eff6ff',
  accent: '#6366f1',
  bg: '#f5f7fb',
  bgAlt: '#fafbfd',
  white: '#ffffff',
  text: '#0f172a',
  textLight: '#475569',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  alertBg: '#fef3c7',
  alertText: '#92400e',
  shadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
  shadowMd: '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
  shadowLg: '0 10px 30px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.04)',
};

export default function ClinicPortal() {
  const router = useRouter();
  const { id, action } = router.query;
  const [chatOpen, setChatOpen] = useState(false);
  const clinic = clinics.find((c) => c.id === id);
  if (!clinic) return null;

  const actions = todayActions[id] || { pendingDocReview: [], upcomingInterviews: [], pendingHireDecision: [], pendingCommunicationRequests: [] };
  const cases = candidates[id] || [];

  // チャットを別ウィンドウのフルチャットページとして開いた場合は通常のレイアウト
  const isFullChatPage = action === 'chat';

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: '"Inter", "Hiragino Sans", "Noto Sans JP", sans-serif' }}>
      <Header clinic={clinic} />
      <main style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 24px 80px' }}>
        {(!action || action === 'dashboard') && <DashboardView clinic={clinic} actions={actions} cases={cases} />}
        {action === 'chat' && <ChatView clinic={clinic} actions={actions} />}
        {action === 'jobs' && <JobsView clinic={clinic} />}
        {action === 'media-scouts' && <MediaScoutsView clinic={clinic} />}
        {action === 'agencies' && <AgenciesView clinic={clinic} />}
        {action === 'jobs-scouts' && <JobsView clinic={clinic} />}
        {action === 'interview-prep' && <InterviewPrepView clinic={clinic} actions={actions} />}
        {action === 'interview-debrief' && <InterviewDebriefView clinic={clinic} cases={cases} />}
        {action === 'communication-request' && <CommunicationRequestView clinic={clinic} cases={cases} actions={actions} />}
        {action === 'monthly-report' && <MonthlyReportView clinic={clinic} />}
      </main>
      {/* フローティングチャット（全画面で常時アクセス可能。フルチャットページでは非表示） */}
      {!isFullChatPage && <FloatingChat clinic={clinic} actions={actions} open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />}
    </div>
  );
}

function Header({ clinic }) {
  const router = useRouter();
  const { action } = router.query;
  const isHome = !action || action === 'dashboard';
  return (
    <header style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '14px 24px', boxShadow: COLORS.shadow, position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15 }}>S</div>
          <div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SuguDesk 採用管理</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginTop: 2 }}>{clinic.name}</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Link href={`/prototype/v2/clinic-portal/${clinic.id}`}><button style={{ ...headerTab, ...(isHome ? activeTab : {}) }}>🏠 ホーム</button></Link>
          <Link href={`/prototype/v2/clinic-portal/${clinic.id}?action=jobs`}><button style={{ ...headerTab, ...(action === 'jobs' || action === 'jobs-scouts' ? activeTab : {}) }}>📋 求人管理</button></Link>
          <Link href={`/prototype/v2/clinic-portal/${clinic.id}?action=media-scouts`}><button style={{ ...headerTab, ...(action === 'media-scouts' ? activeTab : {}) }}>📰 媒体・スカウト</button></Link>
          <Link href={`/prototype/v2/clinic-portal/${clinic.id}?action=agencies`}><button style={{ ...headerTab, ...(action === 'agencies' ? activeTab : {}) }}>🤝 紹介会社</button></Link>
        </nav>
      </div>
    </header>
  );
}

const headerTab = { padding: '8px 16px', fontSize: 13, fontWeight: 600, color: COLORS.textLight, background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' };
const activeTab = { background: COLORS.primaryLight, color: COLORS.primary };


function DashboardView({ clinic, actions, cases }) {
  const router = useRouter();
  const goAction = (a) => router.push(`/prototype/v2/clinic-portal/${clinic.id}?action=${a}`);

  const totalActions = actions.pendingDocReview.length + actions.upcomingInterviews.length + actions.pendingHireDecision.length;

  return (
    <div>
      {/* ヒーロー：ホームページ風の挨拶 */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 4 }}>こんにちは 👋</h1>
        <p style={{ fontSize: 14, color: COLORS.textLight, margin: 0 }}>
          今日のアクション{totalActions > 0 ? `は ${totalActions}件` : 'はありません'}。チャットは右下からいつでも呼び出せます。
        </p>
      </div>

      {/* 辞めない採用 KPI（ミスマッチ防止訴求） */}
      <Section icon="🎯" title="辞めない採用 KPI">
        <RetentionKPISection clinicId={clinic.id} />
      </Section>
      {/* 今日のアクション */}
      <Section icon="📌" title="今日のアクション">
        {totalActions === 0 ? (
          <EmptyBox text="アクション待ちはありません" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {actions.pendingDocReview.length > 0 && (
              <ActionCard
                color={COLORS.warning}
                icon="⚠"
                title={`書類確認待ち ${actions.pendingDocReview.length}名`}
                detail={actions.pendingDocReview.map((d) => `${d.caseId}（${d.role}・${d.source}・${d.daysWaiting}日待ち）`).join(' / ')}
              />
            )}
            {actions.upcomingInterviews.length > 0 && (
              <ActionCard
                color={COLORS.primary}
                icon="📅"
                title={`面接予定 ${actions.upcomingInterviews.length}件`}
                detail={actions.upcomingInterviews.map((i) => `${i.date} ${i.time} ${i.caseId}（${i.role}）`).join(' / ')}
                actionLabel="面接質問を準備"
                onAction={() => goAction('interview-prep')}
              />
            )}
            {actions.pendingHireDecision.length > 0 && (
              <ActionCard
                color={COLORS.success}
                icon="✅"
                title={`採用判断待ち ${actions.pendingHireDecision.length}名`}
                detail={actions.pendingHireDecision.map((p) => `${p.caseId}（${p.role}、面接 ${p.interviewDate}）`).join(' / ')}
              />
            )}
            {actions.pendingCommunicationRequests.length > 0 && (
              <ActionCard
                color={COLORS.textLight}
                icon="💬"
                title={`連絡依頼 ${actions.pendingCommunicationRequests.length}件 進行中`}
                detail={actions.pendingCommunicationRequests.map((c) => `${c.caseId} - ${c.scene}（${c.status}）`).join(' / ')}
              />
            )}
          </div>
        )}
      </Section>

      {/* 進行中の案件 */}
      <Section icon="📊" title="進行中の案件">
        <CaseSummary cases={cases} />
      </Section>

      {/* AI支援メニュー */}
      <Section icon="🤖" title="AI支援">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <FeatureCard
            icon="🎤"
            title="面接質問の準備"
            description="候補者に合わせて、AIが面接で聞くべき質問例を生成します"
            buttonLabel="使う"
            onClick={() => goAction('interview-prep')}
          />
          <FeatureCard
            icon="📝"
            title="面接の振り返り"
            description="Zoomの書き出しをアップロードすると、AIが要約と評価ドラフトを作成します"
            buttonLabel="使う"
            onClick={() => goAction('interview-debrief')}
          />
          <FeatureCard
            icon="💬"
            title="候補者への連絡を依頼"
            description="採用通知や質問への回答など、連絡文の作成を当社に依頼できます"
            buttonLabel="使う"
            onClick={() => goAction('communication-request')}
          />
        </div>
      </Section>

      {/* 媒体・紹介会社の効果 */}
      <Section icon="💹" title="媒体・紹介会社の効果（5月）">
        <MediaAgencyEffectiveness clinicId={clinic.id} />
      </Section>

      {/* 詳細分析（HERP DataHub的） */}
      <Section icon="📊" title="詳細分析：歩留まり・リードタイム・採用構成">
        <FunnelAnalytics clinicId={clinic.id} />
      </Section>

      {/* 月次レポート */}
      <Section icon="📈" title="月次レポート">
        <MonthlyReportCard clinic={clinic} onClick={() => goAction('monthly-report')} />
      </Section>

      <div style={{ textAlign: 'center', padding: '24px 0', color: COLORS.textMuted, fontSize: 11 }}>
        プロトタイプ環境（モックデータで動作）
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 12 }}>
        <span style={{ marginRight: 8 }}>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ActionCard({ color, icon, title, detail, actionLabel, onAction }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 10,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `4px solid ${color}`,
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>
            <span style={{ marginRight: 6 }}>{icon}</span>
            {title}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 1.6 }}>{detail}</div>
        </div>
        {actionLabel && (
          <button onClick={onAction} style={chipButton}>
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 10, border: `1px dashed ${COLORS.border}`, padding: 24, textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}>
      {text}
    </div>
  );
}

function CaseSummary({ cases }) {
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = cases.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {STATUSES.map((s) => (
          <div key={s} style={{ flex: '1 1 120px', minWidth: 100, padding: 12, background: counts[s] > 0 ? COLORS.primaryLight : '#fafafa', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 2 }}>{s}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: counts[s] > 0 ? COLORS.primary : COLORS.textMuted }}>{counts[s]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
        詳細はSuguDeskオペレーションチームが管理しています
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, buttonLabel, onClick }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        padding: 20,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 16, lineHeight: 1.5, flex: 1 }}>{description}</div>
      <button style={{ ...primaryButton, alignSelf: 'flex-start' }} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {buttonLabel} →
      </button>
    </div>
  );
}

function FunnelAnalytics({ clinicId }) {
  const data = funnelByClinic[clinicId];
  if (!data || data.sources.length === 0) {
    return <EmptyBox text="まだ分析データがありません" />;
  }

  const totals = data.sources.reduce(
    (acc, s) => ({
      entry: acc.entry + s.entry,
      docPass: acc.docPass + s.docPass,
      interviewScheduled: acc.interviewScheduled + s.interviewScheduled,
      interviewDone: acc.interviewDone + s.interviewDone,
      offer: acc.offer + s.offer,
      hire: acc.hire + s.hire,
      active: acc.active + s.active,
    }),
    { entry: 0, docPass: 0, interviewScheduled: 0, interviewDone: 0, offer: 0, hire: 0, active: 0 }
  );

  const pct = (num, den) => den > 0 ? Math.round(num / den * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted }}>分析期間：{data.period}</div>

      {/* 応募経路別 歩留まりテーブル */}
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16, overflow: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>応募経路別 歩留まり</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={th}>応募経路</th>
              <th style={thRight}>応募</th>
              <th style={{ ...thCenter, color: COLORS.textMuted, padding: '6px 4px' }}>→</th>
              <th style={thRight}>書類通過</th>
              <th style={{ ...thCenter, color: COLORS.textMuted, padding: '6px 4px' }}>→</th>
              <th style={thRight}>面接実施</th>
              <th style={{ ...thCenter, color: COLORS.textMuted, padding: '6px 4px' }}>→</th>
              <th style={thRight}>内定</th>
              <th style={{ ...thCenter, color: COLORS.textMuted, padding: '6px 4px' }}>→</th>
              <th style={thRight}>採用</th>
              <th style={thRight}>リードタイム</th>
              <th style={thRight}>選考中</th>
            </tr>
          </thead>
          <tbody>
            {data.sources.map((s, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={td}>
                  <strong>{s.source}</strong>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{s.category}</div>
                </td>
                <td style={tdRight}>{s.entry}</td>
                <PctCell value={pct(s.docPass, s.entry)} />
                <td style={tdRight}>{s.docPass}</td>
                <PctCell value={pct(s.interviewDone, s.docPass)} />
                <td style={tdRight}>{s.interviewDone}</td>
                <PctCell value={pct(s.offer, s.interviewDone)} />
                <td style={tdRight}>{s.offer}</td>
                <PctCell value={pct(s.hire, s.offer)} />
                <td style={{ ...tdRight, fontWeight: 700, color: s.hire > 0 ? COLORS.success : COLORS.text }}>{s.hire}</td>
                <td style={tdRight}>{s.leadTimeDays ? `${s.leadTimeDays}日` : '-'}</td>
                <td style={{ ...tdRight, color: s.active > 0 ? COLORS.primary : COLORS.textMuted }}>{s.active}</td>
              </tr>
            ))}
            <tr style={{ background: '#f3f4f6', fontWeight: 700 }}>
              <td style={td}>合計</td>
              <td style={tdRight}>{totals.entry}</td>
              <PctCell value={pct(totals.docPass, totals.entry)} />
              <td style={tdRight}>{totals.docPass}</td>
              <PctCell value={pct(totals.interviewDone, totals.docPass)} />
              <td style={tdRight}>{totals.interviewDone}</td>
              <PctCell value={pct(totals.offer, totals.interviewDone)} />
              <td style={tdRight}>{totals.offer}</td>
              <PctCell value={pct(totals.hire, totals.offer)} />
              <td style={{ ...tdRight, color: COLORS.success }}>{totals.hire}</td>
              <td style={tdRight}>-</td>
              <td style={tdRight}>{totals.active}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2カラム：ステージ別遷移率 + 採用構成 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
        {/* ステージ別遷移率 */}
        <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>応募経路別 ステージ別遷移率</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.sources.map((s) => ({
              name: s.source,
              '応募→書類': pct(s.docPass, s.entry),
              '書類→面接': pct(s.interviewDone, s.docPass),
              '面接→内定': pct(s.offer, s.interviewDone),
              '内定→採用': pct(s.hire, s.offer),
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="応募→書類" fill="#93c5fd" />
              <Bar dataKey="書類→面接" fill="#60a5fa" />
              <Bar dataKey="面接→内定" fill="#3b82f6" />
              <Bar dataKey="内定→採用" fill="#2563a8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 採用構成 */}
        <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>採用の経路内訳</div>
          {totals.hire > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.sources.filter((s) => s.hire > 0).map((s) => ({ name: s.source, value: s.hire }))}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={(e) => `${e.name}: ${e.value}`}
                >
                  {data.sources.filter((s) => s.hire > 0).map((s, i) => (
                    <Cell key={i} fill={['#2563a8', '#60a5fa', '#93c5fd', '#dbeafe', '#10b981', '#34d399'][i % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textMuted, fontSize: 13 }}>
              採用実績がまだありません
            </div>
          )}
          <div style={{ marginTop: 8, padding: 10, background: COLORS.bg, borderRadius: 6, fontSize: 11, color: COLORS.textLight }}>
            <strong>採用合計：{totals.hire}名</strong>　／　選考中：{totals.active}名
          </div>
        </div>
      </div>

      {/* 月次推移 */}
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>月次推移（応募・面接・採用）</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="応募" stroke="#93c5fd" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="面接" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="採用" stroke="#2563a8" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* インサイト */}
      <div style={{ background: '#fffbeb', borderRadius: 10, border: `1px solid #fcd34d`, padding: 14, fontSize: 12, color: '#78350f' }}>
        <strong>💡 AIインサイト（参考）</strong>
        <ul style={{ margin: '6px 0 0 0', paddingLeft: 18, lineHeight: 1.7 }}>
          <li>マイナビ看護師の成約率（紹介→採用 20%）が最も高い。手数料負担はあるが質の高い候補者層。</li>
          <li>スカウト返信は応募数が多い割に採用に至っていない（書類通過率40%、面接到達20%）。スカウト先のスクリーニング条件を見直し推奨。</li>
          <li>Indeedは応募→採用転換率10%、リードタイム18日と堅実。出稿継続を推奨。</li>
        </ul>
      </div>
    </div>
  );
}

function PctCell({ value }) {
  const color = value >= 50 ? '#10b981' : value >= 30 ? '#3b82f6' : value >= 15 ? '#f59e0b' : '#9ca3af';
  return (
    <td style={{ ...tdCenter, fontSize: 10, color, fontWeight: 600, padding: '6px 4px' }}>
      {value > 0 ? `${value}%` : '-'}
    </td>
  );
}

const thCenter = { padding: '10px 6px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdCenter = { padding: '10px 6px', textAlign: 'center', fontSize: 12, color: COLORS.text };

function MediaAgencyEffectiveness({ clinicId }) {
  const mediaList = mediaMetricsByClinic[clinicId]?.['2026-05'] || [];
  const clinicAgencyMetrics = agencyMetricsByClinic[clinicId] || {};
  const usedAgencies = agencies.filter((a) => clinicAgencyMetrics[a.id]);

  if (mediaList.length === 0 && usedAgencies.length === 0) {
    return <EmptyBox text="まだ実績データがありません" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 媒体別 */}
      {mediaList.length > 0 && (
        <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>📰 求人媒体</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 12 }}>媒体別の出稿金額・応募・採用と費用対効果</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={th}>媒体</th>
                <th style={thRight}>出稿金額</th>
                <th style={thRight}>応募</th>
                <th style={thRight}>面接</th>
                <th style={thRight}>採用</th>
                <th style={thRight}>CPA</th>
                <th style={thRight}>CPH</th>
              </tr>
            </thead>
            <tbody>
              {mediaList.map((m, i) => (
                <tr key={i} style={{ borderBottom: i < mediaList.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                  <td style={td}>
                    <strong>{m.media}</strong>
                    {m.note && <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{m.note}</div>}
                  </td>
                  <td style={tdRight}>¥{m.cost.toLocaleString()}</td>
                  <td style={tdRight}>{m.applications}</td>
                  <td style={tdRight}>{m.interviews}</td>
                  <td style={tdRight}><strong>{m.hires}</strong></td>
                  <td style={tdRight}>{m.cpa > 0 ? `¥${m.cpa.toLocaleString()}` : '-'}</td>
                  <td style={tdRight}>{m.cph > 0 ? `¥${m.cph.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            CPA = 出稿金額 ÷ 応募数（応募1件あたり費用）／ CPH = 出稿金額 ÷ 採用数（採用1名あたり費用）
          </div>
        </div>
      )}

      {/* 紹介会社別 */}
      {usedAgencies.length > 0 && (
        <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🤝 紹介会社</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 12 }}>紹介会社別の実績・成約率・支払手数料</div>
          {usedAgencies.map((a, i) => {
            const m = clinicAgencyMetrics[a.id];
            const successRate = m.introductions > 0 ? Math.round(m.hires / m.introductions * 100) : 0;
            return (
              <div key={a.id} style={{ padding: '12px 0', borderBottom: i < usedAgencies.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
                      担当：{a.contactPerson} ／ 料率：年収の{a.feeRate}% ／ 平均返信：{m.avgReplyDays.toFixed(1)}日
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>成約率</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: successRate >= 20 ? COLORS.success : successRate >= 10 ? COLORS.text : COLORS.warning }}>{successRate}%</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  <MiniStat label="紹介" value={m.introductions} />
                  <MiniStat label="書類通過" value={m.docPasses} />
                  <MiniStat label="面接" value={m.interviews} />
                  <MiniStat label="採用" value={m.hires} highlight />
                  <MiniStat label="支払手数料" value={`¥${(m.totalFeePaid / 10000).toFixed(0)}万`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, highlight }) {
  return (
    <div style={{ textAlign: 'center', padding: 8, background: highlight ? COLORS.primaryLight : COLORS.bg, borderRadius: 6 }}>
      <div style={{ fontSize: 10, color: COLORS.textLight }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: highlight ? COLORS.primary : COLORS.text }}>{value}</div>
    </div>
  );
}

const th = { padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' };
const thRight = { ...th, textAlign: 'right' };
const td = { padding: '10px 12px', fontSize: 13, color: COLORS.text };
const tdRight = { ...td, textAlign: 'right' };

function MonthlyReportCard({ clinic, onClick }) {
  const report = monthlyReports[clinic.id];
  if (!report) {
    return <EmptyBox text="この院のレポートはまだありません" />;
  }
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 10,
        border: `1px solid ${COLORS.border}`,
        padding: 20,
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{report.month} 月次レポート</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>発行 {report.issuedAt}</div>
        </div>
        <span style={{ color: COLORS.primary, fontSize: 13, fontWeight: 600 }}>開く →</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <Stat label="応募" value={report.summary.applications} />
        <Stat label="面接" value={report.summary.interviews} />
        <Stat label="採用" value={report.summary.hires} />
        <Stat label="費用合計" value={`¥${(report.summary.totalCost / 1000).toFixed(0)}k`} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center', padding: 10, background: COLORS.bg, borderRadius: 6 }}>
      <div style={{ fontSize: 11, color: COLORS.textLight }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{value}</div>
    </div>
  );
}

// ====================================================================
// AI支援ビュー
// ====================================================================

function BackLink({ clinicId }) {
  return (
    <Link href={`/prototype/v2/clinic-portal/${clinicId}`}>
      <span style={{ color: COLORS.primary, fontSize: 13, cursor: 'pointer', display: 'inline-block', marginBottom: 16 }}>
        ← ダッシュボードへ戻る
      </span>
    </Link>
  );
}

function ViewHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 4 }}>
        <span style={{ marginRight: 10 }}>{icon}</span>
        {title}
      </h1>
      <p style={{ fontSize: 13, color: COLORS.textLight, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

// ============== 紹介会社ビュー ==============
function AgenciesView({ clinic }) {
  const router = useRouter();
  const goChat = (msg) => router.push(`/prototype/v2/clinic-portal/${clinic.id}?action=chat&prefill=${encodeURIComponent(msg)}`);

  const clinicMetrics = agencyMetricsByClinic[clinic.id] || {};
  const clinicRequests = agencyRequestsByClinic[clinic.id] || {};
  const usedAgencies = agencies.filter((a) => clinicMetrics[a.id]);

  // 全件の合計
  const totals = usedAgencies.reduce((acc, a) => {
    const m = clinicMetrics[a.id];
    return { intro: acc.intro + m.introductions, hires: acc.hires + m.hires, fee: acc.fee + m.totalFeePaid };
  }, { intro: 0, hires: 0, fee: 0 });

  return (
    <div>
      <ViewHeader icon="🤝" title="紹介会社" subtitle="契約中の人材紹介会社の実績と要望履歴を管理します。修正や追加はチャットからどうぞ。" />

      {/* サマリーカード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <SummaryCard label="契約中" value={`${usedAgencies.length}社`} />
        <SummaryCard label="累計紹介数" value={`${totals.intro}件`} />
        <SummaryCard label="累計採用数" value={`${totals.hires}件`} highlight />
        <SummaryCard label="支払手数料合計" value={`¥${(totals.fee / 10000).toFixed(0)}万`} />
      </div>

      {/* 紹介会社一覧 */}
      <Section icon="🏢" title={`契約中の紹介会社（${usedAgencies.length}社）`}>
        {usedAgencies.length === 0 ? (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px dashed ${COLORS.border}`, padding: 40, textAlign: 'center', boxShadow: COLORS.shadow }}>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 12 }}>まだ紹介会社が登録されていません</div>
            <button onClick={() => goChat('紹介会社を追加したい')} style={primaryButton}>💬 チャットで紹介会社を追加</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {usedAgencies.map((a) => (
              <AgencyCard key={a.id} agency={a} metrics={clinicMetrics[a.id]} requests={clinicRequests[a.id] || []} onRequestChat={() => goChat(`${a.name}に要望を伝達したい`)} onAddRequest={() => goChat(`${a.name}に新しい要望を伝達`)} />
            ))}
            <button onClick={() => goChat('新しい紹介会社を追加')} style={{ ...secondaryButton, alignSelf: 'flex-start' }}>+ 新しい紹介会社を追加（チャット）</button>
          </div>
        )}
      </Section>

      {/* 直近の要望履歴（全紹介会社まとめ） */}
      <Section icon="📋" title="直近の要望伝達履歴（全紹介会社）">
        <RecentRequestsList clinicRequests={clinicRequests} agencyMap={Object.fromEntries(agencies.map((a) => [a.id, a]))} />
      </Section>
    </div>
  );
}

function SummaryCard({ label, value, highlight }) {
  return (
    <div style={{ background: highlight ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})` : COLORS.white, color: highlight ? 'white' : COLORS.text, borderRadius: 12, border: highlight ? 'none' : `1px solid ${COLORS.border}`, padding: 16, boxShadow: COLORS.shadow }}>
      <div style={{ fontSize: 11, opacity: highlight ? 0.85 : 0.6, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function AgencyCard({ agency: initialAgency, metrics, requests, onRequestChat, onAddRequest }) {
  const [agency, setAgency] = useState(initialAgency);
  const [expanded, setExpanded] = useState(false);
  const updateField = (key, value) => setAgency({ ...agency, [key]: value });

  const successRate = metrics.introductions > 0 ? Math.round(metrics.hires / metrics.introductions * 100) : 0;
  const activeReqs = requests.filter((r) => r.status === '対応中').length;

  return (
    <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 22, boxShadow: COLORS.shadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{agency.name}</span>
            <span style={{ fontSize: 11, padding: '3px 10px', background: '#dcfce7', color: '#166534', borderRadius: 12, fontWeight: 600 }}>{agency.contractStatus}</span>
            {activeReqs > 0 && <span style={{ fontSize: 11, padding: '3px 10px', background: '#fef3c7', color: '#92400e', borderRadius: 12, fontWeight: 600 }}>要望対応中 {activeReqs}件</span>}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>最終紹介日：{metrics.lastIntroductionDate || '-'}</div>
        </div>
        <button onClick={onRequestChat} style={{ ...secondaryButton, fontSize: 11, padding: '6px 12px' }}>💬 要望を伝達</button>
      </div>

      {/* メトリクス4列 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        <MiniMetric label="紹介" value={metrics.introductions} />
        <MiniMetric label="書類通過" value={metrics.docPasses} />
        <MiniMetric label="面接" value={metrics.interviews} />
        <MiniMetric label="採用" value={metrics.hires} highlight={metrics.hires > 0} />
      </div>

      {/* 成約率・手数料・返信日数 */}
      <div style={{ display: 'flex', gap: 16, padding: '12px 14px', background: COLORS.bgAlt, borderRadius: 8, marginBottom: 14, fontSize: 12, flexWrap: 'wrap' }}>
        <div>成約率：<strong style={{ color: successRate >= 20 ? COLORS.success : successRate >= 10 ? COLORS.text : COLORS.warning, fontSize: 13 }}>{successRate}%</strong></div>
        <div>支払手数料：<strong style={{ fontSize: 13 }}>¥{metrics.totalFeePaid.toLocaleString()}</strong></div>
        <div>平均返信日数：<strong style={{ fontSize: 13 }}>{metrics.avgReplyDays.toFixed(1)}日</strong></div>
      </div>

      {/* 連絡先情報（インライン編集可） */}
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>担当者</div>
        <EditableField value={agency.contactPerson} onSave={(v) => updateField('contactPerson', v)} />
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>連絡先</div>
        <EditableField value={agency.contactEmail} onSave={(v) => updateField('contactEmail', v)} />
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>手数料率</div>
        <EditableField value={`年収の${agency.feeRate}%`} onSave={(v) => updateField('feeRate', parseInt(v.replace(/[^0-9]/g, '')) || agency.feeRate)} />
      </div>

      {/* 要望履歴 */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
        <button onClick={() => setExpanded(!expanded)} style={{ ...secondaryButton, width: '100%', fontSize: 12, textAlign: 'center', marginBottom: expanded ? 12 : 0 }}>
          {expanded ? '▲ 要望履歴を閉じる' : `▼ 要望履歴を見る（${requests.length}件）`}
        </button>
        {expanded && (
          <div style={{ background: COLORS.bgAlt, borderRadius: 8, padding: 14 }}>
            {requests.length === 0 ? (
              <div style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center', padding: 12 }}>要望履歴はまだありません</div>
            ) : (
              <div>
                {requests.map((r, i) => (
                  <div key={i} style={{ padding: 12, borderBottom: i < requests.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: COLORS.textMuted }}>{r.date}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: r.status === '対応済み' ? '#dcfce7' : '#fef3c7', color: r.status === '対応済み' ? '#166534' : '#92400e' }}>{r.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.text }}>{r.request}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={onAddRequest} style={{ ...secondaryButton, fontSize: 11, padding: '6px 12px', marginTop: 12 }}>+ 新規要望を伝達（チャット）</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniMetric({ label, value, highlight }) {
  return (
    <div style={{ textAlign: 'center', padding: 10, background: highlight ? COLORS.primaryLight : COLORS.bgAlt, borderRadius: 8 }}>
      <div style={{ fontSize: 10, color: COLORS.textLight }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: highlight ? COLORS.primary : COLORS.text }}>{value}</div>
    </div>
  );
}

function RecentRequestsList({ clinicRequests, agencyMap }) {
  // 全紹介会社の要望をflatten
  const allRequests = Object.entries(clinicRequests).flatMap(([agencyId, reqs]) =>
    reqs.map((r) => ({ ...r, agencyId, agencyName: agencyMap[agencyId]?.name || agencyId }))
  ).sort((a, b) => b.date.localeCompare(a.date));

  if (allRequests.length === 0) {
    return (
      <div style={{ background: COLORS.white, borderRadius: 12, border: `1px dashed ${COLORS.border}`, padding: 24, textAlign: 'center', color: COLORS.textMuted, fontSize: 13, boxShadow: COLORS.shadow }}>
        要望伝達履歴はまだありません
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: COLORS.shadow }}>
      {allRequests.slice(0, 8).map((r, i) => (
        <div key={i} style={{ padding: 14, borderBottom: i < Math.min(allRequests.length, 8) - 1 ? `1px solid ${COLORS.borderLight}` : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary }}>{r.agencyName}</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{r.date}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: r.status === '対応済み' ? '#dcfce7' : '#fef3c7', color: r.status === '対応済み' ? '#166534' : '#92400e' }}>{r.status}</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>{r.request}</div>
        </div>
      ))}
    </div>
  );
}

// ============== 求人管理ビュー（求人のみ・院の魅力含む） ==============
function JobsView({ clinic }) {
  const router = useRouter();
  const postings = jobPostingsByClinic[clinic.id] || [];
  const goChat = (msg) => router.push(`/prototype/v2/clinic-portal/${clinic.id}?action=chat&prefill=${encodeURIComponent(msg)}`);

  return (
    <div>
      <ViewHeader icon="📋" title="求人管理" subtitle="現在掲載中の求人内容を確認・編集できます。各フィールドはクリックして直接編集、もしくはチャットで相談できます。" />

      {/* 募集中の求人 */}
      <Section icon="🎯" title={`募集中の求人（${postings.length}件）`}>
        {postings.length === 0 ? (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px dashed ${COLORS.border}`, padding: 40, textAlign: 'center', boxShadow: COLORS.shadow }}>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 12 }}>まだ求人が登録されていません</div>
            <button onClick={() => goChat('求人内容を登録')} style={primaryButton}>💬 チャットで求人を登録</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {postings.map((p) => (
              <JobPostingCard key={p.id} posting={p} onEdit={() => goChat(`${p.role}の求人を修正したい`)} />
            ))}
            <button onClick={() => goChat('新しい求人を登録')} style={{ ...secondaryButton, alignSelf: 'flex-start' }}>+ 新しい求人を登録（チャット）</button>
          </div>
        )}
      </Section>

      {/* 院の魅力（訴求ポイント） */}
      <Section icon="✨" title="院の魅力・訴求ポイント">
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 22, boxShadow: COLORS.shadow }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>求人原稿・スカウト文面で共通利用される基礎的な訴求</div>
          <EditableField value={clinic.appeal || '未設定'} onSave={(v) => alert('保存しました（プロトタイプ）')} multiline fieldBg={COLORS.bgAlt} />
        </div>
      </Section>
    </div>
  );
}

// ============== 媒体・スカウト管理ビュー ==============
function MediaScoutsView({ clinic }) {
  const router = useRouter();
  const goChat = (msg) => router.push(`/prototype/v2/clinic-portal/${clinic.id}?action=chat&prefill=${encodeURIComponent(msg)}`);
  const mediaList = clinic.mediaConfig || [];
  const scoutMonthly = monthlyScoutStats[clinic.id]?.['2026-05'] || [];

  return (
    <div>
      <ViewHeader icon="📰" title="媒体・スカウト管理" subtitle="ご利用中の求人媒体と、スカウト送信に使う文面テンプレートを管理します。" />

      {/* 利用中の媒体 */}
      <Section icon="🌐" title={`利用中の媒体（${mediaList.length}件）`}>
        {mediaList.length === 0 ? (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px dashed ${COLORS.border}`, padding: 40, textAlign: 'center', boxShadow: COLORS.shadow }}>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 12 }}>まだ媒体が登録されていません</div>
            <button onClick={() => goChat('媒体を追加')} style={primaryButton}>💬 チャットで媒体を追加</button>
          </div>
        ) : (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: COLORS.shadow }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.bgAlt }}>
                  <th style={tableHead}>媒体</th>
                  <th style={tableHead}>契約タイプ</th>
                  <th style={{ ...tableHead, textAlign: 'right' }}>月予算</th>
                  <th style={{ ...tableHead, textAlign: 'right' }}>月のスカウト枠</th>
                  <th style={tableHead}></th>
                </tr>
              </thead>
              <tbody>
                {mediaList.map((m, i) => (
                  <tr key={i} style={{ borderBottom: i < mediaList.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none' }}>
                    <td style={tableCellTd}><strong>{m.name}</strong></td>
                    <td style={tableCellTd}>{m.type}</td>
                    <td style={{ ...tableCellTd, textAlign: 'right' }}>{m.budget > 0 ? `¥${m.budget.toLocaleString()}` : '-'}</td>
                    <td style={{ ...tableCellTd, textAlign: 'right' }}>{clinic.scoutQuota?.[m.name] ? `${clinic.scoutQuota[m.name]}通` : '-'}</td>
                    <td style={tableCellTd}><button onClick={() => goChat(`${m.name}の予算/スカウト枠を変更したい`)} style={{ ...secondaryButton, fontSize: 11, padding: '5px 10px' }}>💬 変更</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: 14, borderTop: `1px solid ${COLORS.border}` }}>
              <button onClick={() => goChat('媒体を追加')} style={{ ...secondaryButton, fontSize: 12 }}>+ 新しい媒体を追加（チャット）</button>
            </div>
          </div>
        )}
      </Section>

      {/* スカウト文面テンプレ */}
      <Section icon="📤" title={`スカウト文面テンプレ（${scoutTemplates.length}パターン）`}>
        <div style={{ marginBottom: 12, padding: 12, background: COLORS.alertBg, color: COLORS.alertText, borderRadius: 8, fontSize: 12 }}>
          💡 候補者へ送るスカウトメッセージの雛形。送信時には候補者の経歴に合わせてAIがカスタマイズします。各フィールドは直接編集できます。
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {scoutTemplates.map((t) => (
            <ScoutTemplateCard key={t.id} template={t} onEdit={() => goChat(`${t.name}のスカウト文面を修正したい`)} />
          ))}
          <button onClick={() => goChat('新しいスカウトテンプレを作りたい')} style={{ ...secondaryButton, alignSelf: 'flex-start' }}>+ 新しいテンプレを追加（チャット）</button>
        </div>
      </Section>

      {/* 直近のスカウト送信実績 */}
      <Section icon="📈" title="今月のスカウト送信実績">
        {scoutMonthly.length === 0 ? (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px dashed ${COLORS.border}`, padding: 24, textAlign: 'center', color: COLORS.textMuted, fontSize: 13, boxShadow: COLORS.shadow }}>
            まだスカウト実績がありません
          </div>
        ) : (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: COLORS.shadow }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.bgAlt }}>
                  <th style={tableHead}>媒体</th>
                  <th style={{ ...tableHead, textAlign: 'right' }}>送信</th>
                  <th style={{ ...tableHead, textAlign: 'right' }}>開封</th>
                  <th style={{ ...tableHead, textAlign: 'right' }}>返信</th>
                  <th style={{ ...tableHead, textAlign: 'right' }}>返信率</th>
                </tr>
              </thead>
              <tbody>
                {scoutMonthly.map((s, i) => (
                  <tr key={i} style={{ borderBottom: i < scoutMonthly.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none' }}>
                    <td style={tableCellTd}><strong>{s.media}</strong></td>
                    <td style={{ ...tableCellTd, textAlign: 'right' }}>{s.sent}</td>
                    <td style={{ ...tableCellTd, textAlign: 'right' }}>{s.opened}</td>
                    <td style={{ ...tableCellTd, textAlign: 'right' }}>{s.replied}</td>
                    <td style={{ ...tableCellTd, textAlign: 'right' }}><strong style={{ color: COLORS.primary }}>{s.replyRate}%</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}

const tableHead = { padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' };
const tableCellTd = { padding: '12px 14px', fontSize: 13, color: COLORS.text };

function JobPostingCard({ posting: initialPosting, onEdit }) {
  const [posting, setPosting] = useState(initialPosting);
  const [expanded, setExpanded] = useState(false);
  const details = jobPostingDetails[posting.id];

  const updateField = (key, value) => {
    setPosting({ ...posting, [key]: value, lastUpdated: new Date().toISOString().slice(0, 10) });
    // 実装では Firestore 更新 + オペ通知。プロトタイプではローカル state のみ
  };

  // 充足率の計算
  const fieldsStatus = details?.fieldsStatus || {};
  const fieldsTotal = Object.keys(fieldsStatus).length;
  const fieldsComplete = Object.values(fieldsStatus).filter((s) => s === 'complete').length;
  const fieldsPending = Object.values(fieldsStatus).filter((s) => s === 'pending').length;
  const completionRate = fieldsTotal > 0 ? Math.round(fieldsComplete / fieldsTotal * 100) : 100;

  return (
    <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 22, boxShadow: COLORS.shadow, transition: 'box-shadow 0.15s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{posting.role}</span>
            <span style={{ fontSize: 11, padding: '3px 10px', background: '#dcfce7', color: '#166534', borderRadius: 12, fontWeight: 600 }}>{posting.status}</span>
            <span style={{ fontSize: 11, color: COLORS.textMuted }}>{posting.employment} / {posting.headcount}名募集</span>
            {fieldsTotal > 0 && (
              <span style={{ fontSize: 11, padding: '3px 10px', background: completionRate >= 80 ? '#dcfce7' : completionRate >= 50 ? '#fef3c7' : '#fee2e2', color: completionRate >= 80 ? '#166534' : completionRate >= 50 ? '#92400e' : '#991b1b', borderRadius: 12, fontWeight: 600 }}>
                情報充足 {completionRate}%
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>最終更新：{posting.lastUpdated}</div>
        </div>
        <button onClick={onEdit} style={{ ...secondaryButton, fontSize: 11, padding: '6px 12px' }}>💬 チャットで相談</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>給与</div>
        <EditableField value={posting.salary} onSave={(v) => updateField('salary', v)} />
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>勤務時間</div>
        <EditableField value={posting.workHours} onSave={(v) => updateField('workHours', v)} />
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>求める経験</div>
        <EditableField value={posting.requirements} onSave={(v) => updateField('requirements', v)} multiline />
        <div style={{ color: COLORS.textLight, fontWeight: 600 }}>訴求</div>
        <EditableField value={posting.appeal} onSave={(v) => updateField('appeal', v)} multiline />
      </div>

      {fieldsPending > 0 && (
        <div style={{ marginBottom: 12, padding: 10, background: COLORS.alertBg, color: COLORS.alertText, borderRadius: 6, fontSize: 11 }}>
          ⚠️ {fieldsPending}項目がオペヒアリング待ちです。詳細を展開して確認できます。
        </div>
      )}

      <div style={{ paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, marginBottom: details ? 12 : 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLight, marginBottom: 8 }}>出稿先</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {posting.postedTo.map((p, i) => (
            <span key={i} style={{ fontSize: 11, padding: '4px 10px', background: COLORS.primaryLight, color: COLORS.primary, borderRadius: 12, fontWeight: 500 }}>
              {p.media}（{p.status}・{p.postedAt}〜）
            </span>
          ))}
        </div>
      </div>

      {details && (
        <>
          <button onClick={() => setExpanded(!expanded)} style={{ ...secondaryButton, width: '100%', fontSize: 12, textAlign: 'center' }}>
            {expanded ? '▲ 詳細を閉じる' : '▼ 求人詳細を表示'}
          </button>
          {expanded && <JobPostingDetailPanel details={details} postingId={posting.id} />}
        </>
      )}
    </div>
  );
}

function JobPostingDetailPanel({ details, postingId }) {
  const extended = jobPostingExtended[postingId];
  const facility = extended ? facilities[extended.facilityId] : null;
  const corp = extended ? corporations[extended.corpId] : null;

  const sections = [
    { key: 'basic', title: '基本情報', fields: [
      ['募集背景', details.background],
      ['募集拠点', details.locations?.join('、')],
      ['雇用形態', details.employment],
      ['募集人数', `${details.headcount}名`],
    ]},
    { key: 'scope', title: '診療内容・業務内容', fields: [
      ['診療科目・範囲', details.medicalScope],
      ['具体的業務', details.duties],
      ['機器設備', details.equipment],
    ]},
    { key: 'qualifications', title: '応募条件', fields: [
      ['必須資格', details.requiredQualifications?.join('、')],
      ['必須経験', details.requiredExperience],
      ['必須スキル', details.requiredSkills],
      ['歓迎条件', details.welcomedCondition],
      ['その他条件', details.notRequired],
    ]},
    { key: 'salary', title: '給与', fields: [
      ['月給', details.salaryBase],
      ['給与構成', details.salaryFrame],
      ['超勤手当', details.overtime],
      ['賞与', details.bonus],
      ['昇給', details.raise],
      ['想定年収', details.expectedAnnual],
    ]},
    { key: 'workhours', title: '勤務時間・休日', fields: [
      ['勤務時間', details.workHours],
      ['実働時間', details.realWorkingHours],
      ['勤務形態', details.shiftType],
      ['休日', details.daysOff],
      ['年間休日', details.annualHoliday ? `${details.annualHoliday}日` : null],
      ['有給休暇', details.paidLeave],
      ['特別休暇', details.specialLeave],
    ]},
    { key: 'benefits', title: '福利厚生・待遇', fields: [
      ['保険', details.insurance],
      ['制服', details.uniform],
      ['交通費', details.commute],
      ['その他', details.others],
    ]},
    { key: 'trial', title: '試用期間・教育', fields: [
      ['試用期間', details.trialPeriod],
      ['教育・研修', details.training],
    ]},
    { key: 'selection', title: '選考プロセス', fields: [
      ['選考フロー', details.selectionSteps?.join(' → ')],
      ['平均期間', details.expectedLeadTime],
    ]},
    { key: 'appeal_full', title: '訴求・院文化', fields: [
      ['訴求ポイント', details.appeal],
      ['院の文化・人物像', details.cultureNotes],
      ['院長プロフィール', details.directorIntro],
    ]},
    { key: 'access', title: '勤務地・アクセス', fields: [
      ['住所', details.address],
      ['アクセス', details.access],
    ]},
  ];

  const fieldsStatus = details.fieldsStatus || {};

  return (
    <div style={{ marginTop: 16, padding: 16, background: COLORS.bg, borderRadius: 8 }}>
      {/* プロローグ・理事長メッセージ */}
      {extended?.introduction && (
        <div style={{ marginBottom: 16, padding: 16, background: COLORS.white, borderRadius: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>📝 求人プロローグ</div>
          <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{extended.introduction}</div>
        </div>
      )}
      {corp && (
        <div style={{ marginBottom: 16, padding: 16, background: COLORS.white, borderRadius: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🏥 法人情報</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 12 }}>
            <tbody>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, width: 120, fontWeight: 500 }}>法人名</td><td style={{ padding: '4px 8px' }}>{corp.name}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500 }}>設立</td><td style={{ padding: '4px 8px' }}>{corp.establishedAt}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500, verticalAlign: 'top' }}>理念</td><td style={{ padding: '4px 8px', lineHeight: 1.6 }}>{corp.principle}</td></tr>
            </tbody>
          </table>
          {corp.directorMessage && (
            <div style={{ padding: 12, background: COLORS.bg, borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 6 }}>理事長メッセージ</div>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{corp.directorMessage}</div>
            </div>
          )}
          {corp.perks?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 6 }}>法人共通の福利厚生・特典</div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, lineHeight: 1.7 }}>
                {corp.perks.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
      {facility && (
        <div style={{ marginBottom: 16, padding: 16, background: COLORS.white, borderRadius: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🏢 施設情報</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, width: 120, fontWeight: 500 }}>施設名</td><td style={{ padding: '4px 8px' }}>{facility.name}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500 }}>住所</td><td style={{ padding: '4px 8px' }}>{facility.address}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500 }}>アクセス</td><td style={{ padding: '4px 8px', whiteSpace: 'pre-wrap' }}>{facility.access}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500 }}>開院</td><td style={{ padding: '4px 8px' }}>{facility.openedAt}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500, verticalAlign: 'top' }}>診療科目</td><td style={{ padding: '4px 8px' }}>{facility.services}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500, verticalAlign: 'top' }}>開院時間</td><td style={{ padding: '4px 8px', whiteSpace: 'pre-wrap' }}>{facility.businessHours}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500 }}>休診日</td><td style={{ padding: '4px 8px' }}>{facility.closedDays}</td></tr>
              <tr><td style={{ padding: '4px 8px', color: COLORS.textLight, fontWeight: 500 }}>平均患者数</td><td style={{ padding: '4px 8px' }}>{facility.patientCount}</td></tr>
            </tbody>
          </table>
          {facility.staffComposition && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 6 }}>スタッフ構成</div>
              <div style={{ fontSize: 12, lineHeight: 1.7, paddingLeft: 16 }}>
                ・医師：{facility.staffComposition.doctors}<br/>
                ・看護師：{facility.staffComposition.nurses}<br/>
                ・医療事務：{facility.staffComposition.medicalClerks}<br/>
                {facility.staffComposition.others && <>・その他：{facility.staffComposition.others}</>}
              </div>
            </div>
          )}
          {facility.equipment && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 6 }}>設備・機材</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {facility.equipment.map((e, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '3px 8px', background: COLORS.primaryLight, color: COLORS.primary, borderRadius: 4 }}>{e}</span>
                ))}
              </div>
            </div>
          )}
          {facility.director && (
            <div style={{ marginTop: 12, padding: 12, background: COLORS.bg, borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 4 }}>院長</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{facility.director}</div>
              {facility.directorBio && <div style={{ fontSize: 11, color: COLORS.textLight, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{facility.directorBio}</div>}
            </div>
          )}
        </div>
      )}
      {extended && (extended.welcomedQualifications?.length > 0 || extended.flexibility) && (
        <div style={{ marginBottom: 16, padding: 16, background: COLORS.white, borderRadius: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✨ 歓迎条件・働き方の柔軟性</div>
          {extended.welcomedQualifications?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 4 }}>歓迎する資格</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {extended.welcomedQualifications.map((q, i) => <span key={i} style={{ fontSize: 11, padding: '3px 8px', background: '#fef3c7', color: '#92400e', borderRadius: 4 }}>{q}</span>)}
              </div>
            </div>
          )}
          {extended.flexibility && (
            <div>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600, marginBottom: 4 }}>働き方の柔軟性</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {extended.flexibility.webInterview && <span style={badge}>📹 WEB面接可</span>}
                {extended.flexibility.onsiteVisit && <span style={badge}>👀 職場見学可</span>}
                {extended.flexibility.activelyWorkingOk && <span style={badge}>📅 在職中応募可</span>}
                {extended.flexibility.sideJobOk && <span style={badge}>💼 副業OK</span>}
              </div>
            </div>
          )}
          {(extended.workScope || extended.workplaceScope) && (
            <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textLight, lineHeight: 1.6 }}>
              {extended.workScope && <>業務内容の変更範囲：{extended.workScope}<br/></>}
              {extended.workplaceScope && <>就業場所の変更範囲：{extended.workplaceScope}</>}
            </div>
          )}
        </div>
      )}
      {sections.map((section) => {
        const hasContent = section.fields.some(([_, v]) => v && v !== '未設定');
        const statusKey = section.key === 'basic' ? 'basicInfo' : section.key === 'scope' ? 'duties' : section.key === 'qualifications' ? 'qualifications' : section.key === 'salary' ? 'salary' : section.key === 'workhours' ? 'workHours' : section.key === 'benefits' ? 'benefits' : section.key === 'trial' ? 'trial' : section.key === 'selection' ? 'selection' : section.key === 'appeal_full' ? 'appeal' : 'directorIntro';
        const status = fieldsStatus[statusKey];

        return (
          <div key={section.key} style={{ marginBottom: 16, padding: 12, background: COLORS.white, borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{section.title}</div>
              {status && <FieldStatusBadge status={status} />}
            </div>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <tbody>
                {section.fields.filter(([_, v]) => v && v !== '未設定').map(([label, value], i) => (
                  <tr key={i}>
                    <td style={{ padding: '4px 8px', color: COLORS.textLight, verticalAlign: 'top', width: 120, fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: '4px 8px', color: COLORS.text, lineHeight: 1.6 }}>{value}</td>
                  </tr>
                ))}
                {!hasContent && (
                  <tr><td colSpan={2} style={{ padding: '8px', color: COLORS.textMuted, fontSize: 11 }}>このセクションはオペがヒアリング予定です</td></tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

const badge = { fontSize: 11, padding: '3px 8px', background: '#dcfce7', color: '#166534', borderRadius: 4, fontWeight: 600 };

function FieldStatusBadge({ status }) {
  const map = {
    complete: { bg: '#dcfce7', color: '#166534', label: '✓ 確定' },
    partial: { bg: '#fef3c7', color: '#92400e', label: '一部のみ' },
    pending: { bg: '#fee2e2', color: '#991b1b', label: 'オペヒアリング待ち' },
  };
  const c = map[status] || map.pending;
  return <span style={{ fontSize: 10, padding: '2px 8px', background: c.bg, color: c.color, borderRadius: 10, fontWeight: 600 }}>{c.label}</span>;
}

function ScoutTemplateCard({ template: initialTemplate, onEdit }) {
  const [template, setTemplate] = useState(initialTemplate);
  const updateField = (key, value) => setTemplate({ ...template, [key]: value });

  return (
    <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 22, boxShadow: COLORS.shadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{template.name}</div>
          {template.stats.reply > 0 ? (
            <div style={{ fontSize: 12, color: COLORS.textLight }}>
              開封率 <strong style={{ color: COLORS.primary }}>{template.stats.open}%</strong> ／ 返信率 <strong style={{ color: COLORS.primary }}>{template.stats.reply}%</strong>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>まだ送信実績なし</div>
          )}
        </div>
        <button onClick={onEdit} style={{ ...secondaryButton, fontSize: 11, padding: '6px 12px' }}>💬 チャットで相談</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLight, marginBottom: 6 }}>件名</div>
        <EditableField value={template.subject} onSave={(v) => updateField('subject', v)} fieldBg={COLORS.bgAlt} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLight, marginBottom: 6 }}>本文</div>
        <EditableField value={template.body} onSave={(v) => updateField('body', v)} multiline fieldBg={COLORS.bgAlt} />
      </div>
    </div>
  );
}

// インラインで編集できるフィールド（ホバー時に編集ボタン表示、クリックで input/textarea へ切替）
function EditableField({ value, onSave, multiline = false, fieldBg = 'transparent' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [hover, setHover] = useState(false);

  if (editing) {
    return (
      <div>
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            style={{ width: '100%', minHeight: 80, padding: 10, fontSize: 13, border: `2px solid ${COLORS.primary}`, borderRadius: 8, fontFamily: 'inherit', lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') { onSave(draft); setEditing(false); } if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
            style={{ width: '100%', padding: '8px 10px', fontSize: 13, border: `2px solid ${COLORS.primary}`, borderRadius: 8, outline: 'none', boxSizing: 'border-box' }}
          />
        )}
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <button onClick={() => { onSave(draft); setEditing(false); }} style={{ padding: '4px 12px', fontSize: 11, fontWeight: 600, background: COLORS.primary, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>保存</button>
          <button onClick={() => { setDraft(value); setEditing(false); }} style={{ padding: '4px 12px', fontSize: 11, fontWeight: 500, background: COLORS.white, color: COLORS.textLight, border: `1px solid ${COLORS.border}`, borderRadius: 6, cursor: 'pointer' }}>キャンセル</button>
          <span style={{ fontSize: 10, color: COLORS.textMuted, alignSelf: 'center', marginLeft: 4 }}>※ 保存するとオペにも通知されます</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: multiline ? 10 : '4px 8px',
        background: hover ? COLORS.primaryLight : fieldBg,
        borderRadius: 6,
        cursor: 'pointer',
        position: 'relative',
        whiteSpace: multiline ? 'pre-wrap' : 'normal',
        lineHeight: multiline ? 1.7 : 1.5,
        fontSize: multiline ? 13 : 13,
        transition: 'background 0.15s',
        minHeight: 24,
      }}
    >
      {value || <span style={{ color: COLORS.textMuted, fontStyle: 'italic' }}>クリックして入力</span>}
      {hover && (
        <span style={{ position: 'absolute', right: 8, top: multiline ? 8 : 4, fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>✏️ 編集</span>
      )}
    </div>
  );
}

// ============== 辞めない採用 KPI セクション ==============
function RetentionKPISection({ clinicId }) {
  const router = useRouter();
  const goChat = (msg) => router.push(`/prototype/v2/clinic-portal/${clinicId}?action=chat&prefill=${encodeURIComponent(msg)}`);
  const kpi = retentionKPI[clinicId];

  if (!kpi || (kpi.retention6m == null && kpi.last12mHires === 0)) {
    return (
      <div style={{ background: COLORS.white, borderRadius: 14, border: `1px dashed ${COLORS.border}`, padding: 24, boxShadow: COLORS.shadow }}>
        <div style={{ fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 12 }}>
          採用実績がまだないので、定着率は計測できていません。<br />
          求人を登録すると採用後の定着サポートが開始されます。
        </div>
      </div>
    );
  }

  const completedSteps = kpi.mitigationSteps.filter((s) => s.done).length;
  const totalSteps = kpi.mitigationSteps.length;
  const diff = kpi.retention6m != null ? kpi.retention6m - kpi.industryAvg6m : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
      {/* 左：定着率と離職コスト削減 */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 14, padding: 22, color: 'white', boxShadow: COLORS.shadowMd }}>
        <div style={{ fontSize: 12, opacity: 0.9, fontWeight: 600, marginBottom: 6 }}>直近6ヶ月の定着率</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{kpi.retention6m != null ? kpi.retention6m : '-'}<span style={{ fontSize: 22 }}>%</span></div>
          {kpi.retention6m != null && (
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              業界平均 {kpi.industryAvg6m}%（{diff >= 0 ? `+${diff}pt` : `${diff}pt`}）
            </div>
          )}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 11, opacity: 0.9, fontWeight: 600, marginBottom: 4 }}>推定 離職コスト削減（年間）</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>¥{kpi.estimatedCostSaved.toLocaleString()}</div>
          <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>
            紹介料1件分相当 ¥{kpi.referralFeeBenchmark.toLocaleString()} の{Math.round(kpi.estimatedCostSaved / kpi.referralFeeBenchmark * 100)}%
          </div>
        </div>
      </div>

      {/* 右：ミスマッチ防止策チェックリスト */}
      <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 22, boxShadow: COLORS.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>ミスマッチ防止策の実行</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: completedSteps === totalSteps ? COLORS.success : COLORS.warning }}>
            {completedSteps} / {totalSteps} 完了
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {kpi.mitigationSteps.map((s) => (
            <div
              key={s.id}
              onClick={() => !s.done && goChat(`${s.label}を設定したい`)}
              style={{
                display: 'flex',
                gap: 10,
                padding: '8px 10px',
                background: s.done ? COLORS.bgAlt : '#fffbeb',
                borderRadius: 8,
                cursor: s.done ? 'default' : 'pointer',
                border: s.done ? 'none' : `1px solid #fde68a`,
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 9, background: s.done ? COLORS.success : COLORS.warning, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {s.done ? '✓' : '!'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: s.done ? COLORS.text : '#92400e' }}>{s.label}</div>
                <div style={{ fontSize: 10, color: s.done ? COLORS.textMuted : '#a16207', marginTop: 2, lineHeight: 1.5 }}>{s.description}</div>
              </div>
              {!s.done && <div style={{ fontSize: 10, color: '#a16207', alignSelf: 'center', fontWeight: 600 }}>設定 →</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============== フローティングチャット（全画面で右下に常駐） ==============
function FloatingChat({ clinic, actions, open, onToggle }) {
  return (
    <>
      {/* ボタン（閉じている時） */}
      {!open && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 50,
            width: 64,
            height: 64,
            borderRadius: 32,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: COLORS.shadowLg,
            fontSize: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          aria-label="AIアシスタントを開く"
        >
          💬
        </button>
      )}

      {/* パネル（開いている時） */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 50,
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            height: 640,
            maxHeight: 'calc(100vh - 80px)',
            background: COLORS.white,
            borderRadius: 18,
            boxShadow: COLORS.shadowLg,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {/* チャットヘッダー */}
          <div
            style={{
              padding: '14px 18px',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>💬 AIアシスタント</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>いつでも話しかけてください</div>
            </div>
            <button onClick={onToggle} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 30, height: 30, borderRadius: 15, cursor: 'pointer', fontSize: 16 }} aria-label="閉じる">×</button>
          </div>

          {/* チャット本体 */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <ChatView clinic={clinic} actions={actions} compact />
          </div>
        </div>
      )}
    </>
  );
}

// ============== AIアシスタント（チャット駆動UX） ==============
function ChatView({ clinic, actions, compact = false }) {
  // 設定状況の判定（実運用では Firestore 参照）
  const hasJobPosting = clinic.targetRoles && clinic.targetRoles.length > 0;
  const hasMediaConfig = clinic.mediaConfig && clinic.mediaConfig.length > 0;
  const isInitialSetup = !hasJobPosting || !hasMediaConfig;

  const initialMessage = isInitialSetup
    ? {
        role: 'assistant',
        text: `${clinic.name} 様、ようこそSuguDeskへ。\n\nまず、採用業務をスタートするために、いくつか教えてください。\n\n${!hasJobPosting ? '📋 求人内容（職種・条件など）\n' : ''}${!hasMediaConfig ? '📰 ご利用中の媒体・紹介会社\n' : ''}\nどちらから入力しますか？`,
        suggestions: !hasJobPosting && !hasMediaConfig ? ['求人内容を登録', '媒体・紹介会社を登録'] : !hasJobPosting ? ['求人内容を登録'] : ['媒体・紹介会社を登録'],
      }
    : {
        role: 'assistant',
        text: `${clinic.name} の事務長様、こんにちは。SuguDesk AIアシスタントです。\n\n今日対応が必要なのは：\n・書類確認待ち ${actions.pendingDocReview.length}名\n・面接予定 ${actions.upcomingInterviews.length}件\n・採用判断待ち ${actions.pendingHireDecision.length}名\n\n何をしましょうか？`,
        suggestions: ['本日の書類選考の人は？', 'スカウトを送って', '5月の採用状況まとめて', '求人内容を変更', '媒体を追加', '面接の振り返り依頼'],
      };

  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState({ mode: 'idle', context: {} });

  // 他画面から prefill で遷移してきた場合、自動送信
  const router = useRouter();
  useEffect(() => {
    const prefill = router.query.prefill;
    if (prefill && typeof prefill === 'string') {
      setTimeout(() => send(prefill), 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.prefill]);

  const send = (text) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setTimeout(() => respond(text, newMessages), 600);
  };

  const respond = (userText, history) => {
    const text = userText.toLowerCase();
    let reply;

    // ステートマシン的な分岐
    if (chatState.mode === 'awaiting_role_for_scout') {
      const role = userText.includes('看護師') ? '看護師' : userText.includes('医療事務') ? '医療事務' : userText.includes('助産') ? '助産師' : userText;
      setChatState({ mode: 'awaiting_scout_confirm', context: { ...chatState.context, role } });
      reply = {
        role: 'assistant',
        text: `${role} ですね。過去で返信率が高い「パターンA：経験活用訴求」をベースに ${chatState.context.count}件 送ります。\n\nターゲット条件：経験3-10年（前回と同じ）\n媒体：ジョブメドレー / 看護roo!\n\nこの内容でよろしければ「OK」と返信してください。`,
        suggestions: ['OK', '条件を変える', 'やめる'],
      };
    } else if (chatState.mode === 'awaiting_scout_confirm') {
      if (text.includes('ok') || text.includes('お願い') || text.includes('はい')) {
        setChatState({ mode: 'idle', context: {} });
        reply = {
          role: 'assistant',
          text: `承知しました。SuguDeskオペに依頼を出しました。\n\n📋 依頼内容：\n・職種：${chatState.context.role}\n・件数：${chatState.context.count}件\n・テンプレ：パターンA\n・条件：経験3-10年\n\n本日中に送信完了の通知をLINEでお送りします。`,
          suggestions: ['他の依頼をする', '今日の書類選考は？'],
        };
      } else {
        setChatState({ mode: 'idle', context: {} });
        reply = { role: 'assistant', text: '依頼を取り消しました。他にやりたいことはありますか？', suggestions: ['本日の書類選考の人は？', 'スカウトを送って'] };
      }
    } else if (chatState.mode === 'doc_review_iteration') {
      const idx = chatState.context.index;
      const decisions = chatState.context.decisions || [];
      const decision = text.includes('通過') || text.includes('ok') ? '通過' : text.includes('保留') ? '保留' : '不通過';
      const newDecisions = [...decisions, { caseId: actions.pendingDocReview[idx]?.caseId, decision }];
      const nextIdx = idx + 1;
      if (nextIdx < actions.pendingDocReview.length) {
        const next = actions.pendingDocReview[nextIdx];
        setChatState({ mode: 'doc_review_iteration', context: { index: nextIdx, decisions: newDecisions } });
        reply = {
          role: 'assistant',
          text: `「${decision}」で承りました。\n\n次の候補者です。\n② ${next.caseId}（${next.role}・${next.source}・${next.daysWaiting}日待ち）\nAI事前評価：要件合致度 ${72 + nextIdx * 5}%。${nextIdx % 2 === 0 ? '経験要件・給与希望ともに範囲内。' : '一部条件で要確認事項あり、面接で深掘り推奨。'}`,
          suggestions: ['👍 通過', '👎 不通過', '🤔 保留'],
        };
      } else {
        const summary = newDecisions.map((d, i) => `${i + 1}. ${d.caseId}：${d.decision}`).join('\n');
        setChatState({ mode: 'idle', context: {} });
        reply = {
          role: 'assistant',
          text: `全${newDecisions.length}件の判断が完了しました。\n\n${summary}\n\n通過された方は弊社オペが面接日程調整に進みます。不採用の方には弊社から丁寧にご連絡します。`,
          suggestions: ['他の依頼をする', '今日の予定は？'],
        };
      }
    } else if (chatState.mode === 'job_posting_role') {
      setChatState({ mode: 'job_posting_count', context: { ...chatState.context, role: userText } });
      reply = { role: 'assistant', text: `「${userText}」ですね。何名募集されますか？`, suggestions: ['1名', '2名', '3名以上'] };
    } else if (chatState.mode === 'job_posting_count') {
      setChatState({ mode: 'job_posting_employment', context: { ...chatState.context, count: userText } });
      reply = { role: 'assistant', text: '雇用形態は？', suggestions: ['常勤', 'パート', '常勤・パートどちらも'] };
    } else if (chatState.mode === 'job_posting_employment') {
      setChatState({ mode: 'job_posting_salary', context: { ...chatState.context, employment: userText } });
      reply = { role: 'assistant', text: '給与レンジを教えてください（例：月給28万〜35万、時給1500〜1800円）', suggestions: [] };
    } else if (chatState.mode === 'job_posting_salary') {
      setChatState({ mode: 'job_posting_requirements', context: { ...chatState.context, salary: userText } });
      reply = { role: 'assistant', text: '求める経験・スキルは？（例：経験3年以上、婦人科経験者歓迎）', suggestions: [] };
    } else if (chatState.mode === 'job_posting_requirements') {
      setChatState({ mode: 'job_posting_appeal', context: { ...chatState.context, requirements: userText } });
      reply = { role: 'assistant', text: '院の魅力・推しポイントは？（例：教育充実、ワークライフバランス重視、駅近）', suggestions: [] };
    } else if (chatState.mode === 'job_posting_appeal') {
      const ctx = { ...chatState.context, appeal: userText };
      setChatState({ mode: 'job_posting_confirm', context: ctx });
      reply = {
        role: 'assistant',
        text: `以下の内容で求人を登録します。よろしいですか？\n\n📋 求人内容\n・職種：${ctx.role}\n・人数：${ctx.count}\n・雇用形態：${ctx.employment}\n・給与：${ctx.salary}\n・求める経験：${ctx.requirements}\n・院の魅力：${ctx.appeal}\n\nこの情報をもとに、AIで求人原稿を生成しSuguDeskオペが媒体に出稿します。`,
        suggestions: ['OK、登録', '修正したい'],
      };
    } else if (chatState.mode === 'job_posting_confirm') {
      if (text.includes('ok') || text.includes('登録') || text.includes('はい')) {
        setChatState({ mode: 'idle', context: {} });
        reply = {
          role: 'assistant',
          text: '求人登録の基本情報を受け付けました。\n\n📋 次の流れ：\n1. SuguDeskオペが詳細項目（勤務時間の詳細・福利厚生・教育制度・選考フロー等）をヒアリング日程調整\n2. 全項目揃ったらAIで求人原稿を生成\n3. ご確認後、対象媒体に出稿\n\n詳細ヒアリングの日程候補は本日中にLINEでお送りします。',
          suggestions: ['媒体・紹介会社も登録', '求人・スカウト文面を見る', '他にやりたいことはない'],
        };
      } else {
        setChatState({ mode: 'idle', context: {} });
        reply = { role: 'assistant', text: '了解しました。最初からやり直しますか？', suggestions: ['求人内容を登録'] };
      }
    } else if (text.includes('求人を修正') || text.includes('求人を修正したい')) {
      const role = userText.match(/^(看護師|助産師|医療事務|受付|ドクター|院長候補)/)?.[1];
      reply = {
        role: 'assistant',
        text: `${role ? role + 'の' : ''}求人を修正します。どこを変えたいですか？`,
        suggestions: ['給与レンジ', '勤務時間', '求める経験', '院の魅力', '出稿先媒体', '募集人数', 'その他（自由記述）'],
      };
    } else if (text.includes('スカウト文面を修正')) {
      const pattern = userText.match(/パターン[ABC]：[^の]+/)?.[0];
      reply = {
        role: 'assistant',
        text: `${pattern ? `「${pattern}」` : ''}スカウト文面の修正ですね。どこを変えたいですか？`,
        suggestions: ['件名', '本文の冒頭', '本文の訴求ポイント', '署名', '新しいパターンを作る', 'その他（自由記述）'],
      };
    } else if (text.includes('院の魅力を更新')) {
      reply = {
        role: 'assistant',
        text: '院の魅力（求人・スカウトで共通利用）を更新します。新しい訴求文面を教えてください。\n\n例：「地域密着で女性が長く働ける環境、教育充実」など',
        suggestions: ['現在の文面を見せて', '雛形から選びたい', 'AIで案を作って'],
      };
    } else if ((text.includes('要望') && (text.includes('伝達') || text.includes('伝える'))) || text.includes('新しい要望')) {
      // 紹介会社名を抽出（マイナビ看護師、レバウェル看護、ナースではたらこ 等）
      const agencyName = userText.match(/^([^に]+?)(に|へ)/)?.[1];
      reply = {
        role: 'assistant',
        text: `${agencyName ? `${agencyName}への` : ''}要望伝達ですね。どんな内容を伝えますか？`,
        suggestions: ['紹介人数を増やしてほしい', '経験年数の条件を変えたい', '給与レンジの上限を伝える', '勤務地・通勤時間の条件を変える', '今までの紹介傾向にフィードバック', 'その他（自由記述）'],
      };
    } else if (text.includes('紹介会社を追加') || text.includes('新しい紹介会社')) {
      reply = {
        role: 'assistant',
        text: '新しい紹介会社を追加します。\nまず、紹介会社の名前を教えてください。',
        suggestions: ['マイナビ看護師', 'レバウェル看護', 'ナースではたらこ', 'ジョブメドレー', '看護のお仕事', 'その他（自由記述）'],
      };
    } else if (text.includes('予算') && text.includes('変更') || text.includes('スカウト枠') && text.includes('変更') || (text.includes('予算/スカウト枠'))) {
      const mediaName = userText.match(/^([^のは]+?)の/)?.[1];
      reply = {
        role: 'assistant',
        text: `${mediaName ? `${mediaName}の` : ''}設定を変更します。何を変えたいですか？`,
        suggestions: ['月予算を変更', 'スカウト送信枠を変更', '掲載を停止したい', '契約タイプを変更', 'その他（自由記述）'],
      };
    } else if (text.includes('新しいスカウトテンプレ') || text.includes('新しいテンプレ') || text.includes('スカウトテンプレを作')) {
      reply = {
        role: 'assistant',
        text: '新しいスカウトテンプレを作成します。\nどんな訴求軸でいきますか？',
        suggestions: ['経験活用訴求', 'ワークライフバランス訴求', '教育・スキル成長訴求', '給与・待遇訴求', '院長/院文化の訴求', 'その他（自由記述）'],
      };
    } else if (chatState.mode === 'media_setup_select') {
      setChatState({ mode: 'media_setup_budget', context: { ...chatState.context, media: userText } });
      reply = { role: 'assistant', text: `「${userText}」ですね。月の出稿予算はいくらですか？（成果報酬型なら「成果報酬制」とお答えください）`, suggestions: ['¥50,000', '¥100,000', '¥150,000', '成果報酬制'] };
    } else if (chatState.mode === 'media_setup_budget') {
      const ctx = { ...chatState.context, budget: userText };
      setChatState({ mode: 'media_setup_more', context: ctx });
      reply = { role: 'assistant', text: `「${ctx.media}（${ctx.budget}）」を登録しました。\n他にも登録する媒体・紹介会社はありますか？`, suggestions: ['Indeed', 'ジョブメドレー', '看護roo!', 'マイナビ看護師', 'レバウェル看護', '紹介会社', 'もう登録不要'] };
    } else if (chatState.mode === 'media_setup_more') {
      if (text.includes('不要') || text.includes('終わり') || text.includes('完了')) {
        setChatState({ mode: 'idle', context: {} });
        reply = { role: 'assistant', text: '媒体・紹介会社の登録を完了しました。\n弊社オペが各媒体・紹介会社へのご連絡を順次進めます。', suggestions: ['求人内容も登録', '今日のアクションは？'] };
      } else {
        setChatState({ mode: 'media_setup_budget', context: { media: userText } });
        reply = { role: 'assistant', text: `「${userText}」ですね。月の出稿予算はいくらですか？`, suggestions: ['¥50,000', '¥100,000', '¥150,000', '成果報酬制'] };
      }
    } else if (text.includes('求人内容') || text.includes('求人を登録') || text.includes('募集') || text.includes('新しい求人')) {
      setChatState({ mode: 'job_posting_role', context: {} });
      reply = { role: 'assistant', text: '求人内容を登録します。まずは基本情報だけ伺います。\n（給与・休日・福利厚生など詳細項目はSuguDeskオペが後日ヒアリングで詰めますので、ご安心ください）\n\nまず、募集する職種を教えてください。', suggestions: ['看護師', '助産師', '医療事務', '受付', 'ドクター', 'コメディカル'] };
    } else if (text.includes('媒体') && (text.includes('登録') || text.includes('追加')) || text.includes('紹介会社を登録')) {
      setChatState({ mode: 'media_setup_select', context: {} });
      reply = { role: 'assistant', text: 'ご利用中の媒体・紹介会社を登録します。\nまず1つ目を教えてください。', suggestions: ['Indeed', 'ジョブメドレー', '看護roo!', 'マイナビ看護師', 'レバウェル看護', 'ナースではたらこ', '紹介会社（その他）'] };
    } else if (text.includes('スカウト') && (text.includes('送') || text.includes('送って'))) {
      const m = userText.match(/(\d+)\s*件/);
      const count = m ? parseInt(m[1]) : 10;
      setChatState({ mode: 'awaiting_role_for_scout', context: { count } });
      reply = { role: 'assistant', text: `かしこまりました。${count}件のスカウトですね。\n職種を教えてください。`, suggestions: ['看護師', '助産師', '医療事務', '受付'] };
    } else if (text.includes('書類選考') || text.includes('書類')) {
      if (actions.pendingDocReview.length === 0) {
        reply = { role: 'assistant', text: '本日は書類選考の依頼はありません。', suggestions: ['今日の予定は？', '採用状況まとめて'] };
      } else {
        const first = actions.pendingDocReview[0];
        setChatState({ mode: 'doc_review_iteration', context: { index: 0, decisions: [] } });
        reply = {
          role: 'assistant',
          text: `本日は ${actions.pendingDocReview.length}件 の書類選考依頼があります。\n1人ずつサマリーをお送りしますので、通過 / 不通過 / 保留 でお返事ください。\n\n① ${first.caseId}（${first.role}・${first.source}・${first.daysWaiting}日待ち）\nAI事前評価：要件合致度 85%。給与希望は院の予算内、経験年数も基準内。`,
          suggestions: ['👍 通過', '👎 不通過', '🤔 保留'],
        };
      }
    } else if (text.includes('採用状況') || text.includes('5月') || text.includes('レポート') || text.includes('まとめ')) {
      const r = monthlyReports[clinic.id];
      if (r) {
        reply = {
          role: 'assistant',
          text: `${r.month} の採用状況です。\n\n📊 サマリー\n・応募 ${r.summary.applications}名（先月比 +${r.summary.applications - r.summary.previousApplications}）\n・面接 ${r.summary.interviews}件\n・採用 ${r.summary.hires}名\n\n💰 費用合計 ¥${r.summary.totalCost.toLocaleString()}\n（媒体¥${r.summary.mediaCost.toLocaleString()} / 当社¥${r.summary.sugudeskFee.toLocaleString()}）\n\n${r.summary.hires > 0 ? `1名採用あたり ¥${r.summary.cph.toLocaleString()}` : '採用は0名でした'}\n\n詳細レポートを開きますか？`,
          suggestions: ['📄 PDFを開く', '改善提案を教えて', '紹介会社の実績は？'],
        };
      } else {
        reply = { role: 'assistant', text: 'まだレポートデータがありません。', suggestions: ['今日の予定は？'] };
      }
    } else if (text.includes('面接の振り返り') || text.includes('振り返り')) {
      reply = {
        role: 'assistant',
        text: '面接振り返りですね。Zoomの書き出しファイルをアップロードいただければ、AIが要約・評価ドラフトを作成します。\n\nご自身でアップロードいただくか、弊社オペに依頼することもできます。',
        suggestions: ['アップロードする', 'オペに依頼する'],
      };
    } else if (text.includes('面接質問') || text.includes('質問')) {
      reply = {
        role: 'assistant',
        text: '面接質問の準備ですね。面接予定の候補者を選んでいただければ、業種特性に合わせたAI質問例を生成します。',
        suggestions: ['面接質問の準備画面へ'],
      };
    } else if (text.includes('改善提案')) {
      const r = monthlyReports[clinic.id];
      if (r && r.suggestions.length > 0) {
        const sug = r.suggestions.map((s, i) => `${i + 1}. ${s.title}\n   根拠：${s.reason}`).join('\n\n');
        reply = { role: 'assistant', text: `5月のデータからの改善提案です。\n\n${sug}\n\nどれか採用しますか？`, suggestions: ['全て採用', '①だけ採用', '相談する'] };
      } else {
        reply = { role: 'assistant', text: '改善提案はまだありません。', suggestions: [] };
      }
    } else if (text.includes('紹介会社') || text.includes('成約')) {
      const m = agencyMetricsByClinic[clinic.id] || {};
      const list = Object.entries(m).map(([id, v]) => {
        const a = agencies.find((x) => x.id === id);
        const rate = v.introductions > 0 ? Math.round(v.hires / v.introductions * 100) : 0;
        return `・${a?.name}：紹介${v.introductions}件 / 採用${v.hires}件 / 成約率${rate}%`;
      }).join('\n');
      reply = { role: 'assistant', text: `紹介会社の実績です（直近2ヶ月）。\n\n${list}\n\nマイナビ看護師の成約率が一番高い状態です。要望があればお伝えします。`, suggestions: ['マイナビに要望伝達', '他の紹介会社を増やす'] };
    } else if (text.includes('今日の予定') || text.includes('予定') || text.includes('アクション')) {
      reply = {
        role: 'assistant',
        text: `本日のアクションです。\n\n📌 書類確認待ち：${actions.pendingDocReview.length}名\n📅 面接予定：${actions.upcomingInterviews.map((i) => `${i.date} ${i.time} ${i.caseId}`).join('、') || 'なし'}\n✅ 採用判断待ち：${actions.pendingHireDecision.length}名\n\n何から進めますか？`,
        suggestions: ['書類選考から', '面接質問の準備', 'スカウトを送る'],
      };
    } else if (text.includes('ok') || text.includes('はい') || text.includes('採用')) {
      reply = { role: 'assistant', text: '承りました。SuguDeskオペが対応いたします。', suggestions: ['他の依頼をする'] };
    } else {
      reply = {
        role: 'assistant',
        text: '了解しました。具体的に教えてもらえますか？以下のような依頼ができます。',
        suggestions: ['本日の書類選考の人は？', 'スカウトを送って', '採用状況をまとめて', '今日の予定は？'],
      };
    }
    setMessages((prev) => [...prev, reply]);
  };

  if (compact) {
    return (
      <>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: COLORS.bgAlt }}>
          {messages.map((m, i) => (
            <Message key={i} message={m} onSuggestion={(s) => send(s)} />
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: 12, display: 'flex', gap: 8, background: COLORS.white }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="話しかけてみてください..."
            style={{ flex: 1, padding: '10px 14px', fontSize: 13, border: `1px solid ${COLORS.border}`, borderRadius: 10, outline: 'none' }}
          />
          <button onClick={() => send(input)} style={{ ...primaryButton, padding: '10px 18px', borderRadius: 10 }}>送信</button>
        </div>
      </>
    );
  }

  return (
    <div>
      <BackLink clinicId={clinic.id} />
      <ViewHeader icon="💬" title="AIアシスタント" subtitle="話すだけでスカウト・書類選考・レポート確認・依頼が完結します" />

      {/* チャット履歴 */}
      <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, marginBottom: 16, boxShadow: COLORS.shadow }}>
        <div style={{ padding: '20px', maxHeight: 600, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <Message key={i} message={m} onSuggestion={(s) => send(s)} />
          ))}
        </div>

        {/* 入力欄 */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: 16, display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="話しかけてみてください..."
            style={{ flex: 1, padding: '10px 14px', fontSize: 14, border: `1px solid ${COLORS.border}`, borderRadius: 10, outline: 'none' }}
          />
          <button onClick={() => send(input)} style={{ ...primaryButton, padding: '10px 20px' }}>送信</button>
        </div>
      </div>

      <div style={{ padding: 12, background: COLORS.bg, borderRadius: 8, fontSize: 11, color: COLORS.textLight, lineHeight: 1.6 }}>
        💡 試せる依頼の例：
        <br />【セットアップ】
        <br />・「求人内容を登録」 → 職種・人数・給与・要件・院の魅力を順に対話で入力
        <br />・「媒体を追加」 → 利用中の媒体・紹介会社を順に登録
        <br />【日次運用】
        <br />・「今日の書類選考の人は？」 → 1名ずつサマリ＋通過/不通過のみ返信
        <br />・「スカウトを10件送って」 → 職種を聞かれて、確認後オペに依頼
        <br />・「5月の採用状況まとめて」 → 月次サマリを会話で受け取る
        <br />・「紹介会社の成約率は？」 → 直近実績を会話で受け取る
        <br />・「改善提案を教えて」 → AIによる次月施策を会話で受け取る
      </div>
    </div>
  );
}

function Message({ message, onSuggestion }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ marginBottom: 14, display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '78%' }}>
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: isUser ? COLORS.primary : COLORS.bg,
            color: isUser ? 'white' : COLORS.text,
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.text}
        </div>
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {message.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggestion(s)}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  background: COLORS.white,
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primary}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============== UC-15: 面接質問の準備 ==============
function InterviewPrepView({ clinic, actions }) {
  const [selectedCase, setSelectedCase] = useState(actions.upcomingInterviews[0]?.caseId || '');
  const [questions, setQuestions] = useState(null);
  const [generating, setGenerating] = useState(false);

  const candidate = actions.upcomingInterviews.find((i) => i.caseId === selectedCase);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setQuestions([
        '当院の応募動機について、特に決め手になった点を教えてください',
        '前職での看護経験で、もっとも印象に残っている症例とその学びは？',
        clinic.specialty === '婦人科' ? '婦人科外来でのケア経験について、対応した患者層を教えてください' : '貴院業種に関わる症例対応経験を教えてください',
        clinic.specialty === '婦人科' ? '分娩介助の経験はありますか？経験回数とどんな配慮をしてきたか' : 'チーム医療での連携経験について教えてください',
        '患者対応で「うまくいかなかった」エピソードと、そこから学んだことを教えてください',
        'ワークライフバランスのために大切にしていることはなんですか？',
        '今後5年で身につけたいスキル、進みたい方向性は？',
        '当院についての逆質問はありますか？',
      ]);
      setGenerating(false);
    }, 1000);
  };

  return (
    <div>
      <BackLink clinicId={clinic.id} />
      <ViewHeader icon="🎤" title="面接質問の準備" subtitle="候補者に合わせて、AIが面接で聞くべき質問例を生成します" />

      {/* 候補者選択 */}
      <Card title="対象候補者">
        <select value={selectedCase} onChange={(e) => { setSelectedCase(e.target.value); setQuestions(null); }} style={selectStyle}>
          {actions.upcomingInterviews.length === 0 ? (
            <option>面接予定の候補者がいません</option>
          ) : (
            actions.upcomingInterviews.map((i) => (
              <option key={i.caseId} value={i.caseId}>
                {i.caseId} ({i.role} / {i.source} / 面接予定 {i.date} {i.time})
              </option>
            ))
          )}
        </select>

        {candidate && (
          <div style={{ marginTop: 12, padding: 12, background: COLORS.bg, borderRadius: 6, fontSize: 12, color: COLORS.textLight }}>
            <strong>候補者情報（媒体内匿名ID）：</strong>
            <br />
            職種：{candidate.role} ／ 媒体：{candidate.source} ／ 面接予定：{candidate.date} {candidate.time}
            <br />
            <span style={{ color: COLORS.textMuted }}>※氏名・連絡先等の個人情報は当社サーバーに保持していません</span>
          </div>
        )}

        <button onClick={handleGenerate} disabled={generating || !candidate} style={{ ...primaryButton, marginTop: 16, width: '100%', opacity: generating ? 0.6 : 1 }}>
          {generating ? 'AIが質問例を作成中...' : '✨ AIで面接質問を生成'}
        </button>
      </Card>

      {/* 結果 */}
      {questions && (
        <Card title="生成された面接質問">
          <ol style={{ paddingLeft: 24, margin: 0, lineHeight: 1.8, fontSize: 14, color: COLORS.text }}>
            {questions.map((q, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{q}</li>
            ))}
          </ol>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => navigator.clipboard.writeText(questions.map((q, i) => `${i + 1}. ${q}`).join('\n')).then(() => alert('コピーしました'))} style={secondaryButton}>
              📋 コピー
            </button>
            <button onClick={handleGenerate} style={secondaryButton}>🔄 再生成</button>
            <button onClick={() => alert('印刷ダイアログを開きます（プロトタイプ）')} style={secondaryButton}>🖨 印刷</button>
            <button onClick={() => alert('スマホへ送信しました（プロトタイプ）')} style={{ ...primaryButton, marginLeft: 'auto' }}>📱 スマホへ送る</button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============== UC-16: 面接の振り返り ==============
function InterviewDebriefView({ clinic, cases }) {
  const [selectedCase, setSelectedCase] = useState('');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [evaluation, setEvaluation] = useState('');

  const interviewedCases = cases.filter((c) => ['面接予定', '面接実施', '内定'].includes(c.status));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        transcript: '〜（中略）〜\n候補者：「前職では混合病棟で5年ほど働いておりまして、特に術後の患者ケアと産科病棟での経験が長かったです。患者様一人ひとりに寄り添うケアを大切にしてきました。」\n面接官：「当院に応募された決め手は？」\n候補者：「個人クリニックで、患者様一人ひとりとの関係性を大切にできる環境に魅力を感じました。教育制度も整っていると伺ったので…」\n〜（中略）〜',
        summary: '婦人科経験5年の看護師。前職は総合病院の混合病棟で勤務。当院の地域密着型の方針と教育制度に魅力を感じて応募。患者対応への姿勢が丁寧で、当院の理念と合致。給与希望は当院予算内。',
        strengths: [
          '婦人科病棟5年の実績、術後ケアの経験豊富',
          '患者対応への姿勢が丁寧',
          '当院の方針への理解が深い',
          '給与希望が当院予算内',
        ],
        concerns: [
          '前職退職理由が「人間関係」で、当院でも同様のリスクがないか追加確認推奨',
          '通勤時間が片道1時間とやや長い',
        ],
        evalDraft: '採用推奨。婦人科経験と患者対応のスキルは当院の求める水準を満たしている。退職理由について追加でリファレンス確認できれば安心。',
        suggestedDecision: 'recommend',
      });
      setEvaluation('採用推奨。婦人科経験と患者対応のスキルは当院の求める水準を満たしている。退職理由について追加でリファレンス確認できれば安心。');
      setAnalyzing(false);
    }, 1500);
  };

  const handleSave = () => {
    alert('面接振り返りを保存しました（プロトタイプ）。\nステータスが「面接実施」に自動更新され、SuguDeskオペにも共有されます。');
  };

  return (
    <div>
      <BackLink clinicId={clinic.id} />
      <ViewHeader icon="📝" title="面接の振り返り" subtitle="Zoomの書き出しをアップロードすると、AIが要約と評価ドラフトを作成します" />

      <Card title="対象候補者">
        <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)} style={selectStyle}>
          <option value="">候補者を選択...</option>
          {interviewedCases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} ({c.role} / {c.media} / {c.status})
            </option>
          ))}
        </select>
      </Card>

      <Card title="Zoom書き出しファイルのアップロード">
        <div style={{ background: COLORS.bg, borderRadius: 8, padding: 24, textAlign: 'center', border: `2px dashed ${COLORS.border}` }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 12 }}>
            対応形式：.vtt（Zoom字幕） / .txt / .mp4 / .m4a
          </div>
          <input
            type="file"
            id="file-upload"
            accept=".vtt,.txt,.mp4,.m4a"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" style={{ ...secondaryButton, display: 'inline-block', cursor: 'pointer' }}>
            ファイルを選択
          </label>
          {fileName && (
            <div style={{ marginTop: 12, fontSize: 13, color: COLORS.text }}>
              選択中：<strong>{fileName}</strong>
            </div>
          )}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!fileName || !selectedCase || analyzing}
          style={{ ...primaryButton, width: '100%', marginTop: 16, opacity: !fileName || !selectedCase || analyzing ? 0.5 : 1 }}
        >
          {analyzing ? 'AIが分析中...（文字起こし→要約→評価ドラフト）' : '✨ AIで分析する'}
        </button>
        <div style={{ marginTop: 12, padding: 10, background: COLORS.alertBg, color: COLORS.alertText, borderRadius: 6, fontSize: 11 }}>
          💡 候補者の同意の上で録画したZoomデータをアップロードしてください。アップロード後はAI解析後30日で削除されます。
        </div>
      </Card>

      {result && (
        <>
          <Card title="AI要約">
            <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.7, padding: 12, background: COLORS.bg, borderRadius: 6 }}>
              {result.summary}
            </div>
          </Card>

          <Card title="強み・懸念点">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, marginBottom: 8 }}>強み</div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.warning, marginBottom: 8 }}>懸念点・確認事項</div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
                  {result.concerns.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          <Card title="評価ドラフト（編集できます）">
            <textarea
              value={evaluation}
              onChange={(e) => setEvaluation(e.target.value)}
              style={{ ...selectStyle, minHeight: 100, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <button onClick={() => setEvaluation('採用推奨。' + evaluation)} style={chipButton}>👍 採用推奨</button>
              <button onClick={() => setEvaluation('保留。' + evaluation)} style={chipButton}>🤔 保留</button>
              <button onClick={() => setEvaluation('見送り。' + evaluation)} style={chipButton}>👎 見送り</button>
              <button onClick={handleSave} style={{ ...primaryButton, marginLeft: 'auto' }}>保存して送信</button>
            </div>
          </Card>

          <Card title="文字起こし全文（参考）">
            <div style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 1.7, padding: 12, background: COLORS.bg, borderRadius: 6, whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
              {result.transcript}
            </div>
          </Card>
        </>
      )}

      {/* 過去の振り返り */}
      <Card title="過去の振り返り">
        {(interviewArtifacts[clinic.id] || []).length === 0 ? (
          <div style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center', padding: 16 }}>過去の振り返りはまだありません</div>
        ) : (
          <div>
            {(interviewArtifacts[clinic.id] || []).map((a, i) => (
              <div key={i} style={{ padding: 12, borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                  <span style={{ fontWeight: 600, color: COLORS.primary, fontFamily: 'monospace' }}>{a.caseId}</span>
                  <span style={{ color: COLORS.textMuted }}>{a.createdAt}</span>
                </div>
                <div style={{ fontSize: 13, color: COLORS.text, marginBottom: 4 }}>{a.summary}</div>
                <div style={{ fontSize: 11, color: COLORS.success, fontWeight: 600 }}>結論：{a.evaluation}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============== UC-17: 候補者への連絡を依頼 ==============
function CommunicationRequestView({ clinic, cases, actions }) {
  const [selectedCase, setSelectedCase] = useState('');
  const [scene, setScene] = useState('採用通知');
  const [request, setRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedCase || !request.trim()) {
      alert('候補者と要望を入力してください');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div>
      <BackLink clinicId={clinic.id} />
      <ViewHeader icon="💬" title="候補者への連絡を依頼" subtitle="シーンを選んで弊社に連絡文の作成を依頼できます" />

      {!submitted ? (
        <>
          <Card title="対象候補者">
            <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)} style={selectStyle}>
              <option value="">候補者を選択...</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} ({c.role} / {c.media} / {c.status})
                </option>
              ))}
            </select>
          </Card>

          <Card title="シーン">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['採用通知', '不採用通知', '面接日程の調整・変更', '質問への回答', 'その他'].map((s) => (
                <button
                  key={s}
                  onClick={() => setScene(s)}
                  style={{
                    padding: '8px 14px',
                    fontSize: 13,
                    border: `2px solid ${scene === s ? COLORS.primary : COLORS.border}`,
                    background: scene === s ? COLORS.primaryLight : COLORS.white,
                    color: scene === s ? COLORS.primary : COLORS.text,
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: scene === s ? 600 : 400,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card title="ご要望（自由記述）">
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="例：6月15日の入職をご案内ください。初日は9時集合で、白衣サイズの確認もしたいです。"
              style={{ ...selectStyle, minHeight: 120, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </Card>

          <button onClick={handleSubmit} style={{ ...primaryButton, width: '100%', padding: '14px', fontSize: 15 }}>
            SuguDeskオペに依頼する
          </button>
          <div style={{ marginTop: 12, padding: 12, background: COLORS.bg, borderRadius: 6, fontSize: 12, color: COLORS.textLight, lineHeight: 1.6 }}>
            依頼後、SuguDeskオペがAI下書きを生成して文面を磨き、院長承認を経て媒体経由で送信します。通常、依頼から24時間以内にドラフトをご共有します。
          </div>
        </>
      ) : (
        <Card title="✅ 依頼を受け付けました">
          <div style={{ padding: 20, background: '#dcfce7', borderRadius: 8, fontSize: 14, color: '#166534', lineHeight: 1.7 }}>
            ご依頼ありがとうございます。
            <br /><br />
            <strong>候補者：</strong>{selectedCase}<br />
            <strong>シーン：</strong>{scene}<br />
            <strong>要望：</strong>{request}
            <br /><br />
            SuguDeskオペが対応中です。AI下書きが完成次第、院長LINEにお知らせします。
          </div>
          <button onClick={() => { setSubmitted(false); setSelectedCase(''); setRequest(''); }} style={{ ...secondaryButton, marginTop: 16 }}>
            別の依頼を作成
          </button>
        </Card>
      )}

      {/* 進行中の依頼 */}
      <Card title="進行中の依頼">
        {actions.pendingCommunicationRequests.length === 0 ? (
          <div style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center', padding: 16 }}>進行中の依頼はありません</div>
        ) : (
          actions.pendingCommunicationRequests.map((r, i) => (
            <div key={i} style={{ padding: 12, borderBottom: i < actions.pendingCommunicationRequests.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{r.caseId} / {r.scene}</span>
                <span style={{ fontSize: 12, color: COLORS.warning, fontWeight: 600 }}>{r.status}</span>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>依頼日：{r.requestedAt}</div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

// ============== 月次レポート閲覧 ==============
function MonthlyReportView({ clinic }) {
  const report = monthlyReports[clinic.id];
  if (!report) {
    return (
      <div>
        <BackLink clinicId={clinic.id} />
        <Card title="月次レポート"><div style={{ textAlign: 'center', padding: 24, color: COLORS.textMuted }}>レポートはまだありません</div></Card>
      </div>
    );
  }

  return (
    <div>
      <BackLink clinicId={clinic.id} />
      <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 32 }}>
        <div style={{ borderBottom: `2px solid ${COLORS.primary}`, paddingBottom: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>
            採用月次レポート
          </h1>
          <div style={{ fontSize: 13, color: COLORS.textLight }}>{report.month} ／ 発行日：{report.issuedAt}</div>
        </div>

        {/* サマリー */}
        <ReportSection title="サマリー">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <Stat label="応募" value={report.summary.applications} />
            <Stat label="面接" value={report.summary.interviews} />
            <Stat label="内定" value={report.summary.offers} />
            <Stat label="採用" value={report.summary.hires} />
          </div>
          <div style={{ marginTop: 12, padding: 12, background: COLORS.bg, borderRadius: 6, fontSize: 13 }}>
            総費用：<strong>¥{report.summary.totalCost.toLocaleString()}</strong>
            （媒体¥{report.summary.mediaCost.toLocaleString()} ＋ 紹介手数料¥{report.summary.referralFee.toLocaleString()} ＋ 当社¥{report.summary.sugudeskFee.toLocaleString()}）
          </div>
        </ReportSection>

        <ReportSection title="媒体別">
          <SimpleTable
            headers={['媒体', '応募', '面接', '採用', '費用', 'CPA']}
            rows={report.media.map((m) => [m.name, m.applications, m.interviews, m.hires, `¥${m.cost.toLocaleString()}`, m.cpa > 0 ? `¥${m.cpa.toLocaleString()}` : '-'])}
          />
        </ReportSection>

        <ReportSection title="スカウト活動">
          <SimpleTable
            headers={['媒体', '送信', '開封', '返信', '返信率']}
            rows={report.scout.map((s) => [s.media, s.sent, s.opened, s.replied, `${s.replyRate}%`])}
          />
        </ReportSection>

        <ReportSection title="改善提案">
          {report.suggestions.map((s, i) => (
            <div key={i} style={{ marginBottom: 12, padding: 12, background: COLORS.bg, borderRadius: 6, borderLeft: `3px solid ${COLORS.primary}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{i + 1}. {s.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textLight }}>{s.reason}</div>
            </div>
          ))}
        </ReportSection>
      </div>
    </div>
  );
}

function ReportSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${COLORS.border}` }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SimpleTable({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ background: COLORS.bg }}>
          {headers.map((h, i) => <th key={i} style={{ padding: '8px 12px', textAlign: i === 0 ? 'left' : 'right', fontWeight: 600, color: COLORS.textLight }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            {row.map((cell, ci) => <td key={ci} style={{ padding: '10px 12px', textAlign: ci === 0 ? 'left' : 'right' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ====================================================================
// 共通スタイル
// ====================================================================
function Card({ title, children }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

const primaryButton = {
  padding: '10px 18px',
  background: COLORS.primary,
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const secondaryButton = {
  padding: '10px 16px',
  background: COLORS.white,
  color: COLORS.text,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};

const chipButton = {
  padding: '6px 12px',
  background: COLORS.primaryLight,
  color: COLORS.primary,
  border: `1px solid ${COLORS.primary}`,
  borderRadius: 16,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  background: COLORS.white,
  outline: 'none',
  boxSizing: 'border-box',
};
