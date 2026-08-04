import Link from 'next/link';
import { registerAction } from '@/actions/auth-actions';
import RegisterForm from './RegisterForm';

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
      <p className="mt-1 text-sm text-slate-600">
        Déjà inscrit ?{' '}
        <Link href="/login" className="text-brand-600 hover:underline">
          Se connecter
        </Link>
      </p>

      {searchParams.error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      )}

      <div className="card mt-6">
        <RegisterForm action={registerAction} />
      </div>
    </div>
  );
}
