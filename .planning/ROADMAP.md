# Roadmap: Checkers Drag and Drop

## Project Overview

**Project:** Checkers Game - Drag and Drop Enhancement
**Granularity:** Standard (3 phases, 3-5 plans each)
**Mode:** YOLO (auto-approved)

## Phases

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|-----------------|
| 1 | Drag Foundation | Implement drag initiation and validation wiring | DRAG-01 through DRAG-09 | 3 |
| 2 | Drop Animation | Complete drop handling with dynamic animations | DRAG-10 through DRAG-16 | 3 |
| 3 | Integration | Ensure click and drag coexist, final testing | DRAG-17 through DRAG-20 | 3 |

---

## Phase 1: Drag Foundation

**Goal:** Wire up drag events and async move calculation

**Requirements:** DRAG-01, DRAG-02, DRAG-03, DRAG-04, DRAG-05, DRAG-06, DRAG-07, DRAG-08, DRAG-09

**Success Criteria:**
1. User can initiate drag on own checker
2. Valid moves calculated and highlighted before drag completes
3. Drop on valid cell triggers move execution

### Plans

**Plan 1.1: Add draggable attribute to checkers**
- Modify `GameView.createCheckerElement()` to add `draggable="true"`
- Verify accessibility (keyboard users still have click)

**Plan 1.2: Implement dragstart handler**
- Add dragstart event listener in `GameView`
- Store source checker position in dataTransfer
- Prevent default to enable drag

**Plan 1.3: Wire dragover to valid moves**
- Enable dragover only on cells with `.valid-move` class
- Prevent default on valid cells, ignore invalid

**Plan 1.4: Implement drop handler with move execution**
- On drop, read source position from dataTransfer
- Read target position from drop event
- Call controller to execute move

**Plan 1.5: Async drag initialization**
- On mousedown, check if valid moves already cached
- If not cached, await move calculation
- Delay dragstart until moves are highlighted

---

## Phase 2: Drop Animation

**Goal:** Dynamic animations from release point to destination

**Requirements:** DRAG-10, DRAG-11, DRAG-12, DRAG-13, DRAG-14, DRAG-15, DRAG-16

**Success Criteria:**
1. Piece animates smoothly from release point to destination
2. Invalid drops animate back to original cell
3. Invalid drop preserves selection state

### Plans

**Plan 2.1: Calculate release coordinates**
- Capture drop event clientX/clientY
- Calculate delta from release point to target cell center
- Store coordinates for animation

**Plan 2.2: Dynamic animation from release point**
- Modify `GameView.animatePieceMove()` to accept custom start coordinates
- Use CSS transform to animate from release to destination
- Chain with existing animation system

**Plan 2.3: Invalid drop animation**
- Detect drop outside valid cells
- Animate from release point back to original cell center
- Preserve checker selection state

**Plan 2.4: State preservation on invalid drop**
- On invalid drop, do not call deselect
- Keep highlights visible
- Allow user to continue with click or retry drag

---

## Phase 3: Integration and Testing

**Goal:** Ensure click and drag coexist without interference

**Requirements:** DRAG-17, DRAG-18, DRAG-19, DRAG-20

**Success Criteria:**
1. Click workflow functions identically to before
2. Both methods can be used interchangeably
3. No interference between click selection and drag

### Plans

**Plan 3.1: Verify click-to-select unchanged**
- Test click on checker still highlights piece
- Test click on checker shows valid moves
- Test click on valid cell executes move

**Plan 3.2: Verify click and drag independence**
- Select checker via click, then drag it
- Select checker via drag, then click different valid cell
- Both workflows should work

**Plan 3.3: Edge case handling**
- Multi-jump sequences with drag
- King promotion during drag
- Undo after drag move
- Win condition after drag move

**Plan 3.4: Final integration testing**
- Test complete game flow with both input methods
- Verify no race conditions between click and drag events
- Manual testing of all game scenarios

---
