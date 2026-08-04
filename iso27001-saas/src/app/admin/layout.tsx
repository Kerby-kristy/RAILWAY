import { requireAdmin } from '@/lib/auth';
import AdminTabs from './AdminTabs';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">Back-office</span>
        <h1 className="mt-1 text-2xl font-bold text-ink-900">Espace auditeur</h1>
      </div>
      <AdminTabs />
      {children}
    </div>
  );
}
