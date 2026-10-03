/**
 * Marketing-themed vizual kompozitsiyalar (monoxrom, raqamsiz).
 * Bular real dashboard emas — faqat dizayn elementi.
 */
import Img from "./Img";
import { videos } from "./content";

/* ---------------- Portfolio intro (qora fonda) ---------------- */
export function IntroVisual() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[560px] sm:aspect-[5/4] select-none">
      {/* browser frame + growth chart */}
      <div className="absolute left-0 top-[6%] w-[78%] rounded-[18px] border border-paper/15 bg-paper/[0.04] backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-paper/10 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-paper/25" />
          <span className="h-2 w-2 rounded-full bg-paper/25" />
          <span className="h-2 w-2 rounded-full bg-paper/25" />
          <span className="ml-3 h-2 w-28 rounded-full bg-paper/10" />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
            <span>Campaign</span>
            <span>Growth</span>
          </div>
          <svg viewBox="0 0 320 130" className="mt-4 w-full" fill="none">
            {[30, 65, 100].map((y) => (
              <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="currentColor" className="text-paper/10" />
            ))}
            <path
              d="M0 112 C40 104 60 96 90 98 S140 78 170 70 S230 52 260 34 S300 16 320 10"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-paper"
            />
            <path
              d="M0 112 C40 104 60 96 90 98 S140 78 170 70 S230 52 260 34 S300 16 320 10 L320 130 L0 130Z"
              fill="currentColor"
              className="text-paper/[0.06]"
            />
            <circle cx="320" cy="10" r="5" fill="#D8501E" />
          </svg>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[70, 45, 85, 60].map((h, i) => (
              <div key={i} className="flex h-12 items-end rounded-md bg-paper/[0.05] p-1.5">
                <div className="w-full rounded-sm bg-paper/30" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* campaign card */}
      <div className="absolute bottom-[4%] right-0 w-[52%] rounded-[16px] border border-paper/15 bg-ink p-4 shadow-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">Ad set</p>
        <div className="mt-3 space-y-2">
          {["Audience", "Creative", "Placement"].map((l, i) => (
            <div key={l} className="flex items-center justify-between rounded-lg bg-paper/[0.05] px-3 py-2">
              <span className="text-[12px] text-paper/80">{l}</span>
              <span className={`h-1.5 rounded-full ${i === 1 ? "w-10 bg-accent" : "w-14 bg-paper/25"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* funnel */}
      <div className="absolute right-[6%] top-0 w-[34%] rounded-[16px] border border-paper/15 bg-ink/80 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">Funnel</p>
        <div className="mt-3 space-y-1.5">
          {["Reach", "Lead", "Sale"].map((l, i) => (
            <div key={l} className="mx-auto flex h-6 items-center justify-center rounded bg-paper/15 text-[10px] text-paper/80" style={{ width: `${100 - i * 22}%` }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 01 Strategy flow ---------------- */
export function FlowVisual({ steps }: { steps: string[] }) {
  return (
    <div aria-hidden className="relative flex h-full flex-col justify-center gap-2 p-6 sm:p-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3" style={{ paddingLeft: `${i * 6}%` }}>
          <span
            className={`flex h-9 min-w-[44px] items-center justify-center rounded-full px-4 text-[12px] font-medium ${
              i === steps.length - 1 ? "bg-accent text-white" : "border border-ink/15 bg-paper text-ink"
            }`}
          >
            {s}
          </span>
          {i < steps.length - 1 ? <span className="h-px flex-1 max-w-[60px] bg-ink/20" /> : null}
        </div>
      ))}
    </div>
  );
}

/* ---------------- 02 Ads manager-style panel ---------------- */
export function AdsVisual() {
  const rows = ["Campaign", "Audience A", "Audience B", "Creative 1", "Creative 2"];
  return (
    <div aria-hidden className="flex h-full flex-col p-5 sm:p-7">
      <div className="rounded-[14px] border border-ink/10 bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-graphite">Ads Manager</span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
          </span>
        </div>
        <ul className="divide-y divide-ink/5">
          {rows.map((r, i) => (
            <li key={r} className="flex items-center gap-3 px-4 py-2.5">
              <span className={`h-3.5 w-6 rounded-full ${i === 3 ? "bg-accent" : "bg-ink/80"}`} />
              <span className="flex-1 text-[12px] text-ink/80">{r}</span>
              <span className="h-1.5 rounded-full bg-ink/15" style={{ width: `${30 + ((i * 17) % 40)}px` }} />
            </li>
          ))}
        </ul>
      </div>
      <svg viewBox="0 0 300 70" className="mt-auto w-full pt-4" fill="none">
        <path d="M0 60 L40 52 L80 56 L120 40 L160 42 L200 26 L240 30 L300 8" stroke="currentColor" strokeWidth="2" className="text-ink" />
        <path d="M0 64 L40 60 L80 62 L120 54 L160 56 L200 48 L240 50 L300 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-ink/30" />
      </svg>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
        <span>Test A</span>
        <span>Test B</span>
      </div>
    </div>
  );
}

/* ---------------- 03 Phone + reels grid (real posters) ---------------- */
export function ContentVisual() {
  const tiles = [...videos, ...videos].slice(0, 6);
  return (
    <div aria-hidden className="flex h-full items-center justify-center p-6">
      <div className="relative w-[58%] max-w-[220px] rounded-[30px] border-[6px] border-ink bg-ink p-1.5 shadow-2xl">
        <div className="mx-auto mb-1.5 h-1.5 w-12 rounded-full bg-paper/20" />
        <div className="grid grid-cols-3 gap-[3px] overflow-hidden rounded-[18px]">
          {tiles.map((v, i) => (
            <div key={i} className="relative aspect-[9/16] bg-paper/10">
              <Img src={v.poster} alt="" fill loading="lazy" sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-around pb-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-accent" : "bg-paper/30"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
