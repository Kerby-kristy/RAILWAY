'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Dossiers à traiter' },
  { href: '/admin/certificates', label: 'Certificats émis' },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-ink-200 text-sm font-medium">
      {TABS.map((tab) => {
        const active = tab.href === '/admin' ? pathname === '/admin' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-t-lg border-b-2 px-3 py-2.5 transition ${
              active
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-ink-600 hover:bg-ink-100/70 hover:text-ink-900'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
