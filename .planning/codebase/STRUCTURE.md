# Codebase Structure

**Analysis Date:** 2026-03-23

## Directory Layout

```
checkers/
├── main.ts                 # Application entry point
├── index.html              # HTML entry point
├── constants.ts            # Configuration constants
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── .gitignore
├── .idea/                   # IDE configuration
├── node_modules/           # Dependencies
├── dist/                   # Build output
├── images/                 # Static assets
├── styles/                 # CSS files
├── models/                 # Game logic
│   ├── Board.ts
│   ├── Checker.ts
│   ├── Color.ts
│   ├── GameModel.ts
│   ├── HistoryModel.ts
│   ├── InfoModel.ts
│   ├── MoveType.ts
│   ├── Player.ts
│   ├── TimerModel.ts
│   └── interfaces/
│       └── CheckerData.ts
├── views/                  # UI rendering
│   ├── GameView.ts
│   ├── HistoryView.ts
│   ├── InfoView.ts
│   └── TimerView.ts
├── controllers/            # Input handling
│   ├── GameController.ts
│   ├── InfoController.ts
│   ├── KeyboardController.ts
│   ├── TimerController.ts
│   └── UndoController.ts
└── services/               # Cross-cutting concerns
    ├── PlayerGenerator.ts
    └── Storage.ts
```

## Directory Purposes

**Root Level:**
- Purpose: Entry points and configuration
- Contains: main.ts, index.html, package.json, tsconfig.json, constants.ts
- Key files: `main.ts`, `index.html`, `constants.ts`

**models/:**
- Purpose: Game state and business logic
- Contains: Board, Checker, Player, GameModel, TimerModel, HistoryModel, InfoModel
- Key files: `GameModel.ts`, `Board.ts`, `Checker.ts`

**views/:**
- Purpose: DOM rendering and visual updates
- Contains: GameView, HistoryView, InfoView, TimerView
- Key files: `GameView.ts`

**controllers/:**
- Purpose: User input handling and coordination
- Contains: GameController, InfoController, KeyboardController, TimerController, UndoController
- Key files: `GameController.ts`

**services/:**
- Purpose: Reusable infrastructure (persistence, helpers)
- Contains: Storage (localStorage), PlayerGenerator
- Key files: `Storage.ts`

**styles/:**
- Purpose: CSS styling
- Contains: reset.css, style.css
- Key files: `style.css`

## Key File Locations

**Entry Points:**
- `main.ts`: Application initialization, component composition
- `index.html`: DOM structure, script loading

**Configuration:**
- `constants.ts`: Game config (board size, CSS classes), game rules
- `package.json`: Dependencies, scripts (dev, build, preview)
- `tsconfig.json`: TypeScript settings

**Core Logic:**
- `models/GameModel.ts`: Main game state, move validation, turn management
- `models/Board.ts`: Board representation, piece placement, promotion
- `models/Checker.ts`: Piece data model with clone/serialize
- `controllers/GameController.ts`: Input handling, flow coordination

**Testing:**
- No test directory detected - tests not present

## Naming Conventions

**Files:**
- PascalCase: `GameModel.ts`, `GameView.ts`, `KeyboardController.ts`
- CamelCase for services: `Storage.ts`, `PlayerGenerator.ts`

**Classes:**
- PascalCase: `GameController`, `Board`, `Checker`

**Private Fields:**
- `#camelCase`: `#model`, `#view`, `#boardElement`

**Functions:**
- camelCase: `getValidMoves()`, `executeMove()`, `#isBlackSquare()`
- Private methods prefixed with #: `#init()`, `#handleCellClick()`

**Type Aliases:**
- PascalCase: `MoveType`, `CheckerData`

## Where to Add New Code

**New Feature (game logic):**
- Implementation: `models/` - add to existing models or create new model
- Tests: `models/` (no dedicated test dir)

**New Component (UI):**
- Implementation: `views/` - create new View class
- DOM in: `index.html`
- Styles in: `styles/style.css`

**New Controller (input handling):**
- Implementation: `controllers/`
- Wire in: `main.ts`

**New Service (utility):**
- Implementation: `services/`
- Import in: `main.ts` or controllers

**New Constants:**
- Add to: `constants.ts` - export object with constants

**Configuration:**
- Game rules: `constants.ts` - GAME_CONFIG, GAME_RULES
- CSS mapping: `constants.ts` - CSS_BOARD, CSS_INFO, CSS_HISTORY
- Build: `package.json` scripts

## Special Directories

**node_modules/:**
- Purpose: Dependency packages
- Generated: Yes (npm install)
- Committed: No (.gitignore)

**dist/:**
- Purpose: Build output
- Generated: Yes (vite build)
- Committed: No

**.idea/:**
- Purpose: WebStorm IDE configuration
- Generated: Yes
- Committed: Possibly (depends on .gitignore)

**images/:**
- Purpose: Static image assets
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-23*