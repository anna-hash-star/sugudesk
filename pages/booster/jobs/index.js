import { useState } from 'react';
import Link from 'next/link';
import BoosterLayout from '../../../components/booster/Layout';
import { sampleJobs, sampleAgencies } from '../../../lib/booster/sample-data';

const urgencyLabel = { high: '急募', medium: '通常', low: '低' };
const urgencyStyle = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-500',
};
const statusLabel = { active: '公開中', draft: '下書き', closed: '募集終了' };
const statusStyle = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-500',
  closed: 'bg-red-100 text-red-600',
};

export default function JobsList() {
  const [jobs] = useState(sampleJobs);
  const [showDetail, setShowDetail] = useState(null);
  const [showPostModal, setShowPostModal] = useState(null);
  const [selectedAgencies, setSelectedAgencies] = useState([]);

  const openPost = (job) => {
    setSelectedAgencies(job.agencies.map(name => sampleAgencies.find(a => a.name === name)?.id).filter(Boolean));
    setShowPostModal(job);
  };

  return (
    <BoosterLayout current="jobs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">求人票管理</h1>
          <p className="text-sm text-gray-500 mt-1">求人票の作成・編集・紹介会社への配信</p>
        </div>
        <Link
          href="/booster/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + 新規求人作成
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div
              className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowDetail(showDetail === job.id ? null : job.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800">{job.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[job.status]}`}>
                      {statusLabel[job.status]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyStyle[job.urgency]}`}>
                      {urgencyLabel[job.urgency]}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{job.department}</span>
                    <span>{job.employmentType}</span>
                    <span>募集 {job.headcount}名</span>
                    <span>{job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openPost(job); }}
                    className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-violet-700 transition-colors"
                  >
                    📤 配信
                  </button>
                  <span className="text-gray-400 text-lg">{showDetail === job.id ? '▲' : '▼'}</span>
                </div>
              </div>
            </div>

            {showDetail === job.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <DetailRow label="勤務時間" value={job.workHours} />
                    <DetailRow label="必須要件" value={job.requirements} />
                    <DetailRow label="歓迎要件" value={job.preferred} />
                    <DetailRow label="福利厚生" value={job.benefits} />
                  </div>
                  <div className="space-y-4">
                    <DetailRow label="仕事内容" value={job.description} />
                    <DetailRow label="アピールポイント" value={job.appealPoints} />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">配信先紹介会社</div>
                      <div className="flex flex-wrap gap-1">
                        {job.agencies.length > 0 ? job.agencies.map(a => (
                          <span key={a} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{a}</span>
                        )) : <span className="text-sm text-gray-400">未設定</span>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      作成: {job.createdAt} / 更新: {job.updatedAt}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowPostModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">求人票マルチポスト配信</h2>
              <p className="text-sm text-gray-500 mt-1">{showPostModal.title}</p>
            </div>
            <div className="p-6">
              <div className="text-sm font-semibold text-gray-700 mb-3">配信先を選択</div>
              <div className="space-y-2 mb-6">
                {sampleAgencies.map(ag => (
                  <label key={ag.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedAgencies.includes(ag.id)}
                      onChange={(e) => {
                        setSelectedAgencies(prev =>
                          e.target.checked ? [...prev, ag.id] : prev.filter(id => id !== ag.id)
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{ag.name}</div>
                      <div className="text-xs text-gray-500">{ag.contact} / {ag.email}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-xs font-semibold text-blue-700 mb-1">AI フォーマット変換</div>
                <div className="text-xs text-blue-600">
                  各紹介会社の推奨フォーマットに自動変換して送信します。
                  求人票の内容をそのまま、各社に最適化された形式でメール配信。
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowPostModal(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => { alert(`${selectedAgencies.length}社に配信しました（デモ）`); setShowPostModal(null); }}
                className="bg-violet-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                📤 {selectedAgencies.length}社に配信
              </button>
            </div>
          </div>
        </div>
      )}
    </BoosterLayout>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  );
}
