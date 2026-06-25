import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleJobs, sampleCandidates, sampleAgencies, candidateStatuses } from '../../lib/booster/sample-data';

const urgencyLabel = { high: '急募', medium: '通常', low: '低' };
const urgencyStyle = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-500',
};

export default function BoosterDashboard() {
  const activeJobs = sampleJobs.filter(j => j.status === 'active').length;
  const totalCandidates = sampleCandidates.length;
  const inProgress = sampleCandidates.filter(c => !['ng', 'withdrawn', 'joined'].includes(c.status)).length;
  const offered = sampleCandidates.filter(c => ['offered', 'accepted'].includes(c.status)).length;

  const avgDaysToInterview = 2.5;
  const avgDaysToOffer = 4.0;

  const kpis = [
    { label: '公開求人数', value: activeJobs, color: 'border-blue-500' },
    { label: '候補者数', value: totalCandidates, color: 'border-emerald-500' },
    { label: '選考中', value: inProgress, color: 'border-violet-500' },
    { label: '内定', value: offered, color: 'border-amber-500' },
  ];

  return (
    <BoosterLayout current="dashboard">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">採用状況の概要</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`bg-white rounded-xl p-5 shadow-sm border-t-3 ${kpi.color}`}>
            <div className="text-sm text-gray-500 mb-2">{kpi.label}</div>
            <div className="text-3xl font-bold text-gray-800">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">選考スピード</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">推薦 → 面接設定</span>
                <span className="font-semibold text-blue-600">{avgDaysToInterview}日</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min((avgDaysToInterview / 7) * 100, 100)}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">目標: 3日以内</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">面接 → 内定提示</span>
                <span className="font-semibold text-emerald-600">{avgDaysToOffer}日</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${Math.min((avgDaysToOffer / 7) * 100, 100)}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">目標: 当日〜3日以内</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">紹介会社別 推薦数</h2>
          <div className="space-y-3">
            {sampleAgencies.slice(0, 3).map(ag => {
              const count = sampleCandidates.filter(c => c.agencyId === ag.id).length;
              const maxCount = 3;
              return (
                <div key={ag.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{ag.name}</span>
                    <span className="font-semibold text-gray-800">{count}名</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-violet-500 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">求人一覧</h2>
        <div className="space-y-3">
          {sampleJobs.map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{job.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyStyle[job.urgency]}`}>
                    {urgencyLabel[job.urgency]}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{job.department} / 募集{job.headcount}名</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">配信先: {job.agencies.length}社</div>
                <div className="text-xs text-gray-400">更新: {job.updatedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BoosterLayout>
  );
}
