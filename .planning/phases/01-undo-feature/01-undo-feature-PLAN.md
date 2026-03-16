---
phase: 01-undo-feature
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - models/GameModel.js
  - controllers/GameController.js
  - views/GameView.js
  - main.js
autonomous: true
requirements:
  - UNDO-01
must_haves:
  truths:
    - "Single undo button appears on screen and is initially disabled"
    - "Button enables after first move is made"
    - "Clicking undo reverses last move with backward animation"
    - "After undo completes, button disables again"
    - "Undo is disabled after game ends (win condition)"
    - "All state is restored: board, turn, mustJumpPiece, hasJumpsAvailable"
  artifacts:
    - path: "models/GameModel.js"
      provides: "State capture and restoration methods"
      methods_added: ["captureState", "restoreState"]
    - path: "controllers/GameController.js"
      provides: "Undo logic and button management"
      methods_added: ["#savePreMoveState", "#handleUndo", "#onMoveExecuted"]
    - path: "views/GameView.js"
      provides: "Backward animation capability"
      methods_added: ["animatePieceMoveReverse"]
    - path: "main.js"
      provides: "Undo button creation and initialization"
  key_links:
    - from: "GameController"
      to: "GameModel"
      via: "captureState() before executeMove()"
      pattern: "captureState.*executeMove"
    - from: "GameController"
      to: "GameView"
      via: "animatePieceMoveReverse() for animation"
      pattern: "animatePieceMoveReverse.*onComplete"
    - from: "main.js"
      to: "GameController"
      via: "Controller method for undo"
      pattern: "controller.*undo"
---

<objective>
Implement an Undo button for the checkers game that reverses the last move with backward animation.

Purpose: Allow players to undo their last move (single turn = any move, jump chain, or multiple jumps)
Output: Working undo button with visual animation and complete state restoration
</objective>

<execution_context>
@./.opencode/get-shit-done/workflows/execute-plan.md
@./.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@models/GameModel.js
@views/GameView.js
@controllers/GameController.js
@main.js
</context>

<interfaces>
<!-- Key types and contracts the executor needs. Extracted from codebase. -->

From models/GameModel.js:
```javascript
class GameModel {
  // State accessors
  get boardClone() // Returns 2D array of cloned Checker pieces
  get currentTurnDir() // Returns 1 (UP) or -1 (DOWN)
  get mustJumpPiece() // Returns {row, col} or null
  get hasJumpsAvailable() // Returns boolean
  
  // Board access
  getPiece(row, col) // Returns Checker or null
  isBlackSquare(row, col) // Returns boolean
  
  // Move execution
  executeMove(from, toMove) // Executes move, returns boolean
  getValidMoves(row, col) // Returns array of valid moves
  hasAnyValidMoves(direction) // Checks if player has moves
}
```

From views/GameView.js:
```javascript
class GameView {
  // Rendering
  render(board, isBlackSquareCallback, onCheckerClickCallback, onCellClickCallback)
  highlightMoves(checkerCoords, validMoves)
  clearHighlights()
  
  // Animation (forward move)
  // Note: animatePieceMove(checkerElement, targetCell, onComplete)
  // Uses CSS transition: 'transform 0.4s ease-in-out'
  // Sets isTransitioning = true during animation
}
```

From controllers/GameController.js:
```javascript
class GameController {
  // State
  #model; GameModel
  #view; GameView
  #selectedChecker = null;
  #validMoves = [];
  
  // Event handlers (called by View)
  #handleCheckerClick(row, col)
  #handleCellClick(row, col)
  
  // Game logic
  #checkWinCondition() // Alerts winner when no moves available
}
```

From constants.js:
```javascript
GAME_RULES.MOVE_DIR_UP = 1
GAME_RULES.MOVE_DIR_DOWN = -1
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Add state capture and restoration to GameModel</name>
  <files>models/GameModel.js</files>
  <action>
    Add two new public methods to GameModel class:

    1. **captureState()** - Returns an object containing all state needed for undo:
       ```javascript
       captureState() {
           return {
               board: this.boardClone,  // 2D array of cloned checkers
               currentTurnDir: this.#currentTurnDir,
               mustJumpPiece: this.#mustJumpPiece ? {...this.#mustJumpPiece} : null,
               hasJumpsAvailable: this.#hasJumpsAvailable
           };
       }
       ```
       Note: Must clone mustJumpPiece since it's an object reference.

    2. **restoreState(state)** - Restores all state from captured object:
       ```javascript
       restoreState(state) {
           // Restore board - need to reconstruct from cloned pieces
           // The state.board is already a 2D array of cloned Checker objects
           // We need to create a new Board and set its internal board to the clone
           
           // Use Board.getBoardClone() logic in reverse
           // Since Board has private #board, add a setter or reconstruction method
           
           this.#currentTurnDir = state.currentTurnDir;
           this.#mustJumpPiece = state.mustJumpPiece;
           this.#hasJumpsAvailable = state.hasJumpsAvailable;
       }
       ```

    Since Board.#board is private, add a method to Board class:
    - `setBoard(boardData)` - Replaces internal board with provided 2D array

    Then implement restoreState as:
    ```javascript
    restoreState(state) {
        this.#board.setBoard(state.board);
        this.#currentTurnDir = state.currentTurnDir;
        this.#mustJumpPiece = state.mustJumpPiece;
        this.#hasJumpsAvailable = state.hasJumpsAvailable;
    }
    ```

    Add to models/Board.js:
    ```javascript
    setBoard(boardData) {
        this.#board = boardData.map(row => row.map(cell => cell ? cell.clone() : null));
    }
    ```
  </action>
  <verify>
    <automated>MISSING — Wave 0 must create test file first. Verify manually: new GameModel().captureState() returns object with board, currentTurnDir, mustJumpPiece, hasJumpsAvailable</automated>
  </verify>
  <done>GameModel.captureState() returns complete state object; GameModel.restoreState(state) restores all state correctly</done>
</task>

<task type="auto">
  <name>Task 2: Add backward animation method to GameView</name>
  <files>views/GameView.js</files>
  <action>
    Add a new public method `animatePieceMoveReverse(checkerElement, fromCell, toCell, onComplete)`:

    This method performs a backward animation - moving a piece FROM its current position (toCell) BACK to where it was before the move (fromCell).

    Implementation:
    ```javascript
    animatePieceMoveReverse(checkerElement, fromCell, toCell, onComplete) {
        this.#isTransitioning = true;
        
        // Calculate delta: where it is NOW (toCell) -> where it WAS (fromCell)
        const delta = this.#calculateDelta(toCell, fromCell);
        
        checkerElement.style.transition = 'transform 0.4s ease-in-out';
        checkerElement.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
        
        checkerElement.addEventListener('transitionend', () => {
            this.#isTransitioning = false;
            // Reset transform after animation completes
            checkerElement.style.transform = '';
            checkerElement.style.transition = '';
            if (onComplete) onComplete();
        }, { once: true });
    }
    ```

    Also add helper method to get cell element by coordinates:
    ```javascript
    getCellElement(row, col) {
        return this.#boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }
    ```

    Also add method to get checker element by coordinates:
    ```javascript
    getCheckerElement(row, col) {
        const cell = this.getCellElement(row, col);
        return cell ? cell.querySelector(`.${CSS_CLASSES.CHECKER_CLASS}`) : null;
    }
    ```
  </action>
  <verify>
    <automated>MISSING — Verify manually: method exists and is callable with correct parameters</automated>
  </verify>
  <done>GameView.animatePieceMoveReverse() animates piece backward and calls onComplete after animation ends</done>
</task>

<task type="auto">
  <name>Task 3: Implement undo logic in GameController</name>
  <files>controllers/GameController.js</files>
  <action>
    Modify GameController to track pre-move state and implement undo:

    1. **Add new private fields**:
       ```javascript
       #previousState = null;  // Stores captured state before each move
       #gameEnded = false;     // Tracks if game has ended
       #lastMoveInfo = null;   // Stores details about the last move for undo
       ```

    2. **Add #savePreMoveState() method** - Called before executeMove:
       ```javascript
       #savePreMoveState() {
           this.#previousState = this.#model.captureState();
       }
       ```

    3. **Add #onMoveExecuted(moveInfo)** - Called after successful move to track move details:
       ```javascript
       #onMoveExecuted(move) {
           this.#lastMoveInfo = {
               from: {...this.#selectedChecker},
               to: {row: move.row, col: move.col},
               type: move.type,
               captured: move.captured ? {...move.captured} : null,
               wasKing: this.#model.getPiece(move.row, move.col)?.isKing || false
           };
       }
       ```

    4. **Modify #handleCellClick()** to save state before move:
       ```javascript
       // At start of #handleCellClick, before executeMove:
       this.#savePreMoveState();
       this.#model.executeMove(this.#selectedChecker, move);
       this.#onMoveExecuted(move);
       ```

    5. **Modify #checkWinCondition()** to set #gameEnded:
       ```javascript
       #checkWinCondition() {
           const activeDir = this.#model.currentTurnDir;
           if (!this.#model.hasAnyValidMoves(activeDir)) {
               this.#gameEnded = true;
               // ... existing alert code
           }
       }
       ```

    6. **Add #handleUndo() method** - Core undo logic:
       ```javascript
       async #handleUndo() {
           if (!this.#previousState || this.#gameEnded) return;

           // Get current checker position (after the move)
           const currentPos = this.#lastMoveInfo.to;
           const originalPos = this.#lastMoveInfo.from;
           
           // Get the checker element at current position
           const checkerElement = this.#view.getCheckerElement(currentPos.row, currentPos.col);
           
           if (checkerElement) {
               // Animate backward
               const fromCell = this.#view.getCellElement(originalPos.row, originalPos.col);
               const toCell = this.#view.getCellElement(currentPos.row, currentPos.col);
               
               await new Promise(resolve => {
                   this.#view.animatePieceMoveReverse(checkerElement, fromCell, toCell, resolve);
               });
           }

           // After animation, restore model state
           this.#model.restoreState(this.#previousState);
           
           // Clear undo state
           this.#previousState = null;
           this.#lastMoveInfo = null;
           
           // Re-render
           this.#init();
           
           // Deselect any selection
           this.#deselect();
       }
       ```

    7. **Add public method to expose undo handler**:
       ```javascript
       undo() {
           this.#handleUndo();
       }
       ```

    8. **Add method to check if undo is available**:
       ```javascript
       canUndo() {
           return this.#previousState !== null && !this.#gameEnded;
       }
       ```
  </action>
  <verify>
    <automated>MISSING — Verify manually: After making a move, canUndo() returns true. After undo, returns false.</automated>
  </verify>
  <done>GameController.undo() reverses last move with animation and restores all state</done>
</task>

<task type="auto">
  <name>Task 4: Create undo button and wire to GameController</name>
<files>main.js</files>
  <action>
    Modify main.js to create undo button and manage its state:

    1. **Add createUndoButton() function**:
       ```javascript
       function createUndoButton() {
           const button = document.createElement('button');
           button.id = 'undo-button';
           button.textContent = 'Undo';
           button.disabled = true;
           button.classList.add('undo-button');
           return button;
       }
       ```

    2. **Modify DOMContentLoaded handler**:
       ```javascript
       document.addEventListener('DOMContentLoaded', () => {
           const boardElement = document.getElementById('board');
           
           const model = new GameModel();
           const view = new GameView(boardElement);
           const controller = new GameController(model, view);
           
           // Create and append undo button
           const undoButton = createUndoButton();
           boardElement.parentElement.insertBefore(undoButton, boardElement);
           
           // Wire button click to controller
           undoButton.addEventListener('click', () => {
               controller.undo();
           });
           
           // Expose canUndo on controller to update button state
           // Actually, need to poll or use callback - add method to controller:
           // Update button state after each move/re-render
           // Add to controller: #updateUndoButtonState() that checks canUndo()
           
           // Better: Add a callback mechanism or poll in the controller
           // Simpler: Update button after #init() is called
       });
       ```

    3. **In GameController, update button state after re-render**:
       Add to #init() method:
       ```javascript
       // Update undo button state
       this.#updateUndoButtonState();
       ```

       Add new method:
       ```javascript
       #updateUndoButtonState() {
           const undoButton = document.getElementById('undo-button');
           if (undoButton) {
               undoButton.disabled = !this.canUndo();
           }
       }
       ```

       Call #updateUndoButtonState() in:
       - #init() - after initial render
       - #handleCellClick() - after move is executed and #init() called
       - #handleUndo() - after undo completes

    4. **Add CSS for undo button** (either in existing CSS or inline):
       If no CSS file exists, add basic styling in createUndoButton:
       ```javascript
       button.style.padding = '10px 20px';
       button.style.fontSize = '16px';
       button.style.marginBottom = '10px';
       button.style.cursor = 'pointer';
       button.style.backgroundColor = '#f0f0f0';
       button.style.border = '1px solid #ccc';
       button.style.borderRadius = '4px';
       
       button.disabled {
           backgroundColor = '#e0e0e0';
           cursor = 'not-allowed';
       }
       ```

    Note: The button should be:
    - Initially disabled (before any move)
    - Enabled after first move
    - Disabled after undo is performed
    - Disabled if game has ended
  </action>
  <verify>
  <automated>MISSING — Verify manually: Button appears, enables after move, disables after undo, stays disabled after game ends</automated>
  </verify>
  <done>Undo button is visible, properly enables/disables based on game state, and triggers undo</done>
</task>

<task type="auto">
  <name>Task 5: Handle edge cases and multi-jump scenarios</name>
  <files>controllers/GameController.js</files>
  <action>
    Handle the following edge cases:

    1. **Multi-jump chains** - A "turn" includes ALL jumps in a chain
       - The current implementation already captures state BEFORE the first jump
       - After each jump in the chain, mustJumpPiece is set
       - When #handleCellClick is called again for subsequent jumps, we DON'T save state again (the #previousState already contains pre-turn state)
       - This is correct behavior - undoing a multi-jump chain undoes the ENTIRE turn

    2. **Promotion** - If a piece was promoted during the move
       - Already handled: #lastMoveInfo.wasKing tracks if piece was king before move
       - After undo, the piece should no longer be king
       - The restored board state (from #previousState) already contains the correct pre-promotion state

    3. **Captured pieces** - If a jump captured a piece
       - Already handled: #lastMoveInfo.captured stores the position
       - After restoreState, the captured piece reappears because we restore the entire board

    4. **mustJumpPiece restoration** - After undo, mustJumpPiece should be as it was before the turn started
       - Already handled: restoreState restores #mustJumpPiece from #previousState

    5. **hasJumpsAvailable restoration** - After undo, should reflect pre-turn state
       - Already handled: restoreState restores #hasJumpsAvailable from #previousState

    6. **Turn direction** - After undo, currentTurnDir should be restored to previous player
       - Already handled: restoreState restores #currentTurnDir from #previousState

    7. **Edge case: Undo after deselect** - If user clicks a checker then clicks elsewhere (deselects), no move is made
       - Need to NOT update #previousState if no move is executed
       - Only call #savePreMoveState() immediately before executeMove(), not when checker is selected

    8. **Edge case: Multiple undos** - Only ONE previous state is stored
       - This is correct per requirements - only store immediately prior state
       - After undo, #previousState is cleared, preventing another undo
  </action>
  <verify>
  <automated>MISSING — Test each edge case manually</automated>
  </verify>
  <done>All edge cases handled correctly: multi-jump, promotion, captured pieces, turn restoration</done>
</task>

</tasks>

<verification>
1. Button appears on screen
2. Button is disabled initially
3. After making a move, button enables
4. Clicking undo reverses the move with animation
5. After undo, button disables
6. Cannot undo after game ends
7. Multi-jump chain undoes entire chain
8. All state (board, turn, mustJumpPiece, hasJumpsAvailable) is restored
</verification>

<success_criteria>
- Undo button visible and styled
- Button enables after first move
- Button disables after undo
- Button disabled when game ends
- Backward animation plays smoothly (0.4s)
- Board state fully restored
- Turn direction restored to previous player
- mustJumpPiece and hasJumpsAvailable restored
- Multi-jump chains undo as single turn
</success_criteria>

<output>
After completion, create `.planning/phases/01-undo-feature/01-undo-feature-SUMMARY.md`
</output>
