import type { ReactNode } from 'react'

interface FormFieldProps {
  number: number
  label: string
  category?: string
  required?: boolean
  helper: string
  children: ReactNode
}

export function FormField({
  number,
  label,
  category,
  required = false,
  helper,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-text-primary">
          {number}. {label}
          {required && <span className="text-error"> *</span>}
        </label>
        {category && (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            {category}
          </span>
        )}
      </div>
      {children}
      <p className="text-xs leading-relaxed text-text-secondary">{helper}</p>
    </div>
  )
}
