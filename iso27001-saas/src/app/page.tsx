import Link from 'next/link';
import { ArrowRightIcon, BuildingIcon, DocumentCheckIcon, SearchIcon, ShieldIcon, SparkleIcon, UserIcon } from '@/components/icons';

const STEPS = [
  { title: 'Créez votre compte', detail: 'Particulier ou entreprise, en moins d’une minute.' },
  { title: 'Auto-évaluez-vous', detail: 'Répondez au questionnaire ISO/IEC 27001 et joignez vos justificatifs.' },
  { title: 'Revue par un auditeur', detail: 'Votre dossier est examiné et une décision est rendue.' },
  { title: 'Certificat vérifiable', detail: 'Téléchargez votre certificat PDF avec QR code de vérification.' },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-8">
      <section className="relative -mx-4 overflow-hidden px-4 pb-4 pt-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[32rem] w-[64rem] -tranink-x-1/2 rounded-full bg-gradient-to-b from-brand-100 via-brand-50 to-transparent blur-2xl" />

        <div className="grid items-center gap-12 py-10 md:grid-cols-2 md:gap-10 md:py-16">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1">
              <SparkleIcon className="h-3.5 w-3.5" />
              Certification en ligne
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-ink-900 sm:text-5xl">
              La certification ISO/IEC 27001,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                sans friction
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-600">
              Évaluez votre conformité, soumettez votre dossier et obtenez un certificat vérifiable en ligne — pour
              vous ou pour votre entreprise, entièrement depuis votre navigateur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary px-5 py-3 text-[15px]">
                Démarrer ma certification
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/verify" className="btn-secondary px-5 py-3 text-[15px]">
                <SearchIcon className="h-4 w-4" />
                Vérifier un certificat
              </Link>
            </div>
          </div>

          <div className="card-tight relative overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50/60 px-6 py-4">
              <p className="section-title text-[15px]">Comment ça marche</p>
            </div>
            <ol className="divide-y divide-ink-100">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4 px-6 py-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 max-w-xl">
          <span className="eyebrow">Deux parcours, une même exigence</span>
          <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">Conçu pour les personnes et les organisations</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<UserIcon className="h-5 w-5" />}
            title="Certification individuelle"
            description="Démontrez votre maîtrise des exigences ISO/IEC 27001 en tant que professionnel de la sécurité de l'information."
          />
          <FeatureCard
            icon={<BuildingIcon className="h-5 w-5" />}
            title="Certification d'entreprise"
            description="Faites certifier le système de management de la sécurité de l'information (SMSI) de votre organisation."
          />
          <FeatureCard
            icon={<DocumentCheckIcon className="h-5 w-5" />}
            title="Vérification publique"
            description="Chaque certificat émis dispose d'un numéro unique et d'une page de vérification publique, sans connexion requise."
          />
        </div>
      </section>

      <section className="card-tight flex flex-col items-start gap-4 border-gold-200/60 bg-gradient-to-br from-gold-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">MVP de démonstration</p>
            <p className="mt-1 max-w-xl text-sm text-ink-600">
              Ce produit simule un parcours de certification ISO/IEC 27001 à des fins de test et de validation
              produit. Il ne s&apos;agit pas d&apos;un organisme de certification accrédité.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card transition hover:shadow-elevated">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{icon}</span>
      <h3 className="mt-4 font-display font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{description}</p>
    </div>
  );
}
