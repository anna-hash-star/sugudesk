import BoosterLayout from '../../components/booster/Layout';
import { sampleAgencies, sampleCandidates } from '../../lib/booster/sample-data';

export default function AgenciesPage() {
  return (
    <BoosterLayout current="agencies">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">紹介会社管理</h1>
        <p className="text-sm text-gray-500 mt-1">取引先紹介会社の一覧と推薦状況</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleAgencies.map(ag => {
          const candidateCount = sampleCandidates.filter(c => c.agencyId === ag.id).length;
          const ngCount = sampleCandidates.filter(c => c.agencyId === ag.id && c.status === 'ng').length;
          const offeredCount = sampleCandidates.filter(c => c.agencyId === ag.id && ['offered', 'accepted', 'joined'].includes(c.status)).length;

          return (
            <div key={ag.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{ag.name}</h3>
                  <div className="text-sm text-gray-500 mt-0.5">{ag.contact}</div>
                </div>
                <span className="text-2xl">🤝</span>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                <div>{ag.email}</div>
                <div>{ag.phone}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-800">{candidateCount}</div>
                  <div className="text-xs text-gray-500">推薦数</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-emerald-600">{offeredCount}</div>
                  <div className="text-xs text-gray-500">内定</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-red-500">{ngCount}</div>
                  <div className="text-xs text-gray-500">NG</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BoosterLayout>
  );
}
