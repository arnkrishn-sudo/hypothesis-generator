import type { ModelResult } from '../../types/hypothesis'
import { getClassificationDisplay } from './coachDisplay'

interface CoachClassificationLineProps {
  classification: ModelResult['classification']
}

export function CoachClassificationLine({ classification }: CoachClassificationLineProps) {
  const display = getClassificationDisplay(classification)

  return (
    <p className="flex items-center gap-2 text-sm text-slate-800">
      <span className="text-base leading-none" role="img" aria-hidden="true">
        {display.emoji}
      </span>
      <span className="font-medium">{display.label}</span>
    </p>
  )
}
