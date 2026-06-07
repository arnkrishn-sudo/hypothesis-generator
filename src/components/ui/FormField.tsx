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
        <label className="text-sm font-medium text-slate-800">
          {number}. {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        {category && (
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">
            {category}
          </span>
        )}
      </div>
      {children}
      <p className="text-xs leading-relaxed text-slate-500">{helper}</p>
    </div>
  )
}
