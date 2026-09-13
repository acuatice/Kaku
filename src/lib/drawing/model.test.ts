import { describe, expect, it } from "vitest";
import { backingStoreSize, hasDrawableStroke, normalizeDrawingPoint, undoLastStroke } from "@/lib/drawing/model";

describe("modelo de escritura", () => {
  it("normaliza igual las coordenadas de touch, ratón o stylus", () => { expect(normalizeDrawingPoint(60, 120, { left: 10, top: 20, width: 100, height: 200 }, 50, 0.6)).toEqual({ x: 0.5, y: 0.5, timestamp: 50, pressure: 0.6 }); });
  it("limita puntos que terminan fuera del canvas", () => { expect(normalizeDrawingPoint(-20, 300, { left: 0, top: 0, width: 100, height: 100 }, 1)).toMatchObject({ x: 0, y: 1 }); });
  it("deshacer elimina solamente el último trazo", () => { const strokes = [{ points: [{ x: 0, y: 0, timestamp: 1 }] }, { points: [{ x: 1, y: 1, timestamp: 2 }] }]; expect(undoLastStroke(strokes)).toEqual([strokes[0]]); expect(strokes).toHaveLength(2); });
  it("distingue un canvas vacío de un trazo real", () => { expect(hasDrawableStroke([])).toBe(false); expect(hasDrawableStroke([{ points: [{ x: 0, y: 0, timestamp: 1 }] }])).toBe(false); expect(hasDrawableStroke([{ points: [{ x: 0, y: 0, timestamp: 1 }, { x: 0.1, y: 0.1, timestamp: 2 }] }])).toBe(true); });
  it("calcula un backing store Retina sin cambiar proporciones", () => { expect(backingStoreSize(375, 375, 3)).toEqual({ width: 1125, height: 1125, ratio: 3 }); expect(backingStoreSize(430, 430, 2)).toEqual({ width: 860, height: 860, ratio: 2 }); });
});
