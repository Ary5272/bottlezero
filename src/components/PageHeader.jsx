export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-1">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
