import Link from 'next/link';
import { loginAction } from '@/actions/auth-actions';
import { ShieldIcon, SparkleIcon } from '@/components/icons';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Connexion</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-medium text-brand-600 hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="card">
        <form action={loginAction} className="space-y-5">
          <input type="hidden" name="next" value={next || '/dashboard'} />
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
          <button type="submit" className="btn-primary w-full py-2.5">
            Se connecter
          </button>
        </form>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-ink-200 bg-white px-4 py-3.5 text-xs text-ink-600">
        <SparkleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
        <div>
          <p className="font-semibold text-ink-700">Comptes de démonstration</p>
          <p className="mt-1">
            Admin : <span className="font-mono">admin@iso27001-cert.test</span> /{' '}
            <span className="font-mono">Admin1234!</span>
          </p>
          <p>
            Client : <span className="font-mono">demo@iso27001-cert.test</span> /{' '}
            <span className="font-mono">Demo1234!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
