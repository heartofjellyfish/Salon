"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { Painting } from "@/lib/types";
import { computeHang } from "@/lib/layout";
import { PaintingFrame } from "./PaintingFrame";

interface RoomWallProps {
  paintings: Painting[];
  onOpen: (index: number) => void;
  /** Normalized pointer position (-0.5 … 0.5). Stays near 0 when parallax is off. */
  mvx: MotionValue<number>;
  mvy: MotionValue<number>;
}

export function RoomWall({ paintings, onOpen, mvx, mvy }: RoomWallProps) {
  const slots = computeHang(paintings);

  // Layers nearer the viewer travel further, against the pointer, for depth.
  const wallX = useTransform(mvx, (v) => v * -16);
  const wallY = useTransform(mvy, (v) => v * -9);
  const plantX = useTransform(mvx, (v) => v * -52);
  const plantY = useTransform(mvy, (v) => v * -26);
  const artX = useTransform(mvx, (v) => v * -38);
  const artY = useTransform(mvy, (v) => v * -20);
  const floorX = useTransform(mvx, (v) => v * -24);
  const floorY = useTransform(mvy, (v) => v * -12);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* WALL (farthest) */}
      <motion.div style={{ x: wallX, y: wallY }} className="absolute inset-0 will-change-transform">
        <div className="room-wall absolute inset-0 scale-110" />
        <div className="room-glow absolute inset-0 scale-110" />
        <div className="room-window absolute inset-0 scale-110" />
      </motion.div>

      {/* PLANT — stands against the wall, behind the art */}
      <motion.div
        style={{ x: plantX, y: plantY }}
        className="pointer-events-none absolute bottom-[20%] left-[-2%] hidden h-[46%] w-[18%] md:block"
        aria-hidden="true"
      >
        <Plant />
      </motion.div>

      {/* FLOOR (anchored to the bottom) */}
      <motion.div
        style={{ x: floorX, y: floorY }}
        className="absolute inset-x-0 bottom-0 h-[26%] will-change-transform"
      >
        <div className="room-baseboard absolute inset-x-0 top-0 h-[6px] scale-x-110" />
        <div className="room-floor absolute inset-0 top-[6px] scale-x-110" />
        <div className="room-floor-sheen absolute inset-0 top-[6px] scale-x-110" />
      </motion.div>

      {/* PAINTINGS (mid depth) */}
      <motion.div
        style={{ x: artX, y: artY }}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <div
          className="w-full"
          style={{ containerType: "inline-size", marginBottom: "9%" }}
        >
          <div className="flex snap-x snap-mandatory items-center justify-start gap-[8vw] overflow-x-auto px-[20vw] [scrollbar-width:none] md:snap-none md:justify-center md:gap-[4.5cqw] md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {paintings.map((painting, i) => (
              <div key={painting.id} className="shrink-0 snap-center">
                <PaintingFrame
                  painting={painting}
                  widthCqw={slots[i].widthCqw}
                  aspectRatio={slots[i].aspectRatio}
                  index={i}
                  onOpen={onOpen}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* room-wide finishing passes */}
      <div className="room-vignette pointer-events-none absolute inset-0" />
      <div className="room-grain pointer-events-none absolute inset-0" />
    </div>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 200 460" className="h-full w-full" preserveAspectRatio="xMidYMax meet" style={{ filter: "blur(0.5px)" }}>
      <g fill="#241d15" opacity="0.42">
        {/* leaves */}
        <path d="M100 300 C70 220 64 140 92 60 C104 130 108 220 100 300Z" />
        <path d="M100 300 C128 230 150 150 150 80 C132 150 116 230 100 300Z" />
        <path d="M100 305 C66 250 36 196 30 140 C58 200 86 252 100 305Z" />
        <path d="M100 305 C140 256 168 206 178 156 C150 214 122 258 100 305Z" />
        <path d="M100 300 C96 220 96 140 100 64 C104 140 104 220 100 300Z" opacity="0.7" />
      </g>
      {/* pot */}
      <g fill="#1c1611" opacity="0.5">
        <path d="M72 300 H128 L120 392 Q100 402 80 392 Z" />
        <ellipse cx="100" cy="300" rx="28" ry="7" fill="#2a2118" />
      </g>
    </svg>
  );
}
