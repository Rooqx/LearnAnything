# LearnAnything — Master Design System

> **LOGIC:** When building a specific page, first check `design-system/learnanything/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** LearnAnything  
**Type:** AI-Powered Gamified Learning Hub  
**Audience:** Gen Z (16–28)  
**Vibe:** Playful, gamified, expressive, mobile-first  
**Style:** Glassmorphism + AI-Native UI  

---

## Color Tokens

### Brand Colors

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Primary | `#6C3CE1` | `--color-primary` | Deep Violet — wisdom, tech, Gen Z identity |
| Primary Dark | `#4F1FCC` | `--color-primary-dark` | Hover states, depth, active states |
| Accent | `#C8F135` | `--color-accent` | Cyber Lime — CTAs, highlights, Gen Z signature |
| Reward | `#F7C948` | `--color-reward` | Vivid Amber — XP, streaks, achievements |
| Error | `#FF6B6B` | `--color-error` | Soft Coral — errors, wrong quiz answers |
| Success | `#2DD4BF` | `--color-success` | Teal Glow — completions, correct answers |

### Dark Mode

| Role | Hex | CSS Variable |
|------|-----|-------------|
| Background | `#0E0B1A` | `--color-bg` |
| Surface | `#1A1530` | `--color-surface` |
| Muted Text | `#8B82A7` | `--color-muted` |
| Text Primary | `#F8F6FF` | `--color-text` |
| Text Secondary | `#C4BFD6` | `--color-text-secondary` |
| Border | `rgba(139, 130, 167, 0.2)` | `--color-border` |

### Light Mode

| Role | Hex | CSS Variable |
|------|-----|-------------|
| Background | `#F8F6FF` | `--color-bg` |
| Surface | `#FFFFFF` | `--color-surface` |
| Muted Text | `#7B6F99` | `--color-muted` |
| Text Primary | `#0E0B1A` | `--color-text` |
| Text Secondary | `#4A4260` | `--color-text-secondary` |
| Border | `rgba(123, 111, 153, 0.15)` | `--color-border` |

---

## Typography

### Font Stack
- **Headings:** `Space Grotesk` (weights: 500, 600, 700) via `next/font/google`
- **Body:** `DM Sans` (weights: 400, 500) via `next/font/google`
- **Monospace:** `JetBrains Mono` (weight: 400) via `next/font/google` — code blocks only

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--text-xs` | `0.75rem` (12px) | Captions, badges |
| `--text-sm` | `0.875rem` (14px) | Secondary text, labels |
| `--text-base` | `1rem` (16px) | Body text |
| `--text-lg` | `1.125rem` (18px) | Emphasized body |
| `--text-xl` | `1.25rem` (20px) | Section titles |
| `--text-2xl` | `1.5rem` (24px) | Card headings |
| `--text-3xl` | `1.875rem` (30px) | Page titles |
| `--text-4xl` | `2.25rem` (36px) | Hero headings |

---

## Spacing & Layout

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.5rem` |
| `--radius-md` | `1rem` |
| `--radius-lg` | `1.5rem` |
| `--radius-xl` | `2rem` |
| `--radius-full` | `9999px` |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(108, 60, 225, 0.08)` | Subtle lift |
| `--shadow-md` | `0 4px 24px rgba(108, 60, 225, 0.15)` | Cards, buttons |
| `--shadow-lg` | `0 8px 48px rgba(108, 60, 225, 0.25)` | Modals, dropdowns |
| `--shadow-glow` | `0 0 32px rgba(108, 60, 225, 0.4)` | Primary element glow |

---

## UI Style: Glassmorphism + AI-Native

### Glass Cards
```css
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
/* Dark mode: bg rgba(26, 21, 48, 0.6) */
/* Light mode: bg rgba(255, 255, 255, 0.7) */
border: 1px solid var(--color-border);
```

### Backgrounds
- **Never flat solid colors** — always subtle gradient meshes
- Dark mode base gradient: `radial-gradient(ellipse at top, #1A1530 0%, #0E0B1A 70%)`
- Light mode base gradient: `radial-gradient(ellipse at top, #EDE8FF 0%, #F8F6FF 70%)`
- Generous negative space — content breathes
- Soft glows on primary interactive elements

### Typography Contrast
- Bold headings in Space Grotesk 700 — large and commanding
- Refined body text in DM Sans 400 — smaller, comfortable
- Never let body text feel cramped — `line-height: 1.7` for paragraphs

---

## Icon System

- **Library:** `lucide-react` exclusively
- **NO emojis as icons** anywhere in the app
- **Sizes:** sm = 16px, md = 20px, lg = 24px
- **Color:** inherits from parent text color by default

---

## Component Rules

### Buttons
- 4 variants: `primary`, `secondary`, `ghost`, `danger`
- Primary: `--color-primary` bg, white text, hover: `--color-primary-dark`
- Accent CTAs: `--color-accent` bg, dark text
- Press interaction: `scale(0.96)` + shadow reduction (150ms)
- All buttons: `cursor-pointer`, visible focus ring

### Cards
- Glass surface with `backdrop-filter: blur(16px)`
- Border radius: `--radius-lg` (1.5rem)
- Hover: subtle `translateY(-2px)` + shadow increase
- Transition: 200ms ease

### Inputs
- Border glow with `--color-primary` on focus
- Label floats upward on focus
- Error state: `--color-error` border + message below
- Min height: 48px for touch targets

### Modals
- Glass surface, `--radius-xl` corners
- Backdrop: blur(8px) + dark overlay
- Focus trap, keyboard escape
- Scale-in entrance animation

---

## Animation Rules

### Micro-Interactions (150–300ms)
- Button press: scale(0.96) + shadow reduction
- Chip select: immediate bg fill
- Toggle: smooth thumb slide
- Input focus: border glow transition

### Medium Transitions (200–400ms)
- Page entry/exit: fade + slide
- Modal open/close: scale + fade
- Drawer slide in/out
- Card hover lift

### Complex Animations (FULL mode only)
- Swipe between learning pages: spring physics (stiffness: 300, damping: 30)
- Confetti burst on completion
- XP float-up animation (800ms)
- Staggered list entrance

---

## Anti-Patterns — NEVER USE

- ❌ Emojis as icons
- ❌ Hardcoded colors outside CSS variables
- ❌ Missing `cursor-pointer` on interactive elements
- ❌ Layout-shifting hover effects (scale that reflows)
- ❌ Low contrast text (< 4.5:1 ratio)
- ❌ Instant state changes without transitions
- ❌ Invisible focus states
- ❌ Heavy chrome / slow response feedback
- ❌ Linear easing for UI transitions (use ease-out for enter, ease-in for exit)
- ❌ Animations > 500ms for micro-interactions
- ❌ Flat solid background colors

---

## Pre-Delivery Checklist (per page)

- [ ] No emojis used as icons (lucide-react SVG only)
- [ ] All icons from lucide-react icon set
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Light mode: text contrast ≥ 4.5:1
- [ ] Dark mode: text contrast verified
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Touch targets ≥ 44px on mobile
- [ ] `useAnimationMode` called before any animation logic
- [ ] No hardcoded colors/spacing outside design tokens
- [ ] Glass surfaces visible in both dark and light modes
- [ ] Page wrapped in AnimatedPage component
