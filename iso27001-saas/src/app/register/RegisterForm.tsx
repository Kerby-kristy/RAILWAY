'use client';

import { useState } from 'react';
import { BuildingIcon, UserIcon } from '@/components/icons';

export default function RegisterForm({ action }: { action: (formData: FormData) => void }) {
  const [accountType, setAccountType] = useState<'PERSON' | 'COMPANY'>('PERSON');

  return (
    <form action={action} className="space-y-5">
      <div>
        <span className="label">Type de compte</span>
        <div className="grid grid-cols-2 gap-3">
          <label className="choice-card py-3">
            <UserIcon className="h-4 w-4" />
            <input
              type="radio"
              name="accountType"
              value="PERSON"
              checked={accountType === 'PERSON'}
              onChange={() => setAccountType('PERSON')}
              className="sr-only"
            />
            Particulier
          </label>
          <label className="choice-card py-3">
            <BuildingIcon className="h-4 w-4" />
            <input
              type="radio"
              name="accountType"
              value="COMPANY"
              checked={accountType === 'COMPANY'}
              onChange={() => setAccountType('COMPANY')}
              className="sr-only"
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
        <p className="mt-1.5 text-xs text-ink-500">8 caractères minimum.</p>
      </div>

      <button type="submit" className="btn-primary w-full py-2.5">
        Créer mon compte
      </button>
    </form>
  );
}
