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
    <div className="border-t border-black/5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-bg-main/30"
      >
        <div>
          <p className="text-sm font-semibold text-text-primary">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>}
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-black/5 px-6 pb-6 pt-4">{children}</div>}
    </div>
  )
}
