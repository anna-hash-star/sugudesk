// SuguDesk 採用業務代行プロトタイプ用モックデータ
// 個人情報非保持の設計：候補者は媒体内匿名IDのみ

export const clinics = [
  {
    id: 'luna_ladies',
    name: 'Luna Ladies Clinic',
    specialty: '婦人科',
    status: 'パイロット中',
    targetRoles: ['看護師', '助産師', '医療事務'],
    mediaConfig: [
      { name: 'Indeed', budget: 150000, type: '有料掲載' },
      { name: 'ジョブメドレー', budget: 0, type: '成果報酬' },
      { name: '看護roo!', budget: 0, type: '成果報酬' },
      { name: 'マイナビ看護師', budget: 0, type: '紹介会社' },
    ],
    scoutQuota: { 'ジョブメドレー': 50, '看護roo!': 45, 'Indeed PLUS': 20 },
    appeal: '地域密着、患者との距離が近い、教育制度充実',
    contactName: '院長様 / 事務長様',
  },
  {
    id: 'adeb',
    name: 'AdeBクリニック',
    specialty: '美容皮膚科',
    status: 'パイロット中',
    targetRoles: ['看護師（美容経験）', '受付'],
    mediaConfig: [
      { name: 'Indeed', budget: 100000, type: '有料掲載' },
      { name: '看護roo! 美容', budget: 50000, type: '有料掲載' },
    ],
    scoutQuota: { '看護roo! 美容': 30, 'Indeed PLUS': 15 },
    appeal: '個人院ならではの裁量、最新機器導入、インセンティブ充実',
    contactName: '院長様',
  },
  {
    id: 'mikasa',
    name: '三笠クリニック',
    specialty: '内科',
    status: 'ヒアリング待ち',
    targetRoles: [],
    mediaConfig: [],
    scoutQuota: {},
    appeal: '',
    contactName: '院長様',
  },
];

// 候補者データ（個人情報なし、媒体内匿名IDのみ）
export const candidates = {
  luna_ladies: [
    { id: 'indeed_a8f3', media: 'Indeed', role: '看護師', status: '応募', updatedAt: '2026-05-28', memo: '常勤希望、経験7年' },
    { id: 'indeed_b2k1', media: 'Indeed', role: '医療事務', status: '応募', updatedAt: '2026-05-29', memo: '未経験' },
    { id: 'indeed_c5d4', media: 'Indeed', role: '看護師', status: '書類選考', updatedAt: '2026-05-25', memo: '経験10年、希望給与応相談' },
    { id: 'jobmedley_x1', media: 'ジョブメドレー', role: '看護師', status: '面接予定', updatedAt: '2026-05-30', memo: '6/15(土)14:00 面接予定' },
    { id: 'jobmedley_x2', media: 'ジョブメドレー', role: '医療事務', status: '面接実施', updatedAt: '2026-05-27', memo: '面接通過、書類待ち' },
    { id: 'kango_y1', media: '看護roo!', role: '看護師', status: '内定', updatedAt: '2026-05-26', memo: '入職予定 6/15' },
    { id: 'mynavi_z1', media: 'マイナビ看護師', role: '看護師', status: '不採用', updatedAt: '2026-05-20', memo: '希望給与折り合わず' },
    { id: 'indeed_d7e2', media: 'Indeed', role: '受付', status: '応募', updatedAt: '2026-05-31', memo: 'パート希望' },
    { id: 'jobmedley_x3', media: 'ジョブメドレー', role: '看護師', status: '応募', updatedAt: '2026-05-30', memo: 'スカウト返信からの応募' },
  ],
  adeb: [
    { id: 'indeed_e3f4', media: 'Indeed', role: '看護師', status: '応募', updatedAt: '2026-05-28', memo: '美容経験あり' },
    { id: 'kango_v2', media: '看護roo! 美容', role: '看護師', status: '面接予定', updatedAt: '2026-05-30', memo: '6/12(水)18:00 面接予定' },
    { id: 'indeed_f6h2', media: 'Indeed', role: '受付', status: '不採用', updatedAt: '2026-05-15', memo: '通勤距離理由で辞退' },
  ],
  mikasa: [],
};

export const STATUSES = ['応募', '書類選考', '面接予定', '面接実施', '内定', '採用', '不採用'];

export const scoutTemplates = [
  {
    id: 'A',
    name: 'パターンA：経験活用訴求',
    subject: '経験を活かしませんか？',
    body: '看護師としての経験を活かして、地域に密着したクリニックで働きませんか？\n\n当院は患者様一人ひとりにじっくり向き合う診療を大切にしており、教育制度も充実しています。\n\nご経験のある方には、それに見合った待遇とポジションをご用意しています。\n\nぜひ一度、当院の働き方をご覧いただければと思います。',
    stats: { open: 62, reply: 18 },
  },
  {
    id: 'B',
    name: 'パターンB：ワークライフバランス訴求',
    subject: 'ワークライフバランスを大切にする職場',
    body: '当院は週休2日制、有給取得率100%、残業ほぼなしの働きやすい環境です。\n\nお子様の予定や生活との両立がしやすく、長く働けるクリニックを目指しています。\n\n託児施設の利用補助制度もあり、子育て中の看護師さんも多く活躍中です。',
    stats: { open: 58, reply: 13 },
  },
  {
    id: 'C',
    name: 'パターンC：教育充実訴求',
    subject: '専門スキルが身につく職場',
    body: '当院は学会参加・研修費用を全額補助しており、専門スキルを伸ばしながら働けます。\n\n経験豊富な医師・先輩看護師からの指導が受けられ、医療職としてのキャリアを一緒に築いていきましょう。',
    stats: { open: 0, reply: 0 },
  },
];

// スカウト送信履歴（集計値のみ、個人情報なし）
export const scoutHistory = {
  luna_ladies: [
    { date: '2026-05-31', media: 'ジョブメドレー', pattern: 'A', status: '送信完了' },
    { date: '2026-05-31', media: '看護roo!', pattern: 'A', status: '送信完了' },
    { date: '2026-05-31', media: '看護roo!', pattern: 'A', status: '送信完了' },
    { date: '2026-05-30', media: 'ジョブメドレー', pattern: 'B', status: '送信完了' },
    { date: '2026-05-30', media: 'Indeed PLUS', pattern: 'A', status: '送信完了' },
  ],
  adeb: [
    { date: '2026-05-31', media: '看護roo! 美容', pattern: 'A', status: '送信完了' },
  ],
  mikasa: [],
};

// 月次レポートデータ
export const monthlyReports = {
  luna_ladies: {
    clinicName: 'Luna Ladies Clinic',
    month: '2026年5月分',
    issuedAt: '2026年6月3日',
    operator: 'SuguDesk オペレーションチーム',
    summary: {
      applications: 12,
      previousApplications: 9,
      interviews: 4,
      offers: 1,
      hires: 1,
      totalCost: 168000,
      mediaCost: 150000,
      referralFee: 0,
      sugudeskFee: 80000,
      cph: 248000,
      cpa: 14000,
    },
    media: [
      { name: 'Indeed', applications: 6, interviews: 2, hires: 1, cost: 150000, cpa: 25000 },
      { name: 'ジョブメドレー', applications: 4, interviews: 1, hires: 0, cost: 0, cpa: 0 },
      { name: '看護roo!', applications: 2, interviews: 1, hires: 0, cost: 0, cpa: 0 },
    ],
    scout: [
      { media: '看護roo!', sent: 45, opened: 28, replied: 8, replyRate: 17.7 },
      { media: 'ジョブメドレー', sent: 38, opened: 22, replied: 5, replyRate: 13.1 },
      { media: 'Indeed PLUS', sent: 17, opened: 9, replied: 2, replyRate: 11.7 },
    ],
    abTest: {
      A: { open: 62, reply: 18 },
      B: { open: 58, reply: 13 },
      conclusion: '来月はパターンAをベースに継続、変化球でCを試行',
    },
    suggestions: [
      { title: 'Indeedの予算を月¥150,000 → ¥195,000 へ増額', reason: 'CPA¥25,000は業界相場¥30-40kより良好。予算増で応募数増が見込める。' },
      { title: '看護roo!のスカウトターゲット条件を変更', reason: '現状の経験10年以上から経験3-10年に拡大。返信者の8割が経験5-8年層で、10年超の反応は薄い。' },
      { title: 'ジョブメドレーの掲載文面を更新', reason: '応募4件中、面接1件・採用0件で転換率が低い。応募者の質を上げるため求める要件を明文化。' },
    ],
    onboarding: [
      { name: '田中様', role: '看護師パート', joinedAt: '2026-04-15', status: '1ヶ月チェックイン完了：状況良好', nextCheckin: '7月中旬（3ヶ月）' },
    ],
    nextMonthPlan: {
      scoutPlan: [
        { media: '看護roo!', count: 50, note: 'パターンA × 30、C × 20' },
        { media: 'ジョブメドレー', count: 40, note: '' },
        { media: 'Indeed PLUS', count: 20, note: '' },
      ],
      budgetProposal: [
        { item: 'Indeed', amount: 195000 },
        { item: '看護roo! オプション', amount: 30000 },
      ],
    },
    nextMtg: { date: '6/10（火）', time: '14:00-14:30', location: 'Google Meet' },
  },
  adeb: {
    clinicName: 'AdeBクリニック',
    month: '2026年5月分',
    issuedAt: '2026年6月3日',
    operator: 'SuguDesk オペレーションチーム',
    summary: {
      applications: 8,
      previousApplications: 5,
      interviews: 2,
      offers: 0,
      hires: 0,
      totalCost: 230000,
      mediaCost: 150000,
      referralFee: 0,
      sugudeskFee: 80000,
      cph: 0,
      cpa: 28750,
    },
    media: [
      { name: 'Indeed', applications: 5, interviews: 1, hires: 0, cost: 100000, cpa: 20000 },
      { name: '看護roo! 美容', applications: 3, interviews: 1, hires: 0, cost: 50000, cpa: 16667 },
    ],
    scout: [
      { media: '看護roo! 美容', sent: 25, opened: 14, replied: 3, replyRate: 12.0 },
      { media: 'Indeed PLUS', sent: 12, opened: 6, replied: 1, replyRate: 8.3 },
    ],
    abTest: {
      A: { open: 56, reply: 12 },
      B: { open: 0, reply: 0 },
      conclusion: 'パターンBの試行を来月実施',
    },
    suggestions: [
      { title: '看護roo! 美容の掲載原稿を変更', reason: '応募3件のうち2件が美容未経験。求人原稿で経験要件を明確化することで応募者の質を改善。' },
      { title: 'スカウト送信数を増やす', reason: '現状月25通は少ない。月40通に増やして母集団拡大を推奨。' },
    ],
    onboarding: [],
    nextMonthPlan: {
      scoutPlan: [
        { media: '看護roo! 美容', count: 40, note: '' },
        { media: 'Indeed PLUS', count: 15, note: '' },
      ],
      budgetProposal: [
        { item: 'Indeed', amount: 100000 },
        { item: '看護roo! 美容', amount: 50000 },
      ],
    },
    nextMtg: { date: '6/12（木）', time: '15:00-15:30', location: 'Google Meet' },
  },
};

// 全院集計（オペダッシュボード用）
export const operatorAlerts = [
  { type: 'task', clinic: 'Luna Ladies Clinic', text: '月次レポート締切', dueDate: '6/3（火）' },
  { type: 'task', clinic: 'AdeBクリニック', text: 'スカウト送信予定 残25通', dueDate: '6/5（木）' },
  { type: 'task', clinic: '三笠クリニック', text: '初回ヒアリング日程調整', dueDate: '6/4（水）' },
  { type: 'alert', clinic: 'Luna Ladies Clinic', text: '田中様 1ヶ月チェックイン期日', dueDate: '6/15（土）' },
  { type: 'alert', clinic: 'AdeBクリニック', text: '来月予算未承認', dueDate: '6/2（月）' },
];

// ====================================================================
// v0.2 追加データ（紹介会社管理 / スカウト月次集計 / 院向け今日のアクション）
// ====================================================================

export const agencies = [
  {
    id: 'mynavi_kango',
    name: 'マイナビ看護師',
    contactPerson: '山田様',
    contactEmail: 'yamada@mynavi.example',
    feeRate: 30,
    contractStatus: '契約中',
    metrics: {
      introductions: 8,
      docPasses: 5,
      interviews: 3,
      hires: 1,
      totalFeePaid: 760000,
      avgReplyDays: 3.2,
    },
    requestHistory: [
      { date: '2026-05-15', request: '婦人科経験ある看護師、月給28万以上希望', status: '対応中' },
      { date: '2026-05-22', request: '応募者の経験浅すぎ、もう少し絞ってほしい', status: '対応済み' },
      { date: '2026-05-28', request: '土曜勤務可能な方を優先紹介してほしい', status: '対応中' },
    ],
  },
  {
    id: 'levaweru_kango',
    name: 'レバウェル看護',
    contactPerson: '佐藤様',
    contactEmail: 'sato@levaweru.example',
    feeRate: 25,
    contractStatus: '契約中',
    metrics: {
      introductions: 5,
      docPasses: 2,
      interviews: 1,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 4.8,
    },
    requestHistory: [
      { date: '2026-05-10', request: '産婦人科未経験でも構わないので経験5年以上', status: '対応済み' },
    ],
  },
  {
    id: 'kango_de_hatarako',
    name: 'ナースではたらこ',
    contactPerson: '鈴木様',
    contactEmail: 'suzuki@kdh.example',
    feeRate: 28,
    contractStatus: '契約中',
    metrics: {
      introductions: 3,
      docPasses: 1,
      interviews: 0,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 5.1,
    },
    requestHistory: [],
  },
];

export const monthlyScoutStats = {
  luna_ladies: {
    '2026-05': [
      { media: '看護roo!', sent: 45, opened: 28, replied: 8, replyRate: 17.7, byPattern: { A: { sent: 30, replied: 6 }, B: { sent: 15, replied: 2 } } },
      { media: 'ジョブメドレー', sent: 38, opened: 22, replied: 5, replyRate: 13.1, byPattern: { A: { sent: 20, replied: 3 }, B: { sent: 18, replied: 2 } } },
      { media: 'Indeed PLUS', sent: 17, opened: 9, replied: 2, replyRate: 11.7, byPattern: { A: { sent: 17, replied: 2 } } },
    ],
    '2026-04': [
      { media: '看護roo!', sent: 40, opened: 22, replied: 6, replyRate: 15.0, byPattern: { A: { sent: 40, replied: 6 } } },
      { media: 'ジョブメドレー', sent: 35, opened: 18, replied: 4, replyRate: 11.4, byPattern: { A: { sent: 35, replied: 4 } } },
    ],
  },
  adeb: {
    '2026-05': [
      { media: '看護roo! 美容', sent: 25, opened: 14, replied: 3, replyRate: 12.0, byPattern: { A: { sent: 25, replied: 3 } } },
      { media: 'Indeed PLUS', sent: 12, opened: 6, replied: 1, replyRate: 8.3, byPattern: { A: { sent: 12, replied: 1 } } },
    ],
  },
  mikasa: {},
};

// 院向け管理画面：今日のアクション
export const todayActions = {
  luna_ladies: {
    pendingDocReview: [
      { caseId: 'indeed_c5d4', role: '看護師', source: 'Indeed', daysWaiting: 3 },
      { caseId: 'kango_y1_doc', role: '看護師', source: '看護roo!', daysWaiting: 1 },
    ],
    upcomingInterviews: [
      { caseId: 'jobmedley_x1', role: '看護師', date: '2026-06-04', time: '14:00', source: 'ジョブメドレー' },
      { caseId: 'kango_v3', role: '助産師', date: '2026-06-06', time: '11:00', source: '看護roo!' },
    ],
    pendingHireDecision: [
      { caseId: 'jobmedley_x2', role: '医療事務', source: 'ジョブメドレー', interviewDate: '2026-05-30' },
    ],
    pendingCommunicationRequests: [
      { caseId: 'kango_y1', scene: '採用通知', requestedAt: '2026-06-02', status: 'AI下書き作成中' },
    ],
  },
  adeb: {
    pendingDocReview: [
      { caseId: 'indeed_e3f4', role: '看護師', source: 'Indeed', daysWaiting: 2 },
    ],
    upcomingInterviews: [
      { caseId: 'kango_v2', role: '看護師', date: '2026-06-12', time: '18:00', source: '看護roo! 美容' },
    ],
    pendingHireDecision: [],
    pendingCommunicationRequests: [],
  },
  mikasa: {
    pendingDocReview: [],
    upcomingInterviews: [],
    pendingHireDecision: [],
    pendingCommunicationRequests: [],
  },
};

// 媒体掲載費月次（CSV取り込み済みのモック）
export const monthlyMediaCost = {
  luna_ladies: {
    '2026-05': [
      { media: 'Indeed', cost: 150000, applications: 6, hires: 1, cpa: 25000 },
      { media: 'ジョブメドレー', cost: 0, applications: 4, hires: 0, cpa: 0 },
      { media: '看護roo!', cost: 0, applications: 2, hires: 0, cpa: 0 },
    ],
  },
  adeb: {
    '2026-05': [
      { media: 'Indeed', cost: 100000, applications: 5, hires: 0, cpa: 20000 },
      { media: '看護roo! 美容', cost: 50000, applications: 3, hires: 0, cpa: 16667 },
    ],
  },
};

// 面接成果物（過去のもの、モック）
export const interviewArtifacts = {
  luna_ladies: [
    {
      caseId: 'jobmedley_x2',
      type: 'debrief',
      createdAt: '2026-05-30',
      summary: '医療事務歴8年、レセプト経験豊富。患者対応も丁寧で当院の雰囲気にも合いそう。給与希望は当院の予算内。',
      strengths: ['レセプト業務の経験豊富', '丁寧な対応'],
      concerns: ['前職の退職理由がやや曖昧', '通勤時間がやや長い（45分）'],
      evaluation: '採用推奨',
    },
  ],
  adeb: [],
  mikasa: [],
};

// ====================================================================
// 院別×紹介会社の実績マトリクス（v0.2 改修：紹介会社実績を院別に管理）
// ====================================================================
export const agencyMetricsByClinic = {
  luna_ladies: {
    mynavi_kango: {
      introductions: 5,
      docPasses: 3,
      interviews: 2,
      hires: 1,
      totalFeePaid: 760000,
      avgReplyDays: 3.0,
      lastIntroductionDate: '2026-05-28',
      requestsActive: 2,
    },
    levaweru_kango: {
      introductions: 3,
      docPasses: 1,
      interviews: 1,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 4.5,
      lastIntroductionDate: '2026-05-15',
      requestsActive: 1,
    },
    kango_de_hatarako: {
      introductions: 2,
      docPasses: 0,
      interviews: 0,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 5.5,
      lastIntroductionDate: '2026-04-22',
      requestsActive: 0,
    },
  },
  adeb: {
    mynavi_kango: {
      introductions: 3,
      docPasses: 2,
      interviews: 1,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 3.5,
      lastIntroductionDate: '2026-05-20',
      requestsActive: 1,
    },
    levaweru_kango: {
      introductions: 2,
      docPasses: 1,
      interviews: 0,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 5.0,
      lastIntroductionDate: '2026-05-08',
      requestsActive: 0,
    },
    kango_de_hatarako: {
      introductions: 1,
      docPasses: 1,
      interviews: 0,
      hires: 0,
      totalFeePaid: 0,
      avgReplyDays: 4.5,
      lastIntroductionDate: '2026-05-18',
      requestsActive: 0,
    },
  },
  mikasa: {},
};

// 院別の紹介会社要望履歴（マスタ + 院別実績と分離）
export const agencyRequestsByClinic = {
  luna_ladies: {
    mynavi_kango: [
      { date: '2026-05-15', request: '婦人科経験ある看護師、月給28万以上希望', status: '対応中' },
      { date: '2026-05-22', request: '応募者の経験浅すぎ、もう少し絞ってほしい', status: '対応済み' },
      { date: '2026-05-28', request: '土曜勤務可能な方を優先紹介してほしい', status: '対応中' },
    ],
    levaweru_kango: [
      { date: '2026-05-10', request: '産婦人科未経験でも構わないので経験5年以上', status: '対応済み' },
      { date: '2026-05-25', request: '助産師資格保有者の紹介を増やしてほしい', status: '対応中' },
    ],
    kango_de_hatarako: [],
  },
  adeb: {
    mynavi_kango: [
      { date: '2026-05-12', request: '美容経験ある看護師希望', status: '対応中' },
    ],
    levaweru_kango: [],
    kango_de_hatarako: [],
  },
  mikasa: {},
};

// 院別×媒体の月次効果（CPA/CPH含む）
// 既存 monthlyMediaCost を拡張する形で別エクスポート
export const mediaMetricsByClinic = {
  luna_ladies: {
    '2026-05': [
      { media: 'Indeed', cost: 150000, applications: 6, interviews: 2, hires: 1, cpa: 25000, cph: 150000 },
      { media: 'ジョブメドレー', cost: 0, applications: 4, interviews: 1, hires: 0, cpa: 0, cph: 0, note: '成果報酬制（採用1件¥7.2万）' },
      { media: '看護roo!', cost: 0, applications: 2, interviews: 1, hires: 0, cpa: 0, cph: 0, note: '成果報酬制' },
    ],
    '2026-04': [
      { media: 'Indeed', cost: 150000, applications: 4, interviews: 1, hires: 0, cpa: 37500, cph: 0 },
      { media: 'ジョブメドレー', cost: 0, applications: 3, interviews: 1, hires: 1, cpa: 0, cph: 72000, note: '成果報酬¥7.2万' },
    ],
  },
  adeb: {
    '2026-05': [
      { media: 'Indeed', cost: 100000, applications: 5, interviews: 1, hires: 0, cpa: 20000, cph: 0 },
      { media: '看護roo! 美容', cost: 50000, applications: 3, interviews: 1, hires: 0, cpa: 16667, cph: 0 },
    ],
  },
  mikasa: {},
};

// ====================================================================
// 採用ファネル分析（経路別×ステージ別）
// HERP DataHub的な歩留まり可視化用
// ====================================================================
export const funnelByClinic = {
  luna_ladies: {
    period: '2026-04-01 〜 2026-05-31（2ヶ月）',
    sources: [
      {
        source: 'Indeed',
        category: '求人媒体',
        entry: 10, docPass: 4, interviewScheduled: 3, interviewDone: 2, offer: 1, hire: 1,
        active: 0, leadTimeDays: 18,
      },
      {
        source: 'ジョブメドレー',
        category: '求人媒体',
        entry: 7, docPass: 3, interviewScheduled: 2, interviewDone: 1, offer: 0, hire: 0,
        active: 2, leadTimeDays: null,
      },
      {
        source: '看護roo!',
        category: '求人媒体',
        entry: 4, docPass: 2, interviewScheduled: 1, interviewDone: 1, offer: 1, hire: 0,
        active: 1, leadTimeDays: null,
      },
      {
        source: 'マイナビ看護師',
        category: '紹介会社',
        entry: 5, docPass: 3, interviewScheduled: 2, interviewDone: 2, offer: 1, hire: 1,
        active: 0, leadTimeDays: 25,
      },
      {
        source: 'レバウェル看護',
        category: '紹介会社',
        entry: 3, docPass: 1, interviewScheduled: 1, interviewDone: 1, offer: 0, hire: 0,
        active: 0, leadTimeDays: null,
      },
      {
        source: 'ナースではたらこ',
        category: '紹介会社',
        entry: 2, docPass: 0, interviewScheduled: 0, interviewDone: 0, offer: 0, hire: 0,
        active: 0, leadTimeDays: null,
      },
      {
        source: 'スカウト返信',
        category: 'スカウト',
        entry: 15, docPass: 6, interviewScheduled: 4, interviewDone: 3, offer: 1, hire: 0,
        active: 2, leadTimeDays: null,
      },
    ],
    monthlyTrend: [
      { month: '3月', 応募: 6, 面接: 2, 採用: 0 },
      { month: '4月', 応募: 9, 面接: 3, 採用: 1 },
      { month: '5月', 応募: 12, 面接: 4, 採用: 1 },
    ],
  },
  adeb: {
    period: '2026-04-01 〜 2026-05-31（2ヶ月）',
    sources: [
      {
        source: 'Indeed',
        category: '求人媒体',
        entry: 8, docPass: 3, interviewScheduled: 2, interviewDone: 1, offer: 0, hire: 0,
        active: 1, leadTimeDays: null,
      },
      {
        source: '看護roo! 美容',
        category: '求人媒体',
        entry: 4, docPass: 2, interviewScheduled: 2, interviewDone: 1, offer: 0, hire: 0,
        active: 1, leadTimeDays: null,
      },
      {
        source: 'マイナビ看護師',
        category: '紹介会社',
        entry: 3, docPass: 2, interviewScheduled: 1, interviewDone: 1, offer: 0, hire: 0,
        active: 0, leadTimeDays: null,
      },
    ],
    monthlyTrend: [
      { month: '3月', 応募: 4, 面接: 1, 採用: 0 },
      { month: '4月', 応募: 5, 面接: 1, 採用: 0 },
      { month: '5月', 応募: 8, 面接: 2, 採用: 0 },
    ],
  },
  mikasa: { period: '', sources: [], monthlyTrend: [] },
};

// ====================================================================
// 院長依頼キュー（チャット駆動UXで院長から発生する依頼をオペが処理）
// ====================================================================
export const clinicRequests = [
  {
    id: 'req_001',
    clinicId: 'luna_ladies',
    clinicName: 'Luna Ladies Clinic',
    type: 'scout',
    summary: '看護師スカウト10件',
    detail: '職種：看護師 / 件数：10件 / テンプレ：パターンA / 条件：経験3-10年',
    requestedAt: '2026-06-03 09:42',
    status: '新規',
    priority: 'normal',
  },
  {
    id: 'req_002',
    clinicId: 'luna_ladies',
    clinicName: 'Luna Ladies Clinic',
    type: 'communication',
    summary: 'kango_y1 採用通知の作成',
    detail: '採用通知文の作成依頼。6/15入職予定で、初日9時集合の案内も含めて。',
    requestedAt: '2026-06-02 16:15',
    status: 'AI下書き作成中',
    priority: 'high',
  },
  {
    id: 'req_003',
    clinicId: 'adeb',
    clinicName: 'AdeBクリニック',
    type: 'doc_review_result',
    summary: '書類選考結果（3件）',
    detail: 'indeed_e3f4：通過、kango_v2：通過、indeed_f6h2：不通過',
    requestedAt: '2026-06-03 08:30',
    status: '対応中',
    priority: 'normal',
  },
  {
    id: 'req_004',
    clinicId: 'luna_ladies',
    clinicName: 'Luna Ladies Clinic',
    type: 'job_posting_update',
    summary: '求人内容の登録（医療事務）',
    detail: '職種：医療事務 / 人数：1名 / 雇用形態：パート / 給与：時給1300-1600円 / 求める経験：レセプト経験者歓迎、未経験可 / 院の魅力：教育充実、長く働ける環境',
    requestedAt: '2026-06-03 11:20',
    status: '新規',
    priority: 'normal',
  },
  {
    id: 'req_005',
    clinicId: 'adeb',
    clinicName: 'AdeBクリニック',
    type: 'agency_request',
    summary: 'マイナビ看護師に要望伝達',
    detail: '美容経験のある看護師を月3名以上紹介してほしい',
    requestedAt: '2026-06-02 14:00',
    status: '対応中',
    priority: 'normal',
  },
];

export const REQUEST_TYPES = {
  scout: { icon: '📤', label: 'スカウト依頼' },
  communication: { icon: '💬', label: '連絡文作成' },
  doc_review_result: { icon: '📋', label: '書類選考結果' },
  job_posting_update: { icon: '📝', label: '求人内容変更' },
  agency_request: { icon: '🤝', label: '紹介会社要望' },
  interview_debrief: { icon: '🎤', label: '面接振り返り' },
};

// ====================================================================
// 募集中の求人（院別、媒体別の出稿状況含む）
// ====================================================================
export const jobPostingsByClinic = {
  luna_ladies: [
    {
      id: 'jp_001',
      role: '看護師',
      employment: '常勤',
      headcount: 2,
      salary: '月給 28万〜35万円（経験考慮）',
      workHours: '平日 9:00-18:00（週休2日制、土曜午前あり）',
      requirements: '正看護師資格、経験3年以上、婦人科経験者歓迎',
      appeal: '地域密着型の温かい職場。患者様一人ひとりとじっくり向き合えるクリニックです。教育制度も充実しており、産婦人科未経験の方も活躍中。',
      postedTo: [
        { media: 'Indeed', status: '掲載中', postedAt: '2026-05-20' },
        { media: 'ジョブメドレー', status: '掲載中', postedAt: '2026-05-20' },
        { media: '看護roo!', status: '掲載中', postedAt: '2026-05-22' },
      ],
      lastUpdated: '2026-05-22',
      status: '募集中',
    },
    {
      id: 'jp_002',
      role: '医療事務',
      employment: 'パート',
      headcount: 1,
      salary: '時給 1,300〜1,600円',
      workHours: '週3日〜（応相談）',
      requirements: 'レセプト経験者歓迎、未経験可（教育あり）',
      appeal: '医療事務の経験を活かして長く働ける環境。残業ほぼなし。',
      postedTo: [
        { media: 'Indeed', status: '掲載中', postedAt: '2026-05-15' },
        { media: 'ジョブメドレー', status: '掲載中', postedAt: '2026-05-15' },
      ],
      lastUpdated: '2026-05-15',
      status: '募集中',
    },
    {
      id: 'jp_003',
      role: '助産師',
      employment: '常勤',
      headcount: 1,
      salary: '月給 32万〜40万円（経験考慮）',
      workHours: '平日 9:00-18:00',
      requirements: '助産師資格、経験5年以上歓迎',
      appeal: '産婦人科に特化したクリニック。専門スキルを存分に発揮できる環境。',
      postedTo: [
        { media: '看護roo!', status: '掲載中', postedAt: '2026-05-25' },
        { media: 'マイナビ看護師', status: '紹介依頼中', postedAt: '2026-05-26' },
      ],
      lastUpdated: '2026-05-26',
      status: '募集中',
    },
  ],
  adeb: [
    {
      id: 'jp_a01',
      role: '看護師（美容経験）',
      employment: '常勤',
      headcount: 1,
      salary: '月給 32万〜45万円 ＋ インセンティブ',
      workHours: '平日 10:00-19:00、土曜出勤あり',
      requirements: '正看護師資格、美容クリニック経験者優遇',
      appeal: '個人院ならではの裁量と最新機器。インセンティブ・教育制度充実。',
      postedTo: [
        { media: 'Indeed', status: '掲載中', postedAt: '2026-05-18' },
        { media: '看護roo! 美容', status: '掲載中', postedAt: '2026-05-18' },
      ],
      lastUpdated: '2026-05-18',
      status: '募集中',
    },
    {
      id: 'jp_a02',
      role: '受付',
      employment: 'パート',
      headcount: 1,
      salary: '時給 1,400〜1,700円',
      workHours: '週3日〜',
      requirements: '接客経験者歓迎、PC基本操作',
      appeal: '美容クリニックでの接客経験を積みたい方にも歓迎。',
      postedTo: [
        { media: 'Indeed', status: '掲載中', postedAt: '2026-05-10' },
      ],
      lastUpdated: '2026-05-10',
      status: '募集中',
    },
  ],
  mikasa: [],
};

// ====================================================================
// 求人詳細スキーマ（実物クリニック求人レベルの情報量）
// 既存の jobPostingsByClinic に対応する詳細データ
// ====================================================================
export const jobPostingDetails = {
  jp_001: {
    // 基本情報
    role: '看護師',
    employment: '常勤',
    headcount: 2,
    background: '事業拡大による増員募集',
    locations: ['Luna Ladies Clinic（婦人科）'],

    // 診療内容
    medicalScope: '婦人科一般診療（分娩・不妊治療・乳房関連は対象外）月経移動、生理不順、月経困難症、不正出血、婦人科健診、妊娠検査、ピル処方、ブライダルチェック',

    // 業務内容
    duties: '診療介助、バイタル管理、採血、手術補助、患者対応、器具洗浄・滅菌、電子カルテ入力',

    // 機器設備
    equipment: '電子カルテ（CLIUS）、オンライン予約システム、キャッシュレス決済、超音波検査装置、心電図、血圧脈波測定装置',

    // 必須条件
    requiredQualifications: ['正看護師免許'],
    requiredExperience: '臨床経験3年以上（精神科・リハビリ科は除く）',
    requiredSkills: '採血・筋肉注射・ルート確保を独力で実施可能、サーフロ留置・急変対応の経験',

    // 歓迎条件
    welcomedCondition: '婦人科経験者歓迎、産婦人科未経験者も可',
    notRequired: '1年未満での自己都合退職が2回未満の方',

    // 給与
    salaryBase: '月給295,000円〜（固定残業代30h分含む）',
    salaryFrame: '基本給 + 各種手当 + 賞与',
    overtime: '法定通り（固定残業超過分は別途支給）',
    bonus: '年2回',
    raise: '年1回',
    expectedAnnual: 'ご経験により応相談（年収例：5年目で約450万円）',

    // 勤務時間
    workHours: '10:00〜20:00',
    realWorkingHours: '実働9時間（休憩60分）',
    shiftType: 'シフト制',

    // 勤務地
    address: '東京都渋谷区...',
    access: 'JR渋谷駅 徒歩5分',

    // 休日
    daysOff: 'シフト制（月9〜11日）',
    annualHoliday: 120,
    paidLeave: '入社半年後に10日付与',
    specialLeave: '年末年始、有給、産前産後、育児休業、介護休業、子の看護休暇',

    // 福利厚生
    insurance: '健康保険、厚生年金、雇用保険、労災保険',
    uniform: '制服上衣支給、下衣黒系統パンツ各自',
    commute: '交通費別途支給',
    others: '美容施術スタッフ割引、社内勉強会補助、学会参加補助',

    // 試用期間
    trialPeriod: '6ヶ月（条件変更なし）',

    // 教育
    training: 'OJT、OFF-JT、フォローアップ体制あり、産婦人科未経験者向け研修プログラム完備',

    // 選考フロー
    selectionSteps: ['書類選考', '院長面談（対面 or オンライン）', 'オファー面談', 'スポット勤務（必要時）', '入職'],
    expectedLeadTime: '応募から内定まで平均1〜4週間',

    // 訴求
    appeal: '地域密着型、患者様一人ひとりに寄り添うケア、教育制度充実、産婦人科未経験者でも安心して学べる環境',
    cultureNotes: '人柄重視、明るく丁寧な対応ができる方、チーム協力できる方歓迎',

    // 院長プロフィール（任意）
    directorIntro: '婦人科専門医として10年以上の診療経験。患者様との対話を重視する診療スタイル。',

    // 出稿先（jobPostingsByClinic と連動）
    postedTo: [
      { media: 'Indeed', status: '掲載中', postedAt: '2026-05-20' },
      { media: 'ジョブメドレー', status: '掲載中', postedAt: '2026-05-20' },
      { media: '看護roo!', status: '掲載中', postedAt: '2026-05-22' },
    ],

    // 充足状況（オペが詰めるべき項目を可視化）
    fieldsStatus: {
      basicInfo: 'complete',
      duties: 'complete',
      qualifications: 'complete',
      salary: 'complete',
      workHours: 'complete',
      daysOff: 'complete',
      benefits: 'complete',
      trial: 'complete',
      training: 'partial',
      selection: 'complete',
      appeal: 'complete',
      directorIntro: 'pending', // オペヒアリング待ち
    },
  },
  jp_002: {
    role: '医療事務',
    employment: 'パート',
    headcount: 1,
    locations: ['Luna Ladies Clinic'],
    duties: '受付業務、患者対応、ご案内、会計、簡単な事務作業、院内整理整頓',
    requiredQualifications: [],
    requiredExperience: '社会人経験1年以上',
    requiredSkills: 'PC基本操作（文字入力）',
    welcomedCondition: 'レセプト経験者歓迎、明るく丁寧な対応ができる方',
    salaryBase: '時給1,300〜1,600円',
    workHours: '9:30〜18:30の間でシフト',
    realWorkingHours: '実働4〜7時間（応相談）',
    daysOff: 'シフト制（週3日〜）',
    annualHoliday: 120,
    insurance: '雇用保険、労災保険（条件次第で社会保険）',
    trialPeriod: '6ヶ月（条件変更なし）',
    training: 'OJTあり、未経験者向けマニュアル完備',
    selectionSteps: ['書類選考', '面接', '内定'],
    appeal: '長く働ける環境、教育充実、残業ほぼなし',
    postedTo: [
      { media: 'Indeed', status: '掲載中', postedAt: '2026-05-15' },
      { media: 'ジョブメドレー', status: '掲載中', postedAt: '2026-05-15' },
    ],
    fieldsStatus: {
      basicInfo: 'complete',
      salary: 'complete',
      workHours: 'partial',
      daysOff: 'partial',
      benefits: 'partial',
      training: 'pending',
      directorIntro: 'pending',
    },
  },
  jp_003: {
    role: '助産師',
    employment: '常勤',
    headcount: 1,
    locations: ['Luna Ladies Clinic'],
    duties: '助産師業務、診療介助、母体・胎児管理（分娩は院では行わないため、産科外来サポート中心）',
    requiredQualifications: ['助産師免許', '正看護師免許'],
    requiredExperience: '経験5年以上歓迎',
    salaryBase: '月給320,000〜400,000円（経験考慮）',
    appeal: '産婦人科に特化したクリニック、専門スキルを発揮できる環境',
    fieldsStatus: {
      basicInfo: 'complete',
      duties: 'partial',
      salary: 'complete',
      workHours: 'pending',
      daysOff: 'pending',
      benefits: 'pending',
      training: 'pending',
      selection: 'pending',
      directorIntro: 'pending',
    },
    postedTo: [
      { media: '看護roo!', status: '掲載中', postedAt: '2026-05-25' },
      { media: 'マイナビ看護師', status: '紹介依頼中', postedAt: '2026-05-26' },
    ],
  },
};
