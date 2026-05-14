const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

export function formatBytes(value: number | undefined): string {
  const bytes = value ?? 0
  if (bytes <= 0) return '0 B'

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  )

  if (exponent === 0) return `${bytes} B`

  const amount = bytes / 1024 ** exponent
  return `${amount.toFixed(1)} ${BYTE_UNITS[exponent]}`
}
