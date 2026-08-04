import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';

export default async function DashboardPage() {
  const session = await requireUser();

  const applications = await prisma.application.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: 'desc' },
    include: { certificate: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon espace</h1>
          <p className="text-sm text-slate-600">Bonjour {session.name}, voici vos dossiers de certification.</p>
        </div>
        <Link href="/dashboard/applications/new" className="btn-primary">
          Nouvelle demande
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center text-sm text-slate-600">
          Vous n&apos;avez pas encore de dossier de certification.
          <div className="mt-4">
            <Link href="/dashboard/applications/new" className="btn-primary">
              Démarrer ma première demande
            </Link>
          </div>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 p-0">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/applications/${app.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {app.type === 'COMPANY' ? app.organizationName : app.applicantName}
                </p>
                <p className="text-xs text-slate-500">
                  Soumis le {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('fr-FR') : '-'} · Score
                  d&apos;auto-évaluation {app.score}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {app.certificate && <span className="text-xs text-emerald-700">{app.certificate.certificateNumber}</span>}
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
