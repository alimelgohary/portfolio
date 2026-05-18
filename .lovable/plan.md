## Goal

Replace the current dark emerald minimalist look with a bold **Brutalist Pop** tech aesthetic — light background, sharp black borders, saturated orange-red (#ff5722) primary and yellow (#ffeb3b) accent, large stacked full-width sections.

## Visual direction

- **Palette:** white `#ffffff` background, near-black `#0a0a0a` foreground, primary `#ff5722` (orange-red), accent `#ffeb3b` (yellow)
- **Typography:** Sora (headings, heavy weights) + Manrope (body) via Google Fonts
- **Style cues:** thick 2px black borders, zero/small border-radius, hard offset shadows (e.g. `4px 4px 0 #0a0a0a`), oversized headings, uppercase section labels, no gradients
- **Layout:** full-width stacked sections separated by bold black dividers; each section spans the viewport with generous vertical padding

## Changes

### 1. `src/index.css`
- Swap all `:root` HSL tokens to the new palette (light theme, brutalist).
- Set `--radius` to `0` (sharp corners).
- Update `.gradient-line` → a solid 2px black divider utility.
- Update `.section-heading` to use uppercase, heavier Sora weight, square primary block accent.
- Add utilities: `.brutal-border` (2px solid foreground), `.brutal-shadow` (hard offset shadow), `.brutal-card`.
- Import Sora + Manrope from Google Fonts.

### 2. `tailwind.config.ts`
- `fontFamily.sans` → Manrope; add `fontFamily.display` → Sora.
- Extend `boxShadow.brutal` → `4px 4px 0 0 hsl(var(--foreground))`.

### 3. `index.html`
- Add `<link>` preconnect + Google Fonts stylesheet for Sora (600/700/800) and Manrope (400/500/700).

### 4. `src/pages/Index.tsx` (presentation only)
- Apply `font-display` + uppercase tracking to section headings.
- Wrap each portfolio section as a full-width band (`w-full border-b-2 border-foreground py-20`) with an inner `container`.
- Use brutal-shadow + 2px borders on project cards instead of soft `bg-card` look.
- Hero: enlarge name to display-scale, accent the role with the yellow highlight behind text.
- Keep all existing logic, data flow, conditional rendering, and components unchanged.

### 5. `src/components/Navbar.tsx` (if present) and small shared UI
- Update to use new border/shadow utilities; no behavior change.

## Out of scope

- No changes to data model, contexts, admin dashboard logic, auth, or Supabase.
- No new dependencies (Google Fonts via `<link>` only).
- Admin dashboard inherits the new tokens automatically; no per-page rework.

## Verification

- Visit `/` in preview, confirm light brutalist look, fonts loaded, sections stacked full-width with black dividers.
- Visit `/admin`, confirm forms still readable with new tokens.
