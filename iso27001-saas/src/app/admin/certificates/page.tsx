import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { revokeCertificateAction } from '@/actions/admin-actions';

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
      <h1 className="text-2xl font-bold text-slate-900">Certificats émis</h1>

      {revoked && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Certificat révoqué.</div>
      )}

      <div className="card divide-y divide-slate-100 p-0">
        {certificates.length === 0 && <p className="px-6 py-4 text-sm text-slate-500">Aucun certificat émis.</p>}
        {certificates.map((cert) => (
          <div key={cert.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-semibold text-slate-900">{cert.application.organizationName || cert.holderName}</p>
              {cert.application.organizationName && (
                <p className="text-xs text-slate-500">Représenté par {cert.holderName}</p>
              )}
              <p className="text-xs text-slate-500">
                {cert.certificateNumber} · Émis le {new Date(cert.issueDate).toLocaleDateString('fr-FR')} · Expire le{' '}
                {new Date(cert.expiryDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href={`/verify/${cert.certificateNumber}`} className="text-xs text-brand-600 hover:underline">
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
                    className="input h-8 w-40 text-xs"
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
    </div>
  );
}
