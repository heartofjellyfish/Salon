import type { Metadata } from "next";
import { RoomNavigation } from "@/components/RoomNavigation";
import { WeeklyRoomArchive } from "@/components/WeeklyRoomArchive";
import { getArchiveRooms } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Archive — Salon",
  description: "Previous weekly rooms, kept as they were.",
};

export default function ArchivePage() {
  const rooms = getArchiveRooms();
  return (
    <>
      <RoomNavigation active="archive" />
      <main className="min-h-[100svh]">
        <WeeklyRoomArchive rooms={rooms} />
      </main>
    </>
  );
}
