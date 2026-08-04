const STYLES: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  VALID: 'bg-emerald-100 text-emerald-700',
  REVOKED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-slate-200 text-slate-600',
};

const LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumis',
  UNDER_REVIEW: 'En cours de revue',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  VALID: 'Valide',
  REVOKED: 'Révoqué',
  EXPIRED: 'Expiré',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] || 'bg-slate-100 text-slate-700'}`}>
      {LABELS[status] || status}
    </span>
  );
}
