# Coding Conventions

**Analysis Date:** 2026-03-23

## Naming Patterns

**Files:**
- PascalCase for classes: `GameController.ts`, `Board.ts`, `Checker.ts`
- CamelCase for interfaces: `CheckerData.ts`
- Suffix: Models use `Model` (`GameModel.ts`), Controllers use `Controller`, Views use `View`, Services use `Service`

**Functions:**
- CamelCase: `getValidMoves`, `executeMove`, `isBlackSquare`
- Private methods use `#` prefix (private fields): `#initializeBoardData`, `#handleCellClick`
- Public methods: `setOnMoveExecuted`, `animateMove`, `render`

**Variables:**
- CamelCase: `boardElement`, `validMoves`, `selectedChecker`
- Private fields use `#` prefix: `#board`, `#model`, `#view`
- Callback variables end with `Callback`: `onCheckerClickCallback`, `onCellClickCallback`

**Types:**
- Interfaces: PascalCase: `CheckerData`, `MoveType`
- Enums: PascalCase: `Color`, `MoveType`
- Type aliases: PascalCase

## Code Style

**Formatting:**
- No formatter config found - uses default editor settings
- 4 spaces indentation
- No semicolons at end of statements (JavaScript default)
- Opening brace on same line

**Linting:**
- No ESLint config found
- TypeScript strict mode enabled in `tsconfig.json`

**TypeScript Configuration:**
- Target: `ESNext`
- Module: `ESNext`
- Strict: `true`
- `noImplicitAny: true`
- `isolatedModules: true`
- `noEmit: true`

## Import Organization

**Order:**
1. External imports (built-in): Not applicable for browser-only app
2. Relative imports grouped by directory depth:
   - Same level: `./Board.ts`
   - One level up: `../constants.ts`
   - Services: `../services/PlayerGenerator.ts`
   - Views: `../views/GameView.ts`

**Path Aliases:**
- No path aliases configured

**File Extensions:**
- Explicit `.js` extension for imports: `import {Checker} from './Checker.js';`
- Some files use `.ts` extension: `import {Board} from './Board.ts';`

## Error Handling

**Patterns:**
- `fromJSON` methods throw errors with descriptive messages:
  ```typescript
  throw new Error("fromJSON: Missing critical Checker data ");
  ```
- Input validation in restoration methods:
  ```typescript
  if (!json?.color || json.row == null || ...) { throw new Error(...) }
  if (!state || !state.board) return;
  ```
- Silent returns for invalid inputs:
  ```typescript
  if (!Array.isArray(boardData)) return;
  ```

**Logging:**
- No logging framework found
- Uses `console` if needed (not observed in codebase)

## Comments

**When to Comment:**
- Minimal comments in code
- Private method descriptions not common
- Complex logic has inline comments for clarity (e.g., in `GameModel.ts`)

**JSDoc/TSDoc:**
- Not used in the codebase

## Function Design

**Size:**
- Private methods are focused and single-purpose
- Controller methods handle single responsibilities

**Parameters:**
- Typed parameters with TypeScript interfaces
- Callback patterns use function parameters: `(row, col) => this.#handleCheckerClick(row, col)`

**Return Values:**
- Explicit return types where applicable
- Getters return specific types
- Methods return booleans for success/failure: `executeMove(from, toMove)` returns `boolean`

## Module Design

**Exports:**
- Single class per file with `export class ClassName`
- Static methods for utility: `Board.isBlackSquare(row, col)`, `Player.fromJSON(json)`

**Barrel Files:**
- Not used - individual imports per file

## Class Structure

**Private Fields:**
- Uses TypeScript private fields with `#` prefix
- Example from `GameController.ts`:
  ```typescript
  #model;
  #view;
  #storage;
  #timerController;
  ```

**Getters:**
- Used for exposing private state: `get boardClone()`, `get currentPlayer()`
- Computed properties exposed as getters

**Constructor:**
- Dependency injection pattern in controllers
- Parameters passed in constructor: `constructor(model, view, storage, timerController, undoController)`

---

*Convention analysis: 2026-03-23*
