import { useState } from 'react';
import BoosterLayout from '../../components/booster/Layout';
import { sampleJobs, sampleCandidates, sampleAgencies, candidateStatuses } from '../../lib/booster/sample-data';

function SpeedGauge({ value, max, target, label, unit = '日' }) {
  const ratio = Math.min(value / max, 1);
  const targetRatio = target / max;
  const r = 70;
  const cx = 90;
  const cy = 85;
  const startAngle = Math.PI;
  const endAngle = 0;
  const arc = (angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });
  const needleAngle = startAngle - ratio * Math.PI;
  const targetAngle = startAngle - targetRatio * Math.PI;
  const needleTip = arc(needleAngle);
  const targetPos = arc(targetAngle);

  const greenEnd = startAngle - (target / max) * Math.PI;
  const yellowEnd = startAngle - ((target + (max - target) * 0.5) / max) * Math.PI;

  const arcPath = (startA, endA, radius) => {
    const s = { x: cx + radius * Math.cos(startA), y: cy - radius * Math.sin(startA) };
    const e = { x: cx + radius * Math.cos(endA), y: cy - radius * Math.sin(endA) };
    const large = startA - endA > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const isGood = value <= target;
  const isOk = value > target && value <= target + (max - target) * 0.5;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path d={arcPath(startAngle, greenEnd, r)} fill="none" stroke="#d1fae5" strokeWidth="14" strokeLinecap="round" />
        <path d={arcPath(greenEnd, yellowEnd, r)} fill="none" stroke="#fef3c7" strokeWidth="14" />
        <path d={arcPath(yellowEnd, endAngle, r)} fill="none" stroke="#fee2e2" strokeWidth="14" strokeLinecap="round" />

        <line
          x1={cx} y1={cy}
          x2={targetPos.x} y2={targetPos.y}
          stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3,2"
        />
        <circle cx={targetPos.x} cy={targetPos.y} r="3" fill="#9ca3af" />

        <line
          x1={cx} y1={cy}
          x2={needleTip.x} y2={needleTip.y}
          stroke={isGood ? '#059669' : isOk ? '#d97706' : '#dc2626'}
          strokeWidth="3" strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill={isGood ? '#059669' : isOk ? '#d97706' : '#dc2626'} />

        <text x={cx} y={cy - 18} textAnchor="middle" className="text-2xl font-bold" fill={isGood ? '#059669' : isOk ? '#d97706' : '#dc2626'} fontSize="28" fontWeight="800">
          {value}
        </text>
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#6b7280" fontSize="11">
          {unit}
        </text>
      </svg>
      <div className="text-sm font-medium text-gray-700 -mt-2">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">目標: {target}{unit}以内</div>
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
          <div className="flex justify-around">
            <SpeedGauge value={avgDaysToInterview} max={7} target={3} label="推薦 → 面接" />
            <SpeedGauge value={avgDaysToOffer} max={7} target={3} label="面接 → 内定" />
          </div>
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-emerald-100 rounded-sm inline-block" />良好</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-amber-100 rounded-sm inline-block" />注意</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-red-100 rounded-sm inline-block" />遅延</span>
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
