import type { HypothesisInput } from '../../types/hypothesis'
import { DECISION_METRIC_OPTIONS } from '../../types/hypothesis'
import { INPUT_CLASS } from '../../styles/formControls'
import { Collapsible } from '../ui/Collapsible'
import { FormField } from '../ui/FormField'

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
      <p className="mb-4 text-xs text-text-secondary">
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
            className={INPUT_CLASS}
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
            className={INPUT_CLASS}
            value={form.guardrailMetric ?? ''}
            onChange={(e) => onChange('guardrailMetric', e.target.value)}
            placeholder="e.g. Support ticket volume"
          />
        </FormField>
        <FormField number={10} label="Notes" helper="Additional experiment planning context.">
          <textarea
            className={`${INPUT_CLASS} min-h-[80px] resize-y`}
            value={form.notes ?? ''}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Any additional planning notes..."
          />
        </FormField>
      </div>
    </Collapsible>
  )
}
