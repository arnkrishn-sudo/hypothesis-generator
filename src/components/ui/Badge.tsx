interface BadgeProps {
  label: string
  variant: 'strong' | 'needs-improvement' | 'status'
}

export function Badge({ label, variant }: BadgeProps) {
  const styles = {
    strong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'needs-improvement': 'bg-amber-50 text-amber-700 border-amber-200',
    status: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }

  const dotColors = {
    strong: 'bg-emerald-500',
    'needs-improvement': 'bg-amber-500',
    status: 'bg-emerald-500',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      {label}
    </span>
  )
}
