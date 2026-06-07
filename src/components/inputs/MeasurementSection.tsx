import type { HypothesisInput } from '../../types/hypothesis'
import { DECISION_METRIC_OPTIONS } from '../../types/hypothesis'
import { Collapsible } from '../ui/Collapsible'
import { FormField } from '../ui/FormField'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20'

interface MeasurementSectionProps {
  form: HypothesisInput
  isOpen: boolean
  onToggle: () => void
  onChange: <K extends keyof HypothesisInput>(field: K, value: HypothesisInput[K]) => void
}

export function MeasurementSection({ form, isOpen, onToggle, onChange }: MeasurementSectionProps) {
  return (
    <Collapsible
      title="Measurement (Optional)"
      subtitle="Used only for experiment planning — not included in the generated hypothesis"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <p className="mb-4 text-xs text-slate-500">
        Measurement fields are not included in the generated hypothesis and are used only for
        experiment planning.
      </p>
      <div className="space-y-5">
        <FormField
          number={8}
          label="Decision Metric"
          helper="Primary metric used to evaluate experiment success."
        >
          <select
            className={inputClass}
            value={form.decisionMetric ?? ''}
            onChange={(e) => onChange('decisionMetric', e.target.value)}
          >
            <option value="">Select a decision metric</option>
            {DECISION_METRIC_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          number={9}
          label="Guardrail Metric"
          helper="Metric monitored to ensure the change does not cause harm."
        >
          <input
            type="text"
            className={inputClass}
            value={form.guardrailMetric ?? ''}
            onChange={(e) => onChange('guardrailMetric', e.target.value)}
            placeholder="e.g. Support ticket volume"
          />
        </FormField>
        <FormField number={10} label="Notes" helper="Additional experiment planning context.">
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            value={form.notes ?? ''}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Any additional planning notes..."
          />
        </FormField>
      </div>
    </Collapsible>
  )
}
