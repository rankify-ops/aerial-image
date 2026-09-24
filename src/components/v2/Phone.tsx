import { asset } from "@/lib/basePath";

/*
 * iPhone-style frame in pure CSS: black bezel, dynamic island, status bar.
 * The screen is a pearl app surface; children are the "app".
 */
export function Phone({
  children,
  className = "",
  style,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
}) {
  return (
    <div className={`phone ${className}`} style={style}>
      <div className={`phone-screen ${dark ? "bg-ink text-white" : ""}`}>
        <div className={`mono pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[34px] items-center justify-between px-[9%] text-[8.5px] tracking-[0.04em] ${dark ? "text-white" : "text-ink"}`}>
          <span>10:41</span>
          <span className="flex items-center gap-1">
            <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden><path d="M1 7h1.5V5H1zM4 7h1.5V3.5H4zM7 7h1.5V2H7zM10 7h1.5V.5H10z" fill="currentColor" /></svg>
            <svg width="16" height="8" viewBox="0 0 16 8" aria-hidden><rect x=".5" y=".5" width="13" height="7" rx="2" stroke="currentColor" fill="none" /><rect x="2" y="2" width="9" height="4" rx="1" fill="currentColor" /></svg>
          </span>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[9px] z-20 h-[20px] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        {children}
        <div className={`pointer-events-none absolute bottom-[7px] left-1/2 z-20 h-[4px] w-[34%] -translate-x-1/2 rounded-full ${dark ? "bg-white/70" : "bg-ink/80"}`} />
      </div>
    </div>
  );
}

/** The ΛΛ mark as a mask (colour = background), sized by the caller. */
export function Mark({ className = "" }: { className?: string }) {
  const url = `url(${asset("/img/ai-mark.png")})`;
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
}
