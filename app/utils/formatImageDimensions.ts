export function formatImageDimensions(
  width?: number | null,
  height?: number | null,
): string {
  if (!width || !height) return 'Unknown'

  return `${width} x ${height}`
}
