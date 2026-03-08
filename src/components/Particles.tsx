import { useMemo } from "react";

const Particles = ({ count = 20 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 15 + Math.random() * 70,
        size: 3 + Math.random() * 6,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 8,
        swayDuration: 3 + Math.random() * 5,
        swayDelay: Math.random() * 3,
        opacity: 0.25 + Math.random() * 0.4,
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
