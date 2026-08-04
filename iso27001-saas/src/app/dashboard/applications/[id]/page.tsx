import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { QUESTIONNAIRE_ITEMS } from '@/lib/questionnaire';

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
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Votre demande a bien été soumise. Un auditeur va l&apos;examiner prochainement.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {application!.type === 'COMPANY' ? application!.organizationName : application!.applicantName}
          </h1>
          <p className="text-sm text-slate-600">Périmètre : {application!.scopeDescription}</p>
        </div>
        <StatusBadge status={application!.status} />
      </div>

      {application!.status === 'APPROVED' && application!.certificate && (
        <div className="card border-emerald-200 bg-emerald-50">
          <h2 className="font-semibold text-emerald-800">Certificat émis</h2>
          <p className="mt-1 text-sm text-emerald-700">N° {application!.certificate.certificateNumber}</p>
          <p className="text-sm text-emerald-700">
            Valide jusqu&apos;au {new Date(application!.certificate.expiryDate).toLocaleDateString('fr-FR')}
          </p>
          <a
            href={`/api/certificates/${application!.certificate.certificateNumber}/pdf`}
            className="btn-primary mt-3 inline-flex"
          >
            Télécharger le certificat PDF
          </a>
        </div>
      )}

      {application!.status === 'REJECTED' && (
        <div className="card border-red-200 bg-red-50">
          <h2 className="font-semibold text-red-800">Demande rejetée</h2>
          {application!.reviewComment && <p className="mt-1 text-sm text-red-700">{application!.reviewComment}</p>}
        </div>
      )}

      {(application!.status === 'SUBMITTED' || application!.status === 'UNDER_REVIEW') && (
        <div className="card border-blue-200 bg-blue-50 text-sm text-blue-700">
          Votre dossier est {application!.status === 'UNDER_REVIEW' ? "en cours d'examen" : 'en attente de revue'} par
          un auditeur.
        </div>
      )}

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
        <h2 className="font-semibold text-slate-900">Réponses à l&apos;auto-évaluation (score : {application!.score})</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {QUESTIONNAIRE_ITEMS.map((item) => (
            <li key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">{item.domain}</span>
              <span className="font-medium text-slate-900">{answers[item.id]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
