# Architecture

**Analysis Date:** 2026-03-23

## Pattern Overview

**Overall:** MVC (Model-View-Controller)

**Key Characteristics:**
- Clean separation between game logic (Model), UI rendering (View), and user input handling (Controller)
- Private class fields (#) used throughout for encapsulation
- Event-driven communication via callbacks registered on controllers
- Single entry point that composes all components together

## Layers

**Models (Game Logic):**
- Purpose: Manage game state, rules, and business logic
- Location: `models/`
- Contains: Board, Checker, GameModel, Player, TimerModel, HistoryModel, InfoModel, Color, MoveType
- Depends on: constants.ts for configuration
- Used by: Controllers

**Views (UI Rendering):**
- Purpose: Render game state to DOM and handle visual feedback
- Location: `views/`
- Contains: GameView, HistoryView, InfoView, TimerView
- Depends on: Models (read-only), CSS constants
- Used by: Controllers to update display

**Controllers (Input/Coordination):**
- Purpose: Handle user input, coordinate between Model and View, manage game flow
- Location: `controllers/`
- Contains: GameController (main), InfoController, KeyboardController, UndoController, TimerController
- Depends on: Models for state, Views for rendering, Services for persistence
- Used by: main.ts for initialization

**Services (Infrastructure):**
- Purpose: Provide cross-cutting functionality like persistence and player generation
- Location: `services/`
- Contains: Storage (localStorage), PlayerGenerator
- Used by: Controllers and Models

## Data Flow

**User Makes Move:**

1. User clicks checker or cell in `GameView`
2. `GameController#handleCheckerClick` or `#handleCellClick` receives event
3. Controller validates move via `GameModel#getValidMoves`
4. If valid, controller triggers animation in `GameView`
5. On animation complete, controller calls `GameModel#executeMove`
6. Model updates board state, checks promotion, handles multi-jump
7. Controller re-renders view via `#init`
8. Controller notifies subscribers (InfoView, HistoryView) via callbacks

**Turn Change Flow:**
1. Controller calls `#processMoveResult` after move execution
2. If no multi-jump, calls `#switchTurn` in Model
3. Controller triggers `#onTurnChange` callback
4. `InfoController` updates turn display
5. Controller starts timer for new player

**State Persistence Flow:**
1. After each move, `#saveStateToLocalStorage` is called
2. `GameController` gathers live state from Model and Timer
3. `Storage` serializes to JSON and saves to localStorage
4. On page load, `main.ts` attempts state restoration
5. `GameModel#restoreState` reconstructs game from saved data

**State Management:**
- Game state held in `GameModel` (board, players, current turn, move history)
- Timer state in `TimerModel`
- Undo state stored in `GameController` (#prevState)
- Persisted state in localStorage via `Storage` service

## Key Abstractions

**Board Abstraction:**
- Purpose: Represent 8x8 checkers board with pieces
- Examples: `models/Board.ts`
- Pattern: 2D array with Checker objects or null

**Checker Piece:**
- Purpose: Represent individual game piece
- Examples: `models/Checker.ts`
- Pattern: Immutable data with clone()/toJSON()/fromJSON() methods

**Move Calculation:**
- Purpose: Compute valid moves for pieces
- Examples: `GameModel#getValidMoves`, `#calculatePotentialMoves`
- Pattern: Enumerate directions, check bounds, validate move/jump types

**View Callbacks:**
- Purpose: Decouple view events from controller logic
- Examples: `controller.setOnMoveExecuted()`, `controller.setOnTurnChange()`, `controller.setOnWin()`
- Pattern: Callback registration pattern

## Entry Points

**HTML Entry:**
- Location: `index.html`
- Triggers: Browser loads page, script module executed
- Responsibilities: Defines DOM structure, loads main.ts

**Application Entry:**
- Location: `main.ts`
- Triggers: DOMContentLoaded event
- Responsibilities: 
  - Initialize Storage and restore state if exists
  - Create Model (GameModel, TimerModel, InfoModel)
  - Create Views (GameView, InfoView, HistoryView, TimerView)
  - Create Controllers and wire them together
  - Register callbacks between components

## Error Handling

**Strategy:** Try-catch with console logging

**Patterns:**
- State restoration failure: Log error, clear localStorage
- Invalid move: Silently ignore (no matching valid move)
- DOM operations: Guard with null checks

## Cross-Cutting Concerns

**Logging:** console.log/console.error for debugging state issues

**Validation:** 
- Bounds checking in Board model
- Move validation in GameModel before execution
- Input validation in KeyboardController

**Authentication:** Not applicable (local game only)

**State Management:**
- In-memory state in Models
- Serialized state in localStorage via Storage service

---

*Architecture analysis: 2026-03-23*