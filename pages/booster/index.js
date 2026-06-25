import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleJobs, sampleCandidates, sampleAgencies, candidateStatuses } from '../../lib/booster/sample-data';

const statusColors = {
  good: 'text-blue-600 bg-blue-50',
  warning: 'text-red-600 bg-red-50',
};

function SpeedKpiCard({ title, currentValue, targetValue, gap, weekChange, status, statusType = 'warning', unit = '秒', maxValue = 20 }) {
  const currentPct = ((maxValue - currentValue) / maxValue) * 100;
  const targetPct = ((maxValue - targetValue) / maxValue) * 100;
  const badgeColor = statusColors[statusType] || statusColors.warning;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-[13px] font-medium text-gray-500 mb-5">{title}</div>

      <div className="text-center mb-1">
        <span className="text-[40px] font-extrabold text-gray-800 tracking-tight leading-none">{currentValue}</span>
        <span className="text-base text-gray-400 ml-1 font-medium">{unit}</span>
      </div>
      <div className="text-center mb-6">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${badgeColor}`}>{status}</span>
      </div>

      <div className="px-1 mb-2">
        <div className="flex justify-between text-[11px] text-gray-300 mb-2">
          <span>ゆっくり</span>
          <span>はやい</span>
        </div>

        <div className="relative h-2.5 rounded-full bg-gradient-to-r from-slate-100 via-blue-50 to-blue-200">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${currentPct}%` }}
          >
            <div className="w-4 h-4 rounded-full bg-white border-[2.5px] border-blue-400 shadow-sm" />
          </div>

          <div
            className="absolute -top-0.5 -translate-x-1/2"
            style={{ left: `${targetPct}%` }}
          >
            <div className="w-[1.5px] h-3.5 bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className="relative h-5 mt-1.5">
          <div
            className="absolute -translate-x-1/2 text-[11px] text-gray-400 font-medium whitespace-nowrap"
            style={{ left: `${currentPct}%` }}
          >
            現状
          </div>
          <div
            className="absolute -translate-x-1/2 text-[11px] text-blue-500 font-medium whitespace-nowrap"
            style={{ left: `${targetPct}%` }}
          >
            目標
          </div>
        </div>
      </div>

      <div className="space-y-2 text-[13px] pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">目標</span>
          <span className="font-semibold text-gray-700">{targetValue}{unit}以内</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">目標まで</span>
          <span className="font-semibold text-blue-600">あと{gap}{unit}短縮</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">前週比</span>
          <span className="font-semibold text-emerald-600">{weekChange}{unit}改善</span>
        </div>
      </div>
    </div>
  );
}

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <SpeedKpiCard
          title="書類選考の判断スピード"
          currentValue={1.8}
          targetValue={1}
          gap={0.8}
          weekChange={0.3}
          status="改善余地あり"
          statusType="warning"
          unit="日"
          maxValue={5}
        />
        <SpeedKpiCard
          title="推薦〜面接設定"
          currentValue={2.5}
          targetValue={1}
          gap={1.5}
          weekChange={0.5}
          status="改善余地あり"
          statusType="warning"
          unit="日"
          maxValue={5}
        />
        <SpeedKpiCard
          title="面接〜内定"
          currentValue={3.2}
          targetValue={3}
          gap={0.2}
          weekChange={0.8}
          status="おおむね良好"
          statusType="good"
          unit="日"
          maxValue={7}
        />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-[13px] font-medium text-gray-500 mb-4">紹介会社別 推薦数</div>
          <div className="space-y-3">
            {sampleAgencies.slice(0, 4).map(ag => {
              const count = sampleCandidates.filter(c => c.agencyId === ag.id).length;
              const maxCount = 3;
              return (
                <div key={ag.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{ag.name}</span>
                    <span className="font-semibold text-gray-800">{count}名</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-300 rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
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
