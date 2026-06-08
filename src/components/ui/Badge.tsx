interface BadgeProps {
  label: string
  variant: 'strong' | 'needs-improvement' | 'status'
}

export function Badge({ label, variant }: BadgeProps) {
  const styles = {
    strong: 'bg-success/10 text-success border-success/20',
    'needs-improvement': 'bg-error/10 text-error border-error/20',
    status: 'bg-success/10 text-success border-success/20',
  }

  const dotColors = {
    strong: 'bg-success',
    'needs-improvement': 'bg-error',
    status: 'bg-success',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[variant]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      {label}
    </span>
  )
}
