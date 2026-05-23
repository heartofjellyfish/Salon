import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryRoom } from "@/components/GalleryRoom";
import { getAllRooms, getCurrentRoom, getRoomBySlug } from "@/lib/rooms";

export function generateStaticParams() {
  return getAllRooms().map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return {};
  return { title: `${room.title} — Salon`, description: room.theme };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  const isCurrent = getCurrentRoom().id === room.id;
  return <GalleryRoom room={room} navActive={isCurrent ? "this-week" : "archive"} />;
}
