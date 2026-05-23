import Link from "next/link";

interface RoomNavigationProps {
  active?: "this-week" | "archive";
}

export function RoomNavigation({ active }: RoomNavigationProps) {
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 sm:py-7"
      style={{ color: "var(--ui-ink)" }}
    >
      <Link
        href="/"
        className="pointer-events-auto font-serif text-lg tracking-[0.18em] uppercase opacity-90 transition-opacity duration-500 hover:opacity-100"
        style={{ textShadow: "0 1px 16px rgba(0,0,0,0.18)" }}
      >
        Salon
      </Link>

      <div
        className="pointer-events-auto flex items-center gap-6 text-[0.7rem] tracking-[0.22em] uppercase sm:gap-8"
        style={{ textShadow: "0 1px 16px rgba(0,0,0,0.18)" }}
      >
        <Link
          href="/"
          className="transition-opacity duration-500"
          style={{ opacity: active === "this-week" ? 1 : 0.6 }}
        >
          This Week
        </Link>
        <Link
          href="/archive"
          className="transition-opacity duration-500"
          style={{ opacity: active === "archive" ? 1 : 0.6 }}
        >
          Archive
        </Link>
      </div>
    </nav>
  );
}
