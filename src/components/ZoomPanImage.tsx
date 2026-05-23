"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.4;

interface ZoomPanImageProps {
  src: string;
  alt: string;
  dominantColor?: string;
}

/**
 * A dependency-light deep-look surface: wheel / pinch to zoom toward a focal
 * point, drag to pan, double-click to toggle. Transforms are applied imperatively
 * so panning stays smooth without a React re-render per pointer move.
 *
 * For true gigapixel artwork, swap this for a tiled viewer (e.g. OpenSeadragon
 * with DZI pyramids) — the surrounding viewer chrome can stay the same.
 */
export function ZoomPanImage({ src, alt, dominantColor }: ZoomPanImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const view = useRef({ scale: 1, tx: 0, ty: 0 });
  const base = useRef({ w: 0, h: 0 });
  const natural = useRef({ w: 0, h: 0 });
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchDist = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const [isZoomed, setIsZoomed] = useState(false);
  const [ready, setReady] = useState(false);

  const applyView = useCallback(() => {
    const c = containerRef.current;
    const img = imgRef.current;
    if (!c || !img) return;

    const cw = c.clientWidth;
    const ch = c.clientHeight;
    const sw = base.current.w * view.current.scale;
    const sh = base.current.h * view.current.scale;

    // Clamp the pan so the artwork never drifts away from the frame.
    view.current.tx = sw <= cw ? (cw - sw) / 2 : Math.min(0, Math.max(cw - sw, view.current.tx));
    view.current.ty = sh <= ch ? (ch - sh) / 2 : Math.min(0, Math.max(ch - sh, view.current.ty));

    img.style.width = `${base.current.w}px`;
    img.style.height = `${base.current.h}px`;
    img.style.transform = `translate(${view.current.tx}px, ${view.current.ty}px) scale(${view.current.scale})`;

    const zoomed = view.current.scale > 1.01;
    setIsZoomed((prev) => (prev === zoomed ? prev : zoomed));
  }, []);

  const measure = useCallback(() => {
    const c = containerRef.current;
    if (!c || !natural.current.w) return;
    const fit = Math.min(c.clientWidth / natural.current.w, c.clientHeight / natural.current.h);
    base.current = { w: natural.current.w * fit, h: natural.current.h * fit };
    applyView();
  }, [applyView]);

  const zoomAt = useCallback(
    (cx: number, cy: number, nextScale: number) => {
      const s = view.current.scale;
      const ns = Math.min(MAX_SCALE, Math.max(1, nextScale));
      const ix = (cx - view.current.tx) / s;
      const iy = (cy - view.current.ty) / s;
      view.current.scale = ns;
      view.current.tx = cx - ix * ns;
      view.current.ty = cy - iy * ns;
      applyView();
    },
    [applyView],
  );

  // Recompute the fit when the viewport resizes.
  useLayoutEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(c);
    return () => ro.disconnect();
  }, [measure]);

  // Native, non-passive wheel listener so we can prevent the page from scrolling.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, view.current.scale * factor);
    };
    c.addEventListener("wheel", onWheel, { passive: false });
    return () => c.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    natural.current = { w: img.naturalWidth || 1200, h: img.naturalHeight || 1200 };
    view.current = { scale: 1, tx: 0, ty: 0 };
    measure();
    setReady(true);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1 && view.current.scale > 1.01) {
      drag.current = { x: e.clientX, y: e.clientY, tx: view.current.tx, ty: view.current.ty };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();

    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2 - rect.left;
      const cy = (a.y + b.y) / 2 - rect.top;
      if (pinchDist.current) zoomAt(cx, cy, view.current.scale * (dist / pinchDist.current));
      pinchDist.current = dist;
      drag.current = null;
    } else if (drag.current) {
      view.current.tx = drag.current.tx + (e.clientX - drag.current.x);
      view.current.ty = drag.current.ty + (e.clientY - drag.current.y);
      applyView();
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDist.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    zoomAt(cx, cy, view.current.scale > 1.01 ? 1 : DOUBLE_TAP_SCALE);
  };

  const stepZoom = (mult: number) => {
    const c = containerRef.current;
    if (!c) return;
    zoomAt(c.clientWidth / 2, c.clientHeight / 2, view.current.scale * mult);
  };

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        className="relative h-full w-full touch-none overflow-hidden select-none"
        style={{ cursor: isZoomed ? "grab" : "zoom-in" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={onLoad}
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 700ms ease",
            backgroundColor: dominantColor,
          }}
        />
      </div>

      <div
        className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full p-1"
        style={{
          background: "rgba(20,18,16,0.55)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <ZoomButton label="Zoom out" onClick={() => stepZoom(1 / 1.6)}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 10h10" /></svg>
        </ZoomButton>
        <ZoomButton label="Reset zoom" onClick={() => stepZoom(0)}>
          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="11" height="11" rx="1.5" /></svg>
        </ZoomButton>
        <ZoomButton label="Zoom in" onClick={() => stepZoom(1.6)}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 5v10M5 10h10" /></svg>
        </ZoomButton>
      </div>
    </div>
  );
}

function ZoomButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-stone-200 transition-colors duration-300 hover:bg-white/10"
    >
      {children}
    </button>
  );
}
