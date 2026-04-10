import { useState, useEffect, useRef, useCallback } from "react";

export default function CaseStudyBubble() {
  const [visible, setVisible] = useState(false);
  const reappearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleShow = useCallback((delay: number) => {
    if (reappearTimer.current) clearTimeout(reappearTimer.current);
    reappearTimer.current = setTimeout(() => setVisible(true), delay);
  }, []);

  useEffect(() => {
    scheduleShow(3000);
    return () => {
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
    };
  }, [scheduleShow]);

  function hide() {
    setVisible(false);
    scheduleShow(30000);
  }

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    hide();
  }

  if (!visible) return null;

  return (
    <a
      href="https://harshit.ai/work/dear-her"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-[10px] rounded-2xl border px-4 py-3 no-underline transition-all hover:brightness-110"
      style={{
        background: "rgba(60,20,30,0.95)",
        borderColor: "rgba(255,182,193,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        animation: "bubbleIn 0.4s ease-out",
      }}
    >
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ background: "rgba(244,114,182,0.15)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-medium" style={{ color: "#fce7f3", margin: 0 }}>
          See the product thinking behind this
        </p>
        <p className="text-[11px]" style={{ color: "#f9a8d4", margin: 0 }}>
          How I built Dear Her
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-1 bg-transparent border-none cursor-pointer text-[16px] leading-none p-0"
        style={{ color: "#9d7084" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fce7f3")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#9d7084")}
        aria-label="Dismiss"
      >
        &#215;
      </button>
    </a>
  );
}
