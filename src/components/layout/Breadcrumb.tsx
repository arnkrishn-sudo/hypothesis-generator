import { FlaskConical } from 'lucide-react'

export function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
        <FlaskConical className="h-4 w-4" />
      </div>
      <span>
        Learning Hub Workspace <span className="text-black/20">/</span> Experimentation Platform
      </span>
    </div>
  )
}
