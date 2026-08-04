import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { QUESTIONNAIRE_ITEMS } from '@/lib/questionnaire';
import { decideApplicationAction, markUnderReviewAction } from '@/actions/admin-actions';
import { CheckCircleIcon, DocumentCheckIcon } from '@/components/icons';

export default async function AdminApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; decided?: string }>;
}) {
  const { id } = await params;
  const { error, decided } = await searchParams;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { user: true, certificate: true },
  });

  if (!application) {
    notFound();
  }

  const answers = JSON.parse(application!.answers) as Record<string, string>;
  const documents = JSON.parse(application!.documents) as { name: string; size: number }[];
  const isPending = application!.status === 'SUBMITTED' || application!.status === 'UNDER_REVIEW';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {decided && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          Décision enregistrée.
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Dossier n° {application!.id.slice(-8)}</span>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">
            {application!.type === 'COMPANY' ? application!.organizationName : application!.applicantName}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {application!.user.email} · {application!.type === 'COMPANY' ? 'Entreprise' : 'Particulier'}
          </p>
        </div>
        <StatusBadge status={application!.status} />
      </div>

      <div className="card">
        <p className="section-title">Périmètre déclaré</p>
        <p className="mt-2 text-sm text-ink-700">{application!.scopeDescription}</p>
      </div>

      <div className="card">
        <p className="section-title">Documents fournis</p>
        {documents.length === 0 ? (
          <p className="mt-2 text-sm text-ink-500">Aucun document joint.</p>
        ) : (
          <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
            {documents.map((doc, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{doc.name}</span>
                <span className="text-ink-400">{(doc.size / 1024).toFixed(1)} Ko</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <p className="section-title">
          Auto-évaluation — {application!.score} / {QUESTIONNAIRE_ITEMS.length * 2}
        </p>
        <ul className="mt-3 divide-y divide-ink-100 text-sm">
          {QUESTIONNAIRE_ITEMS.map((item) => (
            <li key={item.id} className="py-2.5">
              <p className="eyebrow">{item.domain}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-ink-700">{item.companyLabel}</span>
                <span className="font-medium text-ink-900">{answers[item.id]}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isPending && (
        <div className="card space-y-4">
          <p className="section-title">Décision de l&apos;auditeur</p>

          {application!.status === 'SUBMITTED' && (
            <form action={markUnderReviewAction}>
              <input type="hidden" name="applicationId" value={application!.id} />
              <button type="submit" className="btn-secondary">
                Marquer « en cours de revue »
              </button>
            </form>
          )}

          <form action={decideApplicationAction} className="space-y-4">
            <input type="hidden" name="applicationId" value={application!.id} />
            <div>
              <label className="label" htmlFor="comment">
                Commentaire (optionnel)
              </label>
              <textarea className="input" id="comment" name="comment" rows={3} />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" name="decision" value="APPROVE" className="btn-primary">
                Approuver et émettre le certificat
              </button>
              <button type="submit" name="decision" value="REJECT" className="btn-danger">
                Rejeter le dossier
              </button>
            </div>
          </form>
        </div>
      )}

      {application!.status === 'APPROVED' && application!.certificate && (
        <div className="card-tight flex items-center gap-3 border-emerald-200 bg-emerald-50/60 px-6 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <DocumentCheckIcon className="h-4.5 w-4.5" />
          </span>
          <p className="text-sm text-emerald-800">
            Certificat <span className="font-mono">{application!.certificate.certificateNumber}</span> émis le{' '}
            {new Date(application!.certificate.issueDate).toLocaleDateString('fr-FR')}.
          </p>
        </div>
      )}
    </div>
  );
}
