import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200 pb-3 text-sm font-medium">
        <Link href="/admin" className="text-slate-700 hover:text-brand-700">
          Dossiers à traiter
        </Link>
        <Link href="/admin/certificates" className="text-slate-700 hover:text-brand-700">
          Certificats émis
        </Link>
      </div>
      {children}
    </div>
  );
}
