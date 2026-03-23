# Codebase Concerns

**Analysis Date:** 2026-03-23

## Tech Debt

**Inconsistent Import Extensions:**
- Issue: Mixed use of `.js` and `.ts` extensions in imports within the same file
- Files: `main.ts` (lines 2-13), `models/GameModel.ts` (lines 1-6)
- Impact: Potential confusion and build errors when switching between bundler configurations
- Fix approach: Standardize all imports to use consistent extension (.js for compiled, .ts for source)

**Missing Timer State in Undo:**
- Issue: When undoing a move, the timer state is not restored - only board state is restored
- Files: `controllers/GameController.ts` (line 210), `models/GameModel.ts` (line 231-240)
- Impact: If a player undos a move after time has elapsed, the timer doesn't reflect the pre-move state
- Fix approach: Include player times in `getClonedState()` and `restoreState()` methods

**No Input Validation on LocalStorage Data:**
- Issue: `Storage.getStateFromLocalStorage()` parses JSON without try-catch, and `Board.restoreBoard()` doesn't validate structure
- Files: `services/Storage.ts` (line 10), `models/Board.ts` (line 22-28)
- Impact: Corrupted localStorage data will crash the app with uncaught exception
- Fix approach: Wrap JSON.parse in try-catch, validate board structure before restoring

**Timer Runs Continuously:**
- Issue: Timer decrements every second regardless of whose turn it is - both players lose time simultaneously
- Files: `controllers/TimerController.ts` (line 18-39)
- Impact: Game becomes unfair as both players' time decreases during each turn
- Fix approach: Only decrement time for the active player (current implementation already tracks active player, but timer continues regardless)

## Known Bugs

**Timer Not Paused During Animation:**
- Symptoms: Timer continues ticking while piece animation plays, giving advantage to next player
- Files: `controllers/GameController.ts` (line 125-135), `controllers/TimerController.ts`
- Trigger: Make any move and observe timer continues during 400ms animation
- Workaround: None - timer should be stopped during animation

**Keyboard Cursor Allows Invalid Selection:**
- Symptoms: Keyboard can select opponent pieces when pressing Enter on non-owned piece
- Files: `controllers/KeyboardController.ts` (line 51), `controllers/GameController.ts` (line 59-68)
- Trigger: Navigate to opponent piece with arrow keys and press Enter
- Workaround: None - selection should be blocked

## Security Considerations

**LocalStorage Manipulation:**
- Risk: Game state stored in localStorage can be modified by user
- Files: `services/Storage.ts`
- Current mitigation: None - state is trusted on restore
- Recommendations: Add state validation/signature, or accept that cheating is possible in client-only game

**No XSS Protection on Dynamic Content:**
- Risk: If player names were rendered, no escaping is applied
- Files: `models/Player.ts` (stores unvalidated name)
- Current mitigation: Names are generated internally
- Recommendations: Sanitize any future user-provided input

## Performance Bottlenecks

**Full Board Re-render on Every Move:**
- Problem: `GameView.render()` replaces entire board content on each move, even for simple transitions
- Files: `views/GameView.ts` (line 174-189)
- Cause: `replaceChildren()` is called which destroys and recreates all DOM elements
- Improvement path: Implement incremental DOM updates - only update changed cells

**Repeated DOM Queries:**
- Problem: Multiple queries to find same elements (e.g., querySelector inside loops)
- Files: `views/GameView.ts` (lines 220-233, 236-240)
- Cause: Query selectors are called repeatedly without caching
- Improvement path: Cache frequently accessed elements

**Animation Calculation on Every Frame:**
- Problem: `calculateDelta()` uses `getBoundingClientRect()` causing layout thrash
- Files: `views/GameView.ts` (line 163-171)
- Cause: Reading layout properties forces synchronous reflow
- Improvement path: Use CSS transforms with pre-calculated offsets

## Fragile Areas

**GameController Handles Too Much:**
- Files: `controllers/GameController.ts` (272 lines)
- Why fragile: Central coordinator knows too much about other controllers - timer, keyboard, undo, storage
- Safe modification: Extract game flow logic into separate GameFlow class, keep controller as thin coordinator
- Test coverage: No tests exist

**State Management Confusion:**
- Files: `models/GameModel.ts` (methods `getClonedState`, `getLiveState`, `restoreState`)
- Why fragile: Two different state snapshots - cloned (deep copy) vs live (reference), confusing semantics
- Safe modification: Rename to `getSerializableState()` and `getWorkingState()`, clarify clone vs reference behavior

**Magic Numbers in Multiple Files:**
- Files: `constants.ts`, `models/GameModel.ts`, `views/GameView.ts`
- Why fragile: Animation duration (400ms), board size (8), piece rows (3) referenced in different places
- Safe modification: Consolidate all game constants into single constants module

## Scaling Limits

**State Size:**
- Current capacity: Full board state plus move history (unbounded array growth)
- Limit: localStorage has ~5MB limit; long games could exceed it
- Scaling path: Implement move history pruning or external state storage

**DOM Complexity:**
- Current capacity: 64 cells + pieces
- Limit: Beyond 8x8 board, rendering performance degrades
- Scaling path: Not relevant for fixed 8x8 board

## Dependencies at Risk

**Rolldown RC Version:**
- Risk: Using `rolldown@1.0.0-rc.10` - release candidate not stable
- Impact: API changes could break build
- Migration plan: Monitor stable release, test thoroughly before upgrade

**Vite 8:**
- Risk: Major version with potential breaking changes
- Impact: Build configuration may need updates
- Migration plan: Review changelog before upgrading to stable

## Missing Critical Features

**No Game Validation:**
- Problem: No way to validate if a game is in a valid state
- Blocks: Debugging, replay verification, anti-cheat

**No Undo Limit:**
- Problem: Unlimited undo could lead to game manipulation
- Blocks: Fair play enforcement

**No Save/Load Game:**
- Problem: Only localStorage auto-save exists
- Blocks: Sharing saved games, tournament play

## Test Coverage Gaps

**No Tests Whatsoever:**
- What's not tested: Entire codebase - no test files exist
- Files: None (no tests directory)
- Risk: Any refactoring could break functionality without detection
- Priority: High - tests are critical for controller logic and game rules

**Untested Core Logic:**
- What's not tested: GameModel rules (jump validation, multi-jump, king promotion)
- Files: `models/GameModel.ts`, `models/Board.ts`
- Risk: Logic errors in move validation could be catastrophic
- Priority: Critical

**Untested Edge Cases:**
- What's not tested: Timer expiry during multi-jump, undo after promotion, state restoration
- Files: `controllers/TimerController.ts`, `controllers/GameController.ts`
- Risk: Edge cases could cause runtime errors
- Priority: High

---

*Concerns audit: 2026-03-23*
