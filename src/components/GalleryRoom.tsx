"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion, useSpring } from "motion/react";
import type { LightMood, Room } from "@/lib/types";
import { RoomNavigation } from "./RoomNavigation";
import { RoomWall } from "./RoomWall";
import { CuratorNote } from "./CuratorNote";
import { LightToggle } from "./LightToggle";
import { PaintingViewer } from "./PaintingViewer";

interface GalleryRoomProps {
  room: Room;
  navActive?: "this-week" | "archive";
}

export function GalleryRoom({ room, navActive = "this-week" }: GalleryRoomProps) {
  const [mood, setMood] = useState<LightMood>(room.defaultLight ?? "daylight");
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const mvx = useSpring(0, { stiffness: 55, damping: 18, mass: 0.5 });
  const mvy = useSpring(0, { stiffness: 55, damping: 18, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduceMotion || viewerOpen || e.pointerType !== "mouse") return;
    mvx.set(e.clientX / window.innerWidth - 0.5);
    mvy.set(e.clientY / window.innerHeight - 0.5);
  };

  useEffect(() => {
    if (viewerOpen) {
      mvx.set(0);
      mvy.set(0);
    }
  }, [viewerOpen, mvx, mvy]);

  const openPainting = useCallback((i: number) => {
    setIndex(i);
    setViewerOpen(true);
  }, []);
  const closeViewer = useCallback(() => setViewerOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="stage relative h-[100svh] w-full overflow-hidden"
        data-light={mood}
        onPointerMove={handlePointerMove}
      >
        {/* the room, which dollies in and dims when a painting is opened */}
        <div className="camera absolute inset-0" data-viewing={viewerOpen}>
          <RoomWall paintings={room.paintings} onOpen={openPainting} mvx={mvx} mvy={mvy} />
        </div>

        {/* floating chrome — fades away while viewing a painting */}
        <div
          className="transition-opacity duration-500"
          style={{ opacity: viewerOpen ? 0 : 1, pointerEvents: viewerOpen ? "none" : "auto" }}
        >
          <RoomNavigation active={navActive} />
          <LightToggle value={mood} onChange={setMood} />
        </div>

        <CuratorNote room={room} />

        {viewerOpen && (
          <PaintingViewer
            paintings={room.paintings}
            index={index}
            onClose={closeViewer}
            onIndex={setIndex}
          />
        )}
      </main>
    </MotionConfig>
  );
}
