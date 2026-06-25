import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleCandidates, sampleJobs, sampleAgencies, candidateStatuses } from '../../lib/booster/sample-data';

const pipelineStages = ['applied', 'document_passed', 'interview_scheduled', 'interview_completed', 'offered', 'accepted', 'joined'];

export default function CandidatesPage() {
  const [view, setView] = useState('pipeline');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
            onClick={() => setView('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'pipeline' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            パイプライン
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            リスト
          </button>
        </div>
      </div>

      {view === 'pipeline' && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {pipelineStages.map(stage => {
            const stageInfo = candidateStatuses[stage];
            const candidates = sampleCandidates.filter(c => c.status === stage);
            return (
              <div key={stage} className="min-w-[220px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stageInfo.color }} />
                  <span className="text-sm font-semibold text-gray-700">{stageInfo.label}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{candidates.length}</span>
                </div>
                <div className="space-y-2">
                  {candidates.map(c => {
                    const job = getJob(c.jobId);
                    const agency = getAgency(c.agencyId);
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCandidate(c)}
                        className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="font-semibold text-sm text-gray-800">{c.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{job?.title}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{agency?.name}</span>
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

          <div className="min-w-[220px] flex-shrink-0">
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
                const agency = getAgency(c.agencyId);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all opacity-70"
                  >
                    <div className="font-semibold text-sm text-gray-600">{c.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{job?.title}</div>
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
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">紹介会社</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">応募日</th>
              </tr>
            </thead>
            <tbody>
              {sampleCandidates.map(c => {
                const job = getJob(c.jobId);
                const agency = getAgency(c.agencyId);
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
                    <td className="px-4 py-3 text-sm text-gray-600">{agency?.name}</td>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedCandidate.name}</h2>
                  <p className="text-sm text-gray-500">{getJob(selectedCandidate.jobId)?.title}</p>
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
                  <span className="text-gray-500">紹介会社</span>
                  <span className="text-gray-800">{getAgency(selectedCandidate.agencyId)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">経験</span>
                  <span className="text-gray-800">{selectedCandidate.experience}</span>
                </div>
              </div>
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
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </BoosterLayout>
  );
}
