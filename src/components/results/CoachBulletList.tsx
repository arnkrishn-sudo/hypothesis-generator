interface CoachBulletListProps {
  items: string[]
}

export function CoachBulletList({ items }: CoachBulletListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-700">
          <span className="mt-0.5 shrink-0 text-slate-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
