# 応募マッチ → 採用担当メール＋スプレッドシート記録（Google Apps Script）

「応募マッチ」の合格者が送信した応募内容を、**採用担当メールへ送信**し、同時に**指定のスプレッドシートに追記**する受信スクリプトです。
（`lib/recruit/clinics/<slug>.js` の `applyMatch.endpoint` に、デプロイして得たウェブアプリURLを設定します。）

## セットアップ手順

1. [script.google.com](https://script.google.com/) で新規プロジェクトを作成し、下のコードを貼り付け（既存プロジェクトなら全置換）
2. `RECRUIT_EMAIL` と `LOG_SHEET_ID` を確認（下記は設定済み）
3. **エディタで `testRun` を実行**して動作確認＋権限承認
   - 関数のドロップダウンで `testRun` を選び「実行」
   - 「承認が必要です」→ 自分のGoogleアカウントで許可（**Gmail送信・スプレッドシート**の権限）
   - 「このアプリは確認されていません」→「**詳細**」→「**（プロジェクト名）に移動**」→ 許可（自分のスクリプトなので安全）
   - 指定スプレッドシートに**テスト行**が入り、**テストメール**が届けばOK
4. デプロイ →「デプロイを管理」→ 鉛筆（編集）→ バージョン「**新バージョン**」→ デプロイ
   - ※コードを直したら必ず「新バージョン」で再デプロイ。しないと `/exec` は旧コードのまま＝**届かない一番の原因**
   - URL（`/exec`）は変わらないので、LP側の設定変更は不要

## コード

```javascript
const RECRUIT_EMAIL = 'anna.negoro@exmore.jp';                      // 採用担当メール
const LOG_SHEET_ID  = '1qW52ROqyndGQzK_XAczLKrGIUQRGO6dgt6tYdHmBjv0'; // 記録先スプレッドシートID

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

  // 1) スプレッドシートに1行追記（先頭タブ）
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

// 記録先スプレッドシート（先頭タブ）。ヘッダーが無ければ1行目に作成。
function getLogSheet() {
  var sheet = SpreadsheetApp.openById(LOG_SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['日時', '職種', '判定', '充足度', 'お名前', 'メール', '電話', 'ひとこと', '回答', '送信元']);
  }
  return sheet;
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
  Logger.log('OK：テスト完了。シートに1行追記＋メール送信しました。');
}
```

## メモ
- LP側は CORS プリフライトを避けるため `text/plain` + `no-cors` で POST します（レスポンスは読まない）。
- `LOG_SHEET_ID` のスプレッドシートは、デプロイするGoogleアカウントが編集できる必要があります。
- 個人情報は合格者のみが入力し、送信先は上記メール＋指定スプレッドシートのみ。
