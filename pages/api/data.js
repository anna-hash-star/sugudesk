const clients = require('../../lib/clients');
const { getSheetData } = require('../../lib/sheets');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { clientId, password } = req.body;
  const client = clients[clientId];

  if (!client || client.password !== password) {
    return res.status(401).json({ error: '認証失敗' });
  }

  try {
    const rows = await getSheetData(client.spreadsheetId, client.sheetName);
    res.status(200).json({ rows, clientName: client.name });
  } catch (e) {
    res.status(500).json({ error: 'データ取得失敗: ' + e.message });
  }
}
