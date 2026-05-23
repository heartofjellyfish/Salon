"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Painting } from "@/lib/types";
import { PaintingLabel } from "./PaintingLabel";
import { ZoomPanImage } from "./ZoomPanImage";

interface PaintingViewerProps {
  paintings: Painting[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}

const CLOSE_MS = 420;

export function PaintingViewer({ paintings, index, onClose, onIndex }: PaintingViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const count = paintings.length;
  const painting = paintings[index];

  // Animate via CSS transitions so the artwork is reliably shown regardless of
  // the JS animation-frame loop, then unmount after the close transition.
  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(onClose, CLOSE_MS);
  }, [onClose]);

  const go = useCallback(
    (delta: number) => onIndex((index + delta + count) % count),
    [index, count, onIndex],
  );

  useEffect(() => {
    const raise = window.setTimeout(() => setOpen(true), 20);
    rootRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(raise);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go]);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${painting.title} by ${painting.artist}`}
      className="fixed inset-0 z-50 outline-none"
      style={{ color: "#ece6db" }}
    >
      {/* dim, blurred backdrop — the room recedes behind it */}
      <div
        className="absolute inset-0"
        onClick={close}
        style={{
          background: "rgba(9,8,7,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: open ? 1 : 0,
          transition: `opacity ${CLOSE_MS}ms ease`,
        }}
      />

      <div
        className="relative flex h-full w-full flex-col px-4 py-4 sm:px-8 sm:py-6"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.94)",
          transition: "opacity 480ms ease, transform 540ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between">
          <span className="text-[0.66rem] tracking-[0.24em] uppercase opacity-60">
            {String(index + 1).padStart(2, "0")} <span className="opacity-40">/</span>{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close viewer (Esc)"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors duration-300 hover:bg-white/15"
          >
            <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* artwork */}
        <div className="relative min-h-0 flex-1 py-3 sm:py-4">
          <div
            key={painting.id}
            className="absolute inset-0"
            style={{ animation: "viewerFadeIn 0.4s ease both" }}
          >
            <ZoomPanImage
              src={painting.imageUrl}
              alt={`${painting.title} — ${painting.artist}, ${painting.year}`}
              dominantColor={painting.dominantColor}
            />
          </div>

          {count > 1 && (
            <>
              <ArrowButton side="left" label="Previous painting" onClick={() => go(-1)} />
              <ArrowButton side="right" label="Next painting" onClick={() => go(1)} />
            </>
          )}
        </div>

        {/* label */}
        <div className="flex items-end justify-between gap-6">
          <PaintingLabel painting={painting} detailed className="max-w-md" />
          <p className="hidden text-right text-[0.58rem] leading-relaxed tracking-[0.2em] uppercase opacity-35 sm:block">
            Scroll or pinch to zoom
            <br />
            Drag to pan · ← → to browse
          </p>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur transition-colors duration-300 hover:bg-white/15 ${
        side === "left" ? "left-1 sm:left-2" : "right-1 sm:right-2"
      }`}
    >
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {side === "left" ? <path d="M12.5 4.5L7 10l5.5 5.5" /> : <path d="M7.5 4.5L13 10l-5.5 5.5" />}
      </svg>
    </button>
  );
}
