import { RotateCcw, Sparkles } from 'lucide-react'
import { Breadcrumb } from '../layout/Breadcrumb'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Card } from '../ui/Card'

interface PageHeaderProps {
  onGenerate: () => void
  onReset: () => void
  isGenerating: boolean
}

export function PageHeader({ onGenerate, onReset, isGenerating }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <Breadcrumb />
      <Card className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-primary/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Bedrock Model Evaluations Coach
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Hypothesis Generator
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
              Generate well-structured experimentation hypothesis using AI, based on a proposed
              change, audience, location, and expected outcome, and compare outputs across
              multiple LLMs to pick the most causal framework.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 shadow-sm"
            >
              {isGenerating && <LoadingSpinner />}
              Generate Hypotheses
            </Button>
            <Button variant="ghost" onClick={onReset} disabled={isGenerating}>
              <RotateCcw className="h-4 w-4" />
              Reset Inputs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
