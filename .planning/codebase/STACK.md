# Technology Stack

**Analysis Date:** 2026-03-23

## Languages

**Primary:**
- TypeScript 5.9.3 - All game logic, models, views, controllers

**Secondary:**
- CSS - Styling (style.css, reset.css)
- HTML - Entry point (index.html)

## Runtime

**Environment:**
- Browser (ESNext) - Runs in modern browsers via Vite dev server

**Package Manager:**
- npm (Node.js package manager)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Vanilla TypeScript - No framework, pure TS/JS implementation

**Build/Dev:**
- Vite 8.0.2 - Development server and build tool
- Rolldown 1.0.0-rc.10 - Underlying bundler (via Vite)

## Key Dependencies

**Build Tools:**
- lightningcss 1.32.0 - CSS bundling (used by Vite)
- postcss 8.5.8 - CSS processing (used by Vite)
- source-map-js 1.2.1 - Source map support
- picomatch 4.0.3 - Glob matching (used by Vite)
- tinyglobby 0.2.15 - File globbing (used by Vite)
- nanoid 3.3.11 - ID generation

**TypeScript Support:**
- typescript 5.9.3 - Type checking

**Platform:**
- detect-libc 2.1.2 - Platform detection
- picocolors 1.1.1 - Color output

## Configuration

**TypeScript:**
- Config file: `tsconfig.json`
- Target: ESNext
- Module: ESNext
- Strict mode enabled
- DOM types included

**Build:**
- No custom vite.config.ts - Uses Vite defaults
- No ESLint/Prettier config detected

## Platform Requirements

**Development:**
- Node.js (for npm/Vite)
- Modern browser with ESNext support

**Production:**
- Static hosting (Vite build output in `dist/`)
- No server required

---

*Stack analysis: 2026-03-23*
