import type { ModelResult, RubricItem } from '../../types/hypothesis'

export function getRubricStatusLabel(criterion: string, passed: boolean): string {
  if (criterion === 'Measurement leakage') {
    return passed ? 'None detected' : 'Present'
  }
  return passed ? 'Pass' : 'Needs work'
}

export function getClassificationDisplay(
  classification: ModelResult['classification'],
): { emoji: string; label: string } {
  if (classification === 'Strong Hypothesis') {
    return { emoji: '🟢', label: 'Strong hypothesis' }
  }
  return { emoji: '🟡', label: 'Needs improvement' }
}

export function getRubricStatusIcon(passed: boolean): string {
  return passed ? '✅' : '❌'
}

export function shouldShowRubricComment(
  criterion: string,
  passed: boolean,
  comment: string,
): boolean {
  if (criterion === 'Measurement leakage' && passed) return false
  return comment.trim().length > 0
}

export type RubricItemWithStatus = RubricItem & { statusLabel: string }

export function enrichRubric(rubric: RubricItem[]): RubricItemWithStatus[] {
  return rubric.map((item) => ({
    ...item,
    statusLabel: getRubricStatusLabel(item.criterion, item.passed),
  }))
}

export function formatRubricLine(item: RubricItemWithStatus): string {
  const status = `${getRubricStatusIcon(item.passed)} ${item.statusLabel}`
  if (!shouldShowRubricComment(item.criterion, item.passed, item.comment)) {
    return status
  }
  return `${status} — ${item.comment}`
}
