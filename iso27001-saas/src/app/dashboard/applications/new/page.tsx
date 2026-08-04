import { requireUser } from '@/lib/auth';
import { createApplicationAction } from '@/actions/application-actions';
import { QUESTIONNAIRE_ITEMS, ANSWER_OPTIONS } from '@/lib/questionnaire';
import PageHeader from '@/components/PageHeader';

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireUser();
  const { error } = await searchParams;
  const isCompany = session.accountType === 'COMPANY';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Nouvelle demande"
        title="Demande de certification"
        description={
          isCompany
            ? "Auto-évaluez le système de management de la sécurité de l'information de votre organisation."
            : 'Auto-évaluez vos connaissances des exigences ISO/IEC 27001.'
        }
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form action={createApplicationAction} encType="multipart/form-data" className="space-y-6">
        <input type="hidden" name="type" value={session.accountType} />

        <div className="card space-y-4">
          <p className="section-title">Informations générales</p>
          <div>
            <label className="label" htmlFor="applicantName">
              {isCompany ? 'Nom du représentant / contact' : 'Nom complet'}
            </label>
            <input className="input" id="applicantName" name="applicantName" defaultValue={session.name} required />
          </div>
          {isCompany && (
            <div>
              <label className="label" htmlFor="organizationName">
                Nom de l&apos;organisation
              </label>
              <input className="input" id="organizationName" name="organizationName" required />
            </div>
          )}
          <div>
            <label className="label" htmlFor="scopeDescription">
              Périmètre de la certification
            </label>
            <textarea
              className="input"
              id="scopeDescription"
              name="scopeDescription"
              rows={3}
              placeholder={
                isCompany
                  ? "Ex : Système de management de la sécurité de l'information couvrant l'infrastructure cloud et les équipes produit."
                  : 'Ex : Compétences en gestion des risques et pilotage de la sécurité de l\'information.'
              }
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="documents">
              Documents justificatifs (optionnel)
            </label>
            <input className="input" id="documents" name="documents" type="file" multiple />
            <p className="mt-1.5 text-xs text-ink-500">
              Politique de sécurité, rapport d&apos;audit interne, preuves de formation, etc.
            </p>
          </div>
        </div>

        <div className="card space-y-6">
          <div>
            <p className="section-title">Auto-évaluation ISO/IEC 27001</p>
            <p className="mt-1 text-sm text-ink-600">Répondez à chaque affirmation pour chaque domaine de contrôle.</p>
          </div>

          {QUESTIONNAIRE_ITEMS.map((item) => (
            <div key={item.id} className="border-t border-ink-100 pt-5 first:border-0 first:pt-0">
              <p className="eyebrow">{item.domain}</p>
              <p className="mt-1.5 text-sm font-medium text-ink-800">{isCompany ? item.companyLabel : item.personLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ANSWER_OPTIONS.map((option) => (
                  <label key={option.value} className="choice-card py-1.5 text-xs">
                    <input type="radio" name={`answers[${item.id}]`} value={option.value} required className="sr-only" />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary w-full py-2.5">
          Soumettre ma demande de certification
        </button>
      </form>
    </div>
  );
}
