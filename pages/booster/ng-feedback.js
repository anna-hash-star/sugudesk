import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleJobs, sampleAgencies, ngReasonCategories, sampleNgRecords, ngCategoryColors, ngCategoryActions } from '../../lib/booster/sample-data';
import { useCandidates } from '../../lib/booster/useCandidates';

const categoryLabel = (id) => ngReasonCategories.find(c => c.id === id)?.label || id;

const STEPS = ['candidate', 'category', 'detail', 'done'];

function NgQuickInput({ candidates, onRecordNg }) {
  const [step, setStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [freeText, setFreeText] = useState('');

  const activeCandidates = candidates.filter(c =>
    ['interview_completed', 'interview_scheduled', 'document_passed', 'applied'].includes(c.status)
  );

  const reset = () => {
    setStep(0);
    setSelectedCandidate(null);
    setSelectedCategory(null);
    setSelectedDetail(null);
    setFreeText('');
  };

  const getJob = (jobId) => sampleJobs.find(j => j.id === jobId);
  const getAgency = (agencyId) => sampleAgencies.find(a => a.id === agencyId);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i < step ? 'bg-emerald-500 text-white' :
              i === step ? 'bg-blue-600 text-white' :
              'bg-gray-200 text-gray-400'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">候補者を選択</h2>
          <p className="text-sm text-gray-500 mb-4">NG理由を記録する候補者をタップ</p>
          <div className="space-y-2">
            {activeCandidates.map(c => {
              const job = getJob(c.jobId);
              const agency = getAgency(c.agencyId);
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCandidate(c); setStep(1); }}
                  className="w-full text-left p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 transition-all border border-gray-100"
                >
                  <div className="font-semibold text-gray-800">{c.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {job?.title} / {agency?.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{c.experience}</div>
                </button>
              );
            })}
            {activeCandidates.length === 0 && (
              <div className="text-center text-gray-400 py-8">選考中の候補者がいません</div>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">NG理由カテゴリ</h2>
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-medium text-gray-700">{selectedCandidate?.name}</span> さんの不採用理由
          </p>
          <div className="space-y-2">
            {ngReasonCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat); setStep(2); }}
                className="w-full text-left p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 transition-all border border-gray-100"
              >
                <div className="font-semibold text-gray-800">{cat.label}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {cat.subcategories.slice(0, 3).join(' / ')}
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(0)} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
            ← 戻る
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">詳細を選択</h2>
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-medium text-gray-700">{selectedCategory?.label}</span> の詳細理由
          </p>
          <div className="space-y-2 mb-4">
            {selectedCategory?.subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedDetail(sub);
                  onRecordNg(selectedCandidate, selectedCategory, sub, freeText);
                  setStep(3);
                }}
                className={`w-full text-left p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 transition-all border ${
                  selectedDetail === sub ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                }`}
              >
                <div className="font-medium text-gray-800">{sub}</div>
              </button>
            ))}
          </div>
          <div className="mb-4">
            <textarea
              placeholder="補足メモ（任意）"
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">
            ← 戻る
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">記録完了</h2>
          <p className="text-sm text-gray-500 mb-6">NG理由が記録されました</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">候補者</span>
                <span className="font-medium text-gray-800">{selectedCandidate?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">カテゴリ</span>
                <span className="font-medium text-gray-800">{selectedCategory?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">詳細</span>
                <span className="font-medium text-gray-800">{selectedDetail}</span>
              </div>
              {freeText && (
                <div>
                  <span className="text-gray-500">メモ</span>
                  <div className="font-medium text-gray-800 mt-1">{freeText}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-left mb-6">
            <div className="text-xs font-semibold text-blue-700 mb-1">📩 紹介会社へのフィードバック</div>
            <div className="text-xs text-blue-600">
              {getAgency(selectedCandidate?.agencyId)?.name}へNG理由を自動送信します。
              次回の推薦精度が向上します。
            </div>
          </div>

          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors w-full"
          >
            続けて入力する
          </button>
        </div>
      )}
    </div>
  );
}

function NgTrends({ candidates }) {
  // 履歴データ + ライブのNG候補者を統合して傾向を集計
  const liveNg = candidates
    .filter(c => c.status === 'ng' && c.ngReason)
    .map(c => {
      const job = sampleJobs.find(j => j.id === c.jobId);
      const reachedInterview = c.statusHistory?.some(h => ['interview_scheduled', 'interview_completed'].includes(h.status));
      return {
        id: c.id,
        jobType: job?.jobType || 'その他',
        jobTitle: job?.title || '—',
        category: c.ngReason.category,
        detail: c.ngReason.detail,
        stage: reachedInterview ? 'interview' : 'document',
        date: c.statusHistory?.[c.statusHistory.length - 1]?.date || c.appliedAt,
      };
    });
  const records = [...sampleNgRecords, ...liveNg];

  const total = records.length;
  const docCount = records.filter(r => r.stage === 'document').length;
  const intCount = records.filter(r => r.stage === 'interview').length;

  // 職種別に集計
  const jobTypes = [...new Set(records.map(r => r.jobType))];
  const byJobType = jobTypes.map(jt => {
    const list = records.filter(r => r.jobType === jt);
    const catCounts = {};
    list.forEach(r => { catCounts[r.category] = (catCounts[r.category] || 0) + 1; });
    const cats = Object.entries(catCounts)
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count);
    return { jobType: jt, total: list.length, cats, topCat: cats[0]?.cat };
  }).sort((a, b) => b.total - a.total);

  const pct = (n) => Math.round((n / total) * 100);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">総NG件数</div>
          <div className="text-2xl font-bold text-gray-800">{total}<span className="text-sm font-medium text-gray-400 ml-1">件</span></div>
          <div className="text-xs text-gray-400 mt-1">直近2ヶ月の蓄積</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">書類段階でのNG</div>
          <div className="text-2xl font-bold text-gray-800">{docCount}<span className="text-sm font-medium text-gray-400 ml-1">件</span></div>
          <div className="text-xs text-gray-400 mt-1">全体の{pct(docCount)}% — 要件・推薦精度</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">面接段階でのNG</div>
          <div className="text-2xl font-bold text-gray-800">{intCount}<span className="text-sm font-medium text-gray-400 ml-1">件</span></div>
          <div className="text-xs text-gray-400 mt-1">全体の{pct(intCount)}% — 見極め・条件</div>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-3">職種別のNG理由 傾向</h2>
      <div className="space-y-4">
        {byJobType.map(({ jobType, total: jtTotal, cats, topCat }) => (
          <div key={jobType} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">{jobType}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{jtTotal}件</span>
              </div>
              <span className="text-xs text-gray-400">最多: {categoryLabel(topCat)}</span>
            </div>

            {/* 100%積み上げバー */}
            <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-gray-100">
              {cats.map(({ cat, count }) => (
                <div
                  key={cat}
                  style={{ width: `${(count / jtTotal) * 100}%`, backgroundColor: ngCategoryColors[cat] }}
                  className="h-full"
                  title={`${categoryLabel(cat)}: ${count}件`}
                />
              ))}
            </div>

            {/* カテゴリ内訳 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 mb-4">
              {cats.map(({ cat, count }) => (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: ngCategoryColors[cat] }} />
                  <span className="text-gray-600 flex-1">{categoryLabel(cat)}</span>
                  <span className="font-semibold text-gray-700">{count}件</span>
                  <span className="text-gray-400 w-9 text-right">{Math.round((count / jtTotal) * 100)}%</span>
                </div>
              ))}
            </div>

            {/* 示唆 */}
            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
              <span className="text-[11px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold shrink-0 mt-0.5">示唆</span>
              <span className="text-xs text-blue-700 leading-relaxed">
                最多の「{categoryLabel(topCat)}」への対策 — {ngCategoryActions[topCat]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NgHistory({ candidates }) {
  const ngCandidates = candidates.filter(c => c.status === 'ng');

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4">NG記録履歴</h2>
      <div className="space-y-3">
        {ngCandidates.map(c => {
          const job = sampleJobs.find(j => j.id === c.jobId);
          const agency = sampleAgencies.find(a => a.id === c.agencyId);
          const reasonCat = ngReasonCategories.find(cat => cat.id === c.ngReason?.category);
          return (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-800">{c.name}</div>
                  <div className="text-sm text-gray-500">{job?.title}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {c.ngReason?.feedbackSent ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">送信済</span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">未送信</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{reasonCat?.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.ngReason?.detail}</span>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{agency?.name}</span>
              </div>
            </div>
          );
        })}
        {ngCandidates.length === 0 && (
          <div className="text-center text-gray-400 py-8">NG記録はまだありません</div>
        )}
      </div>
    </div>
  );
}

export default function NgFeedbackPage() {
  const [tab, setTab] = useState('trends');
  const { candidates, advanceStatus } = useCandidates();

  const recordNg = (candidate, category, detail, memo) => {
    advanceStatus(candidate.id, 'ng', `NG: ${category.label} - ${detail}${memo ? `（${memo}）` : ''}`, {
      ngReason: { category: category.id, detail, feedbackSent: true },
    });
  };

  return (
    <BoosterLayout current="ng-feedback">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">NG理由 分析</h1>
        <p className="text-sm text-gray-500 mt-1">選考結果を記録し、職種別の傾向から求人・推薦の改善につなげる</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('trends')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'trends' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          📊 傾向分析
        </button>
        <button
          onClick={() => setTab('input')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'input' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          ✍️ NG理由入力
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'history' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          📋 記録履歴
        </button>
      </div>

      {tab === 'trends' && <NgTrends candidates={candidates} />}
      {tab === 'input' && <NgQuickInput candidates={candidates} onRecordNg={recordNg} />}
      {tab === 'history' && <NgHistory candidates={candidates} />}
    </BoosterLayout>
  );
}
