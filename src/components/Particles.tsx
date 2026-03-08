import { useMemo } from "react";

const Particles = ({ count = 20 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 10 + Math.random() * 15,
        delay: Math.random() * 10,
        swayDuration: 4 + Math.random() * 6,
        swayDelay: Math.random() * 4,
        opacity: 0.15 + Math.random() * 0.25,
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
