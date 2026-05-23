"use client";

import type { LightMood } from "@/lib/types";

const MOODS: { value: LightMood; label: string; icon: React.ReactNode }[] = [
  {
    value: "daylight",
    label: "Daylight",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <circle cx="10" cy="10" r="3.4" />
        <path d="M10 2.4v1.8M10 15.8v1.8M2.4 10h1.8M15.8 10h1.8M4.6 4.6l1.3 1.3M14.1 14.1l1.3 1.3M15.4 4.6l-1.3 1.3M5.9 14.1l-1.3 1.3" />
      </svg>
    ),
  },
  {
    value: "evening",
    label: "Evening",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 12.4A6.2 6.2 0 0 1 7.6 4.5a6.2 6.2 0 1 0 7.9 7.9Z" />
      </svg>
    ),
  },
  {
    value: "spotlight",
    label: "Spotlight",
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.4 3.2h5.2l3 6.4c.4 4-2.9 7.2-5.6 7.2s-6-3.2-5.6-7.2Z" />
        <circle cx="10" cy="11.4" r="1.5" />
      </svg>
    ),
  },
];

interface LightToggleProps {
  value: LightMood;
  onChange: (mood: LightMood) => void;
  className?: string;
}

export function LightToggle({ value, onChange, className = "" }: LightToggleProps) {
  return (
    <div
      className={`pointer-events-auto fixed bottom-6 right-6 z-40 flex items-center gap-0.5 rounded-full p-1 sm:bottom-8 sm:right-8 ${className}`}
      role="group"
      aria-label="Room light"
      style={{
        background: "color-mix(in srgb, var(--glow-color) 14%, transparent)",
        border: "1px solid color-mix(in srgb, var(--ui-ink) 16%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "var(--ui-ink)",
      }}
    >
      {MOODS.map((mood) => {
        const isActive = mood.value === value;
        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            title={mood.label}
            aria-label={mood.label}
            aria-pressed={isActive}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500"
            style={{
              opacity: isActive ? 1 : 0.5,
              background: isActive
                ? "color-mix(in srgb, var(--ui-ink) 12%, transparent)"
                : "transparent",
            }}
          >
            {mood.icon}
          </button>
        );
      })}
    </div>
  );
}
