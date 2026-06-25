import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { key: 'dashboard', label: 'ダッシュボード', href: '/booster', icon: '📊' },
  { key: 'jobs', label: '求人票管理', href: '/booster/jobs', icon: '📋' },
  { key: 'candidates', label: '候補者管理', href: '/booster/candidates', icon: '👤' },
  { key: 'ng-feedback', label: 'NG理由入力', href: '/booster/ng-feedback', icon: '✍️' },
  { key: 'agencies', label: '紹介会社', href: '/booster/agencies', icon: '🤝' },
  { key: 'media', label: '求人媒体', href: '/booster/media', icon: '📡' },
];

export default function BoosterLayout({ children, current }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-100">
          <div className="text-lg font-bold text-blue-700">採用ブースター</div>
          <div className="text-xs text-gray-400 mt-0.5">Medical Recruitment</div>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map(item => {
            const isActive = current === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-400">Powered by</div>
          <div className="text-sm font-semibold text-gray-600">exmore</div>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  );
}
