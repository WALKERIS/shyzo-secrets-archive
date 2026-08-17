const DRIPS = [
  { left: "6%", w: 7, h: 34, delay: "0s", dur: "9s" },
  { left: "18%", w: 4, h: 22, delay: "2.4s", dur: "13s" },
  { left: "31%", w: 10, h: 48, delay: "5.1s", dur: "11s" },
  { left: "47%", w: 5, h: 28, delay: "1.2s", dur: "15s" },
  { left: "62%", w: 8, h: 40, delay: "3.7s", dur: "10s" },
  { left: "74%", w: 4, h: 19, delay: "6.5s", dur: "14s" },
  { left: "88%", w: 9, h: 44, delay: "0.8s", dur: "12s" },
  { left: "95%", w: 5, h: 26, delay: "4.3s", dur: "16s" },
];

const SMEARS = [
  { top: "12%", left: "4%", size: 180, rot: "12deg", o: 0.14 },
  { top: "52%", right: "6%", size: 260, rot: "-30deg", o: 0.11 },
  { top: "78%", left: "22%", size: 140, rot: "48deg", o: 0.09 },
];

const WHISPERS = [
  "who pushed me",
  "it wasn't me",
  "look again",
  "don't turn around",
  "you were there",
  "again. again. again.",
];

/** Blood drips, smears and whispering artifacts. Purely decorative. */
export function Dread({ whispers = true }: { whispers?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      <div className="blood-edge" />

      {DRIPS.map((d, i) => (
        <span
          key={i}
          className="blood-drip"
          style={{
            left: d.left,
            width: `${d.w}px`,
            ["--drip-h" as string]: `${d.h}vh`,
            animationDelay: d.delay,
            animationDuration: d.dur,
          }}
        >
          <span className="blood-bead" />
        </span>
      ))}

      {SMEARS.map((s, i) => (
        <span
          key={i}
          className="blood-smear"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: `${s.size}px`,
            height: `${s.size * 0.7}px`,
            opacity: s.o,
            transform: `rotate(${s.rot})`,
          }}
        />
      ))}

      <div className="vignette" />

      {whispers &&
        WHISPERS.map((w, i) => (
          <span
            key={w}
            className="whisper"
            style={{
              top: `${8 + i * 14}%`,
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
