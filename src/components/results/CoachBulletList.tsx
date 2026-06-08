interface CoachBulletListProps {
  items: string[]
}

export function CoachBulletList({ items }: CoachBulletListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-text-primary">
          <span className="mt-0.5 shrink-0 text-text-secondary">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
