import fs from "fs";
import path from "path";

const BUSINESS_DIR = path.join(process.cwd(), "business");
const MANAGEMENT_PASSWORD = process.env.MANAGEMENT_PASSWORD || "sugudesk-admin-2026";

function readJsonFile(filename) {
  const filePath = path.join(BUSINESS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJsonFile(filename, data) {
  const filePath = path.join(BUSINESS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const { password, action, file, data } = req.body;

    if (password !== MANAGEMENT_PASSWORD) {
      return res.status(401).json({ error: "認証エラー" });
    }

    if (action === "read") {
      const strategy = readJsonFile("strategy.json");
      const clients = readJsonFile("clients.json");
      const roadmap = readJsonFile("product-roadmap.json");
      const financials = readJsonFile("financials.json");
      return res.status(200).json({ strategy, clients, roadmap, financials });
    }

    if (action === "update" && file && data) {
      const allowedFiles = ["strategy.json", "clients.json", "product-roadmap.json", "financials.json"];
      if (!allowedFiles.includes(file)) {
        return res.status(400).json({ error: "不正なファイル指定" });
      }
      writeJsonFile(file, data);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "不正なアクション" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
