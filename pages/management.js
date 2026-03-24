import { useState, useEffect } from "react";
import Head from "next/head";

export default function Management() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "read" }),
      });
      if (!res.ok) {
        setError("パスワードが正しくありません");
        setLoading(false);
        return;
      }
      const result = await res.json();
      setData(result);
      setAuthenticated(true);
    } catch {
      setError("エラーが発生しました");
    }
    setLoading(false);
  };

  if (!authenticated) {
    return (
      <>
        <Head><title>SuguDesk 経営管理</title></Head>
        <div style={styles.loginContainer}>
          <div style={styles.loginBox}>
            <h1 style={styles.loginTitle}>SuguDesk</h1>
            <p style={styles.loginSubtitle}>経営管理ダッシュボード</p>
            <input
              type="password"
              placeholder="管理パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button onClick={handleLogin} disabled={loading} style={styles.loginButton}>
              {loading ? "読み込み中..." : "ログイン"}
            </button>
          </div>
        </div>
      </>
    );
  }

  const { strategy, clients, roadmap, financials } = data;

  const tabs = [
    { id: "overview", label: "経営概要" },
    { id: "clients", label: "顧客・営業" },
    { id: "product", label: "プロダクト" },
    { id: "financials", label: "財務" },
    { id: "strategy", label: "戦略" },
  ];

  return (
    <>
      <Head><title>SuguDesk 経営管理</title></Head>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>SuguDesk 経営管理</h1>
            <p style={styles.headerSub}>{strategy?.company?.mission}</p>
          </div>
          <span style={styles.stage}>{strategy?.company?.stage}</span>
        </header>

        <nav style={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main style={styles.main}>
          {activeTab === "overview" && <OverviewTab strategy={strategy} clients={clients} roadmap={roadmap} />}
          {activeTab === "clients" && <ClientsTab clients={clients} />}
          {activeTab === "product" && <ProductTab roadmap={roadmap} />}
          {activeTab === "financials" && <FinancialsTab financials={financials} />}
          {activeTab === "strategy" && <StrategyTab strategy={strategy} />}
        </main>
      </div>
    </>
  );
}

function OverviewTab({ strategy, clients, roadmap }) {
  const activeClients = clients?.clients?.filter((c) => c.status === "active") || [];
  const pipelineLeads = clients?.pipeline?.filter((p) => p.name) || [];
  const inProgressFeatures = roadmap?.roadmap?.filter((r) => r.status === "計画中" || r.status === "進行中") || [];

  return (
    <div>
      <div style={styles.kpiRow}>
        <KpiCard title="アクティブ顧客数" value={activeClients.length} unit="社" color="#4f46e5" />
        <KpiCard title="営業パイプライン" value={pipelineLeads.length} unit="件" color="#059669" />
        <KpiCard title="進行中マイルストーン" value={inProgressFeatures.length} unit="件" color="#d97706" />
        <KpiCard title="事業ドメイン" value={strategy?.businessDomains?.length || 0} unit="事業" color="#dc2626" />
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>事業ドメイン</h3>
          {strategy?.businessDomains?.map((domain, i) => (
            <div key={i} style={styles.domainItem}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{domain.name}</strong>
                <span style={{
                  ...styles.badge,
                  background: domain.status === "運用中" ? "#dcfce7" : "#fef3c7",
                  color: domain.status === "運用中" ? "#166534" : "#92400e"
                }}>
                  {domain.status}
                </span>
              </div>
              <p style={styles.domainPhase}>{domain.phase}</p>
              <p style={styles.domainType}>{domain.type}</p>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>戦略的優先事項</h3>
          {strategy?.strategicPriorities?.map((sp, i) => (
            <div key={i} style={styles.priorityItem}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={styles.priorityTitle}>{sp.title}</span>
                <span style={{
                  ...styles.badge,
                  background: sp.status === "進行中" ? "#dbeafe" : sp.status === "計画中" ? "#fef3c7" : "#f3f4f6",
                  color: sp.status === "進行中" ? "#1e40af" : sp.status === "計画中" ? "#92400e" : "#374151"
                }}>
                  {sp.status}
                </span>
              </div>
              <p style={styles.priorityDesc}>{sp.description}</p>
              {sp.timeline && <p style={styles.timeline}>{sp.timeline}</p>}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>成長フェーズ</h3>
        <div style={styles.phaseRow}>
          {strategy?.growthStrategy && Object.values(strategy.growthStrategy).map((phase, i) => (
            <div key={i} style={styles.phaseCard}>
              <div style={styles.phaseHeader}>
                <span style={styles.phaseNumber}>Phase {i + 1}</span>
                <strong>{phase.name}</strong>
              </div>
              <p style={styles.phasePeriod}>{phase.period}</p>
              <p style={styles.phaseDesc}>{phase.focus}</p>
              <div style={styles.phaseMetrics}>
                {phase.keyMetrics?.map((m, j) => (
                  <span key={j} style={styles.metricBadge}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientsTab({ clients }) {
  const activeClients = clients?.clients?.filter((c) => c.status === "active") || [];
  const pipeline = clients?.pipeline?.filter((p) => p.name) || [];

  return (
    <div>
      <h2 style={styles.sectionTitle}>アクティブ顧客 ({activeClients.length}社)</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>顧客名</th>
              <th style={styles.th}>サービス</th>
              <th style={styles.th}>月額</th>
              <th style={styles.th}>担当者</th>
              <th style={styles.th}>備考</th>
            </tr>
          </thead>
          <tbody>
            {activeClients.map((c, i) => (
              <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                <td style={styles.td}><strong>{c.name}</strong></td>
                <td style={styles.td}>
                  {c.services?.map((s, j) => (
                    <span key={j} style={styles.serviceBadge}>{s === "dashboard" ? "分析" : s === "chatbot" ? "チャット" : s}</span>
                  ))}
                </td>
                <td style={styles.td}>{c.monthlyFee ? `¥${c.monthlyFee.toLocaleString()}` : "未設定"}</td>
                <td style={styles.td}>{c.contactPerson || "-"}</td>
                <td style={styles.td}>{c.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ ...styles.sectionTitle, marginTop: 40 }}>営業パイプライン</h2>
      {pipeline.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>企業名</th>
                <th style={styles.th}>ステージ</th>
                <th style={styles.th}>ソース</th>
                <th style={styles.th}>想定金額</th>
                <th style={styles.th}>次のアクション</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map((p, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                  <td style={styles.td}><strong>{p.name}</strong></td>
                  <td style={styles.td}><span style={styles.stageBadge}>{p.stage}</span></td>
                  <td style={styles.td}>{p.source || "-"}</td>
                  <td style={styles.td}>{p.estimatedValue ? `¥${p.estimatedValue.toLocaleString()}` : "-"}</td>
                  <td style={styles.td}>{p.nextAction || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>営業パイプラインにリードがありません</p>
          <p style={styles.emptyHint}>Claude Codeで「新しいリードを追加して」と指示してください</p>
        </div>
      )}

      <div style={{ ...styles.card, marginTop: 30 }}>
        <h3 style={styles.cardTitle}>営業ステージ定義</h3>
        <div style={styles.stagesFlow}>
          {clients?.stages?.map((s, i) => (
            <span key={i} style={styles.stageStep}>
              {s}
              {i < clients.stages.length - 1 && <span style={styles.stageArrow}> → </span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductTab({ roadmap }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>プロダクトロードマップ</h2>
      <div style={styles.roadmapTimeline}>
        {roadmap?.roadmap?.map((milestone, i) => (
          <div key={i} style={styles.milestoneCard}>
            <div style={styles.milestoneHeader}>
              <span style={styles.versionBadge}>v{milestone.version}</span>
              <strong style={styles.milestoneTitle}>{milestone.title}</strong>
              <span style={{
                ...styles.badge,
                background: milestone.status === "進行中" ? "#dbeafe" : milestone.status === "計画中" ? "#fef3c7" : "#f3f4f6",
                color: milestone.status === "進行中" ? "#1e40af" : milestone.status === "計画中" ? "#92400e" : "#374151"
              }}>
                {milestone.status}
              </span>
            </div>
            <p style={styles.milestoneDate}>{milestone.targetDate}</p>
            <div style={styles.featureList}>
              {milestone.features?.map((f, j) => (
                <div key={j} style={styles.featureItem}>
                  <span style={{
                    ...styles.priorityDot,
                    background: f.priority === "high" ? "#dc2626" : f.priority === "medium" ? "#d97706" : "#6b7280"
                  }} />
                  <div>
                    <strong>{f.title}</strong>
                    <p style={styles.featureDesc}>{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ ...styles.sectionTitle, marginTop: 40 }}>バックログ</h2>
      <div style={styles.card}>
        {roadmap?.backlog?.map((item, i) => (
          <div key={i} style={styles.backlogItem}>
            <span style={{
              ...styles.priorityDot,
              background: item.priority === "high" ? "#dc2626" : item.priority === "medium" ? "#d97706" : "#6b7280"
            }} />
            <div>
              <strong>{item.title}</strong>
              {item.notes && <p style={styles.featureDesc}>{item.notes}</p>}
            </div>
            <span style={styles.priorityLabel}>{item.priority}</span>
          </div>
        ))}
      </div>

      {roadmap?.bugs?.length > 0 && (
        <>
          <h2 style={{ ...styles.sectionTitle, marginTop: 40 }}>バグ</h2>
          <div style={styles.card}>
            {roadmap.bugs.map((bug, i) => (
              <div key={i} style={styles.backlogItem}>
                <strong>{bug.title}</strong>
                <p>{bug.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FinancialsTab({ financials }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>料金プラン</h2>
      <div style={styles.grid2}>
        {financials?.pricing?.plans?.map((plan, i) => (
          <div key={i} style={{ ...styles.card, borderTop: `4px solid ${i === 0 ? "#4f46e5" : "#d97706"}` }}>
            <h3 style={styles.planName}>{plan.name}</h3>
            <p style={styles.planPrice}>
              {plan.monthlyPrice ? `¥${plan.monthlyPrice.toLocaleString()}/月` : "料金未設定"}
            </p>
            <ul style={styles.planFeatures}>
              {plan.includes?.map((f, j) => (
                <li key={j} style={styles.planFeatureItem}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 style={{ ...styles.sectionTitle, marginTop: 40 }}>固定費</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>カテゴリ</th>
              <th style={styles.th}>プロバイダ</th>
              <th style={styles.th}>月額</th>
              <th style={styles.th}>備考</th>
            </tr>
          </thead>
          <tbody>
            {financials?.expenses?.fixedCosts?.map((cost, i) => (
              <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                <td style={styles.td}>{cost.category}</td>
                <td style={styles.td}>{cost.provider || "-"}</td>
                <td style={styles.td}>{cost.amount ? `¥${cost.amount.toLocaleString()}` : "未設定"}</td>
                <td style={styles.td}>{cost.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...styles.emptyState, marginTop: 30 }}>
        <p>売上・経費の月次データを追加するには</p>
        <p style={styles.emptyHint}>Claude Codeで「1月の売上を追加して：ルナ 50,000円、AdeB 30,000円」のように指示してください</p>
      </div>
    </div>
  );
}

function StrategyTab({ strategy }) {
  return (
    <div>
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>ビジョン・ミッション</h2>
        <div style={styles.visionBox}>
          <div>
            <label style={styles.visionLabel}>ミッション</label>
            <p style={styles.visionText}>{strategy?.company?.mission}</p>
          </div>
          <div>
            <label style={styles.visionLabel}>ビジョン</label>
            <p style={styles.visionText}>{strategy?.company?.vision}</p>
          </div>
        </div>
      </div>

      <h2 style={{ ...styles.sectionTitle, marginTop: 30 }}>事業ドメイン詳細</h2>
      {strategy?.businessDomains?.map((domain, i) => (
        <div key={i} style={{ ...styles.card, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>{domain.name}</h3>
            <span style={{
              ...styles.badge,
              background: domain.status === "運用中" ? "#dcfce7" : "#fef3c7",
              color: domain.status === "運用中" ? "#166534" : "#92400e"
            }}>{domain.status}</span>
          </div>
          <p><strong>フェーズ:</strong> {domain.phase}</p>
          <p><strong>ビジネスモデル:</strong> {domain.type}</p>
          <p><strong>ターゲット:</strong> {domain.targetMarket}</p>

          <h4 style={{ marginTop: 15 }}>提供価値</h4>
          <ul>
            {domain.valueProposition?.map((v, j) => <li key={j}>{v}</li>)}
          </ul>

          {domain.potentialServices && (
            <>
              <h4>想定サービス</h4>
              {domain.potentialServices.map((s, j) => (
                <div key={j} style={styles.serviceItem}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      ...styles.priorityDot,
                      background: s.priority === "high" ? "#dc2626" : "#d97706"
                    }} />
                    <strong>{s.name}</strong>
                  </div>
                  <p style={styles.featureDesc}>{s.description}</p>
                </div>
              ))}
            </>
          )}

          {domain.synergy && (
            <div style={styles.synergyBox}>
              <strong>SaaS→BPOシナジー:</strong> {domain.synergy}
            </div>
          )}
        </div>
      ))}

      <h2 style={{ ...styles.sectionTitle, marginTop: 30 }}>競合優位性</h2>
      <div style={styles.card}>
        <ul>
          {strategy?.competitiveAdvantage?.map((a, i) => (
            <li key={i} style={{ padding: "6px 0" }}>{a}</li>
          ))}
        </ul>
      </div>

      <h2 style={{ ...styles.sectionTitle, marginTop: 30 }}>KPI</h2>
      <div style={styles.grid2}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>顧客数目標</h3>
          <table style={styles.table}>
            <tbody>
              {strategy?.kpis?.targetClients && Object.entries(strategy.kpis.targetClients).map(([key, val], i) => (
                <tr key={i}>
                  <td style={styles.td}>{key.replace("_", " ").toUpperCase()}</td>
                  <td style={{ ...styles.td, fontWeight: "bold" }}>{val}社</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>チャーンレート</h3>
          <p>現在: {strategy?.kpis?.churnRate?.current || "未計測"}</p>
          <p>目標: {strategy?.kpis?.churnRate?.target}</p>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, unit, color }) {
  return (
    <div style={{ ...styles.kpiCard, borderLeft: `4px solid ${color}` }}>
      <p style={styles.kpiTitle}>{title}</p>
      <p style={styles.kpiValue}>
        <span style={{ color }}>{value}</span>
        <span style={styles.kpiUnit}>{unit}</span>
      </p>
    </div>
  );
}

const styles = {
  loginContainer: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
  loginBox: { background: "#fff", padding: 40, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", width: 360 },
  loginTitle: { fontSize: 28, fontWeight: 700, color: "#1e293b", margin: 0 },
  loginSubtitle: { color: "#64748b", marginBottom: 24 },
  input: { width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, boxSizing: "border-box" },
  error: { color: "#dc2626", fontSize: 13, margin: "8px 0" },
  loginButton: { width: "100%", padding: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 12 },

  container: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px", fontFamily: "'Segoe UI', sans-serif", color: "#1e293b" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: "1px solid #e2e8f0" },
  headerTitle: { fontSize: 22, fontWeight: 700, margin: 0 },
  headerSub: { color: "#64748b", margin: "4px 0 0", fontSize: 14 },
  stage: { background: "#ede9fe", color: "#5b21b6", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 },

  tabs: { display: "flex", gap: 4, padding: "16px 0", borderBottom: "1px solid #e2e8f0" },
  tab: { padding: "8px 18px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, color: "#64748b", borderRadius: 6, fontWeight: 500 },
  tabActive: { background: "#4f46e5", color: "#fff" },

  main: { paddingTop: 24 },

  kpiRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 },
  kpiCard: { background: "#fff", padding: "20px", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  kpiTitle: { margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 },
  kpiValue: { margin: "8px 0 0", fontSize: 32, fontWeight: 700 },
  kpiUnit: { fontSize: 14, color: "#94a3b8", marginLeft: 4 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 },
  card: { background: "#fff", padding: 24, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  cardTitle: { margin: "0 0 16px", fontSize: 16, fontWeight: 600 },

  domainItem: { padding: "12px 0", borderBottom: "1px solid #f1f5f9" },
  domainPhase: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
  domainType: { margin: "2px 0 0", fontSize: 13, color: "#94a3b8" },

  badge: { padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 },

  priorityItem: { padding: "12px 0", borderBottom: "1px solid #f1f5f9" },
  priorityTitle: { fontSize: 14, fontWeight: 600 },
  priorityDesc: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
  timeline: { margin: "4px 0 0", fontSize: 12, color: "#94a3b8" },

  phaseRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  phaseCard: { background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0" },
  phaseHeader: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
  phaseNumber: { background: "#4f46e5", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600 },
  phasePeriod: { fontSize: 12, color: "#64748b", margin: "0 0 6px" },
  phaseDesc: { fontSize: 13, color: "#374151", margin: 0 },
  phaseMetrics: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 },
  metricBadge: { background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 10, fontSize: 11 },

  sectionTitle: { fontSize: 18, fontWeight: 600, margin: "0 0 16px" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  th: { padding: "12px 16px", textAlign: "left", background: "#f8fafc", fontSize: 13, fontWeight: 600, color: "#475569", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px 16px", fontSize: 14, borderBottom: "1px solid #f1f5f9" },
  trEven: { background: "#fafbfc" },
  serviceBadge: { display: "inline-block", background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 10, fontSize: 11, marginRight: 4 },
  stageBadge: { background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 },

  emptyState: { textAlign: "center", padding: 40, background: "#f8fafc", borderRadius: 10, color: "#64748b" },
  emptyHint: { fontSize: 13, color: "#94a3b8", marginTop: 8 },

  stagesFlow: { display: "flex", flexWrap: "wrap", gap: 4, fontSize: 14 },
  stageStep: { display: "inline-flex", alignItems: "center" },
  stageArrow: { color: "#94a3b8", margin: "0 4px" },

  roadmapTimeline: { display: "flex", flexDirection: "column", gap: 20 },
  milestoneCard: { background: "#fff", padding: 24, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: "4px solid #4f46e5" },
  milestoneHeader: { display: "flex", alignItems: "center", gap: 12 },
  milestoneTitle: { fontSize: 16 },
  milestoneDate: { fontSize: 13, color: "#64748b", margin: "6px 0 12px" },
  versionBadge: { background: "#4f46e5", color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 },
  featureList: { display: "flex", flexDirection: "column", gap: 10 },
  featureItem: { display: "flex", gap: 10, alignItems: "flex-start" },
  featureDesc: { margin: "2px 0 0", fontSize: 13, color: "#64748b" },
  priorityDot: { width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0 },

  backlogItem: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
  priorityLabel: { fontSize: 12, color: "#94a3b8", marginLeft: "auto" },

  planName: { fontSize: 20, fontWeight: 700, margin: "0 0 8px" },
  planPrice: { fontSize: 28, fontWeight: 700, color: "#4f46e5", margin: "0 0 16px" },
  planFeatures: { paddingLeft: 20 },
  planFeatureItem: { padding: "4px 0", fontSize: 14 },

  visionBox: { display: "flex", flexDirection: "column", gap: 20 },
  visionLabel: { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" },
  visionText: { fontSize: 16, fontWeight: 500, margin: "6px 0 0" },

  serviceItem: { padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
  synergyBox: { marginTop: 16, padding: 16, background: "#ede9fe", borderRadius: 8, fontSize: 14 },
};
