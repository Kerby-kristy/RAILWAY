import { requireUser } from '@/lib/auth';
import { createApplicationAction } from '@/actions/application-actions';
import { QUESTIONNAIRE_ITEMS, ANSWER_OPTIONS } from '@/lib/questionnaire';

export default async function NewApplicationPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await requireUser();
  const isCompany = session.accountType === 'COMPANY';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nouvelle demande de certification</h1>
        <p className="mt-1 text-sm text-slate-600">
          {isCompany
            ? "Auto-évaluez le système de management de la sécurité de l'information de votre organisation."
            : 'Auto-évaluez vos connaissances des exigences ISO/IEC 27001.'}
        </p>
      </div>

      {searchParams.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      )}

      <form action={createApplicationAction} encType="multipart/form-data" className="space-y-6">
        <input type="hidden" name="type" value={session.accountType} />

        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Informations générales</h2>
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
            <p className="mt-1 text-xs text-slate-500">
              Politique de sécurité, rapport d&apos;audit interne, preuves de formation, etc.
            </p>
          </div>
        </div>

        <div className="card space-y-6">
          <div>
            <h2 className="font-semibold text-slate-900">Auto-évaluation ISO/IEC 27001</h2>
            <p className="text-sm text-slate-600">Répondez à chaque affirmation pour chaque domaine de contrôle.</p>
          </div>

          {QUESTIONNAIRE_ITEMS.map((item) => (
            <div key={item.id} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.domain}</p>
              <p className="mt-1 text-sm text-slate-800">{isCompany ? item.companyLabel : item.personLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ANSWER_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                  >
                    <input type="radio" name={`answers[${item.id}]`} value={option.value} required />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary w-full">
          Soumettre ma demande de certification
        </button>
      </form>
    </div>
  );
}
