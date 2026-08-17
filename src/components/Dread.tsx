const WHISPERS = [
  "who pushed me",
  "it wasn't me",
  "look again",
  "don't turn around",
  "you were there",
  "again. again. again.",
];

/** Deterministic pseudo-random so SSR and client match. */
function rnd(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Drip = { x: number; w: number; len: number; bead: number; delay: number; dur: number };

const DRIPS: Drip[] = Array.from({ length: 14 }, (_, i) => {
  const a = rnd(i + 1);
  const b = rnd(i + 21);
  const c = rnd(i + 41);
  return {
    x: 2 + i * 7 + a * 4,
    w: 0.35 + b * 1.1,
    len: 3 + c * 26,
    bead: 0.25 + a * 0.5,
    delay: a * 9,
    dur: 14 + b * 16,
  };
});

const SPATTER = Array.from({ length: 26 }, (_, i) => ({
  cx: rnd(i + 3) * 100,
  cy: rnd(i + 61) * 100,
  r: 0.12 + rnd(i + 91) * 0.5,
  o: 0.25 + rnd(i + 121) * 0.5,
}));

/** Blood running from the top edge + whispering artifacts. Decorative only. */
export function Dread({ whispers = true }: { whispers?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-x-0 top-0 h-[65vh] w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="blood-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.14" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="0.7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <linearGradient id="blood-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a0206" />
            <stop offset="35%" stopColor="#6b0a0d" />
            <stop offset="100%" stopColor="#2b0104" />
          </linearGradient>
        </defs>

        <g filter="url(#blood-rough)">
          {/* uneven pooled edge along the very top */}
          <path
            d="M0 0 H100 V2.4 C92 4.1 88 1.6 82 3.2 C74 5.4 70 2.1 62 3.6 C55 4.9 50 2.2 43 3.9 C36 5.6 31 2.4 24 3.7 C17 5 12 2.3 6 3.4 C4 3.8 2 3.1 0 3.6 Z"
            fill="url(#blood-grad)"
            opacity="0.9"
          />
          {DRIPS.map((d, i) => (
            <g key={i} className="drip-run" style={{ animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}>
              <path
                d={`M${d.x - d.w} 2
                    C${d.x - d.w * 1.3} ${d.len * 0.4} ${d.x - d.w * 0.5} ${d.len * 0.7} ${d.x - d.w * 0.45} ${d.len}
                    Q${d.x} ${d.len + d.bead * 1.6} ${d.x + d.w * 0.45} ${d.len}
                    C${d.x + d.w * 0.5} ${d.len * 0.7} ${d.x + d.w * 1.2} ${d.len * 0.4} ${d.x + d.w} 2 Z`}
                fill="url(#blood-grad)"
              />
              <ellipse
                cx={d.x}
                cy={d.len + d.bead}
                rx={d.w * 0.8}
                ry={d.bead}
                fill="#5c0508"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* dried spatter, low and grimy */}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g filter="url(#blood-rough)">
          {SPATTER.map((s, i) => (
            <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.r} ry={s.r * 1.4} fill="#4a0206" opacity={s.o} />
          ))}
        </g>
      </svg>

      <div className="vignette" />

      {whispers &&
        WHISPERS.map((w, i) => (
          <span
            key={w}
            className="whisper"
            style={{
              top: `${12 + i * 13}%`,
              left: i % 2 ? "auto" : `${4 + i * 5}%`,
              right: i % 2 ? `${6 + i * 4}%` : "auto",
              animationDelay: `${i * 3.1}s`,
            }}
          >
            {w}
          </span>
        ))}
    </div>
  );
}
