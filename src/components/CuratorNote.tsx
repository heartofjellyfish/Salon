import type { Room } from "@/lib/types";
import { formatDateRange } from "@/lib/format";

interface CuratorNoteProps {
  room: Room;
}

export function CuratorNote({ room }: CuratorNoteProps) {
  return (
    <aside
      className="panel fixed bottom-5 left-5 z-30 max-w-[19rem] rounded-md p-5 sm:bottom-8 sm:left-8 sm:max-w-[21rem] sm:p-6"
      style={{ animation: "rise 1.1s both", animationDelay: "0.35s" }}
    >
      <p className="text-[0.58rem] tracking-[0.24em] uppercase opacity-50">
        On view · {formatDateRange(room.startDate, room.endDate)}
      </p>
      <h1 className="mt-2 font-serif text-[1.6rem] leading-[1.1]">{room.title}</h1>
      <p className="mt-1.5 font-serif text-[0.95rem] leading-snug italic opacity-65">
        {room.theme}
      </p>

      <div className="my-4 h-px w-10 bg-current opacity-20" />

      <p className="text-[0.58rem] tracking-[0.24em] uppercase opacity-50">
        Curator&rsquo;s note
      </p>
      <p className="text-pretty mt-2 max-w-[40ch] font-serif text-[0.9rem] leading-relaxed opacity-85">
        {room.curatorNote}
      </p>
    </aside>
  );
}
