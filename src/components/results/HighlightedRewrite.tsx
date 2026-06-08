interface HighlightedRewriteProps {
  text: string
}

export function HighlightedRewrite({ text }: HighlightedRewriteProps) {
  const parts = text.split(/(\[[^\]]+\])/g)

  return (
    <p className="text-sm leading-relaxed text-text-primary">
      {parts.map((part, index) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span key={index} className="font-bold italic text-primary">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  )
}
