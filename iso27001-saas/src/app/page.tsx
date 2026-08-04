import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
            Certification ISO/IEC 27001 pour <span className="text-brand-600">particuliers</span> et{' '}
            <span className="text-brand-600">entreprises</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Évaluez votre conformité, soumettez votre dossier et obtenez un certificat vérifiable en ligne — le tout
            depuis votre navigateur.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/register" className="btn-primary">
              Démarrer ma certification
            </Link>
            <Link href="/verify" className="btn-secondary">
              Vérifier un certificat
            </Link>
          </div>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Comment ça marche</h2>
          <ol className="mt-4 space-y-4 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">1</span>
              Créez un compte particulier ou entreprise.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">2</span>
              Complétez l&apos;auto-évaluation ISO 27001 et soumettez vos justificatifs.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">3</span>
              Un auditeur examine votre dossier et rend sa décision.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">4</span>
              Téléchargez votre certificat PDF, vérifiable publiquement via QR code.
            </li>
          </ol>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <h3 className="font-semibold text-slate-900">Certification individuelle</h3>
          <p className="mt-2 text-sm text-slate-600">
            Démontrez votre maîtrise des exigences ISO/IEC 27001 en tant que professionnel de la sécurité de
            l&apos;information.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-900">Certification d&apos;entreprise</h3>
          <p className="mt-2 text-sm text-slate-600">
            Faites certifier le système de management de la sécurité de l&apos;information (SMSI) de votre
            organisation.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-900">Vérification publique</h3>
          <p className="mt-2 text-sm text-slate-600">
            Chaque certificat émis dispose d&apos;un numéro unique et d&apos;une page de vérification publique.
          </p>
        </div>
      </section>

      <section className="card bg-amber-50 text-sm text-amber-800">
        <strong>MVP de démonstration :</strong> ce produit simule un parcours de certification ISO/IEC 27001 à des
        fins de test et de validation produit. Il ne s&apos;agit pas d&apos;un organisme de certification accrédité.
      </section>
    </div>
  );
}
