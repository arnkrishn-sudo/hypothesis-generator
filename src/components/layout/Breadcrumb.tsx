import { FlaskConical } from 'lucide-react'

export function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600">
        <FlaskConical className="h-4 w-4 text-white" />
      </div>
      <span>
        Learning Hub Workspace <span className="text-slate-300">/</span> Experimentation
        Platform
      </span>
    </div>
  )
}
