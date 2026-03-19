# Coding Conventions

## Class Structure

### Private Fields
Uses JavaScript private fields (`#fieldName`) for encapsulation:

```javascript
// models/Checker.js:2-6
export class Checker {
    #color;
    #row;
    #col;
    #direction;
    #isKing;
```

### Getters
Public read access via getters:

```javascript
// models/Checker.js:16-34
get color() { return this.#color; }
get row() { return this.#row; }
```

## Import Style

ES6 named imports with `.js` extension:

```javascript
// main.js:1-6
import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
```

## Constants Organization

Centralized in `constants.js`:
- `GAME_CONFIG` - Board size, piece counts
- `GAME_RULES` - Movement rules, directions
- `CSS_CLASSES` - DOM element class names
- `CSS_CLASSES_INFO` - Info panel class names

## Error Handling

No explicit error handling - assumes valid inputs. Validation is implicit in model methods returning empty arrays or null for invalid states.

## Animations

CSS-based transitions with JavaScript triggering:

```javascript
// views/GameView.js:63-78
checkerElement.style.transition = 'transform 0.4s ease-in-out';
checkerElement.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
```

## Callback Pattern

Event callbacks via setter methods:

```javascript
// controllers/GameController.js:22-32
setOnUndoStateChange(callback) { this.#onUndoStateChange = callback; }
setOnTurnChange(callback) { this.#onTurnChange = callback; }
setOnWin(callback) { this.#onWin = callback; }
```
