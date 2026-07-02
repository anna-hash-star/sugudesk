import Link from 'next/link';
import BoosterLayout from '../../components/booster/Layout';
import { sampleJobs, sampleRetention, agencyResponseMetrics, candidateStatuses } from '../../lib/booster/sample-data';
import { useCandidates, DEMO_TODAY } from '../../lib/booster/useCandidates';

const statusColors = {
  good: 'text-blue-600 bg-blue-50',
  warning: 'text-red-600 bg-red-50',
};

function SpeedKpiCard({ title, currentValue, targetValue, gap, weekChange, status, statusType = 'warning', unit = '秒', maxValue = 20 }) {
  const currentPct = ((maxValue - currentValue) / maxValue) * 100;
  const targetPct = ((maxValue - targetValue) / maxValue) * 100;
  const badgeColor = statusColors[statusType] || statusColors.warning;

  // 現状と目標が近いとラベルが重なるため、最低間隔を確保してずらす
  const MIN_LABEL_GAP = 13;
  let curLabelPct = currentPct;
  let tgtLabelPct = targetPct;
  if (Math.abs(currentPct - targetPct) < MIN_LABEL_GAP) {
    const mid = (currentPct + targetPct) / 2;
    const half = MIN_LABEL_GAP / 2;
    if (currentPct <= targetPct) {
      curLabelPct = mid - half;
      tgtLabelPct = mid + half;
    } else {
      curLabelPct = mid + half;
      tgtLabelPct = mid - half;
    }
  }
  curLabelPct = Math.min(94, Math.max(6, curLabelPct));
  tgtLabelPct = Math.min(94, Math.max(6, tgtLabelPct));

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
        <div className="flex justify-between text-[11px] text-gray-500 mb-2">
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
            className="absolute -translate-x-1/2 text-[11px] text-gray-600 font-medium whitespace-nowrap"
            style={{ left: `${curLabelPct}%` }}
          >
            現状
          </div>
          <div
            className="absolute -translate-x-1/2 text-[11px] text-blue-500 font-medium whitespace-nowrap"
            style={{ left: `${tgtLabelPct}%` }}
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
  const { candidates } = useCandidates();

  const today = new Date(DEMO_TODAY);
  const getDaysStagnant = (c) => {
    const lastEvent = c.statusHistory?.[c.statusHistory.length - 1];
    const lastDate = lastEvent ? new Date(lastEvent.date) : new Date(c.appliedAt);
    return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  };

  const activeJobs = sampleJobs.filter(j => j.status === 'active').length;
  const totalCandidates = candidates.length;
  const inProgress = candidates.filter(c => !['ng', 'withdrawn', 'joined'].includes(c.status)).length;
  const offered = candidates.filter(c => ['offered', 'accepted'].includes(c.status)).length;

  const stagnant = candidates
    .filter(c => !['ng', 'withdrawn', 'joined'].includes(c.status))
    .map(c => ({ ...c, daysSinceUpdate: getDaysStagnant(c) }))
    .filter(c => c.daysSinceUpdate >= 3)
    .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);

  const awaitingJudgment = candidates.filter(c => c.status === 'applied').length;
  const schedulingCount = candidates.filter(c => c.status === 'document_passed' && c.interviewProposal?.status === 'pending').length;
  const interviewCount = candidates.filter(c => c.status === 'interview_scheduled').length;

  const actions = [
    { label: '書類判断待ち', value: awaitingJudgment, sub: '目標: 12時間以内に判断', alert: awaitingJudgment > 0 },
    { label: '日程調整中', value: schedulingCount, sub: '候補者の回答待ち', alert: false },
    { label: '滞留アラート', value: stagnant.length, sub: '3日以上動きなし', alert: stagnant.length > 0 },
    { label: '面接予定', value: interviewCount, sub: '対策シートを事前送付', alert: false },
  ];

  const inventory = [
    { label: '公開求人数', value: activeJobs, delta: null },
    { label: '候補者数', value: totalCandidates, delta: '今週 +2' },
    { label: '選考中', value: inProgress, delta: null },
    { label: '内定', value: offered, delta: '今週 +1' },
  ];

  const avgResponse = Math.round(agencyResponseMetrics.reduce((s, a) => s + a.avgResponseHours, 0) / agencyResponseMetrics.length);

  return (
    <BoosterLayout current="dashboard">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">採用状況の概要</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-700">今日のアクション</h2>
          <span className="text-xs text-gray-400">6/25(木)時点</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map(a => {
            const isAlert = a.alert && a.value > 0;
            return (
              <Link
                key={a.label}
                href="/booster/candidates"
                className={`block bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${
                  isAlert ? 'border-red-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{a.label}</span>
                  <span className="text-gray-300">→</span>
                </div>
                <div className={`text-3xl font-bold ${isAlert ? 'text-red-600' : 'text-gray-800'}`}>
                  {a.value}<span className="text-sm font-medium text-gray-400 ml-1">件</span>
                </div>
                <div className={`text-xs mt-1 ${isAlert ? 'text-red-500' : 'text-gray-400'}`}>{a.sub}</div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm px-6 py-4 mb-8 grid grid-cols-2 md:grid-cols-4 md:divide-x divide-gray-100">
        {inventory.map(item => (
          <div key={item.label} className="px-4 first:pl-0 py-1">
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800">{item.value}</span>
              {item.delta && <span className="text-xs text-gray-400">{item.delta}</span>}
            </div>
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
          <div className="text-[13px] font-medium text-gray-500 mb-4">紹介会社レスポンス</div>
          <div className="space-y-3">
            {agencyResponseMetrics.slice(0, 4).map(ag => {
              const isFast = ag.avgResponseHours <= 12;
              const widthPct = Math.min(100, Math.max(4, (ag.avgResponseHours / 72) * 100));
              return (
                <div key={ag.agencyId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 text-xs">{ag.name}</span>
                    <span className={`text-xs font-semibold ${isFast ? 'text-blue-600' : 'text-red-500'}`}>
                      {ag.avgResponseHours < 24 ? `${ag.avgResponseHours}時間` : `${(ag.avgResponseHours / 24).toFixed(1)}日`}
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-gray-100 rounded-full">
                    <div
                      className={`h-1.5 rounded-full transition-all ${isFast ? 'bg-blue-400' : 'bg-red-300'}`}
                      style={{ width: `${widthPct}%` }}
                    />
                    <div
                      className="absolute -top-[3px] w-[1.5px] h-3 bg-gray-400 rounded-full"
                      style={{ left: `${(12 / 72) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">平均レス時間</span>
              <span className={`font-semibold ${avgResponse > 12 ? 'text-red-600' : 'text-gray-700'}`}>
                {avgResponse}時間{avgResponse > 12 && ' ⚠'}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">縦線 = 目標12時間（推薦受付→書類判断）</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">定着フォロー</h2>
            <Link href="/booster/retention" className="text-xs text-blue-600 hover:text-blue-800 font-medium">詳細 →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-emerald-700">{sampleRetention.filter(r => r.status === 'active').length}</div>
              <div className="text-xs text-emerald-600">在籍中</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-700">{sampleRetention.filter(r => r.risk === 'medium' || r.risk === 'high').length}</div>
              <div className="text-xs text-amber-600">要注意</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-700">{sampleRetention.filter(r => r.status === 'resigned').length}</div>
              <div className="text-xs text-red-600">早期退職</div>
            </div>
          </div>
          <div className="space-y-2">
            {sampleRetention.filter(r => r.risk !== 'low').map(r => (
              <Link key={r.id} href="/booster/retention" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <span className="text-sm font-medium text-gray-800">{r.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{r.jobTitle}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  r.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {r.risk === 'high' ? '高リスク' : '要注意'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">滞留アラート</h2>
          {stagnant.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-4">滞留している候補者はいません</div>
          ) : (
            <div className="space-y-2">
              {stagnant.map(c => {
                const job = sampleJobs.find(j => j.id === c.jobId);
                const statusInfo = candidateStatuses[c.status];
                return (
                  <Link
                    key={c.id}
                    href={`/booster/candidates?focus=${c.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all hover:shadow-sm ${
                      c.daysSinceUpdate >= 5 ? 'bg-red-50 border border-red-200 hover:bg-red-100/60' : 'bg-amber-50 border border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{c.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: statusInfo?.bg, color: statusInfo?.color }}>
                          {statusInfo?.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{job?.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-bold ${c.daysSinceUpdate >= 5 ? 'text-red-600' : 'text-amber-600'}`}>
                          {c.daysSinceUpdate}日間
                        </div>
                        <div className="text-xs text-gray-400">動きなし</div>
                      </div>
                      <span className="text-gray-300">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">求人一覧</h2>
        <div className="space-y-3">
          {sampleJobs.map(job => {
            const jobCandidates = candidates.filter(c => c.jobId === job.id);
            const jobInProgress = jobCandidates.filter(c => !['ng', 'withdrawn', 'joined'].includes(c.status)).length;
            const jobOffered = jobCandidates.filter(c => ['offered', 'accepted'].includes(c.status)).length;
            return (
              <Link key={job.id} href="/booster/jobs" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{job.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyStyle[job.urgency]}`}>
                      {urgencyLabel[job.urgency]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{job.department} / 募集{job.headcount}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    候補者{jobCandidates.length}名（選考中{jobInProgress}・内定{jobOffered}）
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">配信先: {job.agencies.length}社</div>
                  <div className="text-xs text-gray-400">更新: {job.updatedAt}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </BoosterLayout>
  );
}
