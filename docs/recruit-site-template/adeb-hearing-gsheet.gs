/**
 * AdeB 採用ヒアリングシート → Googleスプレッドシート連携
 *
 * 【使い方】
 * 1. Googleスプレッドシートを新規作成する
 * 2. メニュー「拡張機能」→「Apps Script」を開く
 * 3. 既存コードを消してこのファイルの内容を貼り付け、保存（プロジェクト名は任意）
 * 4. 上部「デプロイ」→「新しいデプロイ」→ 種類を「ウェブアプリ」に
 *      - 説明：任意
 *      - 次のユーザーとして実行：自分
 *      - アクセスできるユーザー：「全員」
 *    →「デプロイ」→ 表示された「ウェブアプリのURL」（.../exec）をコピー
 * 5. そのURLを adeb-hearing-sheet.html の ENDPOINT に貼る（または制作担当に渡す）
 *
 * 送信されると「回答」シートに1行追記し、NOTIFY_TO 宛に通知メールを送ります。
 * 初回送信時、Googleの承認ダイアログが出たら許可してください（スプレッドシート操作・メール送信）。
 */

var NOTIFY_TO = 'anna.negoro@exmore.jp'; // 通知メールの宛先
var SHEET_NAME = '回答';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    var payload = JSON.parse(e.postData.contents);
    var items = payload.answers || [];

    // 初回：ヘッダー行（送信日時 + 各質問文）
    if (sh.getLastRow() === 0) {
      sh.appendRow(['送信日時'].concat(items.map(function (it) { return it.q; })));
      sh.setFrozenRows(1);
    }

    // 回答行
    var row = [new Date()].concat(items.map(function (it) { return it.a || ''; }));
    sh.appendRow(row);

    // 通知メール
    var body = '【AdeBクリニック 採用サイト・チャット】ヒアリング回答が届きました。\n\n'
      + items.map(function (it) {
          return '【' + it.cat + '】\nQ. ' + it.q + '\nA. ' + (it.a && it.a.trim() ? it.a : '（未回答）');
        }).join('\n\n')
      + '\n\n----\nスプレッドシートにも同じ内容が記録されています。';
    MailApp.sendEmail(NOTIFY_TO, '【AdeB採用サイト】ヒアリング回答', body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 動作確認用（Apps Scriptエディタから実行してメール到達を確認できます）
function testSend() {
  doPost({ postData: { contents: JSON.stringify({
    answers: [{ cat: 'テスト', q: 'テスト質問', a: 'テスト回答' }]
  }) } });
}
