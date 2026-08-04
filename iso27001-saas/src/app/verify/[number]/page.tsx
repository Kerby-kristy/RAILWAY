import Link from 'next/link';
import { prisma } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { isExpired } from '@/lib/certificate';
import { AlertIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon } from '@/components/icons';

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
  const isValid = effectiveStatus === 'VALID';

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Vérification de certificat</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          Numéro recherché : <span className="font-mono">{number}</span>
        </p>
      </div>

      <div className="card-tight overflow-hidden">
        {!certificate ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="text-lg font-semibold text-ink-900">Certificat introuvable</p>
              <p className="mt-1 text-sm text-ink-600">
                Aucun certificat ne correspond à ce numéro. Vérifiez la saisie ou contactez l&apos;émetteur.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`flex items-center gap-4 px-6 py-6 ${
                isValid ? 'bg-emerald-50/70' : 'bg-red-50/70'
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  isValid ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {isValid ? <CheckCircleIcon className="h-6 w-6" /> : <XCircleIcon className="h-6 w-6" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-ink-900">
                  {certificate.application.organizationName || certificate.holderName}
                </p>
                {certificate.application.organizationName && (
                  <p className="truncate text-xs text-ink-500">Représenté par {certificate.holderName}</p>
                )}
              </div>
              <StatusBadge status={effectiveStatus!} />
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-6 py-5 text-sm">
              <dt className="text-ink-500">Type</dt>
              <dd className="text-right text-ink-900">{certificate.type === 'COMPANY' ? 'Entreprise' : 'Particulier'}</dd>
              <dt className="text-ink-500">Périmètre</dt>
              <dd className="text-right text-ink-900">{certificate.application.scopeDescription}</dd>
              <dt className="text-ink-500">N° de certificat</dt>
              <dd className="text-right font-mono text-ink-900">{certificate.certificateNumber}</dd>
              <dt className="text-ink-500">Date d&apos;émission</dt>
              <dd className="text-right text-ink-900">{new Date(certificate.issueDate).toLocaleDateString('fr-FR')}</dd>
              <dt className="text-ink-500">Date d&apos;expiration</dt>
              <dd className="text-right text-ink-900">{new Date(certificate.expiryDate).toLocaleDateString('fr-FR')}</dd>
              {certificate.status === 'REVOKED' && (
                <>
                  <dt className="text-ink-500">Motif de révocation</dt>
                  <dd className="text-right text-red-700">{certificate.revokedReason}</dd>
                </>
              )}
            </dl>

            {isValid && (
              <div className="border-t border-ink-100 px-6 py-4">
                <a href={`/api/certificates/${certificate.certificateNumber}/pdf`} className="btn-secondary w-full">
                  Télécharger le PDF
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <p className="mt-5 text-center text-sm">
        <Link href="/verify" className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline">
          Vérifier un autre certificat
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  );
}
