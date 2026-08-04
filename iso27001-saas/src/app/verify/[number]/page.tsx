import Link from 'next/link';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { isExpired } from '@/lib/certificate';

export default async function VerifyCertificatePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: number },
    include: { application: true },
  });

  const effectiveStatus = certificate
    ? certificate.status === 'VALID' && isExpired(certificate.expiryDate)
      ? 'EXPIRED'
      : certificate.status
    : null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Vérification de certificat</h1>
      <p className="mt-1 text-sm text-slate-600">
        Numéro recherché : <span className="font-mono">{number}</span>
      </p>

      <div className="card mt-6">
        {!certificate ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-red-700">Certificat introuvable</p>
            <p className="mt-1 text-sm text-slate-600">
              Aucun certificat ne correspond à ce numéro. Vérifiez la saisie ou contactez l&apos;émetteur.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {certificate.application.organizationName || certificate.holderName}
                </p>
                {certificate.application.organizationName && (
                  <p className="text-xs text-slate-500">Représenté par {certificate.holderName}</p>
                )}
              </div>
              <StatusBadge status={effectiveStatus!} />
            </div>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-500">Type</dt>
              <dd className="text-slate-900">{certificate.type === 'COMPANY' ? 'Entreprise' : 'Particulier'}</dd>
              <dt className="text-slate-500">Périmètre</dt>
              <dd className="text-slate-900">{certificate.application.scopeDescription}</dd>
              <dt className="text-slate-500">Date d&apos;émission</dt>
              <dd className="text-slate-900">{new Date(certificate.issueDate).toLocaleDateString('fr-FR')}</dd>
              <dt className="text-slate-500">Date d&apos;expiration</dt>
              <dd className="text-slate-900">{new Date(certificate.expiryDate).toLocaleDateString('fr-FR')}</dd>
              {certificate.status === 'REVOKED' && (
                <>
                  <dt className="text-slate-500">Motif de révocation</dt>
                  <dd className="text-red-700">{certificate.revokedReason}</dd>
                </>
              )}
            </dl>
            {effectiveStatus === 'VALID' && (
              <a href={`/api/certificates/${certificate.certificateNumber}/pdf`} className="btn-secondary w-full">
                Télécharger le PDF
              </a>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm">
        <Link href="/verify" className="text-brand-600 hover:underline">
          Vérifier un autre certificat
        </Link>
      </p>
    </div>
  );
}
