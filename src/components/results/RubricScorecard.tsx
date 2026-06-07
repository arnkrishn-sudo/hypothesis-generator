import type { RubricItem } from '../../types/hypothesis'
import { enrichRubric, formatRubricLine } from './coachDisplay'

interface RubricScorecardProps {
  rubric: RubricItem[]
}

export function RubricScorecard({ rubric }: RubricScorecardProps) {
  const items = enrichRubric(rubric)

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.criterion} className="flex gap-2 text-sm leading-relaxed text-slate-700">
          <span className="mt-0.5 shrink-0 text-slate-400">•</span>
          <p>
            <span className="font-semibold text-slate-900">{item.criterion}:</span>{' '}
            {formatRubricLine(item)}
          </p>
        </li>
      ))}
    </ul>
  )
}
