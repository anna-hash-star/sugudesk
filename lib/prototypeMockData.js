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
