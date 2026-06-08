import { PageHeader } from '../components/header/PageHeader'
import { HypothesisInputPanel } from '../components/inputs/HypothesisInputPanel'
import { ModelAnalysisCard } from '../components/results/ModelAnalysisCard'
import { ModelComparisonMatrix } from '../components/results/ModelComparisonMatrix'
import { RecommendedHypothesisCard } from '../components/results/RecommendedHypothesisCard'
import { useHypothesisGenerator } from '../hooks/useHypothesisGenerator'

export function HypothesisGeneratorPage() {
  const {
    form,
    selectedModels,
    results,
    isGenerating,
    expandedImproved,
    activeAnalysisModel,
    measurementOpen,
    errors,
    isStandardMet,
    recommended,
    updateField,
    toggleModel,
    toggleImproved,
    setMeasurementOpen,
    handleGenerate,
    handleReset,
    scrollToAnalysis,
    copyToClipboard,
  } = useHypothesisGenerator()

  const recommendedExpanded = recommended
    ? expandedImproved.has(`recommended-${recommended.modelId}`)
    : false

  const toggleRecommendedImproved = () => {
    if (!recommended) return
    toggleImproved(`recommended-${recommended.modelId}`)
  }

  return (
    <div className="min-h-screen bg-bg-main font-sans">
      <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 lg:px-8 lg:py-8">
        <PageHeader
          onGenerate={handleGenerate}
          onReset={handleReset}
          isGenerating={isGenerating}
        />

        {errors.length > 0 && (
          <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <HypothesisInputPanel
              form={form}
              isStandardMet={isStandardMet}
              selectedModels={selectedModels}
              measurementOpen={measurementOpen}
              onFieldChange={updateField}
              onToggleModel={toggleModel}
              onMeasurementToggle={() => setMeasurementOpen((prev) => !prev)}
            />
          </div>
          <div className="lg:col-span-5">
            <ModelComparisonMatrix
              results={results}
              isGenerating={isGenerating}
              onAnalyze={scrollToAnalysis}
            />
          </div>
        </div>

        {results && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Model Assay Card
              </span>
              <span className="text-xs text-text-secondary">
                {activeAnalysisModel ? '1 selected' : '0 selected'}
              </span>
            </div>

            <div className="space-y-6">
              {results.map((result) => (
                <ModelAnalysisCard
                  key={result.modelId}
                  result={result}
                  isActive={activeAnalysisModel === result.modelId}
                />
              ))}
            </div>
          </div>
        )}

        {recommended && (
          <RecommendedHypothesisCard
            result={recommended}
            isImprovedExpanded={recommendedExpanded}
            onToggleImproved={toggleRecommendedImproved}
            onCopy={copyToClipboard}
          />
        )}
      </div>
    </div>
  )
}
