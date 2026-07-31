# 応募マッチ → 採用担当メール＋スプレッドシート記録（Google Apps Script）

「応募マッチ」の合格者が送信した応募内容を、**採用担当メールへ送信**し、同時に**スプレッドシートに追記**する受信スクリプトです。
（`lib/recruit/clinics/<slug>.js` の `applyMatch.endpoint` に、デプロイして得たウェブアプリURLを設定します。）

## セットアップ手順

1. [script.google.com](https://script.google.com/) で新規プロジェクトを作成し、下のコードを貼り付け
2. `RECRUIT_EMAIL` を採用担当のメールアドレスに変更（既定 `anna.n@exmore.jp`）
3. **まずエディタで `testRun` を実行**して動作確認＋権限承認する
   - 関数のドロップダウンで `testRun` を選び「実行」
   - 「承認が必要です」→ 自分のGoogleアカウントで許可（Gmail送信・スプレッドシート作成の権限）
   - 「このアプリは確認されていません」と出たら「**詳細**」→「**（プロジェクト名）に移動（安全ではないページ）**」→ 許可（自分のスクリプトなので安全）
   - 実行後、Drive に「**ルナ応募マッチ 受信ログ**」というシートが作成され、テスト行が入り、テストメールが届けばOK（実行ログにシートURLが出ます）
4. デプロイ →「新しいデプロイ」→ 種類「ウェブアプリ」／実行ユーザー「**自分**」／アクセス「**全員**」→ デプロイ → **ウェブアプリURL**をコピー
5. そのURLを `applyMatch.endpoint` に設定（開発側で反映）

> ⚠️ **コードを直したら必ず「デプロイを管理」→ 鉛筆（編集）→ バージョン「新バージョン」→ デプロイ**。
> これをしないと `/exec` は旧コードのままで、送信しても何も起きません（届かない一番の原因）。
> 受信が来ているかは Apps Script の「**実行数（Executions）**」で確認できます。

## コード

```javascript
const RECRUIT_EMAIL = 'anna.n@exmore.jp'; // ← 採用担当のメールアドレス
const SHEET_NAME = 'ルナ応募マッチ 受信ログ';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    handleSubmission(data);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost error: ' + err + '\n' + (err && err.stack)); // 実行ログに失敗理由を残す
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleSubmission(data) {
  var a = data.applicant || {};
  var answers = data.answers || [];
  var answersFlat = answers.map(function (q) { return q.q + '→' + q.a; }).join(' / ');

  // 1) スプレッドシートに1行追記（Driveの「ルナ応募マッチ 受信ログ」に自動保存）
  var sheet = getLogSheet();
  sheet.appendRow([new Date(), (data.job && data.job.label) || '', data.result || '', data.fulfillment || '',
    a.name || '', a.email || '', a.tel || '', a.note || '', answersFlat, data.submittedFrom || '']);

  // 2) 採用担当へメール送信
  var body = ['■ 職種：' + ((data.job && data.job.label) || ''),
    '■ 判定：' + (data.result || '') + (data.fulfillment ? '（充足度：' + data.fulfillment + '）' : ''),
    '', '【応募者】', 'お名前：' + (a.name || ''), 'メール：' + (a.email || ''), '電話：' + (a.tel || '')];
  if (a.note) body.push('ひとこと：' + a.note);
  body.push('', '【回答内容】');
  answers.forEach(function (q) { body.push('・' + q.q + ' → ' + q.a); });
  body.push('', '送信元：' + (data.submittedFrom || ''));

  MailApp.sendEmail({
    to: RECRUIT_EMAIL,
    subject: '【採用応募】' + (data.clinicName || '') + '／' + ((data.job && data.job.label) || '') + '：' + (a.name || ''),
    body: body.join('\n'),
    replyTo: a.email || undefined,
  });
}

// 受信ログ用スプレッドシートを取得（無ければ作成してIDを記憶）
function getLogSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('LOG_SHEET_ID');
  var ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_NAME);
    props.setProperty('LOG_SHEET_ID', ss.getId());
    ss.getActiveSheet().appendRow(['日時', '職種', '判定', '充足度', 'お名前', 'メール', '電話', 'ひとこと', '回答', '送信元']);
    Logger.log('受信ログ シートを作成: ' + ss.getUrl());
  }
  return ss.getActiveSheet();
}

// ▼エディタで実行して動作確認＋権限承認する用（Webからの送信前に一度実行）
function testRun() {
  handleSubmission({
    clinicName: 'ルナレディースクリニック',
    job: { label: '看護師（テスト送信）' },
    result: '合格', fulfillment: '中',
    applicant: { name: 'テスト太郎', email: 'test@example.com', tel: '000-0000-0000', note: 'エディタからのテストです' },
    answers: [{ q: '婦人科経験', a: 'あり' }, { q: '就業時期', a: '1ヶ月以内' }],
    submittedFrom: 'editor-test',
  });
  var url = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('LOG_SHEET_ID')).getUrl();
  Logger.log('OK：テスト完了。受信ログ シート = ' + url);
}
```

## メモ
- LP側は CORS プリフライトを避けるため `text/plain` + `no-cors` で POST します（レスポンスは読まない）。
- 個人情報は合格者のみが入力し、送信先は上記メール＋受信ログシートのみ。
