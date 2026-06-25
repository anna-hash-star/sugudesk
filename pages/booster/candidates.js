import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleCandidates, sampleJobs, sampleAgencies, sampleMediaPlatforms, candidateStatuses } from '../../lib/booster/sample-data';

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

function AiAnalysisPanel({ analysis, jobTitle }) {
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

function UploadModal({ onClose }) {
  const [step, setStep] = useState('upload');
  const [dragOver, setDragOver] = useState(false);

  const demoAnalysis = {
    matchScore: 76,
    summary: '回復期リハビリ病棟3年、急性期外科病棟2年の経験。術後リハビリとの連携に強み。夜勤経験あり。',
    strengths: ['外科病棟2年の実務経験あり', '回復期からの異動でリハビリ連携に強い', '夜勤・日勤の二交代経験'],
    concerns: ['直近の外科経験からブランクが1年', '転職回数が3回とやや多い'],
    interviewPoints: ['ブランク期間の活動内容', '転職理由の一貫性', '希望する夜勤頻度'],
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">候補者を追加</h2>
          <p className="text-sm text-gray-500 mt-1">履歴書・職務経歴書をアップロードするとAIが自動分析します</p>
        </div>

        {step === 'upload' && (
          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setStep('analyzing'); setTimeout(() => setStep('result'), 2000); }}
            >
              <div className="text-4xl text-gray-300 mb-3">+</div>
              <div className="text-sm text-gray-600 font-medium mb-1">履歴書・職務経歴書をドロップ</div>
              <div className="text-xs text-gray-400 mb-4">PDF, JPEG, PNG に対応</div>
              <button
                onClick={() => { setStep('analyzing'); setTimeout(() => setStep('result'), 2000); }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                ファイルを選択
              </button>
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold text-gray-500 mb-3">対象求人</div>
              <select className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">選択してください</option>
                {sampleJobs.filter(j => j.status === 'active').map(j => (
                  <option key={j.id} value={j.id}>{j.title}（{j.department}）</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-500 mb-3">流入元</div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 text-sm">
                  <input type="radio" name="source" defaultChecked className="text-blue-600" /> 手動アップロード
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 text-sm">
                  <input type="radio" name="source" className="text-blue-600" /> 紹介会社
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 text-sm">
                  <input type="radio" name="source" className="text-blue-600" /> 媒体
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="p-12 text-center">
            <div className="inline-block w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <div className="text-sm font-medium text-gray-700 mb-1">AIが分析中...</div>
            <div className="text-xs text-gray-400">履歴書・職務経歴書を読み取り、求人とのマッチ度を算出しています</div>
          </div>
        )}

        {step === 'result' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-500 text-lg">&#10003;</span>
              <span className="text-sm font-semibold text-gray-700">分析完了</span>
            </div>

            <AiAnalysisPanel analysis={demoAnalysis} />

            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="text-xs font-semibold text-blue-700 mb-1">次のアクション</div>
              <div className="text-xs text-blue-600">
                マッチ度76点 — 書類通過の判断をしてください。通過の場合、面接候補日を設定できます。
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            {step === 'result' ? '閉じる' : 'キャンセル'}
          </button>
          {step === 'result' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
              >
                保留
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                書類通過 → 面接設定
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const [view, setView] = useState('pipeline');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const getJob = (jobId) => sampleJobs.find(j => j.id === jobId);
  const getAgency = (agencyId) => sampleAgencies.find(a => a.id === agencyId);

  return (
    <BoosterLayout current="candidates">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">候補者管理</h1>
          <p className="text-sm text-gray-500 mt-1">選考パイプラインの管理</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            + 候補者を追加
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
            const candidates = sampleCandidates.filter(c => c.status === stage);
            return (
              <div key={stage} className="min-w-[230px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stageInfo.color }} />
                  <span className="text-sm font-semibold text-gray-700">{stageInfo.label}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{candidates.length}</span>
                </div>
                <div className="space-y-2">
                  {candidates.map(c => {
                    const job = getJob(c.jobId);
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCandidate(c)}
                        className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-sm text-gray-800">{c.name}</div>
                          <MatchScoreBadge score={c.aiAnalysis?.matchScore} />
                        </div>
                        <div className="text-xs text-gray-500">{job?.title}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <SourceBadge candidate={c} />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{c.appliedAt}</div>
                      </div>
                    );
                  })}
                  {candidates.length === 0 && (
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
                {sampleCandidates.filter(c => ['ng', 'withdrawn'].includes(c.status)).length}
              </span>
            </div>
            <div className="space-y-2">
              {sampleCandidates.filter(c => ['ng', 'withdrawn'].includes(c.status)).map(c => {
                const job = getJob(c.jobId);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
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
              {sampleCandidates.map(c => {
                const job = getJob(c.jobId);
                const status = candidateStatuses[c.status];
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedCandidate(null)}>
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
              </div>

              <AiAnalysisPanel
                analysis={selectedCandidate.aiAnalysis}
                jobTitle={getJob(selectedCandidate.jobId)?.title}
              />

              <h3 className="text-sm font-semibold text-gray-700 mb-3">選考履歴</h3>
              <div className="space-y-3">
                {selectedCandidate.statusHistory?.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full mt-1"
                        style={{ backgroundColor: candidateStatuses[h.status]?.color }}
                      />
                      {i < selectedCandidate.statusHistory.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {candidateStatuses[h.status]?.label}
                        </span>
                        <span className="text-xs text-gray-400">{h.date}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">{h.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                閉じる
              </button>
              {selectedCandidate.aiAnalysis?.interviewPoints?.length > 0 &&
                ['document_passed', 'interview_scheduled'].includes(selectedCandidate.status) && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  面接対策シートを送信
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </BoosterLayout>
  );
}
