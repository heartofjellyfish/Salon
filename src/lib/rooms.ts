import { rooms } from "@/data/rooms";
import type { Room } from "./types";

/** All rooms, newest first. */
export function getAllRooms(): Room[] {
  return [...rooms].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** Today as an ISO date string (YYYY-MM-DD), in the server's locale. */
function todayISO(today: Date): string {
  return today.toISOString().slice(0, 10);
}

/**
 * The room currently on view: the one whose date range contains today, or — if
 * there is no live room — the most recent one, so "/" is never empty.
 */
export function getCurrentRoom(today: Date = new Date()): Room {
  const iso = todayISO(today);
  const live = getAllRooms().find((r) => r.startDate <= iso && iso <= r.endDate);
  return live ?? getAllRooms()[0];
}

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

/** Past rooms for the archive — every room except the one currently on view. */
export function getArchiveRooms(today: Date = new Date()): Room[] {
  const current = getCurrentRoom(today);
  return getAllRooms().filter((r) => r.id !== current.id);
}
