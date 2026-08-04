import { redirect } from 'next/navigation';

async function searchCertificate(formData: FormData) {
  'use server';
  const number = String(formData.get('certificateNumber') || '').trim();
  if (number) {
    redirect(`/verify/${encodeURIComponent(number)}`);
  }
}

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Vérifier un certificat</h1>
      <p className="mt-1 text-sm text-slate-600">
        Saisissez le numéro de certificat (visible sur le document PDF ou scanné via le QR code).
      </p>

      <form action={searchCertificate} className="card mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="certificateNumber">
            Numéro de certificat
          </label>
          <input
            className="input"
            id="certificateNumber"
            name="certificateNumber"
            placeholder="ISO27001-C-2026-XXXXXXXX"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Vérifier
        </button>
      </form>
    </div>
  );
}
