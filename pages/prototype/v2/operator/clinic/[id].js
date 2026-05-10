import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  clinics,
  candidates as initialCandidates,
  STATUSES,
  scoutTemplates as initialTemplates,
  agencies,
  agencyMetricsByClinic,
  agencyRequestsByClinic,
  monthlyScoutStats,
  monthlyMediaCost,
  mediaMetricsByClinic,
  monthlyReports,
} from '../../../../../lib/prototypeMockData';

const COLORS = {
  primary: '#2563a8',
  primaryLight: '#eff6ff',
  bg: '#f8f7f4',
  white: '#ffffff',
  text: '#1f2937',
  textLight: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const STATUS_COLORS = {
  応募: '#3b82f6', 書類選考: '#8b5cf6', 面接予定: '#f59e0b',
  面接実施: '#f97316', 内定: '#10b981', 採用: '#059669', 不採用: '#9ca3af',
};

export default function OperatorClinicDetail() {
  const router = useRouter();
  const { id, tab: tabParam } = router.query;
  const [activeTab, setActiveTab] = useState('kanban');
  const [cards, setCards] = useState([]);

  useEffect(() => { if (id) setCards(initialCandidates[id] || []); }, [id]);
  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  const clinic = clinics.find((c) => c.id === id);
  if (!clinic) return null;

  const moveCard = (cardId, newStatus) => {
    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status: newStatus, updatedAt: new Date().toISOString().slice(0, 10) } : c));
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif' }}>
      <header style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link href="/prototype/v2/operator"><span style={{ fontSize: 12, color: COLORS.textLight, cursor: 'pointer' }}>← オペレータダッシュボード</span></Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: 0 }}>{clinic.name}</h1>
              <span style={{ fontSize: 12, color: COLORS.textLight }}>{clinic.specialty}</span>
            </div>
          </div>
          <Link href={`/prototype/v2/clinic-portal/${clinic.id}`}>
            <span style={{ fontSize: 12, color: COLORS.primary, fontWeight: 600, cursor: 'pointer' }}>院向け画面を確認 →</span>
          </Link>
        </div>
      </header>

      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4 }}>
          <Tab label="案件進捗" active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
          <Tab label="スカウト管理" active={activeTab === 'scout'} onClick={() => setActiveTab('scout')} />
          <Tab label="紹介会社管理" active={activeTab === 'agency'} onClick={() => setActiveTab('agency')} />
          <Tab label="CSV取り込み" active={activeTab === 'csv'} onClick={() => setActiveTab('csv')} />
          <Tab label="イベント記録" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <Tab label="月次レポート" active={activeTab === 'report'} onClick={() => setActiveTab('report')} />
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {activeTab === 'kanban' && <KanbanTab cards={cards} onMoveCard={moveCard} />}
        {activeTab === 'scout' && <ScoutManagementTab clinicId={id} clinic={clinic} />}
        {activeTab === 'agency' && <AgencyManagementTab clinicId={id} />}
        {activeTab === 'csv' && <CSVImportTab clinicId={id} />}
        {activeTab === 'events' && <EventsTab cards={cards} onMoveCard={moveCard} />}
        {activeTab === 'report' && <ReportTab clinicId={id} />}
      </main>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 18px', fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? COLORS.primary : COLORS.textLight,
        background: 'transparent', border: 'none',
        borderBottom: active ? `2px solid ${COLORS.primary}` : '2px solid transparent',
        cursor: 'pointer', marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

// ============== カンバン ==============
function KanbanTab({ cards, onMoveCard }) {
  return (
    <div>
      <Banner text="候補者は媒体内匿名IDで管理されています。詳細は媒体管理画面でご確認ください。" />
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
        {STATUSES.map((status) => {
          const filtered = cards.filter((c) => c.status === status);
          return (
            <div key={status} style={{ minWidth: 220, width: 220, background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: STATUS_COLORS[status], marginRight: 8 }} />
                  {status}
                </div>
                <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600 }}>{filtered.length}</span>
              </div>
              {filtered.map((c) => <Card key={c.id} card={c} onMove={onMoveCard} />)}
              {filtered.length === 0 && <div style={{ padding: 16, textAlign: 'center', fontSize: 11, color: COLORS.textMuted }}>該当なし</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ card, onMove }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div style={{ background: '#fafafa', border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 10, marginBottom: 8, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 11, fontFamily: 'monospace', color: COLORS.textLight }}>{card.id}</div>
        <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: COLORS.textMuted, padding: 0 }}>⋯</button>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{card.role}</div>
      <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 2 }}>{card.media}</div>
      {card.memo && <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 6, padding: 6, background: COLORS.white, borderRadius: 4 }}>{card.memo}</div>}
      {showMenu && (
        <div style={{ position: 'absolute', top: 28, right: 4, background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10, minWidth: 130 }}>
          {STATUSES.filter((s) => s !== card.status).map((s) => (
            <button key={s} onClick={() => { onMove(card.id, s); setShowMenu(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 10px', fontSize: 11, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              → {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============== スカウト管理（v2：テンプレ管理に絞る）==============
function ScoutManagementTab({ clinicId, clinic }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [editing, setEditing] = useState(null);
  const stats = monthlyScoutStats[clinicId]?.['2026-05'] || [];

  return (
    <div>
      <Banner text="個別送信のUIはありません。オペは媒体管理画面でテンプレをコピー&ペーストして送信し、月末にCSVで実績を取り込みます（CSV取り込みタブ）。" />

      {/* 月次スカウト集計 */}
      <SectionTitle>5月のスカウト実績（CSV取り込み済み）</SectionTitle>
      <CardWrap>
        {stats.length === 0 ? (
          <Empty text="スカウト実績はまだありません" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={th}>媒体</th>
                <th style={thRight}>送信</th>
                <th style={thRight}>開封</th>
                <th style={thRight}>返信</th>
                <th style={thRight}>返信率</th>
                <th style={th}>パターン別</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={td}>{s.media}</td>
                  <td style={tdRight}>{s.sent}</td>
                  <td style={tdRight}>{s.opened}</td>
                  <td style={tdRight}>{s.replied}</td>
                  <td style={tdRight}><strong style={{ color: COLORS.primary }}>{s.replyRate}%</strong></td>
                  <td style={td}>
                    {Object.entries(s.byPattern).map(([p, d]) => (
                      <span key={p} style={{ marginRight: 12, fontSize: 11 }}>
                        {p}: {d.replied}/{d.sent} ({d.sent > 0 ? Math.round(d.replied / d.sent * 100) : 0}%)
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardWrap>

      {/* テンプレ管理 */}
      <SectionTitle>スカウト文面テンプレ</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {templates.map((t) => (
          <div key={t.id} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
              <span style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: 'monospace' }}>{t.id}</span>
            </div>
            {t.stats.reply > 0 && (
              <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 8 }}>
                直近：開封 {t.stats.open}% / 返信 {t.stats.reply}%
              </div>
            )}
            <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 4, fontWeight: 600 }}>件名</div>
            <div style={{ fontSize: 12, padding: 8, background: COLORS.bg, borderRadius: 4, marginBottom: 8 }}>{t.subject}</div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 4, fontWeight: 600 }}>本文（先頭）</div>
            <div style={{ fontSize: 12, padding: 8, background: COLORS.bg, borderRadius: 4, color: COLORS.textLight, whiteSpace: 'pre-wrap', maxHeight: 80, overflow: 'hidden' }}>
              {t.body.slice(0, 100)}...
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <button onClick={() => navigator.clipboard.writeText(`${t.subject}\n\n${t.body}`).then(() => alert('媒体管理画面にペーストしてください'))} style={{ ...primaryButton, fontSize: 11, padding: '6px 12px' }}>📋 コピー</button>
              <button onClick={() => setEditing(t)} style={{ ...secondaryButton, fontSize: 11, padding: '6px 12px' }}>編集</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => alert('AI生成で新規テンプレを作成（プロトタイプ）')} style={{ ...secondaryButton, fontSize: 13 }}>+ AIで新規テンプレ生成</button>
      </div>
    </div>
  );
}

// ============== 紹介会社管理（v2 改修：院別実績） ==============
function AgencyManagementTab({ clinicId }) {
  const clinicMetrics = agencyMetricsByClinic[clinicId] || {};
  const clinicRequests = agencyRequestsByClinic[clinicId] || {};
  const usedAgencies = agencies.filter((a) => clinicMetrics[a.id]);
  const [selected, setSelected] = useState(usedAgencies[0]?.id);
  const agency = agencies.find((a) => a.id === selected);
  const m = clinicMetrics[selected];
  const requests = clinicRequests[selected] || [];

  return (
    <div>
      <Banner text="この院での紹介会社実績・要望履歴を管理します。手数料率や担当者などのマスタ情報は紹介会社共通です。" />

      <SectionTitle>この院で利用中の紹介会社</SectionTitle>
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'hidden', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={th}>紹介会社</th>
              <th style={th}>担当</th>
              <th style={thRight}>料率</th>
              <th style={thRight}>紹介数</th>
              <th style={thRight}>書類通過</th>
              <th style={thRight}>面接</th>
              <th style={thRight}>採用</th>
              <th style={thRight}>成約率</th>
              <th style={thRight}>手数料</th>
              <th style={thRight}>返信日数</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {usedAgencies.map((a) => {
              const cm = clinicMetrics[a.id];
              const rate = cm.introductions > 0 ? Math.round(cm.hires / cm.introductions * 100) : 0;
              return (
                <tr key={a.id} style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer', background: selected === a.id ? COLORS.primaryLight : 'transparent' }} onClick={() => setSelected(a.id)}>
                  <td style={td}><strong>{a.name}</strong></td>
                  <td style={td}>{a.contactPerson}</td>
                  <td style={tdRight}>{a.feeRate}%</td>
                  <td style={tdRight}>{cm.introductions}</td>
                  <td style={tdRight}>{cm.docPasses}</td>
                  <td style={tdRight}>{cm.interviews}</td>
                  <td style={tdRight}>{cm.hires}</td>
                  <td style={tdRight}><strong style={{ color: rate >= 20 ? COLORS.success : rate >= 10 ? COLORS.text : COLORS.warning }}>{rate}%</strong></td>
                  <td style={tdRight}>¥{cm.totalFeePaid.toLocaleString()}</td>
                  <td style={tdRight}>{cm.avgReplyDays.toFixed(1)}日</td>
                  <td style={td}><span style={{ color: COLORS.primary, fontSize: 12 }}>選択 →</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {agency && m && (
        <>
          <SectionTitle>{agency.name}：詳細（この院）</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <CardWrap>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>この院での実績</div>
              <Row label="紹介数" value={`${m.introductions}件`} />
              <Row label="書類通過数" value={`${m.docPasses}件`} />
              <Row label="面接実施数" value={`${m.interviews}件`} />
              <Row label="採用数" value={`${m.hires}件`} />
              <Row label="支払手数料合計" value={`¥${m.totalFeePaid.toLocaleString()}`} />
              <Row label="平均返信日数" value={`${m.avgReplyDays.toFixed(1)}日`} />
              <Row label="最終紹介日" value={m.lastIntroductionDate} />
            </CardWrap>
            <CardWrap>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>マスタ情報（共通）</div>
              <Row label="担当者" value={agency.contactPerson} />
              <Row label="メール" value={agency.contactEmail} />
              <Row label="手数料率" value={`年収の${agency.feeRate}%`} />
              <Row label="契約状況" value={agency.contractStatus} />
            </CardWrap>
          </div>

          <SectionTitle>この院での要望伝達履歴</SectionTitle>
          <CardWrap>
            {requests.length === 0 ? (
              <Empty text="この紹介会社への要望履歴はまだありません" />
            ) : (
              requests.map((r, i) => (
                <div key={i} style={{ padding: 12, borderBottom: i < requests.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>{r.date}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: r.status === '対応済み' ? COLORS.success : COLORS.warning }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.text }}>{r.request}</div>
                </div>
              ))
            )}
            <button onClick={() => alert('新規要望を伝達しました（プロトタイプ）')} style={{ ...secondaryButton, marginTop: 12, fontSize: 12 }}>+ 新規要望を伝達</button>
          </CardWrap>
        </>
      )}
    </div>
  );
}

// ============== CSV取り込み（v2 新規） ==============
function CSVImportTab({ clinicId }) {
  const [media, setMedia] = useState('ジョブメドレー');
  const [type, setType] = useState('スカウト履歴');
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => { setFileName(e.target.files[0]?.name || ''); setResult(null); };

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setResult({ sent: 38, opened: 22, replied: 5 });
      setProcessing(false);
    }, 1200);
  };

  return (
    <div>
      <Banner text="各媒体管理画面でエクスポートしたCSVをアップロードすると、AIが解析して集計値を取り込みます。個人情報列は自動削除されます。" />

      <CardWrap>
        <SectionTitle>新規CSVアップロード</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <Field label="媒体">
            <select value={media} onChange={(e) => setMedia(e.target.value)} style={selectStyle}>
              <option>ジョブメドレー</option>
              <option>看護roo!</option>
              <option>Indeed</option>
              <option>マイナビ看護師</option>
            </select>
          </Field>
          <Field label="種別">
            <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
              <option>スカウト履歴</option>
              <option>応募履歴</option>
              <option>媒体掲載費請求</option>
            </select>
          </Field>
        </div>
        <div style={{ background: COLORS.bg, border: `2px dashed ${COLORS.border}`, borderRadius: 8, padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <input type="file" id="csv-upload" accept=".csv,.xlsx" onChange={handleFile} style={{ display: 'none' }} />
          <label htmlFor="csv-upload" style={{ ...secondaryButton, display: 'inline-block', cursor: 'pointer' }}>📁 ファイルを選択</label>
          {fileName && <div style={{ marginTop: 8, fontSize: 12 }}>選択中：<strong>{fileName}</strong></div>}
        </div>
        <button onClick={handleProcess} disabled={!fileName || processing} style={{ ...primaryButton, width: '100%', opacity: !fileName || processing ? 0.5 : 1 }}>
          {processing ? 'AIが解析中...' : '✨ AIで解析'}
        </button>
      </CardWrap>

      {result && (
        <CardWrap>
          <SectionTitle>解析結果プレビュー</SectionTitle>
          <div style={{ background: COLORS.bg, padding: 16, borderRadius: 6, fontSize: 13 }}>
            <div><strong>{media} {type}</strong> から抽出した集計値：</div>
            <div style={{ marginTop: 8 }}>
              ・送信数：{result.sent}<br />
              ・開封数：{result.opened}<br />
              ・返信数：{result.replied}
            </div>
            <div style={{ marginTop: 12, padding: 8, background: '#dcfce7', borderRadius: 4, fontSize: 12, color: '#166534' }}>
              ✓ 個人情報列は自動的に削除されています
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => { alert('保存しました'); setResult(null); setFileName(''); }} style={primaryButton}>確定して保存</button>
            <button onClick={() => setResult(null)} style={secondaryButton}>破棄</button>
          </div>
        </CardWrap>
      )}

      <SectionTitle>取込済み履歴</SectionTitle>
      <CardWrap>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={th}>取込日</th>
              <th style={th}>媒体</th>
              <th style={th}>種別</th>
              <th style={th}>件数</th>
              <th style={th}>状態</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: '2026-05-31', media: 'ジョブメドレー', type: 'スカウト履歴', count: 38 },
              { date: '2026-05-31', media: '看護roo!', type: 'スカウト履歴', count: 45 },
              { date: '2026-05-31', media: 'Indeed', type: '応募履歴', count: 6 },
            ].map((h, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={td}>{h.date}</td>
                <td style={td}>{h.media}</td>
                <td style={td}>{h.type}</td>
                <td style={td}>{h.count}</td>
                <td style={td}><span style={{ color: COLORS.success, fontSize: 11, fontWeight: 600 }}>✓ 確定</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardWrap>
    </div>
  );
}

// ============== イベント記録 ==============
function EventsTab({ cards, onMoveCard }) {
  const [selected, setSelected] = useState('');
  const [type, setType] = useState('面接予定登録');
  const [memo, setMemo] = useState('');
  const [log, setLog] = useState([
    { time: '10:00', target: 'indeed_a8f3', type: '面接実施', result: '通過' },
    { time: '14:30', target: 'jobmedley_x1', type: '内定', result: '' },
  ]);

  const eventOpts = ['応募受付（紹介会社経由）', '書類選考通過', '書類選考不通過', '面接予定登録', '面接実施・通過', '面接実施・不通過', '内定', '採用確定', '不採用通知済み', '候補者辞退'];

  const statusMap = {
    '書類選考通過': '面接予定', '書類選考不通過': '不採用',
    '面接予定登録': '面接予定', '面接実施・通過': '面接実施',
    '面接実施・不通過': '不採用', '内定': '内定', '採用確定': '採用',
    '不採用通知済み': '不採用', '候補者辞退': '不採用',
  };

  const handleSave = () => {
    if (!selected) { alert('対象候補者を選択してください'); return; }
    const time = new Date().toTimeString().slice(0, 5);
    setLog((p) => [{ time, target: selected, type, result: memo }, ...p]);
    if (statusMap[type]) onMoveCard(selected, statusMap[type]);
    setMemo('');
    alert('イベントを記録しました');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <CardWrap>
        <SectionTitle>新規イベント記録</SectionTitle>
        <Field label="対象候補者">
          <select value={selected} onChange={(e) => setSelected(e.target.value)} style={selectStyle}>
            <option value="">候補者を選択...</option>
            {cards.map((c) => <option key={c.id} value={c.id}>{c.id} ({c.role}・{c.media})</option>)}
          </select>
        </Field>
        <Field label="イベント種別">
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            {eventOpts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="メモ（個人情報入力不可）">
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ ...selectStyle, minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }} />
        </Field>
        <button onClick={handleSave} style={{ ...primaryButton, width: '100%' }}>記録を保存（カンバン自動連動）</button>
      </CardWrap>
      <CardWrap>
        <SectionTitle>今日の記録</SectionTitle>
        {log.map((e, i) => (
          <div key={i} style={{ padding: 10, borderBottom: i < log.length - 1 ? `1px solid ${COLORS.border}` : 'none', fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: COLORS.primary, fontFamily: 'monospace' }}>{e.target}</span>
              <span style={{ color: COLORS.textMuted }}>{e.time}</span>
            </div>
            <div>{e.type}</div>
            {e.result && <div style={{ color: COLORS.textLight, marginTop: 2 }}>{e.result}</div>}
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ============== 月次レポート ==============
function ReportTab({ clinicId }) {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const report = monthlyReports[clinicId];

  if (!report) return <CardWrap><Empty text="レポートデータがありません" /></CardWrap>;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200);
  };

  if (!generated) {
    return (
      <CardWrap>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>{report.month} レポート</h3>
          <p style={{ fontSize: 13, color: COLORS.textLight }}>応募 {report.summary.applications} ・ 面接 {report.summary.interviews} ・ 採用 {report.summary.hires}</p>
          <button onClick={handleGenerate} disabled={generating} style={{ ...primaryButton, opacity: generating ? 0.6 : 1 }}>
            {generating ? 'AI生成中...' : '✨ AIでレポート生成'}
          </button>
        </div>
      </CardWrap>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'flex-end' }}>
        <button onClick={() => setGenerated(false)} style={secondaryButton}>🔄 再生成</button>
        <button onClick={() => alert('PDF出力（プロトタイプ）')} style={secondaryButton}>📄 PDF</button>
        <button onClick={() => alert('院長へ送信（プロトタイプ）')} style={primaryButton}>院長へ送信</button>
      </div>
      <CardWrap>
        <h3 style={{ marginTop: 0, fontSize: 18 }}>{report.clinicName} 採用月次レポート</h3>
        <p style={{ color: COLORS.textLight, fontSize: 13 }}>{report.month} ／ 発行 {report.issuedAt}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 16, marginBottom: 16 }}>
          {[['応募', report.summary.applications], ['面接', report.summary.interviews], ['内定', report.summary.offers], ['採用', report.summary.hires]].map(([l, v], i) => (
            <div key={i} style={{ padding: 12, background: COLORS.bg, borderRadius: 6, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: COLORS.textLight }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, marginBottom: 12 }}>
          <strong>媒体別費用対効果：</strong>
        </div>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead><tr style={{ background: '#fafafa' }}><th style={th}>媒体</th><th style={thRight}>応募</th><th style={thRight}>採用</th><th style={thRight}>費用</th><th style={thRight}>CPA</th></tr></thead>
          <tbody>
            {report.media.map((m, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={td}>{m.name}</td>
                <td style={tdRight}>{m.applications}</td>
                <td style={tdRight}>{m.hires}</td>
                <td style={tdRight}>¥{m.cost.toLocaleString()}</td>
                <td style={tdRight}>{m.cpa > 0 ? `¥${m.cpa.toLocaleString()}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 13, marginBottom: 8 }}><strong>改善提案：</strong></div>
        {report.suggestions.map((s, i) => (
          <div key={i} style={{ marginBottom: 8, padding: 12, background: COLORS.bg, borderRadius: 6, borderLeft: `3px solid ${COLORS.primary}` }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{i + 1}. {s.title}</div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>{s.reason}</div>
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ============== 共通コンポーネント ==============
function Banner({ text }) { return <div style={{ padding: '10px 14px', background: COLORS.primaryLight, color: COLORS.primary, borderRadius: 6, marginBottom: 16, fontSize: 12 }}>{text}</div>; }
function CardWrap({ children }) { return <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>{children}</div>; }
function SectionTitle({ children }) { return <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, marginBottom: 12, marginTop: 16, color: COLORS.text }}>{children}</h3>; }
function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, display: 'block', marginBottom: 4 }}>{label}</label>{children}</div>; }
function Empty({ text }) { return <div style={{ padding: 20, textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}>{text}</div>; }
function Row({ label, value }) { return <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}><div style={{ color: COLORS.textLight }}>{label}</div><div style={{ fontWeight: 500 }}>{value}</div></div>; }

const primaryButton = { padding: '10px 18px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const secondaryButton = { padding: '10px 14px', background: COLORS.white, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' };
const selectStyle = { width: '100%', padding: '10px 12px', fontSize: 13, border: `1px solid ${COLORS.border}`, borderRadius: 6, background: COLORS.white, outline: 'none', boxSizing: 'border-box' };
const th = { padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' };
const thRight = { ...th, textAlign: 'right' };
const td = { padding: '10px 12px', fontSize: 13, color: COLORS.text };
const tdRight = { ...td, textAlign: 'right' };
