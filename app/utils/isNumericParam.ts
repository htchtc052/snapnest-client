export function isNumericParam(value: unknown): value is string {
  return typeof value === 'string' && /^\d+$/.test(value)
}
