import Link from 'next/link';
import { registerAction } from '@/actions/auth-actions';
import RegisterForm from './RegisterForm';
import { ShieldIcon } from '@/components/icons';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Créer un compte</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          Déjà inscrit ?{' '}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="card">
        <RegisterForm action={registerAction} />
      </div>
    </div>
  );
}
