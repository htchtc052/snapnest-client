type VirtualGridLanesOptions = {
  min?: number
  max?: number
  targetWidth?: number
}

export function getVirtualGridLanes(
  width: number,
  options: VirtualGridLanesOptions = {},
): number {
  const min = options.min ?? 2
  const max = options.max ?? 6
  const targetWidth = options.targetWidth ?? 200
  const raw = Math.floor(width / targetWidth)

  return Math.max(min, Math.min(max, raw || min))
}
