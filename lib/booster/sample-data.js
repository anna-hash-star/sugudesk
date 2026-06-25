export const sampleJobs = [
  {
    id: 'job-001',
    title: '透析センター看護師',
    catchCopy: '県内最大級の民間病院でこれからのキャリアを築きませんか？',
    department: '透析センター（2025年7月新設）',
    employmentType: '正社員・パート',
    headcount: '2〜3名',
    urgency: 'high',
    status: 'active',

    facility: '一宮西病院（801床）',
    address: '愛知県一宮市開明字平1番地',
    access: [
      '車：職員用無料駐車場完備',
      '名鉄尾西線「開明駅」徒歩約10分',
      '一宮駅からバス約9分（病院前バス停あり）',
    ],

    duties: '透析業務全般。医師やMEと連携しながらセンター専任として勤務。判断や検査等にも看護師が積極的に介入でき、ルーティン化しづらい環境。',
    requirements: '正看護師免許',
    preferred: '透析経験者歓迎（未経験可）',

    workSchedule: [
      { label: '常勤・日勤', hours: '8:30〜17:20（休憩60分）' },
      { label: '常勤・遅番', hours: '11:00〜20:50（休憩60分）' },
      { label: 'パート', hours: '応相談' },
    ],

    salary: '経験年数・現年収により決定（年収400万円以上可）',
    salaryDetail: {
      partTime: '時給1,650円',
      raises: '年1回（4月）',
      bonus: '年2回（6月・12月、実績4.5ヶ月）',
    },
    allowances: ['通勤手当（上限50,000円）', '家族手当（該当者）', '夜勤手当'],

    holidays: 'シフト制（週休2日・祝日）',
    annualDaysOff: 123,
    paidLeave: '入職6ヶ月後に10日付与（最高20日）',
    specialLeave: ['慶弔', '産前産後', '育児休業', '介護休業', '子の看護休暇'],

    benefits: ['健康保険', '厚生年金', '労災保険', '雇用保険', '退職金制度', '財形貯蓄', '会員制リゾートホテル'],
    housing: '看護師寮あり（月13,000円）',
    childcare: '院内保育所あり（月・水・金 夜勤対応）',

    appealPoints: [
      '県内最大級の病床数（801床）',
      '2025年7月オープンの新施設で透析キャリアを構築',
      '看護師が判断・検査に積極介入できる環境',
      '年収400万円以上も目指せる待遇',
      '年間休日123日',
      '育児休業の取得実績多数（寮・託児所完備）',
      '幅広い年齢層、意見交換しやすい職場',
    ],

    selectionFlow: ['書類選考', '面接（見学同時可）', '内定'],
    contact: { name: '福島', department: '人事部', phone: '0586-48-0033' },

    agencies: ['マイナビ看護師', 'ナース人材バンク', 'レバウェル看護'],
    mediaPostings: ['Indeed', 'ジョブメドレー'],
    createdAt: '2026-06-10',
    updatedAt: '2026-06-20',
  },
  {
    id: 'job-002',
    title: '訪問看護師',
    catchCopy: '在宅医療の最前線で、患者さまの生活を支える仲間を募集',
    department: '訪問看護ステーション',
    employmentType: '正社員',
    headcount: '3名',
    urgency: 'medium',
    status: 'active',

    facility: '一宮西病院 訪問看護ステーション',
    address: '愛知県一宮市開明字平1番地',
    access: ['車：直行直帰可（車両貸与）', '名鉄尾西線「開明駅」徒歩約10分'],

    duties: '在宅療養中の患者様への訪問看護業務。1日4〜5件の訪問。多職種連携チームでのカンファレンスあり。',
    requirements: '看護師免許必須、臨床経験3年以上',
    preferred: '訪問看護経験、在宅医療経験',

    workSchedule: [
      { label: '日勤', hours: '9:00〜18:00（オンコール月4〜5回）' },
    ],

    salary: '月給30万〜38万円',
    salaryDetail: {
      raises: '年1回',
      bonus: '年2回',
    },
    allowances: ['通勤手当', 'オンコール手当', '訪問手当'],

    holidays: 'シフト制（週休2日）',
    annualDaysOff: 120,
    paidLeave: '入職6ヶ月後に10日付与',
    specialLeave: ['慶弔', '産前産後', '育児休業'],

    benefits: ['社会保険完備', '退職金制度', '車両貸与'],
    housing: '',
    childcare: '',

    appealPoints: [
      '直行直帰OK・残業ほぼなし',
      '未経験者には同行研修3ヶ月',
      '多職種連携で幅広いスキルが身につく',
      '地域包括ケアの中核を担うやりがい',
    ],

    selectionFlow: ['書類選考', '面接', '内定'],
    contact: { name: '福島', department: '人事部', phone: '0586-48-0033' },

    agencies: ['マイナビ看護師', 'ナース人材バンク'],
    mediaPostings: ['ジョブメドレー'],
    createdAt: '2026-06-15',
    updatedAt: '2026-06-22',
  },
  {
    id: 'job-003',
    title: '理学療法士',
    catchCopy: '症例数豊富な急性期〜回復期で、専門性を高めませんか？',
    department: 'リハビリテーション科',
    employmentType: '正社員',
    headcount: '1名',
    urgency: 'low',
    status: 'draft',

    facility: '一宮西病院（801床）',
    address: '愛知県一宮市開明字平1番地',
    access: ['車：無料駐車場完備', '名鉄尾西線「開明駅」徒歩約10分'],

    duties: '急性期から回復期まで幅広いリハビリテーションを担当。整形外科・脳外科の術後リハビリが中心。',
    requirements: '理学療法士免許必須',
    preferred: '急性期リハビリ経験、回復期リハビリ経験',

    workSchedule: [
      { label: '日勤', hours: '8:30〜17:30（日勤のみ）' },
    ],

    salary: '月給25万〜32万円',
    salaryDetail: {
      raises: '年1回',
      bonus: '年2回（3.8ヶ月）',
    },
    allowances: ['通勤手当', '資格手当'],

    holidays: '週休2日（日曜＋他1日）',
    annualDaysOff: 120,
    paidLeave: '入職6ヶ月後に10日付与',
    specialLeave: ['慶弔', '産前産後'],

    benefits: ['社会保険完備', '退職金制度', '学会参加費補助'],
    housing: '',
    childcare: '',

    appealPoints: [
      '症例数が豊富で専門性が磨ける',
      '専門資格取得支援制度あり',
      '日勤のみでワークライフバランス◎',
    ],

    selectionFlow: ['書類選考', '面接', '内定'],
    contact: { name: '福島', department: '人事部', phone: '0586-48-0033' },

    agencies: [],
    mediaPostings: [],
    createdAt: '2026-06-18',
    updatedAt: '2026-06-18',
  },
];

export const sampleAgencies = [
  { id: 'ag-001', name: 'マイナビ看護師', contact: '田中太郎', email: 'tanaka@mynavi-kaigo.example.com', phone: '03-1234-5678' },
  { id: 'ag-002', name: 'ナース人材バンク', contact: '鈴木花子', email: 'suzuki@nhb.example.com', phone: '03-2345-6789' },
  { id: 'ag-003', name: 'レバウェル看護', contact: '佐藤一郎', email: 'sato@leverages.example.com', phone: '03-3456-7890' },
  { id: 'ag-004', name: 'ナースではたらこ', contact: '山田美咲', email: 'yamada@dip.example.com', phone: '03-4567-8901' },
  { id: 'ag-005', name: 'MCナースネット', contact: '高橋健', email: 'takahashi@mc-nurse.example.com', phone: '03-5678-9012' },
];

export const sampleMediaPlatforms = [
  { id: 'media-001', name: 'Indeed', type: '総合求人', status: 'active', postings: 2, applicants: 8, monthlyCost: '¥48,000', costModel: 'クリック課金', url: 'indeed.com', apiAvailable: true },
  { id: 'media-002', name: 'ジョブメドレー', type: '医療特化', status: 'active', postings: 2, applicants: 5, monthlyCost: '¥0（成功報酬）', costModel: '成功報酬', url: 'jobmedley.com', apiAvailable: true },
  { id: 'media-003', name: 'コメディカルドットコム', type: '医療特化', status: 'active', postings: 1, applicants: 3, monthlyCost: '¥0（成功報酬）', costModel: '成功報酬', url: 'comedical.com', apiAvailable: false },
  { id: 'media-004', name: 'グッピー', type: '医療特化', status: 'paused', postings: 0, applicants: 1, monthlyCost: '¥33,000', costModel: '月額固定', url: 'guppy.jp', apiAvailable: false },
  { id: 'media-005', name: 'ハローワーク', type: '公共', status: 'active', postings: 3, applicants: 2, monthlyCost: '無料', costModel: '無料', url: 'hellowork.mhlw.go.jp', apiAvailable: false },
];

export const sampleCandidates = [
  {
    id: 'cand-001',
    name: '山本 真由美',
    jobId: 'job-001',
    agencyId: 'ag-001',
    source: 'agency',
    status: 'interview_scheduled',
    appliedAt: '2026-06-12',
    experience: '外科病棟5年（急性期300床）',
    hasResume: true,
    aiAnalysis: {
      matchScore: 82,
      summary: '外科病棟5年の経験あり。急性期300床での実務経験が求人要件と合致。夜勤経験も豊富で即戦力として期待できる。',
      strengths: ['外科病棟5年の即戦力', '急性期300床での経験', '電子カルテ操作に慣れている'],
      concerns: ['転職理由の確認が必要（短期離職の懸念）'],
      interviewPoints: ['前職の退職理由と今後のキャリアプラン', '夜勤頻度の希望（二交代制への対応可否）', 'プリセプター経験の有無'],
    },
    statusHistory: [
      { status: 'applied', date: '2026-06-12', note: 'マイナビ看護師経由で推薦' },
      { status: 'document_passed', date: '2026-06-13', note: '書類通過' },
      { status: 'interview_scheduled', date: '2026-06-15', note: '6/20 14:00 面接設定' },
    ],
  },
  {
    id: 'cand-002',
    name: '田中 さくら',
    jobId: 'job-001',
    agencyId: 'ag-002',
    source: 'agency',
    status: 'offered',
    appliedAt: '2026-06-10',
    experience: '外科・ICU計7年',
    hasResume: true,
    aiAnalysis: {
      matchScore: 94,
      summary: '外科病棟とICUで計7年の豊富な経験。急性期看護のスペシャリスト。リーダー経験もあり、即戦力かつチームへの貢献が期待できる。',
      strengths: ['外科+ICU計7年の豊富な臨床経験', 'リーダー・プリセプター経験あり', '認定看護師取得に向けて学習中'],
      concerns: ['給与面の期待値がやや高い可能性'],
      interviewPoints: ['希望年収と現年収の確認', '認定看護師取得への支援希望の有無', 'ICUから病棟への異動に対する考え'],
    },
    statusHistory: [
      { status: 'applied', date: '2026-06-10', note: 'ナース人材バンク経由で推薦' },
      { status: 'document_passed', date: '2026-06-10', note: '即日書類通過' },
      { status: 'interview_completed', date: '2026-06-14', note: '面接実施、評価◎' },
      { status: 'offered', date: '2026-06-14', note: '当日内定提示' },
    ],
  },
  {
    id: 'cand-003',
    name: '佐々木 健一',
    jobId: 'job-002',
    agencyId: 'ag-001',
    source: 'agency',
    status: 'applied',
    appliedAt: '2026-06-20',
    experience: '急性期病棟4年、訪問看護1年',
    hasResume: true,
    aiAnalysis: {
      matchScore: 71,
      summary: '急性期病棟4年の基盤に加え訪問看護1年の経験あり。訪問看護の実務経験があるが期間が短い。在宅医療への適性は確認が必要。',
      strengths: ['急性期の臨床経験が基盤にある', '訪問看護の実務経験あり', '多職種連携の経験'],
      concerns: ['訪問看護経験が1年と短い', 'オンコール対応への耐性が未知数'],
      interviewPoints: ['訪問看護を続けたい理由', 'オンコール対応の経験と許容範囲', '運転免許の有無と訪問エリアの希望'],
    },
    statusHistory: [
      { status: 'applied', date: '2026-06-20', note: 'マイナビ看護師経由' },
    ],
  },
  {
    id: 'cand-004',
    name: '高橋 ゆき',
    jobId: 'job-001',
    agencyId: 'ag-003',
    source: 'agency',
    status: 'ng',
    appliedAt: '2026-06-08',
    experience: '内科病棟3年',
    hasResume: true,
    aiAnalysis: {
      matchScore: 38,
      summary: '内科病棟3年の経験だが、求人が求める外科経験がない。基本的な看護スキルは備えているが、外科病棟での即戦力としては難しい。',
      strengths: ['看護基礎スキルは問題なし', '患者対応の評判が良い'],
      concerns: ['外科経験がゼロ', '臨床年数が要件の3年ギリギリ'],
      interviewPoints: [],
    },
    ngReason: {
      category: 'experience_mismatch',
      detail: '外科経験なし',
      feedbackSent: true,
    },
    statusHistory: [
      { status: 'applied', date: '2026-06-08', note: 'レバウェル看護経由' },
      { status: 'interview_completed', date: '2026-06-12', note: '面接実施' },
      { status: 'ng', date: '2026-06-12', note: '面接NG: 外科経験なし、基本スキルは問題ないが即戦力としては難しい' },
    ],
  },
  {
    id: 'cand-005',
    name: '中村 あおい',
    jobId: 'job-001',
    source: 'media',
    mediaId: 'media-002',
    status: 'document_passed',
    appliedAt: '2026-06-22',
    experience: '外科病棟3年、手術室2年',
    hasResume: true,
    aiAnalysis: {
      matchScore: 88,
      summary: '外科病棟3年に加え手術室2年の経験。オペ前後の患者管理に精通しており、外科病棟での即戦力として高く評価できる。',
      strengths: ['外科+手術室で計5年の専門経験', '術前術後管理のスキル', '急性期での実績'],
      concerns: ['前職の退職から3ヶ月のブランクあり'],
      interviewPoints: ['ブランク期間の過ごし方', '手術室から病棟へ戻る理由', '夜勤シフトへの対応可否'],
    },
    statusHistory: [
      { status: 'applied', date: '2026-06-22', note: 'ジョブメドレー経由で応募' },
      { status: 'document_passed', date: '2026-06-23', note: 'AI分析スコア88点、書類通過' },
    ],
  },
];

export const ngReasonCategories = [
  {
    id: 'experience_mismatch',
    label: '経験・スキル不足',
    subcategories: ['必要な診療科経験なし', '臨床年数不足', '必要な資格なし', 'スキルレベル不足'],
  },
  {
    id: 'culture_fit',
    label: '組織風土とのミスマッチ',
    subcategories: ['コミュニケーションスタイル', 'チームワーク志向の違い', '働き方の価値観'],
  },
  {
    id: 'conditions_mismatch',
    label: '条件面の不一致',
    subcategories: ['給与希望が合わない', '勤務形態が合わない', '通勤距離', '入職時期が合わない'],
  },
  {
    id: 'motivation',
    label: '志望動機・意欲',
    subcategories: ['志望理由が不明確', '長期就業の意思が不明', '他院優先の印象'],
  },
  {
    id: 'other_decided',
    label: '他院で決定',
    subcategories: ['候補者辞退（他院内定）', '候補者辞退（現職残留）', '候補者辞退（その他）'],
  },
  {
    id: 'other',
    label: 'その他',
    subcategories: ['面接無断欠席', '連絡不通', 'その他'],
  },
];

export const candidateStatuses = {
  applied: { label: '推薦受付', color: '#6b7280', bg: '#f3f4f6' },
  document_passed: { label: '書類通過', color: '#2563eb', bg: '#eff6ff' },
  interview_scheduled: { label: '面接予定', color: '#7c3aed', bg: '#f5f3ff' },
  interview_completed: { label: '面接済', color: '#0891b2', bg: '#ecfeff' },
  offered: { label: '内定', color: '#059669', bg: '#ecfdf5' },
  accepted: { label: '内定承諾', color: '#047857', bg: '#d1fae5' },
  joined: { label: '入職', color: '#065f46', bg: '#a7f3d0' },
  ng: { label: 'NG', color: '#dc2626', bg: '#fef2f2' },
  withdrawn: { label: '辞退', color: '#9ca3af', bg: '#f9fafb' },
};
