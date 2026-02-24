const imageDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatImageDate(
  capturedAt?: string | null,
  createdAt?: string | null,
): string {
  const source = capturedAt || createdAt
  if (!source) return ''

  const date = new Date(source.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return source

  return imageDateFormatter.format(date)
}
