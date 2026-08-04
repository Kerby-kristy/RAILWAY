import Link from 'next/link';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { BuildingIcon, DocumentCheckIcon, UserIcon } from '@/components/icons';

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-400">
            <DocumentCheckIcon className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink-900">Aucun dossier pour le moment</p>
          <p className="text-sm text-ink-500">Les nouvelles demandes de certification apparaîtront ici.</p>
        </div>
      ) : (
        <div className="card-tight">
          {applications.map((app) => (
            <Link key={app.id} href={`/admin/applications/${app.id}`} className="list-row">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                  {app.type === 'COMPANY' ? <BuildingIcon className="h-4.5 w-4.5" /> : <UserIcon className="h-4.5 w-4.5" />}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">
                    {app.type === 'COMPANY' ? app.organizationName : app.applicantName}
                  </p>
                  <p className="text-xs text-ink-500">
                    {app.user.email} · Score {app.score} · Soumis le{' '}
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
