import Image from "next/image";
import Link from "next/link";
import type { Room } from "@/lib/types";
import { computeHang } from "@/lib/layout";
import { formatDateRange } from "@/lib/format";

interface WeeklyRoomArchiveProps {
  rooms: Room[];
}

export function WeeklyRoomArchive({ rooms }: WeeklyRoomArchiveProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <header className="max-w-xl">
        <p className="text-[0.6rem] tracking-[0.26em] uppercase opacity-50">The Archive</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Rooms past</h1>
        <p className="text-pretty mt-4 font-serif text-[1.02rem] leading-relaxed opacity-70">
          Each week the salon is rehung. The rooms that have closed remain here, kept
          as they were — quiet to return to.
        </p>
      </header>

      {rooms.length === 0 && (
        <p className="mt-16 font-serif text-lg italic opacity-55">
          The first room is still on view. Come back next week.
        </p>
      )}

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:mt-16 sm:grid-cols-2">
        {rooms.map((room, i) => (
          <Link
            key={room.id}
            href={`/room/${room.slug}`}
            className="group block"
            style={{ animation: "rise 0.8s both", animationDelay: `${i * 90}ms` }}
          >
            <RoomThumbnail room={room} />
            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-2xl leading-tight">{room.title}</h2>
                <span className="shrink-0 text-[0.58rem] tracking-[0.2em] uppercase opacity-45">
                  {room.paintings.length} works
                </span>
              </div>
              <p className="mt-1.5 font-serif text-[0.98rem] italic opacity-65">{room.theme}</p>
              <p className="mt-3 text-[0.62rem] tracking-[0.22em] uppercase opacity-45">
                {formatDateRange(room.startDate, room.endDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RoomThumbnail({ room }: { room: Room }) {
  const preview = room.paintings.slice(0, 3);
  const slots = computeHang(preview);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-md shadow-[0_24px_60px_-36px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-out group-hover:-translate-y-1"
      style={{ background: "linear-gradient(177deg, #efe9e0, #e1d8c6)" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ containerType: "inline-size" }}
      >
        <div className="flex items-center justify-center gap-[6cqw] pb-[7%]">
          {preview.map((painting, i) => (
            <div key={painting.id} className="shrink-0" style={{ width: `${slots[i].widthCqw}cqw` }}>
              <div
                className="rounded-[1px] p-[3%] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.5)]"
                style={{ background: "linear-gradient(160deg,#332c23,#1f1912)" }}
              >
                <div className="bg-[#f1ebde] p-[5%]">
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: String(slots[i].aspectRatio),
                      backgroundColor: painting.dominantColor ?? "#cabfa8",
                    }}
                  >
                    <Image
                      src={painting.imageUrl}
                      alt={`${painting.title} — ${painting.artist}`}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="room-grain pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 50% 36%, transparent 55%, rgba(0,0,0,0.12))" }}
      />
    </div>
  );
}
