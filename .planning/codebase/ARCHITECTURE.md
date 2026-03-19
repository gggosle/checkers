# Architecture

## Design Pattern

**MVC (Model-View-Controller)** with two separate MVC triads:

1. **Game MVC** - Core game logic
2. **Info MVC** - Turn tracking and win display

## Architecture Layers

### Models Layer
- `GameModel.js` - Game state, move validation, turn management
- `Board.js` - Board state, piece placement, promotion logic
- `Checker.js` - Individual piece state
- `InfoModel.js` - Turn direction tracking

### Views Layer
- `GameView.js` - Board rendering, piece highlighting, animations
- `InfoView.js` - Turn indicator, win modal

### Controllers Layer
- `GameController.js` - Input handling, move execution, undo logic
- `InfoController.js` - Info display synchronization

## Data Flow

1. User clicks board cell/checker
2. `GameController` receives click via `GameView`
3. `GameController` validates move via `GameModel`
4. `GameModel` executes move and updates state
5. `GameController` re-renders via `GameView`
6. `GameController` notifies `InfoController` of turn change
7. `InfoController` updates `InfoView`

## Entry Points

- `main.js:8` - DOMContentLoaded initializes both MVC triads
- `index.html:8` - Loads main.js as ES6 module

## State Management

- Game state managed in `GameModel` with private fields
- State snapshots captured for undo functionality (`GameModel:185-199`)
- State restoration on undo (`GameController:144-163`)
