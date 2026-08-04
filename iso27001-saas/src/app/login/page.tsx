import Link from 'next/link';
import { loginAction } from '@/actions/auth-actions';

export default function LoginPage({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
      <p className="mt-1 text-sm text-slate-600">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-brand-600 hover:underline">
          S&apos;inscrire
        </Link>
      </p>

      {searchParams.error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      )}

      <div className="card mt-6">
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={searchParams.next || '/dashboard'} />
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
            <input className="input" id="password" name="password" type="password" required />
          </div>
          <button type="submit" className="btn-primary w-full">
            Se connecter
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-lg bg-slate-100 p-4 text-xs text-slate-600">
        <p className="font-semibold">Comptes de démonstration (après `npm run db:seed`) :</p>
        <p>Admin : admin@iso27001-cert.test / Admin1234!</p>
        <p>Client : demo@iso27001-cert.test / Demo1234!</p>
      </div>
    </div>
  );
}
