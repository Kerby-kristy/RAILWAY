import Link from 'next/link';
import { registerAction } from '@/actions/auth-actions';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
      <p className="mt-1 text-sm text-slate-600">
        Déjà inscrit ?{' '}
        <Link href="/login" className="text-brand-600 hover:underline">
          Se connecter
        </Link>
      </p>

      {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="card mt-6">
        <RegisterForm action={registerAction} />
      </div>
    </div>
  );
}
