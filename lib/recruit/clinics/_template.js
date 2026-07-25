// クリニック・データ雛形。新しいクリニックを追加するときは、このファイルを
//   lib/recruit/clinics/<slug>.js にコピーして各項目を埋める。
// 実例は adeb.js / luna.js。追加後は clinics/index.js に import と CLINICS 登録を1行ずつ足す。
// （このファイル自体は index.js に登録しないので、ビルド対象にはならない）

export const clinic = {
  name: '◯◯クリニック',                 // 正式名称（JobPosting等に使用）
  enName: 'CLINIC RECRUIT',              // 英字（OGP等・任意）
  shortName: '◯◯クリニック',             // ヘッダー等の短い表示名
  tagline: 'キャッチコピー。',            // ヒーロー見出し。\n で改行可
  lead: '採用の一言説明（誰に・何を・どこで）。',
  station: '最寄駅 徒歩◯分',
  holiday: '休日の要点（例：年間休日120日）',
  address: '所在地の要約（フッター表示）',
  headquartersAddress: '',               // 代表院の正式住所（任意）
  corporation: '正式な開設者名／法人名',
  patientSiteUrl: 'https://example.com/',// 患者さま向けサイト
  phone: '',                             // 採用問い合わせ電話（任意）
  recruitContact: '採用担当',
  gaId: '',                              // GA4 測定ID（例 G-XXXXXXXXXX）。設定した時だけ計測

  // --- 応募導線（どちらか）---
  // applyForm: { endpoint: 'https://script.google.com/.../exec' }, // 自作フォーム（Apps Script）
  applyFormUrl: '',                      // Googleフォーム等。applyForm があればそちら優先
  applyByPhone: false,                   // 「お電話でも応募できます」等を出さない場合 false

  // --- チャット ---
  chatWidget: {},                        // SuguDesk常駐なら { src, key }。無しは {}（未設定にしない）

  // --- 見た目 ---
  themeClass: 'theme-<slug>',            // styles/globals.css に .theme-<slug> を定義
  heroDecor: '',                         // 'soft-pink' でファーストビュー装飾＋浮遊する円
  logoMark: '',                          // 専用ロゴ分岐（adeb等）。通常は空
  logo: '',                              // ヘッダー横組みロゴ /recruit-photos/<slug>-logo.png
  markIcon: '',                          // クリニック名左のマーク（任意）
  favicon: '',                           // /recruit-photos/<slug>-favicon.png（未設定はデフォルト）
  heroScene: 'clinic',                   // 写真が無いときの代替イラスト
  photos: {
    hero: '',                            // /recruit-photos/<slug>-hero.jpg（未配置はイラスト）
    director: '',                        // /recruit-photos/<slug>-director.jpg
  },
  gallery: [                             // 院内ギャラリー（任意）
    // { src: '/recruit-photos/<slug>-1.jpg', caption: '受付' },
  ],
  postedAt: '2026-01-01',                // 求人掲載日（JobPosting）
  badges: ['要点1', '要点2', '要点3'],    // ヒーローの働きやすさタグ
  statsHeadline: '◯◯クリニックの数字',
};

// 数字で見る（事実値のみ）
export const stats = [
  { value: '3', unit: '院', label: '展開エリア', note: '任意の補足' },
  // ...
];

// 院長／理事長メッセージ（求職者に向けた言葉で）
export const director = {
  name: '院長名',
  title: '院長 ／ 専門医',
  headline: 'メッセージ見出し。',
  message: [
    '段落1（理念・どんな人と働きたいか）。',
    '段落2（未経験歓迎・サポート体制など）。',
  ],
};

// 治療ポリシー（使わなければ null）
export const policies = null;

// 「目指すもの」等の特徴セクション（使わなければ null）
export const signature = null;
// 例）{ eyebrow, title, body: [..], image: '/recruit-photos/<slug>-*.jpg', imageAlt, scene: 'counsel' }

// 職種。募集要項は職安法の明示項目に準拠。employmentTypes を1つにすると単一雇用形態。
export const jobs = [
  {
    slug: 'nurse',
    scene: 'treatment',
    title: '看護師',
    icon: 'nurse',
    catch: '一言キャッチ。',
    summary: '仕事内容の要約。',
    day: [
      { time: '9:00', text: '出勤・準備' },
      // ...
    ],
    employmentTypes: [
      {
        type: '正社員',
        requirements: {
          '業務内容': '',
          '就業場所': '',
          '雇用形態': '',
          '勤務時間': '',
          '勤務日・休日': '',
          '給与': '',
          '応募資格': '',
          '待遇・福利厚生': '',
          '募集者': '',
          '応募方法': '応募フォームよりご応募ください。',
        },
      },
    ],
  },
];

// 先輩の声（実際の声が理想。jobSlug で職種チップ＋詳細リンクが付く）
export const voices = [
  // { id: 'v-nurse', jobSlug: 'nurse', role: '看護師（正社員）', years: '入職1年目 ／ 前職：…',
  //   headline: '見出し', reason: '入職の決め手', gap: '働いてみて', message: '応募検討者へ' },
];

// 相性診断（マッチ度チェック）。使わなければ削除可。luna.js の diagnosis を参照。
// export const diagnosis = { eyebrow, title, lead, startCta, questions:[{q,options:[{label,w:{job:重み},tempo?,pts}]}], jobMap:{...}, resultLead, encourage };

// 教育・福利厚生
export const support = {
  education: [
    // { title: '', text: '' },
  ],
  benefits: [],
};

// 応募の流れ
export const flowSteps = [
  { step: 'STEP 1', title: '応募', text: '' },
  { step: 'STEP 2', title: '書類選考', text: '' },
  { step: 'STEP 3', title: '面接', text: '' },
  { step: 'STEP 4', title: '内定・入職', text: '' },
];

// 見学（実施しないなら null）
export const tourDetail = null;

// FAQ
export const faqs = [
  // { q: '', a: '' },
];
