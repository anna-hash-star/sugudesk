import { createContext, useContext } from 'react';

// アクティブなクリニックの bundle（clinic/jobs/voices/... と slug/hasTour）を配布する。
// 各コンポーネントは useClinic() で受け取る（従来の site-data シングルトンimportの置き換え）。
const ClinicContext = createContext(null);

export function ClinicProvider({ bundle, children }) {
  return <ClinicContext.Provider value={bundle}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const b = useContext(ClinicContext);
  if (!b) throw new Error('useClinic() は ClinicProvider の内側で使ってください');
  return b;
}

// 採用サイトのベースパス（例 "/recruit/adeb"）。リンク生成に使う。
export function useBase() {
  return `/recruit/${useClinic().slug}`;
}
