import { useCallback, useMemo, useState } from 'react'
import type { HypothesisInput, ModelResult } from '../types/hypothesis'
import { DEFAULT_FORM_VALUES, DEFAULT_SELECTED_MODELS } from '../types/hypothesis'
import { generateHypotheses } from '../services/hypothesisApi'

const REQUIRED_FIELDS: (keyof HypothesisInput)[] = [
  'targetAudience',
  'location',
  'proposedChange',
  'userProblem',
  'expectedOutcome',
  'direction',
  'reasoning',
]

export function useHypothesisGenerator() {
  const [form, setForm] = useState<HypothesisInput>(DEFAULT_FORM_VALUES)
  const [selectedModels, setSelectedModels] = useState<string[]>(DEFAULT_SELECTED_MODELS)
  const [results, setResults] = useState<ModelResult[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedImproved, setExpandedImproved] = useState<Set<string>>(new Set())
  const [activeAnalysisModel, setActiveAnalysisModel] = useState<string | null>(null)
  const [measurementOpen, setMeasurementOpen] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const isStandardMet = useMemo(
    () =>
      REQUIRED_FIELDS.every((field) => {
        const value = form[field]
        return typeof value === 'string' && value.trim().length > 0
      }),
    [form],
  )

  const recommended = useMemo(() => {
    if (!results || results.length === 0) return null
    return results.reduce((best, curr) => (curr.score > best.score ? curr : best))
  }, [results])

  const updateField = useCallback(
    <K extends keyof HypothesisInput>(field: K, value: HypothesisInput[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
    )
  }, [])

  const toggleImproved = useCallback((modelId: string) => {
    setExpandedImproved((prev) => {
      const next = new Set(prev)
      if (next.has(modelId)) next.delete(modelId)
      else next.add(modelId)
      return next
    })
  }, [])

  const handleGenerate = useCallback(async () => {
    const validationErrors: string[] = []
    if (!isStandardMet) validationErrors.push('Please fill in all required fields.')
    if (selectedModels.length === 0) validationErrors.push('Select at least one model.')

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    setIsGenerating(true)
    try {
      const data = await generateHypotheses(form, selectedModels)
      setResults(data)
      setActiveAnalysisModel(null)
      setExpandedImproved(new Set())
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate hypotheses. Please try again.'
      setErrors([message])
    } finally {
      setIsGenerating(false)
    }
  }, [form, isStandardMet, selectedModels])

  const handleReset = useCallback(() => {
    setForm(DEFAULT_FORM_VALUES)
    setSelectedModels(DEFAULT_SELECTED_MODELS)
    setResults(null)
    setErrors([])
    setExpandedImproved(new Set())
    setActiveAnalysisModel(null)
    setMeasurementOpen(false)
  }, [])

  const scrollToAnalysis = useCallback((modelId: string) => {
    setActiveAnalysisModel(modelId)
    const el = document.getElementById(`analysis-card-${modelId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
  }, [])

  return {
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
  }
}
