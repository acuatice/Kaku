import type { DrawingPoint, DrawingStroke } from "@/lib/drawing/types";

export function normalizeDrawingPoint(clientX: number, clientY: number, rect: Pick<DOMRect, "left" | "top" | "width" | "height">, timestamp: number, pressure?: number): DrawingPoint {
  return { x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)), y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)), timestamp, ...(pressure && pressure > 0 ? { pressure } : {}) };
}
export function backingStoreSize(cssWidth: number, cssHeight: number, devicePixelRatio: number) { const ratio = Math.max(1, devicePixelRatio || 1); return { width: Math.round(cssWidth * ratio), height: Math.round(cssHeight * ratio), ratio }; }
export function undoLastStroke(strokes: readonly DrawingStroke[]) { return strokes.slice(0, -1); }
export function hasDrawableStroke(strokes: readonly DrawingStroke[]) { return strokes.some((stroke) => stroke.points.length > 1); }
