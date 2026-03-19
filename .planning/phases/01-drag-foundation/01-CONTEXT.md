# Phase 1: Drag Foundation - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up HTML5 Drag and Drop API events and async move calculation. User can initiate drag on own checker, valid moves are fetched asynchronously, and drop on valid cell triggers move execution. Click workflow remains unchanged.

</domain>

<decisions>
## Implementation Decisions

### Drag initiation timing
- If user releases mouse before valid moves are highlighted: **cancel the drag**
- Drag physically starts only after valid cells are calculated and visually highlighted
- If moves already cached from prior click, allow instant drag

### Event wiring
- **Board-level listeners** — dragstart, dragover, drop attach to `boardElement` (same as existing click handler)
- Centralized event handling is cleaner and matches existing pattern

### State interaction
- **Share with click state** — drag reads/writes the same `#selectedChecker` and `#validMoves` variables
- When drag initiates, it uses `handleCheckerClick` logic to populate state
- This ensures click and drag remain synchronized

### Visual feedback during wait
- **None** — No additional visual feedback while awaiting move calculation
- Highlights appearing is the signal that drag is ready

### Click workflow preservation
- Existing click handler in `GameView.#handleBoardClick` remains untouched
- Both click and drag write to same controller state
- Selection, highlighting, and deselection work identically

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Existing Code References
- `views/GameView.js` — Existing click handling, animation patterns, highlightMoves()
- `controllers/GameController.js` — Selection state (#selectedChecker, #validMoves), handleCheckerClick()
- `models/GameModel.js` — getValidMoves() API
- `constants.js` — CSS class names for valid-move highlighting

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GameView.highlightMoves()` — Already highlights valid moves, reuse for drag
- `GameView.animatePieceMove()` — Animation system to build on
- `GameView.clearHighlights()` — For state reset
- CSS classes `.valid-move`, `.highlight`, `.checker` already defined

### Established Patterns
- Event listeners on `boardElement` (click pattern at line 16)
- Private fields with getters for state access
- Callback-based coordination between View and Controller
- DOM queries via `querySelector` with data attributes

### Integration Points
- Drag events wire into `GameController.handleCheckerClick()` for state population
- Drop handler calls `handleCellClick()` for move execution
- Controller state (#selectedChecker, #validMoves) shared between click and drag

</code_context>

<specifics>
## Specific Ideas

From requirements:
- "Async Drag Initialization: On mousedown and hold, the system must fetch the valid moves"
- "If the user had already clicked the checker (moves are cached), allow the drag instantly"
- "Do not allow the physical drag to start until the valid cells are calculated and visually highlighted in the View"
- "Use dragstart to store the data of the checker being dragged"
- "Use dragover with preventDefault() only on the valid destination cells"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-drag-foundation*
*Context gathered: 2026-03-19*
