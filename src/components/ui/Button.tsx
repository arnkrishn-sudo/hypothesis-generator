import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-white border border-primary hover:bg-primary/90 shadow-sm disabled:opacity-50',
  ghost:
    'bg-white text-text-primary border border-black/5 hover:bg-bg-main disabled:opacity-50',
  outline:
    'bg-white text-link border border-link/30 hover:bg-link/5 disabled:opacity-50',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
