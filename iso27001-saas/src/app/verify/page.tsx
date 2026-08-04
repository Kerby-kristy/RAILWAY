import { redirect } from 'next/navigation';
import { SearchIcon } from '@/components/icons';

async function searchCertificate(formData: FormData) {
  'use server';
  const number = String(formData.get('certificateNumber') || '').trim();
  if (number) {
    redirect(`/verify/${encodeURIComponent(number)}`);
  }
}

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <SearchIcon className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Vérifier un certificat</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          Saisissez le numéro de certificat, visible sur le document PDF ou scanné via le QR code.
        </p>
      </div>

      <form action={searchCertificate} className="card space-y-4">
        <div>
          <label className="label" htmlFor="certificateNumber">
            Numéro de certificat
          </label>
          <input
            className="input font-mono"
            id="certificateNumber"
            name="certificateNumber"
            placeholder="ISO27001-C-2026-XXXXXXXX"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full py-2.5">
          Vérifier
        </button>
      </form>
    </div>
  );
}
