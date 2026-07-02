import { useState } from 'react';
import { useRouter } from 'next/router';
import BoosterLayout from '../../../components/booster/Layout';
import { sampleAgencies, sampleMediaPlatforms } from '../../../lib/booster/sample-data';

const aiQuestions = [
  { key: 'position', question: 'どの職種・配属先の求人ですか？', placeholder: '例: 看護師 / 透析センター（新規開設）' },
  { key: 'reason', question: '募集の背景と人数を教えてください', placeholder: '例: 2025年7月の新規開設に伴い2〜3名' },
  { key: 'conditions', question: '勤務条件・給与の基本情報を教えてください（わかる範囲でOK）', placeholder: '例: 日勤・遅番の二交代、年収400万円以上可、年間休日123日' },
  { key: 'notes', question: '職場について知っていることを自由に教えてください（断片的でOK）', placeholder: '例: 医師との距離が近い、看護師が検査に介入できる、育休取得者が多い ※魅力への転換はAIが行います' },
];

const generatedDraft = {
  title: '透析センター看護師',
  catchCopy: '2025年7月新設の透析センターで、専門キャリアを築きませんか？',
  department: '透析センター（新規開設）',
  employmentType: '正社員・パート',
  headcount: '2〜3名',
  urgency: 'high',
  facility: '',
  address: '',
  access: '',
  duties: '透析業務全般。医師やMEと連携しながらセンター専任として勤務いただきます。看護師が判断や検査等にも積極的に介入でき、ルーティン化しづらい環境で専門性を高められます。',
  requirements: '正看護師免許',
  preferred: '透析経験者歓迎（未経験でも丁寧に指導します）',
  workSchedule: '常勤・日勤: 8:30〜17:20（休憩60分）\n常勤・遅番: 11:00〜20:50（休憩60分）\nパート: 応相談',
  salary: '経験年数・現年収により決定（年収400万円以上可）',
  salaryDetail: '賞与年2回（6月・12月）、昇給年1回（4月）',
  allowances: '通勤手当（上限50,000円）、家族手当、夜勤手当',
  holidays: 'シフト制（週休2日・祝日）、年間休日123日',
  paidLeave: '入職6ヶ月後に10日付与（最高20日）',
  specialLeave: '慶弔、産前産後、育児休業、介護休業、子の看護休暇',
  benefits: '健康保険、厚生年金、労災保険、雇用保険、退職金制度、財形貯蓄',
  housing: '',
  childcare: '',
  appealPoints: '・新設センターで透析キャリアを一から構築できる\n・看護師が判断・検査に積極介入できる環境\n・年間休日123日でワークライフバランス◎\n・育児休業の取得実績多数',
  selectionFlow: '書類選考 → 面接（見学同時可）→ 内定',
  contactName: '',
  contactDepartment: '',
  contactPhone: '',
};

function AiRewriteButton({ field, value, onRewrite }) {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const rewriteOptions = [
    { label: 'より魅力的に', icon: '✨' },
    { label: 'より具体的に', icon: '🎯' },
    { label: 'シンプルに', icon: '📝' },
  ];

  const handleRewrite = (style) => {
    setLoading(true);
    setShowOptions(false);
    setTimeout(() => {
      let rewritten = value;
      if (style === 'より魅力的に') {
        rewritten = value + '\n※ 充実した教育体制で安心してスタートできます';
      } else if (style === 'より具体的に') {
        rewritten = value.replace(/等/g, '（詳細はお問い合わせください）');
      } else {
        rewritten = value.split('\n').slice(0, 2).join('\n');
      }
      onRewrite(field, rewritten);
      setLoading(false);
    }, 1500);
  };

  if (!value) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowOptions(!showOptions)}
        disabled={loading}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            リライト中...
          </>
        ) : (
          <>AI リライト</>
        )}
      </button>
      {showOptions && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[160px]">
          {rewriteOptions.map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleRewrite(opt.label)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AiGuidedStep({ questions, answers, onAnswer, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState('');

  const handleNext = () => {
    if (!input.trim()) return;
    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.key]: input.trim() };
    onAnswer(newAnswers);
    setInput('');
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleSkip = () => {
    setInput('');
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(answers);
    }
  };

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">求人票作成アシスタント</div>
              <div className="text-xs text-gray-500">必要なのは「要件」だけ。魅力づけ・言葉選び・訴求の設計はAIが行います。</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-blue-200/50 rounded-full">
              <div
                className="h-1.5 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-blue-600 font-medium">{currentQ + 1}/{questions.length}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">Q</span>
              </div>
              <p className="text-[15px] font-medium text-gray-800">{q.question}</p>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={q.placeholder}
              className="w-full p-4 border border-gray-200 rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleNext(); } }}
              autoFocus
            />
          </div>

          {Object.keys(answers).length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="text-xs font-medium text-gray-400 mb-2">これまでの回答</div>
              {questions.slice(0, currentQ).map(prevQ => answers[prevQ.key] ? (
                <div key={prevQ.key} className="flex gap-2 text-xs">
                  <span className="text-gray-400 flex-shrink-0">{prevQ.question.replace(/？$/, '')}:</span>
                  <span className="text-gray-600">{answers[prevQ.key]}</span>
                </div>
              ) : null)}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              スキップ
            </button>
            <div className="flex gap-2">
              {currentQ > 0 && (
                <button
                  type="button"
                  onClick={() => { setCurrentQ(currentQ - 1); setInput(answers[questions[currentQ - 1].key] || ''); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  戻る
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!input.trim()}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentQ < questions.length - 1 ? '次へ' : 'ドラフト生成'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiGeneratingStep({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    '要件を構造化しています...',
    '近隣の競合求人と比較し、差別化ポイントを特定しています...',
    '回答に埋もれた「隠れた魅力」を発掘しています...',
    '求職者目線でキャッチコピーと訴求の順序を設計しています...',
  ];

  useState(() => {
    const timers = [];
    timers.push(setTimeout(() => setStep(1), 1100));
    timers.push(setTimeout(() => setStep(2), 2200));
    timers.push(setTimeout(() => setStep(3), 3300));
    timers.push(setTimeout(() => onDone(), 4600));
    return () => timers.forEach(clearTimeout);
  });

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">AIが求人を魅力化しています</h2>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < step ? (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : i === step ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
              )}
              <span className={`text-sm ${i <= step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AIが「要件」から創意工夫した内容の説明（デモ用）
const enhancementReport = [
  {
    tag: '魅力への転換',
    text: '「新規開設」という事実を「立ち上げメンバーとして透析キャリアをゼロから築ける」という応募動機に転換しました。',
  },
  {
    tag: '市場比較',
    text: '年間休日123日は近隣同規模病院の平均（約115日）を上回るため、キャッチコピー直下の訴求に配置しました。',
  },
  {
    tag: 'ターゲット拡張',
    text: '透析経験者だけでなく「急性期からワークライフバランス重視で転向したい層」にも刺さる文面にしています。',
  },
  {
    tag: '不安の先回り',
    text: '未経験者の「ついていけるか」という不安に対し、教育・指導体制への言及を業務内容の直後に配置しました。',
  },
];

const enhancementTagStyle = {
  '魅力への転換': 'bg-blue-100 text-blue-700',
  '市場比較': 'bg-emerald-100 text-emerald-700',
  'ターゲット拡張': 'bg-violet-100 text-violet-700',
  '不安の先回り': 'bg-amber-100 text-amber-700',
};

// AIからの逆提案: ワンクリックでドラフトに反映できる
const aiSuggestions = [
  {
    id: 'sug-1',
    text: '院内見学・カジュアル面談を受け入れ可能なら、選考フローに追加すると応募のハードルが下がります。',
    field: 'selectionFlow',
    value: '書類選考 → カジュアル面談・見学（任意） → 面接 → 内定',
  },
  {
    id: 'sug-2',
    text: '未経験者向けに独り立ちまでの目安期間を明記すると、応募をためらう層を取り込めます。',
    field: 'preferred',
    value: '透析経験者歓迎（未経験の方も約3ヶ月の教育プログラムで独り立ちできるよう丁寧に指導します）',
  },
];

function AiEnhancementPanel({ onApply }) {
  const [applied, setApplied] = useState([]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mb-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">AI</span>
        </div>
        <h2 className="text-sm font-bold text-gray-800">AI魅力化レポート</h2>
      </div>
      <p className="text-xs text-gray-500 mb-4 ml-8">
        いただいた要件から、AIが以下の創意工夫でこのドラフトを設計しました
      </p>

      <div className="space-y-2.5 mb-5">
        {enhancementReport.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 bg-white/70 rounded-lg p-3">
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${enhancementTagStyle[item.tag]}`}>
              {item.tag}
            </span>
            <span className="text-xs text-gray-700 leading-relaxed">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-blue-100 pt-4">
        <div className="text-xs font-semibold text-blue-700 mb-2.5">💡 AIからの提案 — さらに魅力を高めるには</div>
        <div className="space-y-2.5">
          {aiSuggestions.map(sug => {
            const isApplied = applied.includes(sug.id);
            return (
              <div key={sug.id} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-100">
                <span className="text-xs text-gray-700 leading-relaxed flex-1">{sug.text}</span>
                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => { onApply(sug.field, sug.value); setApplied(prev => [...prev, sug.id]); }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    isApplied
                      ? 'bg-emerald-50 text-emerald-600 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isApplied ? '✓ 反映済み' : 'ドラフトに反映'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const fieldLabels = {
  title: '求人タイトル',
  catchCopy: 'キャッチコピー',
  department: '配属先',
  employmentType: '雇用形態',
  headcount: '募集人数',
  urgency: '緊急度',
  facility: '施設名',
  address: '所在地',
  access: 'アクセス',
  duties: '業務内容',
  requirements: '必須要件',
  preferred: '歓迎要件',
  workSchedule: '勤務時間',
  salary: '給与',
  salaryDetail: '昇給・賞与',
  allowances: '手当',
  holidays: '休日',
  paidLeave: '有給休暇',
  specialLeave: '特別休暇',
  benefits: '福利厚生',
  housing: '住居支援',
  childcare: '育児支援',
  appealPoints: 'アピールポイント',
  selectionFlow: '選考フロー',
  contactName: '担当者名',
  contactDepartment: '担当部署',
  contactPhone: '電話番号',
};

const formLayout = [
  {
    section: '基本情報',
    fields: [
      { key: 'title', type: 'text' },
      { key: 'catchCopy', type: 'text' },
      { key: 'department', type: 'text' },
      { key: 'employmentType', type: 'select', options: ['正社員', 'パート・アルバイト', '契約社員', '正社員・パート', '派遣'] },
      { key: 'headcount', type: 'text' },
      { key: 'urgency', type: 'select', options: ['high:急募', 'medium:通常', 'low:低'] },
    ],
  },
  {
    section: '施設情報',
    fields: [
      { key: 'facility', type: 'text' },
      { key: 'address', type: 'text' },
      { key: 'access', type: 'textarea' },
    ],
  },
  {
    section: '業務内容・要件',
    rewritable: true,
    fields: [
      { key: 'duties', type: 'textarea' },
      { key: 'requirements', type: 'textarea' },
      { key: 'preferred', type: 'textarea' },
    ],
  },
  {
    section: '勤務条件',
    fields: [
      { key: 'workSchedule', type: 'textarea' },
      { key: 'salary', type: 'text' },
      { key: 'salaryDetail', type: 'text' },
      { key: 'allowances', type: 'textarea' },
    ],
  },
  {
    section: '休日・休暇',
    fields: [
      { key: 'holidays', type: 'text' },
      { key: 'paidLeave', type: 'text' },
      { key: 'specialLeave', type: 'textarea' },
    ],
  },
  {
    section: '福利厚生',
    rewritable: true,
    fields: [
      { key: 'benefits', type: 'textarea' },
      { key: 'housing', type: 'text' },
      { key: 'childcare', type: 'text' },
    ],
  },
  {
    section: 'アピールポイント',
    rewritable: true,
    fields: [
      { key: 'appealPoints', type: 'textarea' },
    ],
  },
  {
    section: '選考・連絡先',
    fields: [
      { key: 'selectionFlow', type: 'text' },
      { key: 'contactName', type: 'text' },
      { key: 'contactDepartment', type: 'text' },
      { key: 'contactPhone', type: 'text' },
    ],
  },
];

export default function NewJob() {
  const router = useRouter();
  const [phase, setPhase] = useState('choose');
  const [aiAnswers, setAiAnswers] = useState({});
  const [form, setForm] = useState({});
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleAiComplete = () => {
    setForm({ ...generatedDraft });
    setPhase('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('求人票を保存しました（デモ）');
    router.push('/booster/jobs');
  };

  return (
    <BoosterLayout current="jobs">
      {phase === 'choose' && (
        <div className="max-w-2xl mx-auto mt-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-800 mb-2">新規求人作成</h1>
            <p className="text-sm text-gray-500">作成方法を選択してください</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setPhase('ai-questions')}
              className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 p-6 text-left hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-xl font-bold text-blue-600">AI</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">AIアシスト作成</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                要件を4問答えるだけ。AIが市場比較と創意工夫で「選ばれる求人票」に魅力化して仕上げます。
              </p>
              <div className="mt-4 text-xs text-blue-600 font-medium">おすすめ</div>
            </button>
            <button
              onClick={() => { setForm({}); setPhase('edit'); }}
              className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 text-left hover:border-gray-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">手動で作成</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                白紙の状態から求人票を作成します。各項目を自由に記入できます。AIリライト機能も利用可能です。
              </p>
              <div className="mt-4 text-xs text-gray-400 font-medium">テンプレートなし</div>
            </button>
          </div>
        </div>
      )}

      {phase === 'ai-questions' && (
        <AiGuidedStep
          questions={aiQuestions}
          answers={aiAnswers}
          onAnswer={setAiAnswers}
          onComplete={() => setPhase('ai-generating')}
        />
      )}

      {phase === 'ai-generating' && (
        <AiGeneratingStep onDone={handleAiComplete} />
      )}

      {phase === 'edit' && (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {Object.keys(aiAnswers).length > 0 ? 'AIドラフトを編集' : '新規求人作成'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {Object.keys(aiAnswers).length > 0
                  ? 'AIが生成したドラフトです。内容を確認・修正してください。'
                  : '求人票を作成し、紹介会社・媒体へ配信できます。'}
              </p>
            </div>
            {Object.keys(aiAnswers).length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                AI生成済み
              </div>
            )}
          </div>

          {Object.keys(aiAnswers).length > 0 && (
            <AiEnhancementPanel onApply={(field, value) => updateField(field, value)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {formLayout.map(section => (
              <div key={section.section} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-700">{section.section}</h2>
                  {section.rewritable && (
                    <div className="flex items-center gap-1 text-xs text-blue-500">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      AIリライト対応
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {section.fields.map(field => (
                    <div key={field.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {fieldLabels[field.key]}
                        </label>
                        {section.rewritable && (
                          <AiRewriteButton
                            field={field.key}
                            value={form[field.key] || ''}
                            onRewrite={(k, v) => updateField(k, v)}
                          />
                        )}
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={form[field.key] || ''}
                          onChange={e => updateField(field.key, e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={form[field.key] || ''}
                          onChange={e => updateField(field.key, e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                          <option value="">選択してください</option>
                          {field.options.map(opt => {
                            const [val, label] = opt.includes(':') ? opt.split(':') : [opt, opt];
                            return <option key={val} value={val}>{label}</option>;
                          })}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={form[field.key] || ''}
                          onChange={e => updateField(field.key, e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                配信先（紹介会社）
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
                      <div className="text-xs text-gray-500">{ag.contact} / {ag.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                配信先（求人媒体）
              </h2>
              <div className="space-y-2">
                {sampleMediaPlatforms.filter(m => m.status === 'active').map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMedia.includes(m.id)}
                      onChange={e => setSelectedMedia(prev =>
                        e.target.checked ? [...prev, m.id] : prev.filter(id => id !== m.id)
                      )}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.type} / {m.costModel}</div>
                    </div>
                    {m.apiAvailable && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">API連携</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pb-8">
              <button
                type="button"
                onClick={() => router.push('/booster/jobs')}
                className="px-6 py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => alert('下書き保存しました（デモ）')}
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
      )}
    </BoosterLayout>
  );
}
