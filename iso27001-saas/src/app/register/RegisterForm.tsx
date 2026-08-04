'use client';

import { useState } from 'react';

export default function RegisterForm({ action }: { action: (formData: FormData) => void }) {
  const [accountType, setAccountType] = useState<'PERSON' | 'COMPANY'>('PERSON');

  return (
    <form action={action} className="space-y-4">
      <div>
        <span className="label">Type de compte</span>
        <div className="flex gap-3">
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="accountType"
              value="PERSON"
              checked={accountType === 'PERSON'}
              onChange={() => setAccountType('PERSON')}
            />
            Particulier
          </label>
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
            <input
              type="radio"
              name="accountType"
              value="COMPANY"
              checked={accountType === 'COMPANY'}
              onChange={() => setAccountType('COMPANY')}
            />
            Entreprise
          </label>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="name">
          {accountType === 'COMPANY' ? 'Nom du représentant' : 'Nom complet'}
        </label>
        <input className="input" id="name" name="name" type="text" required />
      </div>

      {accountType === 'COMPANY' && (
        <div>
          <label className="label" htmlFor="companyName">
            Nom de l&apos;entreprise
          </label>
          <input className="input" id="companyName" name="companyName" type="text" required />
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="input" id="email" name="email" type="email" required />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Mot de passe
        </label>
        <input className="input" id="password" name="password" type="password" minLength={8} required />
        <p className="mt-1 text-xs text-slate-500">8 caractères minimum.</p>
      </div>

      <button type="submit" className="btn-primary w-full">
        Créer mon compte
      </button>
    </form>
  );
}
