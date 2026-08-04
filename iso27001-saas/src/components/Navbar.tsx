import Link from 'next/link';
import { logoutAction } from '@/actions/auth-actions';
import type { SessionPayload } from '@/lib/jwt';
import { SearchIcon, ShieldIcon } from './icons';

export default function Navbar({ session }: { session: SessionPayload | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <ShieldIcon className="h-4.5 w-4.5" />
          </span>
          ISO27001 Cert
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/verify"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 sm:flex"
          >
            <SearchIcon className="h-4 w-4" />
            Vérifier un certificat
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
              >
                Mon espace
              </Link>
              {session.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2 font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
                >
                  Back-office
                </Link>
              )}
              <div className="mx-2 hidden h-6 w-px bg-ink-200 sm:block" />
              <span className="hidden pr-1 text-sm font-medium text-ink-500 sm:inline">{session.name}</span>
              <form action={logoutAction}>
                <button type="submit" className="btn-secondary py-2">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
              >
                Connexion
              </Link>
              <Link href="/register" className="btn-primary ml-1">
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
