import { useEffect, useRef } from 'react';

// Ambient background: a quiet grid where signals run along the lines,
// like leads moving through a funnel. Pauses off-screen and for reduced motion.
export function SignalGrid({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CELL = 56;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true;
    type Pulse = { horiz: boolean; line: number; pos: number; speed: number; len: number };
    let pulses: Pulse[] = [];

    const spawn = (): Pulse => {
      const horiz = Math.random() < 0.6;
      const lines = horiz ? Math.floor(h / CELL) : Math.floor(w / CELL);
      return {
        horiz,
        line: (1 + Math.floor(Math.random() * Math.max(1, lines - 1))) * CELL,
        pos: -120,
        speed: 0.6 + Math.random() * 1.3,
        len: 60 + Math.random() * 110,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(4, Math.round((w * h) / 140000));
      pulses = Array.from({ length: count }, () => {
        const p = spawn();
        p.pos = Math.random() * (p.horiz ? w : h);
        return p;
      });
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = CELL; x < w; x += CELL) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }
      for (let y = CELL; y < h; y += CELL) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      for (let x = CELL; x < w; x += CELL * 3)
        for (let y = CELL; y < h; y += CELL * 3) ctx.fillRect(x - 1, y - 1, 2, 2);
    };

    const frame = () => {
      drawGrid();
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        p.pos += p.speed;
        const max = p.horiz ? w : h;
        if (p.pos - p.len > max) {
          pulses[i] = spawn();
          continue;
        }
        const [x1, y1, x2, y2] = p.horiz
          ? [p.pos - p.len, p.line + 0.5, p.pos, p.line + 0.5]
          : [p.line + 0.5, p.pos - p.len, p.line + 0.5, p.pos];
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, 'rgba(227,33,45,0)');
        g.addColorStop(1, 'rgba(227,33,45,0.32)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,150,155,0.5)';
        ctx.beginPath();
        ctx.arc(x2, y2, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduce) drawGrid();
    else raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) drawGrid();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
