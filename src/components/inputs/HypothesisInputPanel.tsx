import type { HypothesisInput } from '../../types/hypothesis'
import { DIRECTION_OPTIONS } from '../../types/hypothesis'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { MeasurementSection } from './MeasurementSection'
import { ModelSelection } from './ModelSelection'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20'

interface HypothesisInputPanelProps {
  form: HypothesisInput
  isStandardMet: boolean
  selectedModels: string[]
  measurementOpen: boolean
  onFieldChange: <K extends keyof HypothesisInput>(field: K, value: HypothesisInput[K]) => void
  onToggleModel: (modelId: string) => void
  onMeasurementToggle: () => void
}

export function HypothesisInputPanel({
  form,
  isStandardMet,
  selectedModels,
  measurementOpen,
  onFieldChange,
  onToggleModel,
  onMeasurementToggle,
}: HypothesisInputPanelProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Hypothesis Inputs</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Translate product insights into structured parameters
          </p>
        </div>
        {isStandardMet && <Badge label="Standard Met" variant="status" />}
      </div>

      <div className="space-y-6 px-6 py-6">
        <FormField
          number={1}
          label="Target Audience"
          category="Who"
          required
          helper="Who will experience this change? Example: new visitors, current subscribers, expired subscribers."
        >
          <input
            type="text"
            className={inputClass}
            value={form.targetAudience}
            onChange={(e) => onFieldChange('targetAudience', e.target.value)}
          />
        </FormField>

        <FormField
          number={2}
          label="Location / Journey Step"
          category="Where"
          required
          helper="Where does the change occur? Example: homepage banner, checkout page, upgrade modal."
        >
          <input
            type="text"
            className={inputClass}
            value={form.location}
            onChange={(e) => onFieldChange('location', e.target.value)}
          />
        </FormField>

        <FormField
          number={3}
          label="Proposed Change"
          category="What (Variant)"
          required
          helper="What specific change will users see in the variant?"
        >
          <textarea
            className={`${inputClass} min-h-[100px] resize-y`}
            value={form.proposedChange}
            onChange={(e) => onFieldChange('proposedChange', e.target.value)}
          />
        </FormField>

        <FormField
          number={4}
          label="User Problem or Friction"
          category="Why (Friction)"
          required
          helper="What friction, confusion, concern, or unmet need are you trying to address?"
        >
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            value={form.userProblem}
            onChange={(e) => onFieldChange('userProblem', e.target.value)}
          />
        </FormField>

        <FormField
          number={5}
          label="Expected Outcome"
          category="Outcome"
          required
          helper="What observable user behavior should change?"
        >
          <input
            type="text"
            className={inputClass}
            value={form.expectedOutcome}
            onChange={(e) => onFieldChange('expectedOutcome', e.target.value)}
          />
        </FormField>

        <FormField
          number={6}
          label="Direction"
          category="Direction"
          required
          helper="What direction should the outcome move?"
        >
          <select
            className={inputClass}
            value={form.direction}
            onChange={(e) => onFieldChange('direction', e.target.value)}
          >
            {DIRECTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          number={7}
          label="Reasoning"
          category="Because"
          required
          helper="Why do you believe this change will influence user behavior?"
        >
          <textarea
            className={`${inputClass} min-h-[80px] resize-y`}
            value={form.reasoning}
            onChange={(e) => onFieldChange('reasoning', e.target.value)}
          />
        </FormField>
      </div>

      <MeasurementSection
        form={form}
        isOpen={measurementOpen}
        onToggle={onMeasurementToggle}
        onChange={onFieldChange}
      />

      <ModelSelection selectedModels={selectedModels} onToggle={onToggleModel} />
    </Card>
  )
}
