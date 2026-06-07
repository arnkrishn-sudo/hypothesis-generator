import { BEDROCK_MODEL_POOL } from '../../types/hypothesis'

interface ModelSelectionProps {
  selectedModels: string[]
  onToggle: (modelId: string) => void
}

export function ModelSelection({ selectedModels, onToggle }: ModelSelectionProps) {
  return (
    <div className="border-t border-slate-100 px-6 py-5">
      <h3 className="text-sm font-semibold text-slate-800">Model Selection</h3>
      <p className="mt-1 text-xs text-slate-500">
        Select Bedrock models to compare coach evaluation quality.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BEDROCK_MODEL_POOL.map((model) => (
          <label
            key={model.modelId}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selectedModels.includes(model.modelId)}
              onChange={() => onToggle(model.modelId)}
              className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm text-slate-700">{model.displayName}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
