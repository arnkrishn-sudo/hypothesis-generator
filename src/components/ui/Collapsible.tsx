import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface CollapsibleProps {
  title: string
  subtitle?: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export function Collapsible({ title, subtitle, isOpen, onToggle, children }: CollapsibleProps) {
  return (
    <div className="border-t border-slate-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50"
      >
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-slate-100 px-6 pb-6 pt-4">{children}</div>}
    </div>
  )
}
