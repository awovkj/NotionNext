# NotionNext Progressive Image Loading and Typewriter Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Improve heo theme perceived performance by loading images from top to bottom with controlled concurrency and stopping typewriter work after the user reaches the blog list.

**Architecture:** Keep the optimization small and local. `components/LazyImage.js` becomes the shared image scheduler used by heo cards, while `themes/heo/components/Hero.js` controls hero-specific image priority and typewriter lifecycle. `components/AISummary.js` receives a safer visibility-aware typing loop to avoid background animation work.

**Tech Stack:** Next.js 14, React 18 hooks, existing `LazyImage`, browser `Image`, `requestAnimationFrame`, `IntersectionObserver` where appropriate.

---

## File Structure

- Modify: `components/LazyImage.js` — replace proximity-only lazy loading with a shared top-to-bottom queue and controlled concurrency.
- Modify: `themes/heo/components/Hero.js` — remove excessive hero icon priority loading, use `LazyImage` for the Today card cover, and stop hero typewriter after blog list is reached.
- Modify: `components/AISummary.js` — rewrite AI summary typing to use a ref-based visibility-aware loop with cleanup.
- Verify: `git diff --check`, targeted source inspection, and available project static checks.

### Task 1: Shared top-to-bottom image scheduler

**Files:**
- Modify: `components/LazyImage.js`

- [x] Replace the shared `IntersectionObserver` loader with a shared queue.
- [x] Queue items sort by `priority`, then DOM top position, then mount order.
- [x] Limit concurrent image fetches to `siteConfig('IMAGE_LOAD_CONCURRENCY', 2)` with a safe numeric fallback.
- [x] After each image load or error, continue draining the queue without waiting for scroll proximity.
- [x] Keep placeholder, `decoding='async'`, eager/lazy attributes, and priority preload behavior.

### Task 2: heo hero image priority and typewriter lifecycle

**Files:**
- Modify: `themes/heo/components/Hero.js`

- [x] Replace the state-dependent recursive typewriter effect with a stable timer loop.
- [x] Add a scroll detector for `#post-outer-wrapper`; when the blog list reaches the viewport, permanently stop the typewriter and render the full text statically.
- [x] Remove `priority={true}` from every scrolling group icon so they enter the global top-to-bottom queue instead of preloading all at once.
- [x] Replace the Today card raw `<img>` with `LazyImage` so it uses the same scheduler.

### Task 3: AI summary typing cleanup

**Files:**
- Modify: `components/AISummary.js`

- [x] Use a `ref` instead of querying `.post-ai` under CSS modules.
- [x] Start typing only when visible; pause while hidden.
- [x] Use one state update per emitted character/chunk and clean up timers, animation frames, and observers.
- [x] Honor reduced-motion by rendering the full summary immediately.

### Task 4: Verification

**Files:**
- Inspect: `components/LazyImage.js`, `themes/heo/components/Hero.js`, `components/AISummary.js`

- [x] Run `git diff --check` and expect no whitespace errors.
- [x] Run available syntax/static checks. If dependencies are unavailable, report that limitation and verify diffs manually.
- [x] Confirm only intended files changed, plus this plan document.
