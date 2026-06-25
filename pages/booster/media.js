import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleMediaPlatforms, sampleJobs } from '../../lib/booster/sample-data';

const statusLabel = { active: '掲載中', paused: '停止中' };
const statusStyle = {
  active: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-gray-100 text-gray-500',
};

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const totalApplicants = sampleMediaPlatforms.reduce((sum, m) => sum + m.applicants, 0);
  const activeCount = sampleMediaPlatforms.filter(m => m.status === 'active').length;

  return (
    <BoosterLayout current="media">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">求人媒体管理</h1>
          <p className="text-sm text-gray-500 mt-1">媒体ごとの掲載状況・応募者数を一元管理</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          + 媒体を追加
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-blue-500">
          <div className="text-sm text-gray-500 mb-2">連携媒体数</div>
          <div className="text-3xl font-bold text-gray-800">{sampleMediaPlatforms.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-emerald-500">
          <div className="text-sm text-gray-500 mb-2">掲載中</div>
          <div className="text-3xl font-bold text-gray-800">{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border-t-3 border-violet-500">
          <div className="text-sm text-gray-500 mb-2">媒体経由 応募者</div>
          <div className="text-3xl font-bold text-gray-800">{totalApplicants}名</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">媒体名</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">種別</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">ステータス</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">掲載求人数</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">応募者数</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">費用</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500">API連携</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {sampleMediaPlatforms.map(m => (
              <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-sm text-gray-800">{m.name}</div>
                  <div className="text-xs text-gray-400">{m.url}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{m.type}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[m.status]}`}>
                    {statusLabel[m.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700">{m.postings}件</td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-800">{m.applicants}名</td>
                <td className="px-5 py-4">
                  <div className="text-sm text-gray-700">{m.monthlyCost}</div>
                  <div className="text-xs text-gray-400">{m.costModel}</div>
                </td>
                <td className="px-5 py-4">
                  {m.apiAvailable ? (
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">対応</span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">非対応</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setSelectedMedia(m)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    詳細
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedMedia(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedMedia.name}</h2>
                  <p className="text-sm text-gray-500">{selectedMedia.type} / {selectedMedia.costModel}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle[selectedMedia.status]}`}>
                  {statusLabel[selectedMedia.status]}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">掲載求人数</div>
                  <div className="text-2xl font-bold text-gray-800">{selectedMedia.postings}件</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">応募者数</div>
                  <div className="text-2xl font-bold text-gray-800">{selectedMedia.applicants}名</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">掲載中の求人</div>
                <div className="space-y-2">
                  {sampleJobs.filter(j => j.status === 'active').slice(0, selectedMedia.postings).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-800">{job.title}</span>
                      <span className="text-xs text-gray-400">{job.department}</span>
                    </div>
                  ))}
                  {selectedMedia.postings === 0 && (
                    <div className="text-sm text-gray-400 text-center py-4">掲載中の求人はありません</div>
                  )}
                </div>
              </div>

              {selectedMedia.apiAvailable && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs font-semibold text-blue-700 mb-1">API連携</div>
                  <div className="text-xs text-blue-600">
                    この媒体はAPI連携に対応しています。応募者データの自動取り込みと求人情報の自動掲載が可能です。
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setSelectedMedia(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                閉じる
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                掲載設定
              </button>
            </div>
          </div>
        </div>
      )}
    </BoosterLayout>
  );
}
