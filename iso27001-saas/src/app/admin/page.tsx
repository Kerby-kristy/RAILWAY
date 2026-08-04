import Link from 'next/link';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Dossiers de certification</h1>

      <div className="card divide-y divide-slate-100 p-0">
        {applications.length === 0 && <p className="px-6 py-4 text-sm text-slate-500">Aucun dossier pour le moment.</p>}
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/admin/applications/${app.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {app.type === 'COMPANY' ? app.organizationName : app.applicantName}
              </p>
              <p className="text-xs text-slate-500">
                {app.user.email} · Score {app.score} · Soumis le{' '}
                {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <StatusBadge status={app.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
