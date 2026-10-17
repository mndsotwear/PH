export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-foreground text-background">
        <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
          <circle cx="20" cy="20" r="3.2" fill="currentColor" />
          <circle cx="11" cy="12" r="2.2" fill="var(--brand-1)" />
          <circle cx="29" cy="12" r="2.2" fill="var(--brand-2)" />
          <circle cx="11" cy="28" r="2.2" fill="var(--brand-4)" />
          <circle cx="29" cy="28" r="2.2" fill="var(--brand-3)" />
          <path d="M20 20 11 12M20 20l9-8M20 20l-9 8M20 20l9 8" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        </svg>
      </span>
      {compact ? null : (
        <span className="leading-tight">
          <span className="block text-base font-black tracking-tight">پویان هاب</span>
          <span className="block text-[10px] font-semibold tracking-[0.2em] text-muted">POUYAN HUB</span>
        </span>
      )}
    </span>
  );
}
