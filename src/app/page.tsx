import { GalleryRoom } from "@/components/GalleryRoom";
import { getCurrentRoom } from "@/lib/rooms";

export default function HomePage() {
  const room = getCurrentRoom();
  return <GalleryRoom room={room} navActive="this-week" />;
}
