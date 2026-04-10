# CLAUDE.md

## Vision and Mission
AI letter generator. Users answer three prompts about someone they care about. Claude transforms them into a beautiful animated letter. Fully anonymous, shareable via unique link, no login required.

## Current Stack
- TypeScript, React, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL, auth-free letter storage)
- Claude API (Sonnet) for letter generation
- Deployed via Lovable (Vite + auto-deploy from Lovable editor, manual Publish required for GitHub pushes)
- Repo: harshitleads/dear-her
- Live: dearher.harshit.ai

## Architecture
- Landing page with relationship type selector
- Three-prompt writer with voice input
- Letter generation via Claude API
- Shareable letter page with typewriter animation
- Supabase stores letters with hashed IPs only

## Code Rules
- No em dashes anywhere in copy
- NEVER run git commit, git push, git reset, git checkout, or any git write commands
- NEVER delete files unless the task spec explicitly says to delete a specific named file
- NEVER touch .env, .gitignore, or any config files — only touch the files listed in the task spec
- This is a Vite/React app — NO "use client" directives

## Deployment Rules
- Lovable does NOT auto-deploy from GitHub pushes
- After Cursor pushes, must manually click Publish → Update in Lovable editor
- .env must remain in the repo for Lovable's build pipeline

## Decision Logging
When you make or execute a product or technical decision, append it to `docs/decisions.md` in this format:
```
### YYYY-MM-DD -- Short title
**Decision:** What was decided.
**Why:** The reasoning.
**Rejected:** What alternatives were considered and why they lost.
```

---

## ACTIVE TASK: Add Floating Case Study Bubble

### Context
Add a floating popup to the landing page linking to the case study on harshit.ai. Consumer app — 30s reappear delay after dismiss.

### What to Do

**1. Create `src/components/CaseStudyBubble.tsx`** with this exact content:

```tsx
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
```

**2. In `src/index.css`**, add at the very bottom (only if not already present):
```css
@keyframes bubbleIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 639px) {
  .fixed.bottom-6.right-6 {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}
```

**3. In `src/pages/Index.tsx`**:
- Add import at top: `import CaseStudyBubble from "@/components/CaseStudyBubble";`
- Add `<CaseStudyBubble />` as the last child inside the root div, after `</motion.div>`

### DO NOT TOUCH
- .env
- .gitignore
- Any file not listed above

### Acceptance Criteria
- [ ] Bubble appears bottom-right after 3 seconds on landing page
- [ ] Links to https://harshit.ai/work/dear-her in new tab
- [ ] Clicking x dismisses, reappears after 30 seconds
- [ ] Matches rose/pink theme
- [ ] No TypeScript errors
- [ ] No "use client" directives anywhere

### Files to Touch (ONLY these)
- CREATE: `src/components/CaseStudyBubble.tsx`
- EDIT: `src/pages/Index.tsx` (import + render)
- EDIT: `src/index.css` (keyframe + mobile, only if not present)
