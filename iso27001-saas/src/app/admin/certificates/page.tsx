import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { revokeCertificateAction } from '@/actions/admin-actions';
import { CheckCircleIcon, DocumentCheckIcon } from '@/components/icons';

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ revoked?: string }>;
}) {
  const { revoked } = await searchParams;
  const certificates = await prisma.certificate.findMany({
    orderBy: { createdAt: 'desc' },
    include: { application: true },
  });

  return (
    <div className="space-y-4">
      {revoked && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          Certificat révoqué.
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-400">
            <DocumentCheckIcon className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink-900">Aucun certificat émis</p>
          <p className="text-sm text-ink-500">Les certificats approuvés apparaîtront ici.</p>
        </div>
      ) : (
        <div className="card-tight">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink-900">{cert.application.organizationName || cert.holderName}</p>
                {cert.application.organizationName && (
                  <p className="text-xs text-ink-500">Représenté par {cert.holderName}</p>
                )}
                <p className="mt-0.5 font-mono text-xs text-ink-500">
                  {cert.certificateNumber} · Émis le {new Date(cert.issueDate).toLocaleDateString('fr-FR')} · Expire
                  le {new Date(cert.expiryDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={`/verify/${cert.certificateNumber}`} className="text-xs font-medium text-brand-600 hover:underline">
                  Voir la page publique
                </a>
                <StatusBadge status={cert.status} />
                {cert.status === 'VALID' && (
                  <form action={revokeCertificateAction} className="flex items-center gap-2">
                    <input type="hidden" name="certificateId" value={cert.id} />
                    <input
                      type="text"
                      name="reason"
                      placeholder="Motif de révocation"
                      className="input h-8 w-40 py-1.5 text-xs"
                    />
                    <button type="submit" className="btn-danger py-1.5 text-xs">
                      Révoquer
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
