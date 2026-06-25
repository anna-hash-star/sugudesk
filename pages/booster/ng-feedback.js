import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleCandidates, sampleJobs, sampleAgencies, ngReasonCategories } from '../../lib/booster/sample-data';

const STEPS = ['candidate', 'category', 'detail', 'done'];

function NgQuickInput() {
  const [step, setStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [freeText, setFreeText] = useState('');

  const activeCandidates = sampleCandidates.filter(c =>
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
                onClick={() => { setSelectedDetail(sub); setStep(3); }}
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

function NgHistory() {
  const ngCandidates = sampleCandidates.filter(c => c.status === 'ng');

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
  const [tab, setTab] = useState('input');

  return (
    <BoosterLayout current="ng-feedback">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">NG理由取得アシスタント</h1>
        <p className="text-sm text-gray-500 mt-1">選考結果を記録し、紹介会社へのフィードバック精度を向上</p>
      </div>

      <div className="flex gap-2 mb-6">
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

      {tab === 'input' ? <NgQuickInput /> : <NgHistory />}
    </BoosterLayout>
  );
}
