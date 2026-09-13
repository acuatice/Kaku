"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";

type Point = { x: number; y: number };
type Stroke = Point[];

export function WritingCanvas({ onStrokeChange }: { onStrokeChange?: (hasStrokes: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.scale(ratio, ratio);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = Math.max(7, rect.width * 0.025);
    context.strokeStyle = "#171719";
    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.stroke();
    }
  };

  useEffect(() => {
    draw();
    const resize = () => draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke = [pointFromEvent(event)];
    activeStrokeRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
  };

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStrokeRef.current) return;
    activeStrokeRef.current.push(pointFromEvent(event));
    draw();
  };

  const finishStroke = () => {
    if (!activeStrokeRef.current) return;
    activeStrokeRef.current = null;
    setStrokeCount(strokesRef.current.length);
    onStrokeChange?.(strokesRef.current.length > 0);
  };

  const undo = () => { strokesRef.current = strokesRef.current.slice(0, -1); setStrokeCount(strokesRef.current.length); onStrokeChange?.(strokesRef.current.length > 0); draw(); };
  const clear = () => { strokesRef.current = []; setStrokeCount(0); onStrokeChange?.(false); draw(); };

  return <div><div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-hero)] bg-white"><div className="pointer-events-none absolute inset-0" aria-hidden="true"><span className="absolute left-1/2 top-0 h-full w-px bg-[var(--kaku-purple)]/10"/><span className="absolute left-0 top-1/2 h-px w-full bg-[var(--kaku-purple)]/10"/><span className="absolute left-[12%] top-[12%] size-3 rounded-full bg-[var(--yuzu)] ring-2 ring-[var(--sumi)]/10"/></div><canvas ref={canvasRef} onPointerDown={startStroke} onPointerMove={continueStroke} onPointerUp={finishStroke} onPointerCancel={finishStroke} className="absolute inset-0 size-full touch-none" aria-label="Lienzo de escritura" /></div><div className="mt-3 flex items-center justify-between"><span className="text-xs text-[var(--muted)]">{strokeCount} {strokeCount === 1 ? "trazo" : "trazos"}</span><div className="flex gap-2"><IconButton icon="undo" label="Deshacer último trazo" onClick={undo} className="bg-white text-[var(--sumi)]" /><IconButton icon="trash" label="Limpiar lienzo" onClick={clear} className="bg-white text-[var(--sumi)]" /></div></div></div>;
}
