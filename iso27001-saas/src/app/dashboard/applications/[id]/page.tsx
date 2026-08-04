import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { QUESTIONNAIRE_ITEMS } from '@/lib/questionnaire';
import { CheckCircleIcon, DocumentCheckIcon, XCircleIcon } from '@/components/icons';

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;
  const { submitted } = await searchParams;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { certificate: true },
  });

  if (!application || application.userId !== session.sub) {
    notFound();
  }

  const answers = JSON.parse(application!.answers) as Record<string, string>;
  const documents = JSON.parse(application!.documents) as { name: string; size: number }[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {submitted && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          Votre demande a bien été soumise. Un auditeur va l&apos;examiner prochainement.
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Dossier de certification</span>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">
            {application!.type === 'COMPANY' ? application!.organizationName : application!.applicantName}
          </h1>
          <p className="mt-1 text-sm text-ink-600">Périmètre : {application!.scopeDescription}</p>
        </div>
        <StatusBadge status={application!.status} />
      </div>

      {application!.status === 'APPROVED' && application!.certificate && (
        <div className="card-tight flex flex-col gap-4 border-emerald-200 bg-emerald-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <DocumentCheckIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-emerald-900">Certificat émis</p>
              <p className="mt-0.5 font-mono text-sm text-emerald-700">{application!.certificate.certificateNumber}</p>
              <p className="text-sm text-emerald-700">
                Valide jusqu&apos;au {new Date(application!.certificate.expiryDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <a
            href={`/api/certificates/${application!.certificate.certificateNumber}/pdf`}
            className="btn-primary shrink-0"
          >
            Télécharger le PDF
          </a>
        </div>
      )}

      {application!.status === 'REJECTED' && (
        <div className="card-tight flex items-start gap-3 border-red-200 bg-red-50/60 p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
            <XCircleIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-red-900">Demande rejetée</p>
            {application!.reviewComment && <p className="mt-1 text-sm text-red-700">{application!.reviewComment}</p>}
          </div>
        </div>
      )}

      {(application!.status === 'SUBMITTED' || application!.status === 'UNDER_REVIEW') && (
        <div className="card-tight border-brand-200 bg-brand-50/60 px-6 py-4 text-sm text-brand-700">
          Votre dossier est {application!.status === 'UNDER_REVIEW' ? "en cours d'examen" : 'en attente de revue'} par
          un auditeur.
        </div>
      )}

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
        <p className="section-title">Auto-évaluation — score {application!.score}</p>
        <ul className="mt-3 divide-y divide-ink-100 text-sm">
          {QUESTIONNAIRE_ITEMS.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2.5">
              <span className="text-ink-600">{item.domain}</span>
              <span className="font-medium text-ink-900">{answers[item.id]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
