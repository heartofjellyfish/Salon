"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Painting } from "@/lib/types";
import { PaintingLabel } from "./PaintingLabel";

// Three-layer shadows (contact + soft cast + long throw). Both strings share the
// same structure so Framer Motion can interpolate between them on hover.
const SHADOW_REST =
  "0 2px 3px rgba(0,0,0,0.22), 0 16px 26px -14px rgba(0,0,0,0.42), 0 40px 60px -40px rgba(0,0,0,0.40)";
const SHADOW_HOVER =
  "0 4px 6px rgba(0,0,0,0.26), 0 28px 42px -16px rgba(0,0,0,0.50), 0 72px 92px -52px rgba(0,0,0,0.50)";

interface PaintingFrameProps {
  painting: Painting;
  widthCqw: number;
  aspectRatio: number;
  index: number;
  onOpen: (index: number) => void;
}

export function PaintingFrame({
  painting,
  widthCqw,
  aspectRatio,
  index,
  onOpen,
}: PaintingFrameProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={{ scale: 0.985 }}
      className="group relative flex shrink-0 cursor-pointer flex-col items-center"
      style={{ width: `clamp(116px, ${widthCqw}cqw, 640px)` }}
      aria-label={`View ${painting.title} by ${painting.artist}, ${painting.year}`}
    >
      <motion.div
        variants={{
          rest: { y: 0, boxShadow: SHADOW_REST },
          hover: { y: -6, boxShadow: SHADOW_HOVER },
        }}
        transition={{ type: "spring", stiffness: 190, damping: 26 }}
        className="relative w-full rounded-[2px]"
        style={{
          padding: "clamp(7px, 0.9cqw, 15px)",
          background: "linear-gradient(160deg, #352e25 0%, #201a14 58%, #2b241b 100%)",
        }}
      >
        {/* mat board */}
        <div
          className="relative w-full"
          style={{
            padding: "clamp(8px, 1.5cqw, 26px)",
            background: "linear-gradient(180deg, #f1ebde, #e5ddcc)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 2px 6px rgba(0,0,0,0.10)",
          }}
        >
          {/* the artwork window */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: String(aspectRatio),
              backgroundColor: painting.dominantColor ?? "#cabfa8",
            }}
          >
            <Image
              src={painting.imageUrl}
              alt={`${painting.title} — ${painting.artist}, ${painting.year}`}
              fill
              sizes="(max-width: 640px) 78vw, 30vw"
              className="object-cover"
              priority={index < 2}
            />
            {/* varnish sheen */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 30%)",
              }}
            />
            {/* recess where the artwork sits behind the mat */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.18)" }}
            />
          </div>
        </div>
      </motion.div>

      {/* museum label — revealed on hover / keyboard focus */}
      <motion.div
        variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="label-on-touch absolute left-1/2 top-full mt-4 w-max max-w-[15rem] -translate-x-1/2"
        style={{ color: "var(--ui-ink)" }}
      >
        <PaintingLabel painting={painting} align="center" />
      </motion.div>
    </motion.button>
  );
}
