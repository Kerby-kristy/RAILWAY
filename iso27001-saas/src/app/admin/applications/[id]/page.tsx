import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { QUESTIONNAIRE_ITEMS } from '@/lib/questionnaire';
import { decideApplicationAction, markUnderReviewAction } from '@/actions/admin-actions';

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
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {decided && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Décision enregistrée.</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {application!.type === 'COMPANY' ? application!.organizationName : application!.applicantName}
          </h1>
          <p className="text-sm text-slate-600">
            {application!.user.email} · {application!.type === 'COMPANY' ? 'Entreprise' : 'Particulier'}
          </p>
        </div>
        <StatusBadge status={application!.status} />
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-900">Périmètre déclaré</h2>
        <p className="mt-1 text-sm text-slate-700">{application!.scopeDescription}</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-900">Documents fournis</h2>
        {documents.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500">Aucun document joint.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {documents.map((doc, i) => (
              <li key={i}>
                {doc.name} · {(doc.size / 1024).toFixed(1)} Ko
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-900">Auto-évaluation (score {application!.score} / {QUESTIONNAIRE_ITEMS.length * 2})</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {QUESTIONNAIRE_ITEMS.map((item) => (
            <li key={item.id} className="border-b border-slate-100 pb-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.domain}</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">{item.companyLabel}</span>
                <span className="font-medium text-slate-900">{answers[item.id]}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isPending && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Décision de l&apos;auditeur</h2>

          {application!.status === 'SUBMITTED' && (
            <form action={markUnderReviewAction}>
              <input type="hidden" name="applicationId" value={application!.id} />
              <button type="submit" className="btn-secondary">
                Marquer « en cours de revue »
              </button>
            </form>
          )}

          <form action={decideApplicationAction} className="space-y-3">
            <input type="hidden" name="applicationId" value={application!.id} />
            <div>
              <label className="label" htmlFor="comment">
                Commentaire (optionnel)
              </label>
              <textarea className="input" id="comment" name="comment" rows={3} />
            </div>
            <div className="flex gap-3">
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
        <div className="card border-emerald-200 bg-emerald-50 text-sm text-emerald-700">
          Certificat {application!.certificate.certificateNumber} émis le{' '}
          {new Date(application!.certificate.issueDate).toLocaleDateString('fr-FR')}.
        </div>
      )}
    </div>
  );
}
