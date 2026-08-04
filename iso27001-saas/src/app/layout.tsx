import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ISO27001 Cert - Certification ISO/IEC 27001',
  description: 'Plateforme de certification ISO/IEC 27001 pour particuliers et entreprises.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="fr">
      <body>
        <Navbar session={session} />
        <main className="mx-auto min-h-[calc(100vh-64px)] max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          MVP de démonstration — ISO27001 Cert. Ne constitue pas une certification accréditée.
        </footer>
      </body>
    </html>
  );
}
