// Utility helpers for the ImageCropper component
// These functions are intentionally pure and framework agnostic so they can be unit tested easily.

export interface CropRect { x: number; y: number; w: number; h: number }
export interface Size { w: number; h: number }

/**
 * Parse an aspect string like "16:9" or "4:3"; returns ratio (w / h) or null for free.
 */
export function parseAspect(aspect: string): number | null {
  // Accept only value keyword 'free' (empty string also treated as free). No language-specific synonyms here.
  const normalized = aspect.trim().toLowerCase()
  if (normalized === 'free' || normalized === '') return null
  const [w, h] = normalized.split(':').map(Number)
  return w && h ? w / h : null
}

/**
 * Compute an initial crop rectangle centered inside the given display size with optional aspect.
 * Adds padding (pct of min dimension) so the crop isn't flush to edges.
 */
export function computeDefaultCrop(display: Size, aspect: string, paddingRatio = 0.1): CropRect {
  if (!display.w || !display.h) return { x: 0, y: 0, w: 0, h: 0 }
  const pad = paddingRatio * Math.min(display.w, display.h)
  let targetW = display.w - pad * 2
  let targetH = display.h - pad * 2
  const ar = parseAspect(aspect)
  if (ar) {
    if (targetW / targetH > ar) targetW = targetH * ar
    else targetH = targetW / ar
  }
  const w = Math.round(targetW)
  const h = Math.round(targetH)
  const x = Math.round((display.w - w) / 2)
  const y = Math.round((display.h - h) / 2)
  return { x, y, w, h }
}

/** Clamp a crop rect so it stays within the display bounds and meets min sizes. */
export function clampCrop(crop: CropRect, display: Size, min = 10): CropRect {
  let { x, y, w, h } = crop
  w = Math.max(min, Math.min(w, display.w))
  h = Math.max(min, Math.min(h, display.h))
  x = Math.min(Math.max(0, x), display.w - w)
  y = Math.min(Math.max(0, y), display.h - h)
  return { x, y, w, h }
}

/**
 * Apply aspect ratio constraint by adjusting the secondary dimension.
 * The priorityAxis lets us know which dimension user primarily changed (w or h).
 */
export function enforceAspect(crop: CropRect, aspect: string, priorityAxis: 'w' | 'h'): CropRect {
  const ar = parseAspect(aspect)
  if (!ar) return crop
  let { x, y, w, h } = crop
  if (priorityAxis === 'h') {
    w = Math.round(h * ar)
  } else {
    h = Math.round(w / ar)
  }
  return { x, y, w, h }
}
