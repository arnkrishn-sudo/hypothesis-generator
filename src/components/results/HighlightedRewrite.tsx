interface HighlightedRewriteProps {
  text: string
}

export function HighlightedRewrite({ text }: HighlightedRewriteProps) {
  const parts = text.split(/(\[[^\]]+\])/g)

  return (
    <p className="text-sm leading-relaxed text-slate-700">
      {parts.map((part, index) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span key={index} className="font-semibold text-violet-700">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  )
}
