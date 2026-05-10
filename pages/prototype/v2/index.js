import Link from 'next/link';
import { clinics } from '../../../lib/prototypeMockData';

const COLORS = {
  primary: '#2563a8',
  bg: '#f8f7f4',
  white: '#ffffff',
  text: '#1f2937',
  textLight: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
};

export default function V2Home() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, marginBottom: 4 }}>SuguDesk Prototype v2</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0, marginBottom: 8 }}>採用業務代行 プロトタイプ</h1>
          <p style={{ fontSize: 14, color: COLORS.textLight, margin: 0 }}>役割を選んでください</p>
        </div>

        {/* 院（事務長/医師）向け */}
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>🏥</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: 0 }}>院向け管理画面</h2>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4, marginBottom: 16 }}>
            事務長・医師1名向けのシンプルなUI。今日のアクション、進行中の案件、AI支援機能（面接質問・振り返り・連絡依頼）、月次レポート閲覧。
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {clinics.map((c) => (
              <Link key={c.id} href={`/prototype/v2/clinic-portal/${c.id}`}>
                <div style={{ padding: '10px 16px', background: '#eff6ff', color: COLORS.primary, border: `1px solid ${COLORS.primary}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {c.name} →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* オペレータ向け */}
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>⚙️</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: 0 }}>オペレータ向け管理画面</h2>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4, marginBottom: 16 }}>
            業務代行のための内部ツール。全院横断、スカウトテンプレ管理、CSV取り込み、紹介会社管理、月次レポート生成。
          </p>
          <Link href="/prototype/v2/operator">
            <div style={{ display: 'inline-block', padding: '10px 20px', background: COLORS.primary, color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              オペレータダッシュボードへ →
            </div>
          </Link>
        </div>

        {/* v1 参考リンク */}
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px dashed ${COLORS.border}`, padding: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>参考：v1（フィードバック反映前）</div>
          <Link href="/prototype">
            <span style={{ fontSize: 12, color: COLORS.textLight, cursor: 'pointer', textDecoration: 'underline' }}>v1 オペレータダッシュボード →</span>
          </Link>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center', fontSize: 11, color: COLORS.textMuted }}>
          要件定義 v0.2 ベース ／ モックデータで動作 ／ 個人情報非保持
        </div>
      </div>
    </div>
  );
}
