import type { ReactNode } from 'react'

interface CoachSectionProps {
  number: number
  title: string
  children: ReactNode
}

export function CoachSection({ number, title, children }: CoachSectionProps) {
  return (
    <section>
      <h4 className="mb-2 text-sm font-bold text-slate-900">
        {number}. {title}
      </h4>
      <div className="pl-1">{children}</div>
    </section>
  )
}
