# CLAUDE.md

## Vision and Mission
AI letter generator. Users answer three prompts about someone they care about. Claude transforms them into a beautiful animated letter. Fully anonymous, shareable via unique link, no login required.

## Current Stack
- TypeScript, React, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL, auth-free letter storage)
- Claude API (Sonnet) for letter generation
- Deployed via Lovable (Vite + manual Publish required for GitHub pushes)
- Repo: harshitleads/dear-her
- Live: dearher.harshit.ai

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

---

## ACTIVE TASK: Simplify Case Study Bubble — persistent, all pages, right-aligned

### Context
The current CaseStudyBubble has dismiss/reappear logic and only shows on the landing page. We want it persistent (always visible, no dismiss), showing on ALL pages, and right-aligned on mobile (not full-width).

### What to Do

**1. Replace `src/components/CaseStudyBubble.tsx`** with this simplified version:

```tsx
export default function CaseStudyBubble() {
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
    </a>
  );
}
```

**2. Move render from `src/pages/Index.tsx` to `src/App.tsx`:**

In `src/pages/Index.tsx`:
- REMOVE the import line: `import CaseStudyBubble from "@/components/CaseStudyBubble";`
- REMOVE the `<CaseStudyBubble />` render from the JSX

In `src/App.tsx`:
- ADD import: `import CaseStudyBubble from "@/components/CaseStudyBubble";`
- ADD `<CaseStudyBubble />` right before the closing `</QueryClientProvider>` tag, so it renders on all routes

**3. In `src/index.css`**, REMOVE the mobile full-width override. Find and delete this block:
```css
@media (max-width: 639px) {
  .fixed.bottom-6.right-6 {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}
```

Keep the `bubbleIn` keyframe — that stays.

### DO NOT TOUCH
- .env
- .gitignore
- Any file not listed above

### Files to Touch (ONLY these)
- EDIT: `src/components/CaseStudyBubble.tsx` (simplify — remove all state/timers/dismiss)
- EDIT: `src/pages/Index.tsx` (remove import and render of CaseStudyBubble)
- EDIT: `src/App.tsx` (add import and render of CaseStudyBubble)
- EDIT: `src/index.css` (remove mobile full-width media query, keep bubbleIn keyframe)
