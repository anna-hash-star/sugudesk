/**
 * AdeB 採用サイト 応募フォーム → Googleドライブ保存＋スプレッドシート記録＋通知メール
 *
 * 【できること】
 * - LP内の応募フォームから送信された「応募者情報＋履歴書・職務経歴書（ファイル）」を受け取り、
 *   ・ファイルを Googleドライブの専用フォルダに保存
 *   ・応募内容を「応募」シートに1行記録（ファイルのリンク付き）
 *   ・NOTIFY_TO 宛に通知メール（ドライブのリンク付き）
 * - 応募者はGoogleログイン不要（このスクリプトの所有者権限で処理されます）
 *
 * 【使い方】
 * 1. Googleスプレッドシートを新規作成（例：「AdeB採用 応募管理」）
 * 2. メニュー「拡張機能」→「Apps Script」を開く
 * 3. 既存コードを消してこのファイルの内容を貼り付け、保存
 * 4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      - 次のユーザーとして実行：自分
 *      - アクセスできるユーザー：「全員」
 *    →「デプロイ」→ 表示された「ウェブアプリのURL（.../exec）」をコピー
 * 5. そのURLを lib/recruit/clinics/adeb.js の applyForm.endpoint に貼る（または制作担当へ）
 * 6. 初回送信時、Googleの承認ダイアログが出たら許可（ドライブ操作・メール送信）
 *
 * 【フォーム項目を増やした場合の再デプロイ】
 * - フォームの項目（メール・電話・住所・勤務開始可能日・連絡時間帯など）を変更・追加したときは、
 *   このコードを貼り替えたうえで「デプロイ」→「デプロイを管理」→ 既存デプロイの鉛筆✏️→
 *   バージョン「新バージョン」→「デプロイ」で更新してください（URLは変わりません）。
 *
 * 【個人情報の取り扱い】
 * - 履歴書・職務経歴書は個人情報です。保存先の「応募書類フォルダ」は
 *   このGoogleアカウント内の非公開フォルダです。共有設定を安易に「リンクを知る全員」にしないでください。
 * - 不要になった応募書類は定期的に削除する運用を推奨します。
 */

var NOTIFY_TO   = 'anna.negoro@exmore.jp';   // 通知メールの宛先
var SHEET_NAME  = '応募';
var FOLDER_NAME = 'AdeB採用 応募書類';         // Driveに自動作成されるフォルダ名
var TZ          = 'Asia/Tokyo';

// スプレッドシートの見出し（順番＝記録される列）
var HEADERS = ['受信日時', 'お名前', 'メールアドレス', '電話番号', 'ご住所',
               '希望職種', '勤務開始可能日', '連絡のつきやすい時間帯', '志望動機・ご質問', '添付ファイル'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var payload = JSON.parse(e.postData.contents);
    var now = new Date();
    var stamp = Utilities.formatDate(now, TZ, 'yyyyMMdd-HHmmss');

    // 1) 応募書類フォルダ（無ければ作成）
    var folder = getOrCreateFolder(FOLDER_NAME);

    // 2) ファイル保存（履歴書・職務経歴書など）
    var fileLinks = [];
    (payload.files || []).forEach(function (f) {
      if (!f || !f.dataBase64) return;
      var bytes = Utilities.base64Decode(f.dataBase64);
      var blob = Utilities.newBlob(bytes, f.mimeType || 'application/octet-stream', f.filename || 'file');
      var safeName = stamp + '_' + sanitize(payload.name || '応募者') + '_' + (f.label || '書類') + '_' + (f.filename || 'file');
      var saved = folder.createFile(blob).setName(safeName);
      fileLinks.push({ label: f.label || '書類', name: saved.getName(), url: saved.getUrl() });
    });

    // 3) スプレッドシートに記録
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    }
    sh.appendRow([
      now,
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      payload.address || '',
      payload.job || '',
      payload.start || '',
      payload.times || '',
      payload.note || '',
      fileLinks.map(function (l) { return l.label + '：' + l.url; }).join('\n')
    ]);

    // 4) 通知メール
    var body = '【' + (payload.clinic || 'AdeBクリニック') + ' 採用サイト】新しい応募が届きました。\n\n'
      + 'お名前：' + (payload.name || '') + '\n'
      + 'メールアドレス：' + (payload.email || '') + '\n'
      + '電話番号：' + (payload.phone || '') + '\n'
      + 'ご住所：' + (payload.address || '') + '\n'
      + '希望職種：' + (payload.job || '') + '\n'
      + '勤務開始可能日：' + (payload.start || '') + '\n'
      + '連絡のつきやすい時間帯：' + (payload.times || '') + '\n'
      + '志望動機・ご質問：\n' + (payload.note || '（なし）') + '\n\n'
      + '添付ファイル：\n'
      + (fileLinks.length
          ? fileLinks.map(function (l) { return '・' + l.label + '：' + l.url; }).join('\n')
          : '（なし）')
      + '\n\n----\nスプレッドシート「' + SHEET_NAME + '」にも記録しています。';
    MailApp.sendEmail(NOTIFY_TO, '【AdeB採用】応募が届きました（' + (payload.name || '') + '）', body);

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

function getOrCreateFolder(name) {
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function sanitize(s) {
  return String(s).replace(/[\\/:*?"<>|\n\r]/g, '_').slice(0, 40);
}

// 動作確認用（エディタから実行してメール・シート・フォルダをテスト）
function testSend() {
  doPost({ postData: { contents: JSON.stringify({
    clinic: 'AdeBクリニック', name: 'テスト太郎',
    email: 'test@example.com', phone: '090-0000-0000', address: '秋田県秋田市中通1-1-1',
    job: 'カウンセラー（受付補助）', start: '1ヶ月以内', times: '午前（9-12時）、午後（13-17時）',
    note: 'テスト送信です。',
    files: [{ label: '履歴書', filename: 'test.txt', mimeType: 'text/plain',
      dataBase64: Utilities.base64Encode(Utilities.newBlob('これはテストです').getBytes()) }]
  }) } });
}
