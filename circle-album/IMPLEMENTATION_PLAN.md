# Circle Album Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build an interactive circular/arc image carousel where poster-style cards sit along the bottom of the viewport and scroll along an invisible circular path.

**Architecture:** Keep the carousel math isolated in a hook/function, render cards with CSS transforms, and layer pointer/wheel/keyboard interactions on top. Start with static local data and no backend.

**Tech Stack:** React or Next.js, TypeScript, CSS transforms, requestAnimationFrame or Framer Motion later.

---

## Phase 1: Static Prototype

### Task 1: Create sample album data

**Objective:** Define 8~12 sample image items with title, artist, country, image URL.

**Files:**
- Create: `circle-album/src/data/albums.ts`

**Acceptance:** Data can render a list of album cards.

### Task 2: Implement circular position calculator

**Objective:** Convert card index and active offset into x/y/rotation/scale/zIndex.

**Files:**
- Create: `circle-album/src/lib/arcPosition.ts`
- Test: `circle-album/src/lib/arcPosition.test.ts`

**Acceptance:** Center card has near-zero rotation and highest z-index. Side cards rotate left/right.

### Task 3: Render static arc carousel

**Objective:** Render all cards along the lower arc with CSS transforms.

**Files:**
- Create: `circle-album/src/components/ArcCarousel.tsx`
- Create: `circle-album/src/components/AlbumCard.tsx`
- Create: `circle-album/src/styles/circle-album.css`

**Acceptance:** On desktop, cards visually match the supplied reference: lower arc, rotated, partially clipped at edges.

---

## Phase 2: Interaction

### Task 4: Add drag/swipe state

**Objective:** Pointer drag changes virtual offset in real time.

**Files:**
- Create: `circle-album/src/hooks/useArcCarousel.ts`
- Modify: `circle-album/src/components/ArcCarousel.tsx`

**Acceptance:** Dragging left/right rotates cards along the arc.

### Task 5: Add snap behavior

**Objective:** On drag release, nearest item snaps to active center.

**Files:**
- Modify: `circle-album/src/hooks/useArcCarousel.ts`

**Acceptance:** After release, one card cleanly centers as active.

### Task 6: Add wheel and keyboard navigation

**Objective:** Support wheel/trackpad and ArrowLeft/ArrowRight.

**Files:**
- Modify: `circle-album/src/hooks/useArcCarousel.ts`
- Modify: `circle-album/src/components/ArcCarousel.tsx`

**Acceptance:** Wheel and keyboard move between cards without page scroll surprises.

---

## Phase 3: Details and Responsive

### Task 7: Add active card detail modal

**Objective:** Clicking active card opens a lightweight detail panel/modal.

**Files:**
- Create: `circle-album/src/components/AlbumDetailModal.tsx`
- Modify: `circle-album/src/components/ArcCarousel.tsx`

**Acceptance:** Active card opens detail; Escape closes it.

### Task 8: Responsive tuning

**Objective:** Tune radius, card size, and visible card count for mobile.

**Files:**
- Modify: `circle-album/src/styles/circle-album.css`
- Modify: `circle-album/src/lib/arcPosition.ts`

**Acceptance:** Mobile shows active card plus partial side cards and supports swipe.

### Task 9: Accessibility pass

**Objective:** Add roles, labels, focus states, and reduced-motion support.

**Files:**
- Modify: carousel components and CSS

**Acceptance:** Keyboard navigation works; focus is visible; reduced motion disables excessive animation.

---

## Verification Commands

Exact commands depend on the chosen app scaffold. Recommended checks after implementation:

```bash
npm run lint
npm run test
npm run build
```

Browser QA:

- Desktop: card arc matches reference and drag feels smooth.
- Mobile: swipe works and cards remain clipped to bottom arc.
- Keyboard: ArrowLeft/ArrowRight and Enter/Escape work.
- Reduced motion: transitions are minimized.
