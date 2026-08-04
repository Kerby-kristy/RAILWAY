export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className={`text-2xl font-bold text-ink-900 sm:text-3xl ${eyebrow ? 'mt-1.5' : ''}`}>{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-ink-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
