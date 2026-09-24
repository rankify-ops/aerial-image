import { asset } from "@/lib/basePath";

/*
 * Their ΛΛ mark (assets-raw/site/logo-white-orig.png, trimmed) used as a CSS
 * mask so it can be ink on paper or white on the footer without a second file.
 */
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const url = `url(${asset("/img/ai-mark.png")})`;
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden
        className={`block h-9 w-[44px] ${light ? "bg-white" : "bg-ink"}`}
        style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
      />
      <span className="sr-only">Aerial Image</span>
    </span>
  );
}
