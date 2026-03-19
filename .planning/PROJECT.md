# Checkers Game - Drag and Drop Enhancement

## What This Is

A browser-based Checkers game with MVC architecture. The game currently supports click-to-move interaction. This project adds drag-and-drop functionality while preserving the existing click workflow.

## Core Value

Users can play Checkers using either click-to-move or drag-and-drop with consistent, polished animations and responsive feedback.

## Requirements

### Validated

- ✓ Click-to-move with piece highlighting — existing
- ✓ Valid move calculation and display — existing
- ✓ Piece animation on move — existing
- ✓ Multi-jump support with forced jumps — existing
- ✓ King promotion — existing
- ✓ Turn management — existing
- ✓ Win condition detection — existing
- ✓ Undo functionality — existing

### Active

- [ ] Drag-and-drop piece movement with dragstart/dragover/drop
- [ ] Async drag initialization with valid move pre-calculation
- [ ] Dynamic animation from release coordinates to destination center
- [ ] Invalid drop animation back to original cell
- [ ] Preservation of click-to-move functionality alongside drag

### Out of Scope

- Touch/mobile drag support — deferred to future release
- AI opponent — not part of this enhancement
- Sound effects — not part of this enhancement
- Game statistics/save — not part of this enhancement

## Context

The existing codebase follows MVC pattern with clear separation:
- Models: GameModel, Board, Checker handle game logic
- Views: GameView handles rendering and animations
- Controllers: GameController coordinates Model and View

Current click workflow (must preserve):
1. Click checker → highlight checker
2. Calculate valid moves → highlight valid cells
3. Click target cell → animate piece → execute move

Drag implementation must integrate with existing animation system in GameView.

## Constraints

- **Tech Stack**: Vanilla JavaScript ES6+, no frameworks
- **Backward Compatible**: Existing click-to-move must work unchanged
- **Animation**: Use existing CSS transform/animation approach
- **No Build Step**: Direct browser execution

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Preserve click workflow | User requirement - both methods must work | — Pending |
| Drag only on valid cells | Prevent invalid moves via drag | — Pending |
| Dynamic animation coordinates | Smooth UX from any release point | — Pending |
| Keep existing animation system | Consistency with current animations | — Pending |

---
*Last updated: 2026-03-19 after auto initialization with drag-and-drop requirements*
