const STYLES: Record<string, string> = {
  DRAFT: 'bg-ink-100 text-ink-600',
  SUBMITTED: 'bg-brand-100 text-brand-700',
  UNDER_REVIEW: 'bg-gold-100 text-gold-800',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  VALID: 'bg-emerald-100 text-emerald-700',
  REVOKED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-ink-200 text-ink-600',
};

const DOT_STYLES: Record<string, string> = {
  DRAFT: 'bg-ink-400',
  SUBMITTED: 'bg-brand-500',
  UNDER_REVIEW: 'bg-gold-500',
  APPROVED: 'bg-emerald-500',
  REJECTED: 'bg-red-500',
  VALID: 'bg-emerald-500',
  REVOKED: 'bg-red-500',
  EXPIRED: 'bg-ink-400',
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
    <span className={`badge ${STYLES[status] || 'bg-ink-100 text-ink-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status] || 'bg-ink-400'}`} />
      {LABELS[status] || status}
    </span>
  );
}
