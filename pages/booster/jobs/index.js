import { useState } from 'react';
import Link from 'next/link';
import BoosterLayout from '../../../components/booster/Layout';
import { sampleJobs, sampleAgencies, sampleMediaPlatforms } from '../../../lib/booster/sample-data';

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

function DetailSection({ title, children }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join('、') : value;
  return (
    <div className="flex gap-2 py-1.5">
      <span className="text-xs text-gray-400 flex-shrink-0 w-24">{label}</span>
      <span className="text-sm text-gray-800">{display}</span>
    </div>
  );
}

function TagList({ items, color = 'blue' }) {
  if (!items || items.length === 0) return <span className="text-sm text-gray-400">未設定</span>;
  const styles = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(item => (
        <span key={item} className={`text-xs px-2.5 py-1 rounded-full ${styles[color]}`}>{item}</span>
      ))}
    </div>
  );
}

function JobDetailPanel({ job }) {
  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="p-5">
        {job.catchCopy && (
          <div className="mb-4 text-sm text-blue-700 bg-blue-50 px-4 py-3 rounded-lg font-medium">
            {job.catchCopy}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <DetailSection title="施設・アクセス">
              <DetailRow label="施設名" value={job.facility} />
              <DetailRow label="所在地" value={job.address} />
              {job.access && job.access.length > 0 && (
                <div className="py-1.5">
                  <span className="text-xs text-gray-400 block mb-1">アクセス</span>
                  <div className="space-y-1">
                    {job.access.map((a, i) => (
                      <div key={i} className="text-sm text-gray-800 flex items-start gap-1.5">
                        <span className="text-gray-300 mt-0.5">·</span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DetailSection>

            <DetailSection title="業務内容・要件">
              <DetailRow label="業務内容" value={job.duties} />
              <DetailRow label="必須要件" value={job.requirements} />
              <DetailRow label="歓迎要件" value={job.preferred} />
            </DetailSection>

            <DetailSection title="勤務時間">
              {job.workSchedule && job.workSchedule.length > 0 ? (
                <div className="space-y-1.5">
                  {job.workSchedule.map((ws, i) => (
                    <div key={i} className="flex gap-2 py-1">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded flex-shrink-0">{ws.label}</span>
                      <span className="text-sm text-gray-800">{ws.hours}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">未設定</span>
              )}
            </DetailSection>

            <DetailSection title="給与">
              <DetailRow label="給与" value={job.salary} />
              {job.salaryDetail && (
                <>
                  {job.salaryDetail.partTime && <DetailRow label="パート時給" value={job.salaryDetail.partTime} />}
                  <DetailRow label="昇給" value={job.salaryDetail.raises} />
                  <DetailRow label="賞与" value={job.salaryDetail.bonus} />
                </>
              )}
              <DetailRow label="手当" value={job.allowances} />
            </DetailSection>
          </div>

          <div className="space-y-5">
            <DetailSection title="休日・休暇">
              <DetailRow label="休日" value={job.holidays} />
              {job.annualDaysOff && <DetailRow label="年間休日" value={`${job.annualDaysOff}日`} />}
              <DetailRow label="有給休暇" value={job.paidLeave} />
              <DetailRow label="特別休暇" value={job.specialLeave} />
            </DetailSection>

            <DetailSection title="福利厚生">
              <DetailRow label="福利厚生" value={job.benefits} />
              {job.housing && <DetailRow label="住居支援" value={job.housing} />}
              {job.childcare && <DetailRow label="育児支援" value={job.childcare} />}
            </DetailSection>

            {job.appealPoints && job.appealPoints.length > 0 && (
              <DetailSection title="アピールポイント">
                <div className="space-y-1.5 mt-1">
                  {job.appealPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-800">
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">●</span>
                      {point}
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            <DetailSection title="選考フロー">
              {job.selectionFlow && job.selectionFlow.length > 0 ? (
                <div className="flex items-center gap-1 mt-1">
                  {job.selectionFlow.map((step, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{step}</span>
                      {i < job.selectionFlow.length - 1 && <span className="text-gray-300">→</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">未設定</span>
              )}
            </DetailSection>

            {job.contact && (
              <DetailSection title="問い合わせ先">
                <DetailRow label="担当者" value={`${job.contact.name}（${job.contact.department}）`} />
                <DetailRow label="電話" value={job.contact.phone} />
              </DetailSection>
            )}

            <DetailSection title="配信先">
              <div className="mb-2">
                <span className="text-xs text-gray-400 block mb-1.5">紹介会社</span>
                <TagList items={job.agencies} color="blue" />
              </div>
              {job.mediaPostings && job.mediaPostings.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400 block mb-1.5">求人媒体</span>
                  <TagList items={job.mediaPostings} color="violet" />
                </div>
              )}
            </DetailSection>

            <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
              作成: {job.createdAt} / 更新: {job.updatedAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsList() {
  const [jobs] = useState(sampleJobs);
  const [showDetail, setShowDetail] = useState(null);
  const [showPostModal, setShowPostModal] = useState(null);
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const openPost = (job) => {
    setSelectedAgencies(job.agencies.map(name => sampleAgencies.find(a => a.name === name)?.id).filter(Boolean));
    setSelectedMedia(
      (job.mediaPostings || []).map(name => sampleMediaPlatforms.find(m => m.name === name)?.id).filter(Boolean)
    );
    setShowPostModal(job);
  };

  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalAgencyLinks = jobs.reduce((sum, j) => sum + j.agencies.length, 0);
  const totalMediaLinks = jobs.reduce((sum, j) => sum + (j.mediaPostings || []).length, 0);

  return (
    <BoosterLayout current="jobs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">求人票管理</h1>
          <p className="text-sm text-gray-500 mt-1">求人票の作成・編集・紹介会社/媒体への配信</p>
        </div>
        <Link
          href="/booster/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + 新規求人作成
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-t-3 border-blue-500">
          <div className="text-xs text-gray-500 mb-1">公開中の求人</div>
          <div className="text-2xl font-bold text-gray-800">{activeJobs}件</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-t-3 border-violet-500">
          <div className="text-xs text-gray-500 mb-1">紹介会社配信</div>
          <div className="text-2xl font-bold text-gray-800">{totalAgencyLinks}社</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-t-3 border-emerald-500">
          <div className="text-xs text-gray-500 mb-1">媒体掲載</div>
          <div className="text-2xl font-bold text-gray-800">{totalMediaLinks}媒体</div>
        </div>
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
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>{job.department}</span>
                    <span>{job.employmentType}</span>
                    <span>募集 {job.headcount}</span>
                    <span>{job.salary}</span>
                  </div>
                  {job.facility && (
                    <div className="text-xs text-gray-400 mt-1">{job.facility}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); openPost(job); }}
                    className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-violet-700 transition-colors"
                  >
                    配信
                  </button>
                  <span className="text-gray-400 text-sm">{showDetail === job.id ? '▲' : '▼'}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {job.agencies.length > 0 && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    紹介会社 {job.agencies.length}社
                  </span>
                )}
                {job.mediaPostings && job.mediaPostings.length > 0 && (
                  <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                    媒体 {job.mediaPostings.length}件
                  </span>
                )}
                {job.annualDaysOff && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    年間休日{job.annualDaysOff}日
                  </span>
                )}
              </div>
            </div>

            {showDetail === job.id && <JobDetailPanel job={job} />}
          </div>
        ))}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowPostModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800">求人票マルチポスト配信</h2>
              <p className="text-sm text-gray-500 mt-1">{showPostModal.title}</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-sm font-semibold text-gray-700 mb-3">紹介会社</div>
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

              <div className="text-sm font-semibold text-gray-700 mb-3">求人媒体</div>
              <div className="space-y-2 mb-6">
                {sampleMediaPlatforms.filter(m => m.status === 'active').map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMedia.includes(m.id)}
                      onChange={(e) => {
                        setSelectedMedia(prev =>
                          e.target.checked ? [...prev, m.id] : prev.filter(id => id !== m.id)
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.type} / {m.costModel}</div>
                    </div>
                    {m.apiAvailable && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">API</span>
                    )}
                  </label>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs font-semibold text-blue-700 mb-1">AI フォーマット変換</div>
                <div className="text-xs text-blue-600">
                  各紹介会社・媒体の推奨フォーマットに自動変換して送信します。
                  求人票の内容をそのまま、各配信先に最適化された形式で配信。
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0">
              <button
                onClick={() => setShowPostModal(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  const total = selectedAgencies.length + selectedMedia.length;
                  alert(`${selectedAgencies.length}社 + ${selectedMedia.length}媒体に配信しました（デモ）`);
                  setShowPostModal(null);
                }}
                className="bg-violet-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                {selectedAgencies.length + selectedMedia.length}件に配信
              </button>
            </div>
          </div>
        </div>
      )}
    </BoosterLayout>
  );
}
