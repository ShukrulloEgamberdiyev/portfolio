/**
 * Marketing vizual tili — monoxrom editorial grafikalar.
 * Hech biri real kabinet skrinshoti emas va raqam ko'rsatmaydi.
 */
import Img from './Img';
import { videos } from './content';

/* ── 01 Strategy: auditoriya segmentlari + pozitsiya xaritasi ── */
export function StrategyVisual() {
  return (
    <div aria-hidden className="relative h-full w-full select-none">
      <svg viewBox="0 0 520 420" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
        {/* axes */}
        <line x1="40" y1="210" x2="480" y2="210" stroke="currentColor" className="text-ink/15" />
        <line x1="260" y1="30" x2="260" y2="390" stroke="currentColor" className="text-ink/15" />
        {/* segment rings */}
        {[150, 108, 66].map((r, i) => (
          <circle key={r} cx="300" cy="190" r={r} stroke="currentColor" strokeDasharray={i === 0 ? '3 6' : undefined} className={i === 2 ? 'text-ink/70' : 'text-ink/20'} />
        ))}
        <circle cx="300" cy="190" r="26" className="fill-ink" />
        {/* scattered audience dots */}
        {[
          [120, 110], [150, 300], [200, 80], [420, 120], [440, 300], [360, 350], [90, 220], [400, 60], [230, 340],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" className="fill-ink/25" />
        ))}
        {[[330, 150], [270, 230], [340, 240], [250, 160]].map(([x, y], i) => (
          <circle key={`c${i}`} cx={x} cy={y} r="5" className="fill-ink" />
        ))}
        <circle cx="300" cy="190" r="6" fill="#b89a63" />
      </svg>
      <span className="kicker absolute left-[9%] top-[8%] text-ink/45">Bozor</span>
      <span className="kicker absolute right-[8%] top-[20%] text-ink/45">Segment</span>
      <span className="kicker absolute bottom-[10%] right-[30%] text-ink/70">Asosiy auditoriya</span>
      <span className="kicker absolute bottom-[45%] left-[8%] text-ink/45">Taklif</span>
    </div>
  );
}

/* ── 02 Target: reklama preview (real poster) + abstrakt o‘sish chiziqlari ── */
export function AdsVisual() {
  return (
    <div aria-hidden className="relative h-full w-full select-none">
      {/* abstract performance curves — raqamsiz, faqat grafik */}
      <svg viewBox="0 0 600 450" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path
            key={k}
            d={`M-20 ${400 - k * 14} C 120 ${390 - k * 18}, 200 ${330 - k * 30}, 300 ${300 - k * 34} S 480 ${170 - k * 22}, 640 ${90 - k * 10}`}
            stroke="currentColor"
            strokeWidth={k === 5 ? 2.5 : 1}
            className={k === 5 ? 'text-paper' : 'text-paper/15'}
          />
        ))}
        <circle cx="560" cy="62" r="7" fill="#b89a63" />
      </svg>
      {/* ad preview card with real poster */}
      <div className="absolute bottom-[6%] right-[4%] w-[38%] min-w-[150px] rotate-2 overflow-hidden rounded-[16px] bg-paper shadow-2xl">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="h-5 w-5 rounded-full bg-ink" />
          <span className="h-1.5 w-16 rounded-full bg-ink/20" />
        </div>
        <div className="relative aspect-[4/5] bg-bone">
          <Img src={videos[3].poster} alt="" fill className="object-cover" />
        </div>
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-[11px] font-medium text-ink">Reklama</span>
          <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] text-paper">Batafsil</span>
        </div>
      </div>
    </div>
  );
}

/* ── 03 Content: telefon ichida Reels + kontent kalendari (real posterlar) ── */
export function ContentVisual() {
  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  return (
    <div aria-hidden className="relative flex h-full w-full select-none items-center justify-center gap-[6%] px-[6%]">
      {/* calendar */}
      <div className="hidden w-[46%] sm:block">
        <p className="kicker text-ink/45">Kontent reja</p>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <span key={d} className="text-center font-mono text-[9px] text-ink/40">
              {d}
            </span>
          ))}
          {Array.from({ length: 21 }).map((_, i) => {
            const poster = [2, 5, 9, 12, 16, 19].indexOf(i);
            return (
              <span key={i} className={`relative aspect-square overflow-hidden rounded-[5px] ${poster >= 0 ? 'bg-ink' : i % 3 === 0 ? 'bg-ink/10' : 'bg-ink/5'}`}>
                {poster >= 0 ? <Img src={videos[poster % 4].poster} alt="" fill className="object-cover opacity-90" /> : null}
              </span>
            );
          })}
        </div>
      </div>
      {/* phone */}
      <div className="relative w-[40%] max-w-[210px] rounded-[30px] border-[5px] border-ink bg-ink shadow-2xl">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[24px]">
          <Img src={videos[0].poster} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-ink/20" />
          <span className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink/80" />
          <div className="absolute bottom-3 left-3 right-10 space-y-1.5">
            <span className="block h-1.5 w-2/3 rounded-full bg-paper/80" />
            <span className="block h-1.5 w-1/2 rounded-full bg-paper/50" />
          </div>
          <div className="absolute bottom-3 right-2.5 flex flex-col items-center gap-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-4 w-4 rounded-full bg-paper/80" />
            ))}
          </div>
          <span className="absolute left-0 right-0 top-0 h-[2px] bg-paper/20">
            <span className="block h-full w-2/5 bg-paper" />
          </span>
        </div>
      </div>
    </div>
  );
}
