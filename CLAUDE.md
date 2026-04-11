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

## Architecture
- Landing page with relationship type selector
- Three-prompt writer with voice input
- Letter generation via Claude API
- Shareable letter page with typewriter animation
- Supabase stores letters with hashed IPs only
- `src/components/CaseStudyBubble.tsx` — persistent floating popup linking to harshit.ai/work/dear-her, rendered in App.tsx on all pages

## Code Rules
- No em dashes anywhere in copy
- NEVER run git commit, git push, git reset, git checkout, or any git write commands
- NEVER delete files unless the task spec explicitly says to delete a specific named file
- NEVER touch .env, .gitignore, or any config files unless explicitly listed in task spec
- This is a Vite/React app — NO "use client" directives

## Deployment Rules
- Lovable does NOT auto-deploy from GitHub pushes
- After Cursor pushes, must manually click Publish → Update in Lovable editor
- .env must remain in the repo — Lovable's build pipeline reads env vars from .env at build time
- Supabase anon keys in .env are public by design (security is via RLS policies)

## Completed Work
- 2026-04-10: Persistent case study bubble on all pages (App.tsx), rose/pink theme, no dismiss
