import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { ShieldIcon } from '@/components/icons';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'ISO27001 Cert — Certification ISO/IEC 27001',
  description: 'Plateforme de certification ISO/IEC 27001 pour particuliers et entreprises.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink-50 font-sans text-ink-900 antialiased">
        <Navbar session={session} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-ink-200/70 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              <ShieldIcon className="h-4 w-4 text-brand-600" />
              ISO27001 Cert
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-ink-500">
              MVP de démonstration à des fins de test produit. Ne constitue pas une certification accréditée par un
              organisme reconnu.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
