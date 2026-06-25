import { useState } from 'react';
import { useRouter } from 'next/router';
import BoosterLayout from '../../../components/booster/Layout';
import { sampleAgencies } from '../../../lib/booster/sample-data';

const formSections = [
  {
    title: '基本情報',
    fields: [
      { key: 'title', label: '求人タイトル', type: 'text', placeholder: '例: 病棟看護師（正社員）', required: true },
      { key: 'department', label: '配属先', type: 'text', placeholder: '例: 外科病棟' },
      { key: 'employmentType', label: '雇用形態', type: 'select', options: ['正社員', 'パート・アルバイト', '契約社員', '派遣'] },
      { key: 'headcount', label: '募集人数', type: 'number', placeholder: '1' },
      { key: 'urgency', label: '緊急度', type: 'select', options: ['high:急募', 'medium:通常', 'low:低'] },
    ],
  },
  {
    title: '条件',
    fields: [
      { key: 'salary', label: '給与', type: 'text', placeholder: '例: 月給28万〜35万円（経験年数による）' },
      { key: 'workHours', label: '勤務時間', type: 'text', placeholder: '例: 日勤 8:30-17:30 / 夜勤 16:30-翌9:00' },
      { key: 'benefits', label: '福利厚生', type: 'textarea', placeholder: '住宅手当、夜勤手当、賞与年2回...' },
    ],
  },
  {
    title: '要件',
    fields: [
      { key: 'requirements', label: '必須要件', type: 'textarea', placeholder: '看護師免許必須、病棟経験3年以上' },
      { key: 'preferred', label: '歓迎要件', type: 'textarea', placeholder: '外科病棟経験、急性期経験' },
    ],
  },
  {
    title: '詳細・アピール',
    fields: [
      { key: 'description', label: '仕事内容', type: 'textarea', placeholder: '具体的な業務内容を記載...' },
      { key: 'appealPoints', label: 'アピールポイント', type: 'textarea', placeholder: '残業月平均10時間以下、有給取得率80%以上...' },
    ],
  },
];

export default function NewJob() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [selectedAgencies, setSelectedAgencies] = useState([]);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('求人票を保存しました（デモ）');
    router.push('/booster/jobs');
  };

  return (
    <BoosterLayout current="jobs">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">新規求人作成</h1>
          <p className="text-sm text-gray-500 mt-1">求人票を作成し、紹介会社へ配信できます</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formSections.map(section => (
            <div key={section.title} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={form[field.key] || ''}
                        onChange={e => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={form[field.key] || ''}
                        onChange={e => updateField(field.key, e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">選択してください</option>
                        {field.options.map(opt => {
                          const [val, label] = opt.includes(':') ? opt.split(':') : [opt, opt];
                          return <option key={val} value={val}>{label}</option>;
                        })}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={form[field.key] || ''}
                        onChange={e => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              配信先紹介会社
            </h2>
            <div className="space-y-2">
              {sampleAgencies.map(ag => (
                <label key={ag.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedAgencies.includes(ag.id)}
                    onChange={e => setSelectedAgencies(prev =>
                      e.target.checked ? [...prev, ag.id] : prev.filter(id => id !== ag.id)
                    )}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{ag.name}</div>
                    <div className="text-xs text-gray-500">{ag.contact}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/booster/jobs')}
              className="px-6 py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={() => { alert('下書き保存しました（デモ）'); }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
            >
              下書き保存
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex-1"
            >
              保存して公開
            </button>
          </div>
        </form>
      </div>
    </BoosterLayout>
  );
}
