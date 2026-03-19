# Technical Concerns

## Missing Features

1. **No piece capture animation** - Captured pieces disappear instantly without visual feedback
2. **No sound effects** - No audio for moves, captures, or wins
3. **No difficulty levels** - AI opponent not implemented
4. **No game statistics** - Wins/losses not tracked
5. **No save/load** - Games cannot be saved to local storage

## Code Quality Issues

1. **No tests** - Zero test coverage is a significant risk for refactoring
2. **Tight coupling between GameController and InfoController** - `main.js:19-25` wires these directly
3. **No input validation** - Assumes valid coordinates without bounds checking
4. **Magic strings** - CSS class references in multiple places (`constants.js` and inline)
5. **Board rendering recreates DOM** - Full re-render on each move (`GameController:35-40`)

## Performance Concerns

1. **Full board re-render** - `GameController.init()` recreates all DOM elements after every move
2. **DOM query on undo** - `GameView.animateUndoMove` uses multiple `querySelector` calls
3. **No virtual DOM or diffing** - Direct DOM manipulation could cause layout thrashing

## Security

1. **No XSS protection** - `InfoView.showWinModal` sets `textContent` safely but pattern should be reviewed
2. **No CSP headers** - Static file serving without security headers

## Maintainability

1. **Board coordinate system implicit** - `(row + col) % 2 !== 0` pattern scattered
2. **Direction constants ambiguous** - `MOVE_DIR_UP = 1`, `MOVE_DIR_DOWN = -1` requires domain knowledge
3. **No logging** - No debug output for troubleshooting production issues
