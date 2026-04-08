export const FONT_PX_MIN = 8
export const FONT_PX_MAX = 120

export function fontSizePxToCss(value: number | null | undefined): string | null {
  if (value == null || typeof value !== 'number' || !Number.isFinite(value))
    return null
  const px = Math.round(value)
  if (px < FONT_PX_MIN || px > FONT_PX_MAX) return null
  return `${px}px`
}
