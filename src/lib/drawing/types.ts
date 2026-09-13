export type DrawingLevel = "trace" | "copy" | "memory";
export interface DrawingPoint { x: number; y: number; timestamp: number; pressure?: number; }
export interface DrawingStroke { points: DrawingPoint[]; }
export interface StrokeLabel { x: number; y: number; number: number; }
export interface KanaStrokeData { character: string; viewBox: string; paths: readonly string[]; labels: readonly StrokeLabel[]; }
