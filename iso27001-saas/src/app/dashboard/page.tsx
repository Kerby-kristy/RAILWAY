import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/PageHeader';
import { ArrowRightIcon, BuildingIcon, DocumentCheckIcon, UserIcon } from '@/components/icons';

export default async function DashboardPage() {
  const session = await requireUser();

  const applications = await prisma.application.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: 'desc' },
    include: { certificate: true },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mon espace"
        title={`Bonjour ${session.name.split(' ')[0]}`}
        description="Suivez vos dossiers de certification et téléchargez vos certificats."
        action={
          <Link href="/dashboard/applications/new" className="btn-primary">
            Nouvelle demande
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        }
      />

      {applications.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <DocumentCheckIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-ink-900">Aucun dossier pour le moment</p>
            <p className="mt-1 text-sm text-ink-500">Démarrez votre première demande de certification ISO/IEC 27001.</p>
          </div>
          <Link href="/dashboard/applications/new" className="btn-primary mt-2">
            Démarrer ma première demande
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="card-tight">
          {applications.map((app) => (
            <Link key={app.id} href={`/dashboard/applications/${app.id}`} className="list-row">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                  {app.type === 'COMPANY' ? <BuildingIcon className="h-4.5 w-4.5" /> : <UserIcon className="h-4.5 w-4.5" />}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">
                    {app.type === 'COMPANY' ? app.organizationName : app.applicantName}
                  </p>
                  <p className="text-xs text-ink-500">
                    Soumis le {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('fr-FR') : '-'} · Score{' '}
                    {app.score}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {app.certificate && (
                  <span className="hidden font-mono text-xs text-emerald-700 sm:inline">{app.certificate.certificateNumber}</span>
                )}
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
