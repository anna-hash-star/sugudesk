import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  clinics,
  candidates as initialCandidates,
  STATUSES,
  scoutTemplates,
  scoutHistory as initialScoutHistory,
  monthlyReports,
} from '../../../lib/prototypeMockData';
import { Layout } from '../index';

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

const STATUS_COLORS = {
  応募: '#3b82f6',
  書類選考: '#8b5cf6',
  面接予定: '#f59e0b',
  面接実施: '#f97316',
  内定: '#10b981',
  採用: '#059669',
  不採用: '#9ca3af',
};

export default function ClinicDetail() {
  const router = useRouter();
  const { id, tab: tabParam } = router.query;
  const [activeTab, setActiveTab] = useState(tabParam || 'kanban');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (id) setCards(initialCandidates[id] || []);
  }, [id]);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  const clinic = clinics.find((c) => c.id === id);
  if (!clinic) {
    return (
      <Layout activeClinicId={id}>
        <div style={{ padding: 40 }}>院が見つかりません</div>
      </Layout>
    );
  }

  const moveCard = (cardId, newStatus) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: newStatus, updatedAt: new Date().toISOString().slice(0, 10) } : c))
    );
  };

  return (
    <Layout activeClinicId={id}>
      {/* ヘッダー */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>{clinic.name}</h1>
          <ClinicStatusBadge status={clinic.status} />
        </div>
        <div style={{ fontSize: 13, color: COLORS.textLight }}>
          {clinic.specialty} ／ 募集: {clinic.targetRoles.join('、') || '未設定'}
        </div>
      </div>

      {/* タブ */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '0 40px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <Tab label="案件進捗" active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
          <Tab label="スカウト生成" active={activeTab === 'scout'} onClick={() => setActiveTab('scout')} />
          <Tab label="イベント記録" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <Tab label="月次レポート" active={activeTab === 'report'} onClick={() => setActiveTab('report')} />
          <Tab label="マスタ設定" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </div>

      {/* タブコンテンツ */}
      <div style={{ padding: '32px 40px' }}>
        {activeTab === 'kanban' && <KanbanTab cards={cards} onMoveCard={moveCard} />}
        {activeTab === 'scout' && <ScoutTab clinicId={id} clinic={clinic} />}
        {activeTab === 'events' && <EventsTab clinicId={id} cards={cards} onMoveCard={moveCard} />}
        {activeTab === 'report' && <ReportTab clinicId={id} />}
        {activeTab === 'settings' && <SettingsTab clinic={clinic} />}
      </div>
    </Layout>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 20px',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        color: active ? COLORS.primary : COLORS.textLight,
        background: 'transparent',
        border: 'none',
        borderBottom: active ? `2px solid ${COLORS.primary}` : '2px solid transparent',
        cursor: 'pointer',
        marginBottom: -1,
      }}
    >
      {label}
    </button>
  );
}

function ClinicStatusBadge({ status }) {
  const colorMap = {
    'パイロット中': { bg: '#dcfce7', color: '#166534' },
    'ヒアリング待ち': { bg: '#fef3c7', color: '#92400e' },
    '本契約': { bg: '#dbeafe', color: '#1e40af' },
  };
  const c = colorMap[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 12 }}>
      {status}
    </span>
  );
}

// ============== タブ1：案件進捗（カンバン） ==============
function KanbanTab({ cards, onMoveCard }) {
  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 13, color: COLORS.textLight }}>
        候補者は媒体内匿名IDで管理しています（個人情報非保持の設計）。詳細は媒体管理画面でご確認ください。
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
        {STATUSES.map((status) => {
          const filtered = cards.filter((c) => c.status === status);
          return (
            <div
              key={status}
              style={{
                minWidth: 240,
                width: 240,
                background: COLORS.white,
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                padding: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '4px 6px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: STATUS_COLORS[status], marginRight: 8 }} />
                  {status}
                </div>
                <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>{filtered.length}</span>
              </div>
              {filtered.map((c) => (
                <CandidateCard key={c.id} card={c} onMove={onMoveCard} />
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: '20px 8px', textAlign: 'center', fontSize: 12, color: COLORS.textMuted }}>
                  該当なし
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CandidateCard({ card, onMove }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      style={{
        background: '#fafafa',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontFamily: 'monospace', color: COLORS.textLight }}>{card.id}</div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: COLORS.textMuted, padding: 0 }}
        >
          ⋯
        </button>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{card.role}</div>
      <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 6 }}>{card.media}</div>
      {card.memo && (
        <div style={{ fontSize: 11, color: COLORS.textLight, padding: 8, background: COLORS.white, borderRadius: 4, borderLeft: `2px solid ${COLORS.border}` }}>
          {card.memo}
        </div>
      )}
      <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 6 }}>更新: {card.updatedAt}</div>
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 8,
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: 4,
            zIndex: 10,
            minWidth: 140,
          }}
        >
          <div style={{ fontSize: 10, color: COLORS.textMuted, padding: '6px 10px', fontWeight: 600 }}>ステータス変更</div>
          {STATUSES.filter((s) => s !== card.status).map((s) => (
            <button
              key={s}
              onClick={() => {
                onMove(card.id, s);
                setShowMenu(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '6px 10px',
                fontSize: 12,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: COLORS.text,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              → {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============== タブ2：スカウト生成 ==============
function ScoutTab({ clinicId, clinic }) {
  const [media, setMedia] = useState('ジョブメドレー');
  const [role, setRole] = useState('看護師');
  const [experience, setExperience] = useState('3-10年');
  const [pattern, setPattern] = useState('A');
  const [generated, setGenerated] = useState(null);
  const [history, setHistory] = useState(initialScoutHistory[clinicId] || []);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const tmpl = scoutTemplates.find((t) => t.id === pattern);
      const customSubject = tmpl.subject;
      const customBody = `${role}としての${experience}のご経験を活かしませんか？\n\n${tmpl.body}\n\n＝＝＝\n${clinic.name}（${clinic.specialty}）\n${clinic.appeal}`;
      setGenerated({ subject: customSubject, body: customBody });
      setGenerating(false);
    }, 800);
  };

  const handleSendComplete = () => {
    const newEntry = {
      date: new Date().toISOString().slice(0, 10),
      media,
      pattern,
      status: '送信完了',
    };
    setHistory((prev) => [newEntry, ...prev]);
    setGenerated(null);
    alert('Firestoreに送信完了として記録しました（プロトタイプのため実際には保存されません）');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* 左：生成フォーム */}
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 20, color: COLORS.text }}>
          スカウト文面生成
        </h3>

        <FormField label="送信先媒体">
          <select value={media} onChange={(e) => setMedia(e.target.value)} style={selectStyle}>
            <option>ジョブメドレー</option>
            <option>看護roo!</option>
            <option>Indeed PLUS</option>
            <option>マイナビ看護師</option>
          </select>
        </FormField>

        <FormField label="職種">
          <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
            <option>看護師</option>
            <option>助産師</option>
            <option>医療事務</option>
            <option>受付</option>
          </select>
        </FormField>

        <FormField label="候補者条件：経験年数">
          <select value={experience} onChange={(e) => setExperience(e.target.value)} style={selectStyle}>
            <option>1-3年</option>
            <option>3-10年</option>
            <option>10年以上</option>
          </select>
        </FormField>

        <FormField label="文面パターン">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {scoutTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setPattern(t.id)}
                style={{
                  padding: '10px 14px',
                  fontSize: 12,
                  border: `2px solid ${pattern === t.id ? COLORS.primary : COLORS.border}`,
                  background: pattern === t.id ? '#eff6ff' : COLORS.white,
                  color: pattern === t.id ? COLORS.primary : COLORS.text,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: pattern === t.id ? 600 : 400,
                  textAlign: 'left',
                  flex: '1 1 calc(50% - 4px)',
                  minWidth: 140,
                }}
              >
                {t.name}
                {t.stats.reply > 0 && (
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>
                    返信率 {t.stats.reply}%
                  </div>
                )}
              </button>
            ))}
          </div>
        </FormField>

        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            ...primaryButton,
            width: '100%',
            marginTop: 8,
            opacity: generating ? 0.6 : 1,
          }}
        >
          {generating ? 'AIが生成中...' : '✨ AIで生成'}
        </button>
      </div>

      {/* 右：生成結果 + 履歴 */}
      <div>
        {generated ? (
          <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 16, color: COLORS.text }}>
              生成結果
            </h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, marginBottom: 4 }}>件名</div>
              <div style={{ padding: 12, background: '#fafafa', borderRadius: 6, fontSize: 14 }}>
                {generated.subject}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, marginBottom: 4 }}>本文</div>
              <textarea
                value={generated.body}
                onChange={(e) => setGenerated({ ...generated, body: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: 200,
                  padding: 12,
                  background: '#fafafa',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generated.body);
                  alert('文面をコピーしました');
                }}
                style={secondaryButton}
              >
                📋 コピー
              </button>
              <button onClick={handleGenerate} style={secondaryButton}>
                🔄 再生成
              </button>
              <button onClick={handleSendComplete} style={{ ...primaryButton, marginLeft: 'auto' }}>
                ✓ 送信完了として記録
              </button>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: '#fef3c7', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
              💡 媒体管理画面に上記文面をペーストして送信した後、「送信完了として記録」を押してください
            </div>
          </div>
        ) : (
          <div style={{ background: COLORS.white, borderRadius: 10, border: `1px dashed ${COLORS.border}`, padding: 40, textAlign: 'center', color: COLORS.textMuted, marginBottom: 16 }}>
            左の条件を入力して「AIで生成」を押してください
          </div>
        )}

        {/* 送信履歴 */}
        <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 16, color: COLORS.text }}>
            最近の送信履歴
          </h3>
          {history.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}>
              送信履歴はまだありません
            </div>
          ) : (
            <div>
              {history.slice(0, 8).map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderBottom: i < history.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                    fontSize: 13,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500 }}>{h.media}</span>
                    <span style={{ color: COLORS.textMuted, marginLeft: 8 }}>パターン{h.pattern}</span>
                  </div>
                  <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{h.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============== タブ3：イベント記録 ==============
function EventsTab({ clinicId, cards, onMoveCard }) {
  const [eventLog, setEventLog] = useState([
    { time: '10:00', target: 'indeed_a8f3', type: '面接実施', result: '通過' },
    { time: '14:30', target: 'jobmedley_x1', type: '内定', result: '' },
  ]);
  const [selectedCard, setSelectedCard] = useState('');
  const [eventType, setEventType] = useState('面接予定登録');
  const [memo, setMemo] = useState('');

  const eventOptions = [
    '応募受付（紹介会社経由）',
    '書類選考通過',
    '書類選考不通過',
    '面接予定登録',
    '面接実施・通過',
    '面接実施・不通過',
    '内定',
    '採用確定',
    '不採用通知済み',
    '候補者辞退',
  ];

  const handleSave = () => {
    if (!selectedCard) {
      alert('対象候補者を選択してください');
      return;
    }
    const time = new Date().toTimeString().slice(0, 5);
    setEventLog((prev) => [{ time, target: selectedCard, type: eventType, result: memo }, ...prev]);

    // ステータス自動連動
    const statusMap = {
      '書類選考通過': '面接予定',
      '面接予定登録': '面接予定',
      '面接実施・通過': '面接実施',
      '面接実施・不通過': '不採用',
      '内定': '内定',
      '採用確定': '採用',
      '不採用通知済み': '不採用',
      '候補者辞退': '不採用',
    };
    if (statusMap[eventType]) {
      onMoveCard(selectedCard, statusMap[eventType]);
    }
    setMemo('');
    alert('イベントを記録しました（カンバンも自動更新）');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 4, color: COLORS.text }}>
          新規イベント記録
        </h3>
        <p style={{ fontSize: 12, color: COLORS.textLight, marginTop: 0, marginBottom: 20 }}>
          メール自動取得できないイベント（面接実施・採用確定・紹介会社対応等）を手動記録します
        </p>

        <FormField label="対象候補者">
          <select value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} style={selectStyle}>
            <option value="">候補者を選択...</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}（{c.role}・{c.media}）
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="イベント種別">
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={selectStyle}>
            {eventOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </FormField>

        <FormField label="メモ（個人情報は入力不可）">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例: 面接通過、書類提出待ち"
            style={{ ...selectStyle, minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </FormField>

        <button onClick={handleSave} style={{ ...primaryButton, width: '100%' }}>
          記録を保存
        </button>
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 16, color: COLORS.text }}>
          今日のイベント記録
        </h3>
        {eventLog.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}>
            記録なし
          </div>
        ) : (
          <div>
            {eventLog.map((e, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderBottom: i < eventLog.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                  fontSize: 13,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: COLORS.primary, fontFamily: 'monospace', fontSize: 12 }}>
                    {e.target}
                  </span>
                  <span style={{ color: COLORS.textMuted, fontSize: 11 }}>{e.time}</span>
                </div>
                <div style={{ color: COLORS.text, marginBottom: e.result ? 4 : 0 }}>{e.type}</div>
                {e.result && <div style={{ fontSize: 12, color: COLORS.textLight }}>{e.result}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============== タブ4：月次レポート ==============
function ReportTab({ clinicId }) {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const report = monthlyReports[clinicId];

  if (!report) {
    return (
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 40, textAlign: 'center', color: COLORS.textMuted }}>
        この院のレポートデータはまだありません
      </div>
    );
  }

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1200);
  };

  if (!generated) {
    return (
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 40, textAlign: 'center' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 12 }}>
          {report.month} 月次レポート
        </h3>
        <p style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 24 }}>
          Firestoreから集計値を取得済み:
          <br />
          応募 {report.summary.applications} ・ 面接 {report.summary.interviews} ・ 採用 {report.summary.hires}
          <br />
          スカウト送信 {report.scout.reduce((s, x) => s + x.sent, 0)} ・ 返信 {report.scout.reduce((s, x) => s + x.replied, 0)}
        </p>
        <button onClick={handleGenerate} disabled={generating} style={{ ...primaryButton, fontSize: 15, padding: '12px 32px', opacity: generating ? 0.6 : 1 }}>
          {generating ? 'AIが本文を生成中...' : '✨ AIでレポート本文を生成'}
        </button>
      </div>
    );
  }

  return <ReportView report={report} onRegenerate={() => setGenerated(false)} />;
}

function ReportView({ report, onRegenerate }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'flex-end' }}>
        <button onClick={onRegenerate} style={secondaryButton}>🔄 再生成</button>
        <button onClick={() => alert('PDFを生成しました（プロトタイプ）')} style={secondaryButton}>📄 PDF出力</button>
        <button onClick={() => alert('院長LINEへ送信しました（プロトタイプ）')} style={primaryButton}>院長へ送信</button>
      </div>

      {/* レポート本体（PDF風） */}
      <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 48, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ borderBottom: `2px solid ${COLORS.primary}`, paddingBottom: 16, marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 }}>
            {report.clinicName} 採用月次レポート
          </h1>
          <div style={{ fontSize: 14, color: COLORS.textLight }}>
            {report.month} ／ 発行日：{report.issuedAt} ／ {report.operator}
          </div>
        </div>

        {/* サマリー */}
        <ReportSection title="今月のサマリー">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <SummaryBox label="応募" value={report.summary.applications} sub={`先月比 +${report.summary.applications - report.summary.previousApplications}`} />
            <SummaryBox label="面接実施" value={report.summary.interviews} />
            <SummaryBox label="内定" value={report.summary.offers} />
            <SummaryBox label="採用" value={report.summary.hires} highlight />
          </div>
          <div style={{ background: '#f8f7f4', borderRadius: 8, padding: 16, fontSize: 13 }}>
            <div style={{ marginBottom: 4 }}>
              採用にかかった費用合計：<strong>¥{report.summary.totalCost.toLocaleString()}</strong>
            </div>
            <div style={{ color: COLORS.textLight, fontSize: 12, marginLeft: 16 }}>
              ┗ 媒体掲載費：¥{report.summary.mediaCost.toLocaleString()}
              <br />
              ┗ 紹介手数料：¥{report.summary.referralFee.toLocaleString()}
              <br />
              ┗ SuguDesk業務代行費：¥{report.summary.sugudeskFee.toLocaleString()}
            </div>
            {report.summary.cph > 0 && (
              <div style={{ marginTop: 8 }}>
                1名採用あたりコスト（CPH）：<strong>¥{report.summary.cph.toLocaleString()}</strong>
              </div>
            )}
          </div>
        </ReportSection>

        {/* 媒体別パフォーマンス */}
        <ReportSection title="媒体別パフォーマンス">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={tableHeader}>媒体</th>
                <th style={tableHeaderRight}>応募</th>
                <th style={tableHeaderRight}>面接</th>
                <th style={tableHeaderRight}>採用</th>
                <th style={tableHeaderRight}>月額費用</th>
                <th style={tableHeaderRight}>CPA</th>
              </tr>
            </thead>
            <tbody>
              {report.media.map((m, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={tableCell}>{m.name}</td>
                  <td style={tableCellRight}>{m.applications}</td>
                  <td style={tableCellRight}>{m.interviews}</td>
                  <td style={tableCellRight}>{m.hires}</td>
                  <td style={tableCellRight}>¥{m.cost.toLocaleString()}</td>
                  <td style={tableCellRight}>{m.cpa > 0 ? `¥${m.cpa.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        {/* スカウト活動 */}
        <ReportSection title="スカウト活動">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={tableHeader}>媒体</th>
                <th style={tableHeaderRight}>送信</th>
                <th style={tableHeaderRight}>開封</th>
                <th style={tableHeaderRight}>返信</th>
                <th style={tableHeaderRight}>返信率</th>
              </tr>
            </thead>
            <tbody>
              {report.scout.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={tableCell}>{s.media}</td>
                  <td style={tableCellRight}>{s.sent}</td>
                  <td style={tableCellRight}>{s.opened}</td>
                  <td style={tableCellRight}>{s.replied}</td>
                  <td style={tableCellRight}>
                    <strong style={{ color: COLORS.primary }}>{s.replyRate}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        {/* 文面A/B */}
        <ReportSection title="文面A/Bテスト結果">
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <ABBox label="パターンA：経験活用訴求" open={report.abTest.A.open} reply={report.abTest.A.reply} better={report.abTest.A.reply > report.abTest.B.reply} />
            <ABBox label="パターンB：ワークライフバランス訴求" open={report.abTest.B.open} reply={report.abTest.B.reply} better={report.abTest.B.reply > report.abTest.A.reply} />
          </div>
          <div style={{ fontSize: 13, color: COLORS.text, padding: 12, background: '#eff6ff', borderRadius: 6 }}>
            ▶ {report.abTest.conclusion}
          </div>
        </ReportSection>

        {/* 改善提案 */}
        <ReportSection title="来月の改善提案">
          {report.suggestions.map((s, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: '#fafafa', borderRadius: 8, borderLeft: `4px solid ${COLORS.primary}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                {String.fromCharCode(9312 + i)} {s.title}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 1.6 }}>
                根拠：{s.reason}
              </div>
            </div>
          ))}
        </ReportSection>

        {/* 入職後フォロー */}
        {report.onboarding.length > 0 && (
          <ReportSection title="入職後フォロー">
            {report.onboarding.map((o, i) => (
              <div key={i} style={{ padding: 12, background: '#fafafa', borderRadius: 6, fontSize: 13 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {o.name}（{o.role}、{o.joinedAt} 入職）
                </div>
                <div style={{ color: COLORS.textLight, fontSize: 12 }}>{o.status}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 4 }}>次回チェックイン：{o.nextCheckin}</div>
              </div>
            ))}
          </ReportSection>
        )}

        {/* 来月の活動計画 */}
        <ReportSection title="来月の活動計画">
          <div style={{ fontSize: 13, marginBottom: 12 }}>
            <strong>スカウト送信予定：</strong>
            <ul style={{ marginTop: 4, marginBottom: 12, paddingLeft: 20, color: COLORS.textLight }}>
              {report.nextMonthPlan.scoutPlan.map((p, i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  {p.media}：{p.count}通{p.note && `（${p.note}）`}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ fontSize: 13 }}>
            <strong>予算（提案）：</strong>
            <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20, color: COLORS.textLight }}>
              {report.nextMonthPlan.budgetProposal.map((b, i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  {b.item}：¥{b.amount.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </ReportSection>

        {/* 次回MTG */}
        <div style={{ background: '#eff6ff', borderRadius: 8, padding: 16, fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>
          📅 次回月次MTG：{report.nextMtg.date} {report.nextMtg.time}（{report.nextMtg.location}）
        </div>
      </div>
    </div>
  );
}

function ReportSection({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${COLORS.border}` }}>
        ■ {title}
      </h2>
      {children}
    </div>
  );
}

function SummaryBox({ label, value, sub, highlight }) {
  return (
    <div
      style={{
        background: highlight ? COLORS.primary : '#fafafa',
        color: highlight ? 'white' : COLORS.text,
        borderRadius: 8,
        padding: 16,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ABBox({ label, open, reply, better }) {
  return (
    <div
      style={{
        flex: 1,
        background: better ? '#dcfce7' : '#fafafa',
        border: `1px solid ${better ? COLORS.success : COLORS.border}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
        {label} {better && <span style={{ color: COLORS.success, marginLeft: 4 }}>★優位</span>}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textLight }}>
        開封率：<strong style={{ color: COLORS.text }}>{open}%</strong>
        <span style={{ marginLeft: 16 }}>
          返信率：<strong style={{ color: COLORS.text }}>{reply}%</strong>
        </span>
      </div>
    </div>
  );
}

// ============== タブ5：マスタ設定 ==============
function SettingsTab({ clinic }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: 24 }}>院マスタ</h3>

      <SettingRow label="院名" value={clinic.name} />
      <SettingRow label="業種" value={clinic.specialty} />
      <SettingRow label="募集職種" value={clinic.targetRoles.join('、') || '未設定'} />
      <SettingRow label="訴求ポイント" value={clinic.appeal || '未設定'} />

      <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>媒体契約状況</h4>
      {clinic.mediaConfig.length === 0 ? (
        <div style={{ color: COLORS.textMuted, fontSize: 13 }}>未設定</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={tableHeader}>媒体</th>
              <th style={tableHeader}>契約形態</th>
              <th style={tableHeaderRight}>月予算</th>
            </tr>
          </thead>
          <tbody>
            {clinic.mediaConfig.map((m, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={tableCell}>{m.name}</td>
                <td style={tableCell}>{m.type}</td>
                <td style={tableCellRight}>{m.budget > 0 ? `¥${m.budget.toLocaleString()}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>スカウト送信枠</h4>
      {Object.keys(clinic.scoutQuota).length === 0 ? (
        <div style={{ color: COLORS.textMuted, fontSize: 13 }}>未設定</div>
      ) : (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(clinic.scoutQuota).map(([media, count]) => (
            <div key={media} style={{ padding: '8px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13 }}>
              {media}：<strong>月{count}通</strong>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, padding: 16, background: '#fef3c7', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
        💡 プロトタイプではマスタ編集は無効化されています
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, padding: '12px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
      <div style={{ color: COLORS.textLight, fontWeight: 500 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

// ============== 共通スタイル ==============
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: COLORS.textLight, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

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

const tableHeader = {
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 700,
  color: COLORS.textLight,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
const tableHeaderRight = { ...tableHeader, textAlign: 'right' };
const tableCell = { padding: '12px', fontSize: 13, color: COLORS.text };
const tableCellRight = { ...tableCell, textAlign: 'right' };
