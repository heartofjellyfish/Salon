import type { Painting } from "@/lib/types";
import { formatDimensions } from "@/lib/layout";

interface PaintingLabelProps {
  painting: Painting;
  /** When true, also renders the short note + medium/collection details. */
  detailed?: boolean;
  align?: "left" | "center";
  className?: string;
}

export function PaintingLabel({
  painting,
  detailed = false,
  align = "left",
  className = "",
}: PaintingLabelProps) {
  return (
    <div
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
      style={{ color: "currentColor" }}
    >
      <h3 className="font-serif text-[0.98rem] leading-tight italic">
        {painting.title}
      </h3>
      <p className="mt-1.5 text-[0.62rem] tracking-[0.2em] uppercase opacity-60">
        {painting.artist} <span className="opacity-50">·</span> {painting.year}
      </p>

      {detailed && (
        <>
          {painting.shortNote && (
            <p className="text-pretty mt-4 max-w-[44ch] font-serif text-[0.95rem] leading-relaxed opacity-85">
              {painting.shortNote}
            </p>
          )}
          <dl className="mt-5 space-y-1.5 text-[0.7rem]">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 tracking-[0.16em] uppercase opacity-45">
                Dimensions
              </dt>
              <dd className="opacity-75">{formatDimensions(painting)}</dd>
            </div>
            {painting.details?.map((d) => (
              <div key={d.label} className="flex gap-3">
                <dt className="w-24 shrink-0 tracking-[0.16em] uppercase opacity-45">
                  {d.label}
                </dt>
                <dd className="opacity-75">{d.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </div>
  );
}
