import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleRetention } from '../../lib/booster/sample-data';

const riskStyle = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
};
const riskLabel = { low: '安定', medium: '要注意', high: '高リスク' };

const statusStyle = {
  active: 'bg-emerald-100 text-emerald-700',
  resigned: 'bg-red-100 text-red-700',
};
const statusLabel = { active: '在籍中', resigned: '退職済' };

function ScoreBar({ score }) {
  if (score == null) return <span className="text-xs text-gray-400">未実施</span>;
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400'];
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-4 h-2 rounded-sm ${i <= score ? colors[score] : 'bg-gray-200'}`} />
      ))}
    </div>
  );
}

function FollowUpTimeline({ followUps }) {
  return (
    <div className="space-y-3">
      {followUps.map((f, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full mt-1 ${
              f.status === 'done' ? 'bg-blue-500' : 'bg-gray-300 border-2 border-dashed border-gray-400'
            }`} />
            {i < followUps.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-800">{f.timing}フォロー</span>
              <span className="text-xs text-gray-400">{f.date}</span>
              {f.status === 'upcoming' && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">予定</span>
              )}
            </div>
            {f.note && <div className="text-sm text-gray-600 mb-1">{f.note}</div>}
            <ScoreBar score={f.score} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RetentionPage() {
  const [selected, setSelected] = useState(null);

  const activeCount = sampleRetention.filter(r => r.status === 'active').length;
  const resignedCount = sampleRetention.filter(r => r.status === 'resigned').length;
  const atRisk = sampleRetention.filter(r => r.risk === 'medium' || r.risk === 'high').length;

  const allLearnings = sampleRetention.flatMap(r => r.learnings || []);

  return (
    <BoosterLayout current="retention">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">定着フォロー</h1>
          <p className="text-sm text-gray-500 mt-1">入職者の定着状況を追跡し、次の採用に活かす</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-emerald-500">
          <div className="text-sm text-gray-500 mb-2">在籍中</div>
          <div className="text-3xl font-bold text-gray-800">{activeCount}名</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-amber-500">
          <div className="text-sm text-gray-500 mb-2">要注意</div>
          <div className="text-3xl font-bold text-gray-800">{atRisk}名</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-red-500">
          <div className="text-sm text-gray-500 mb-2">早期退職</div>
          <div className="text-3xl font-bold text-gray-800">{resignedCount}名</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-blue-500">
          <div className="text-sm text-gray-500 mb-2">定着率</div>
          <div className="text-3xl font-bold text-gray-800">
            {Math.round((activeCount / sampleRetention.length) * 100)}%
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">入職者一覧</h2>
          {sampleRetention.map(person => (
            <div
              key={person.id}
              onClick={() => setSelected(selected?.id === person.id ? null : person)}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">{person.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[person.status]}`}>
                        {statusLabel[person.status]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskStyle[person.risk]}`}>
                        {riskLabel[person.risk]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {person.jobTitle} / {person.department}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">入職日</div>
                    <div className="text-sm font-medium text-gray-700">{person.joinedAt}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>流入: {person.agencyName}</span>
                  {person.status === 'resigned' && (
                    <span className="text-red-500">退職: {person.resignedAt}（{person.tenure}）</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {person.followUps.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">{f.timing}</span>
                      {f.status === 'done' ? <ScoreBar score={f.score} /> : (
                        <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">予定</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selected?.id === person.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 mb-3">フォローアップ履歴</h3>
                      <FollowUpTimeline followUps={person.followUps} />
                    </div>
                    <div>
                      {person.status === 'resigned' && person.resignReason && (
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-red-600 mb-2">退職理由</h3>
                          <div className="text-sm text-gray-700 bg-red-50 rounded-lg p-3 border border-red-100">
                            {person.resignReason}
                          </div>
                        </div>
                      )}
                      {person.learnings && person.learnings.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-blue-700 mb-2">次の採用へのフィードバック</h3>
                          <div className="space-y-2">
                            {person.learnings.map((l, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                                {l}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">AI学習インサイト</h2>
            <p className="text-xs text-gray-500 mb-3">
              定着データから抽出された、次の採用プロセスに活かすべき知見
            </p>
            <div className="space-y-3">
              {allLearnings.map((l, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex items-start gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">学</span>
                    <span className="text-xs text-gray-700 leading-relaxed">{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">定着率トレンド</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">3ヶ月定着率</span>
                <span className="text-sm font-bold text-gray-800">67%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-amber-400 rounded-full" style={{ width: '67%' }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">6ヶ月定着率</span>
                <span className="text-sm font-bold text-gray-800">67%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-emerald-400 rounded-full" style={{ width: '67%' }} />
              </div>
              <div className="text-xs text-gray-400 mt-2">
                業界平均: 3ヶ月 85% / 6ヶ月 75%
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 mt-2">
                <div className="text-xs text-amber-700">
                  3ヶ月定着率が業界平均を下回っています。1ヶ月フォローでの早期課題検出と対応が鍵です。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoosterLayout>
  );
}
