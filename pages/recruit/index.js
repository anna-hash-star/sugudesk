// /recruit（クリニック名なし）は現時点では公開しない。
// これが無いと、単一セグメントの動的ルート pages/[client].js に飲まれてしまうため、
// ここで明示的に 404 を返してクリニックURL（/recruit/<slug>）だけを有効にする。
// 将来クリニック一覧ページを作るときは、この notFound を実ページに差し替える。
export function getStaticProps() {
  return { notFound: true };
}

export default function RecruitIndex() {
  return null;
}
