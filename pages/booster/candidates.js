import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BoosterLayout from '../../components/booster/Layout';
import { sampleJobs, sampleAgencies, sampleMediaPlatforms, candidateStatuses, ngReasonCategories } from '../../lib/booster/sample-data';
import { useCandidates, DEMO_TODAY } from '../../lib/booster/useCandidates';

const pipelineStages = ['applied', 'document_passed', 'interview_scheduled', 'interview_completed', 'offered', 'accepted', 'joined'];

function MatchScoreBadge({ score }) {
  if (score == null) return null;
  const color = score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : score >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-gray-50 text-gray-500 border-gray-200';
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border font-semibold ${color}`}>
      {score}点
    </span>
  );
}

function SourceBadge({ candidate }) {
  if (candidate.source === 'media') {
    const media = sampleMediaPlatforms.find(m => m.id === candidate.mediaId);
    return <span className="text-xs bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded">{media?.name || '媒体'}</span>;
  }
  if (candidate.source === 'manual') {
    return <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">手動登録</span>;
  }
  const agency = sampleAgencies.find(a => a.id === candidate.agencyId);
  return <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{agency?.name}</span>;
}

function AiAnalysisPanel({ analysis }) {
  if (!analysis) return null;
  const scoreColor = analysis.matchScore >= 80 ? 'text-emerald-600'
    : analysis.matchScore >= 60 ? 'text-blue-600' : 'text-gray-500';

  return (
    <div className="bg-slate-50 rounded-xl p-5 mb-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">AI分析</span>
        <span className="text-xs text-slate-400">by 採用ブースターAI</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className={`text-3xl font-extrabold ${scoreColor}`}>{analysis.matchScore}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">マッチ度</div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full transition-all ${
                analysis.matchScore >= 80 ? 'bg-emerald-400' : analysis.matchScore >= 60 ? 'bg-blue-400' : 'bg-gray-400'
              }`}
              style={{ width: `${analysis.matchScore}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {analysis.matchScore >= 80 ? '求人要件と高くマッチ' : analysis.matchScore >= 60 ? '概ねマッチ、確認事項あり' : 'マッチ度が低い'}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-600 mb-1.5">経歴サマリ</div>
        <div className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs font-semibold text-emerald-600 mb-1.5">強み</div>
          <ul className="space-y-1">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-emerald-400 mt-0.5 shrink-0">+</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-amber-600 mb-1.5">確認事項</div>
          <ul className="space-y-1">
            {analysis.concerns.map((c, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5 shrink-0">!</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {analysis.interviewPoints.length > 0 && (
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <div className="text-xs font-semibold text-blue-700 mb-2">面接で確認すべきポイント</div>
          <ol className="space-y-1.5">
            {analysis.interviewPoints.map((p, i) => (
              <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-blue-400 font-semibold shrink-0">{i + 1}.</span>{p}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// 面接候補日の選択肢（デモ日以降の平日）
const proposalDates = (() => {
  const out = [];
  const d = new Date(DEMO_TODAY);
  while (out.length < 5) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    out.push(`${d.getMonth() + 1}/${d.getDate()}(${'日月火水木金土'[day]})`);
  }
  return out;
})();
const proposalTimes = ['10:00', '14:00', '16:00'];

function SchedulingModal({ candidate, onClose, onSend }) {
  const [selected, setSelected] = useState([]);

  const toggle = (slot) => {
    setSelected(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot)
        : prev.length >= 3 ? prev
        : [...prev, slot]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">面接候補日を送る</h2>
          <p className="text-sm text-gray-500 mt-1">
            {candidate.name}さんに提示する候補日時を最大3枠選択してください
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-3 mb-5">
            {proposalDates.map(date => (
              <div key={date} className="flex items-center gap-3">
                <div className="w-20 text-sm font-medium text-gray-700 shrink-0">{date}</div>
                <div className="flex gap-2">
                  {proposalTimes.map(time => {
                    const slot = `${date} ${time}`;
                    const isSelected = selected.includes(slot);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggle(slot)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-semibold text-blue-700 mb-1.5">選択中の候補日（{selected.length}/3）</div>
              <div className="flex flex-wrap gap-2">
                {selected.map(s => (
                  <span key={s} className="text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            候補日はエージェント経由で候補者に打診されます。回答が届き次第、面接日が確定します。
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            キャンセル
          </button>
          <button
            onClick={() => onSend(selected)}
            disabled={selected.length === 0}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            候補日を送信
          </button>
        </div>
      </div>
    </div>
  );
}

function NgModal({ candidate, onClose, onSubmit }) {
  const [category, setCategory] = useState(null);
  const agency = sampleAgencies.find(a => a.id === candidate.agencyId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">NG理由を記録</h2>
          <p className="text-sm text-gray-500 mt-1">
            {candidate.name}さんの不採用理由を選択してください
          </p>
        </div>
        <div className="p-6">
          {!category ? (
            <div className="space-y-2">
              {ngReasonCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat)}
                  className="w-full text-left p-3.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                >
                  <div className="font-semibold text-sm text-gray-800">{cat.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{cat.subcategories.slice(0, 3).join(' / ')}</div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button onClick={() => setCategory(null)} className="text-xs text-gray-400 hover:text-gray-600 mb-3">
                ← {category.label}
              </button>
              <div className="space-y-2 mb-4">
                {category.subcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => onSubmit(category, sub)}
                    className="w-full text-left p-3.5 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors border border-gray-100 text-sm font-medium text-gray-800"
                  >
                    {sub}
                  </button>
                ))}
              </div>
              {agency && (
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-600">
                  📩 記録と同時に{agency.name}へNG理由をフィードバックします。次回の推薦精度が向上します。
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyzingSteps({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    '履歴書・職務経歴書を読み取っています...',
    '経歴を構造化しています...',
    '求人要件と照合し、マッチ度を算出しています...',
    '強み・確認事項・面接ポイントを抽出しています...',
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3000),
      setTimeout(() => onDone(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-8">
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-5 text-center">AIが候補者を分析しています</h2>
      <div className="space-y-3 max-w-sm mx-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            {i < step ? (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : i === step ? (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
            )}
            <span className={`text-sm ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegisterModal({ onClose, onRegister }) {
  const [step, setStep] = useState('form');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [jobId, setJobId] = useState(sampleJobs[0]?.id || '');
  const [agencyId, setAgencyId] = useState(sampleAgencies[0]?.id || '');
  const [dragOver, setDragOver] = useState(false);

  const demoAnalysis = {
    matchScore: 76,
    summary: '回復期リハビリ病棟3年、急性期外科病棟2年の経験。術後リハビリとの連携に強み。夜勤経験あり。',
    strengths: ['外科病棟2年の実務経験あり', '回復期からの異動でリハビリ連携に強い', '夜勤・日勤の二交代経験'],
    concerns: ['直近の外科経験からブランクが1年', '転職回数が3回とやや多い'],
    interviewPoints: ['ブランク期間の活動内容', '転職理由の一貫性', '希望する夜勤頻度'],
  };

  const startAnalysis = () => setStep('analyzing');

  const handleRegister = () => {
    const agency = sampleAgencies.find(a => a.id === agencyId);
    onRegister({
      id: `cand-${Date.now()}`,
      name: name.trim() || '新規候補者',
      jobId,
      agencyId,
      source: 'agency',
      status: 'applied',
      appliedAt: DEMO_TODAY,
      experience: experience.trim() || '経歴確認中',
      hasResume: true,
      aiAnalysis: demoAnalysis,
      statusHistory: [
        { status: 'applied', date: DEMO_TODAY, note: `${agency?.name || 'エージェント'}からメールで推薦 → 手動登録` },
      ],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">推薦を手動登録</h2>
          <p className="text-sm text-gray-500 mt-1">
            エージェントからメールで届いた推薦を登録します。書類をアップロードするとAIが自動分析します。
          </p>
          <div className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            📧 将来リリース: 推薦メールの自動取り込み（メール連携）に対応予定
          </div>
        </div>

        {step === 'form' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">候補者名</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="例: 鈴木 花子"
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">経験</label>
                <input
                  type="text"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="例: 外科病棟2年"
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">対象求人</label>
                <select
                  value={jobId}
                  onChange={e => setJobId(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {sampleJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">推薦元エージェント</label>
                <select
                  value={agencyId}
                  onChange={e => setAgencyId(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {sampleAgencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>

            <div
              onClick={startAnalysis}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); startAnalysis(); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm text-gray-600 font-medium mb-1">履歴書・職務経歴書をドロップ</div>
              <div className="text-xs text-gray-400">またはクリックしてファイルを選択（PDF / Word）</div>
            </div>
          </div>
        )}

        {step === 'analyzing' && <AnalyzingSteps onDone={() => setStep('result')} />}

        {step === 'result' && (
          <div className="p-6">
            <AiAnalysisPanel analysis={demoAnalysis} />
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="text-xs font-semibold text-blue-700 mb-1">次のアクション</div>
              <div className="text-xs text-blue-600">
                マッチ度76点 — 推薦として登録後、パイプラインから書類通過/NGの判断ができます。
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            キャンセル
          </button>
          {step === 'result' && (
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              推薦として登録
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const router = useRouter();
  const { candidates, updateCandidate, advanceStatus, addCandidate, resetDemo } = useCandidates();
  const [view, setView] = useState('pipeline');
  const [selectedId, setSelectedId] = useState(null);

  // ダッシュボードの滞留アラート等からのディープリンクで候補者詳細を開く
  useEffect(() => {
    if (router.isReady && router.query.focus) {
      setSelectedId(router.query.focus);
    }
  }, [router.isReady, router.query.focus]);
  const [showRegister, setShowRegister] = useState(false);
  const [scheduleTargetId, setScheduleTargetId] = useState(null);
  const [ngTargetId, setNgTargetId] = useState(null);

  const selectedCandidate = candidates.find(c => c.id === selectedId) || null;
  const scheduleTarget = candidates.find(c => c.id === scheduleTargetId) || null;
  const ngTarget = candidates.find(c => c.id === ngTargetId) || null;

  const today = new Date(DEMO_TODAY);
  const getJob = (jobId) => sampleJobs.find(j => j.id === jobId);
  const getDaysStagnant = (c) => {
    const lastEvent = c.statusHistory?.[c.statusHistory.length - 1];
    const lastDate = lastEvent ? new Date(lastEvent.date) : new Date(c.appliedAt);
    return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  };

  const sendProposal = (slots) => {
    updateCandidate(scheduleTargetId, c => ({
      interviewProposal: { dates: slots, status: 'pending', sentAt: DEMO_TODAY },
      statusHistory: [
        ...(c.statusHistory || []),
        { status: c.status, date: DEMO_TODAY, note: `面接候補日${slots.length}件をエージェント経由で候補者に送信`, label: '日程調整' },
      ],
    }));
    setScheduleTargetId(null);
  };

  const receiveProposalReply = (c) => {
    const chosen = c.interviewProposal?.dates?.[0];
    if (!chosen) return;
    advanceStatus(c.id, 'interview_scheduled', `面接確定: ${chosen}`, {
      interviewDate: chosen,
      interviewProposal: { ...c.interviewProposal, status: 'confirmed' },
    });
  };

  const submitNg = (category, detail) => {
    advanceStatus(ngTargetId, 'ng', `NG: ${category.label} - ${detail}`, {
      ngReason: { category: category.id, detail, feedbackSent: true },
    });
    setNgTargetId(null);
  };

  return (
    <BoosterLayout current="candidates">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">候補者管理</h1>
          <p className="text-sm text-gray-500 mt-1">選考パイプラインの管理</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetDemo}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 transition-colors"
          >
            デモをリセット
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            + 推薦を登録
          </button>
          <button
            onClick={() => setView('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'pipeline' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            パイプライン
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            リスト
          </button>
        </div>
      </div>

      {view === 'pipeline' && (
        <div className="flex gap-3 overflow-x-auto pb-4 min-w-0 bg-gray-50">
          {pipelineStages.map(stage => {
            const stageInfo = candidateStatuses[stage];
            const stageCandidates = candidates.filter(c => c.status === stage);
            return (
              <div key={stage} className="min-w-[230px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stageInfo.color }} />
                  <span className="text-sm font-semibold text-gray-700">{stageInfo.label}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{stageCandidates.length}</span>
                </div>
                <div className="space-y-2">
                  {stageCandidates.map(c => {
                    const job = getJob(c.jobId);
                    const days = getDaysStagnant(c);
                    const isStagnant = days >= 3;
                    const isCritical = days >= 5;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                          isCritical ? 'bg-red-50 border-2 border-red-300' :
                          isStagnant ? 'bg-amber-50 border-2 border-amber-300' :
                          'bg-white border border-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-sm text-gray-800">{c.name}</div>
                          <MatchScoreBadge score={c.aiAnalysis?.matchScore} />
                        </div>
                        <div className="text-xs text-gray-500">{job?.title}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <SourceBadge candidate={c} />
                          {c.interviewProposal?.status === 'pending' && (
                            <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded">日程調整中</span>
                          )}
                          {c.interviewDate && c.status === 'interview_scheduled' && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">📅 {c.interviewDate}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-gray-400">{c.appliedAt}</div>
                          {isStagnant && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {days}日滞留
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {stageCandidates.length === 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-400 border border-dashed border-gray-200">
                      なし
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="min-w-[230px] flex-shrink-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-gray-700">NG / 辞退</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {candidates.filter(c => ['ng', 'withdrawn'].includes(c.status)).length}
              </span>
            </div>
            <div className="space-y-2">
              {candidates.filter(c => ['ng', 'withdrawn'].includes(c.status)).map(c => {
                const job = getJob(c.jobId);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all opacity-70"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm text-gray-600">{c.name}</div>
                      <MatchScoreBadge score={c.aiAnalysis?.matchScore} />
                    </div>
                    <div className="text-xs text-gray-400">{job?.title}</div>
                    {c.ngReason && (
                      <div className="text-xs text-red-500 mt-1">{c.ngReason.detail}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">候補者</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">求人</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">流入元</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">マッチ度</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">応募日</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => {
                const job = getJob(c.jobId);
                const status = candidateStatuses[c.status];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.experience}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job?.title}</td>
                    <td className="px-4 py-3"><SourceBadge candidate={c} /></td>
                    <td className="px-4 py-3"><MatchScoreBadge score={c.aiAnalysis?.matchScore} /></td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: status?.bg, color: status?.color }}
                      >
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.appliedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-800">{selectedCandidate.name}</h2>
                    <MatchScoreBadge score={selectedCandidate.aiAnalysis?.matchScore} />
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{getJob(selectedCandidate.jobId)?.title}</p>
                </div>
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: candidateStatuses[selectedCandidate.status]?.bg,
                    color: candidateStatuses[selectedCandidate.status]?.color,
                  }}
                >
                  {candidateStatuses[selectedCandidate.status]?.label}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">流入元</span>
                  <SourceBadge candidate={selectedCandidate} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">経験</span>
                  <span className="text-gray-800">{selectedCandidate.experience}</span>
                </div>
                {selectedCandidate.hasResume && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">書類</span>
                    <span className="text-blue-600 text-xs font-medium">履歴書・職務経歴書 アップロード済</span>
                  </div>
                )}
                {selectedCandidate.interviewDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">面接日時</span>
                    <span className="text-gray-800 font-medium">📅 {selectedCandidate.interviewDate}</span>
                  </div>
                )}
              </div>

              {selectedCandidate.interviewProposal?.status === 'pending' && (
                <div className="bg-violet-50 rounded-xl p-4 mb-4 border border-violet-100">
                  <div className="text-xs font-semibold text-violet-700 mb-2">📅 日程調整中 — 候補者の回答待ち</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCandidate.interviewProposal.dates.map(d => (
                      <span key={d} className="text-xs bg-white text-violet-700 px-2 py-1 rounded border border-violet-200">{d}</span>
                    ))}
                  </div>
                  <div className="text-xs text-violet-500">
                    エージェント経由で候補者に打診済み（{selectedCandidate.interviewProposal.sentAt}送信）
                  </div>
                </div>
              )}

              <AiAnalysisPanel analysis={selectedCandidate.aiAnalysis} />

              <h3 className="text-sm font-semibold text-gray-700 mb-3">選考履歴</h3>
              <div className="space-y-3">
                {selectedCandidate.statusHistory?.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full mt-1"
                        style={{ backgroundColor: h.label ? '#7c3aed' : candidateStatuses[h.status]?.color }}
                      />
                      {i < selectedCandidate.statusHistory.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {h.label || candidateStatuses[h.status]?.label}
                        </span>
                        <span className="text-xs text-gray-400">{h.date}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">{h.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                閉じる
              </button>
              <div className="flex-1" />

              {selectedCandidate.status === 'applied' && (
                <>
                  <button
                    onClick={() => setNgTargetId(selectedCandidate.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    NG（理由を記録）
                  </button>
                  <button
                    onClick={() => {
                      advanceStatus(selectedCandidate.id, 'document_passed', `書類通過（AIマッチ度${selectedCandidate.aiAnalysis?.matchScore ?? '—'}点）`);
                      setScheduleTargetId(selectedCandidate.id);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    書類通過 → 日程調整へ
                  </button>
                </>
              )}

              {selectedCandidate.status === 'document_passed' && (
                selectedCandidate.interviewProposal?.status === 'pending' ? (
                  <button
                    onClick={() => receiveProposalReply(selectedCandidate)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
                  >
                    候補者の回答を受信（デモ）
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setNgTargetId(selectedCandidate.id)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                      NG（理由を記録）
                    </button>
                    <button
                      onClick={() => setScheduleTargetId(selectedCandidate.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      面接候補日を送る
                    </button>
                  </>
                )
              )}

              {selectedCandidate.status === 'interview_scheduled' && (
                <>
                  {selectedCandidate.aiAnalysis?.interviewPoints?.length > 0 && (
                    <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                      面接対策シートを送信
                    </button>
                  )}
                  <button
                    onClick={() => advanceStatus(selectedCandidate.id, 'interview_completed', `面接実施${selectedCandidate.interviewDate ? `（${selectedCandidate.interviewDate}）` : ''}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    面接完了を記録
                  </button>
                </>
              )}

              {selectedCandidate.status === 'interview_completed' && (
                <>
                  <button
                    onClick={() => setNgTargetId(selectedCandidate.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    NG（理由を記録）
                  </button>
                  <button
                    onClick={() => advanceStatus(selectedCandidate.id, 'offered', '内定提示')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    内定を出す
                  </button>
                </>
              )}

              {selectedCandidate.status === 'offered' && (
                <>
                  <button
                    onClick={() => advanceStatus(selectedCandidate.id, 'withdrawn', '候補者辞退')}
                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    辞退
                  </button>
                  <button
                    onClick={() => advanceStatus(selectedCandidate.id, 'accepted', '内定承諾')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    内定承諾を記録
                  </button>
                </>
              )}

              {selectedCandidate.status === 'accepted' && (
                <button
                  onClick={() => advanceStatus(selectedCandidate.id, 'joined', '入職（定着フォローを開始）')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  入職を記録
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {scheduleTarget && (
        <SchedulingModal
          candidate={scheduleTarget}
          onClose={() => setScheduleTargetId(null)}
          onSend={sendProposal}
        />
      )}

      {ngTarget && (
        <NgModal
          candidate={ngTarget}
          onClose={() => setNgTargetId(null)}
          onSubmit={submitNg}
        />
      )}

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={addCandidate} />}
    </BoosterLayout>
  );
}
