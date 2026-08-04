import Link from 'next/link';
import { logoutAction } from '@/actions/auth-actions';
import type { SessionPayload } from '@/lib/jwt';

export default function Navbar({ session }: { session: SessionPayload | null }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-700">
          ISO27001 Cert
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/verify" className="text-slate-600 hover:text-brand-700">
            Vérifier un certificat
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-slate-600 hover:text-brand-700">
                Mon espace
              </Link>
              {session.role === 'ADMIN' && (
                <Link href="/admin" className="text-slate-600 hover:text-brand-700">
                  Back-office
                </Link>
              )}
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{session.name}</span>
              <form action={logoutAction}>
                <button type="submit" className="btn-secondary">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-brand-700">
                Connexion
              </Link>
              <Link href="/register" className="btn-primary">
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
