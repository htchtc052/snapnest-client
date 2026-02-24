export function isNumericPageQueryParam(value: unknown): boolean {
  return value === undefined || (typeof value === 'string' && /^[1-9]\d*$/.test(value))
}
