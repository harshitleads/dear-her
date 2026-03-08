import { useMemo } from "react";

const Particles = ({ count = 20 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        size: 4 + Math.random() * 8,
        duration: 7 + Math.random() * 10,
        delay: Math.random() * 6,
        swayDuration: 3 + Math.random() * 5,
        swayDelay: Math.random() * 3,
        opacity: 0.35 + Math.random() * 0.45,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sway absolute"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            ["--sway-duration" as string]: `${p.swayDuration}s`,
            ["--sway-delay" as string]: `${p.swayDelay}s`,
          }}
        >
          <div
            className="particle rounded-full bg-rose-gold"
            style={{
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              ["--duration" as string]: `${p.duration}s`,
              ["--delay" as string]: `${p.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Particles;
