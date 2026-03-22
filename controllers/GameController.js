import {GAME_CONFIG, GAME_RULES} from "../constants.js";

export class GameController {
    #model;
    #view;
    #storage;
    #timerController;
    #selectedChecker = null;
    #validMoves = [];
    #prevState = null;
    #lastMove = null;
    #gameEnded = false;
    #cursorRow = 0;
    #cursorCol = 0;
    #onUndoStateChange = null;
    #onTurnChange = null;
    #onMoveExecuted = null;
    #onWin = null;

    constructor(model, view, storage, timerController) {
        this.#model = model;
        this.#view = view;
        this.#storage = storage;
        this.#timerController = timerController;
        
        this.#timerController.setOnTimeout((playerNum) => this.#handleTimeOut(playerNum));

        this.#init();
        this.#initKeyboardEvents();
        this.#startTimer();
    }

    setOnMoveExecuted(callback) {
        this.#onMoveExecuted = callback;
    }

    setOnUndoStateChange(callback) {
        this.#onUndoStateChange = callback;
    }

    setOnTurnChange(callback) {
        this.#onTurnChange = callback;
    }

    setOnWin(callback) {
        this.#onWin = callback;
    }

    getSelectedChecker() {
        return this.#selectedChecker;
    }

    #init() {
        this.#view.render(
            this.#model.boardClone,
            (row, col) => this.#model.isBlackSquare(row, col),
            (row, col) => this.#handleCheckerClick(row, col),
            (row, col) => this.#handleCellClick(row, col)
        );
        this.#view.setCursor(this.#cursorRow, this.#cursorCol);
    }

    #initKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.#gameEnded) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.#moveCursor(-1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.#moveCursor(1, 0);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.#moveCursor(0, -1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.#moveCursor(0, 1);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.#handleCursorAction();
                    break;
            }
        });
    }

    #moveCursor(dr, dc) {
        const newRow = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - 1, this.#cursorRow + dr));
        const newCol = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - 1, this.#cursorCol + dc));

        if (newRow !== this.#cursorRow || newCol !== this.#cursorCol) {
            this.#cursorRow = newRow;
            this.#cursorCol = newCol;
            this.#view.setCursor(this.#cursorRow, this.#cursorCol);
        }
    }

    #handleCursorAction() {
        const piece = this.#model.getPiece(this.#cursorRow, this.#cursorCol);
        if (piece && this.#isOwnPiece(piece)) {
            this.#handleCheckerClick(this.#cursorRow, this.#cursorCol);
        } else {
            this.#handleCellClick(this.#cursorRow, this.#cursorCol);
        }
    }

    #handleCheckerClick(row, col) {
        if (this.#view.isTransitioning) return;
        this.#view.clearHistoryHighlights();
        const piece = this.#model.getPiece(row, col);
        if (!this.#isOwnPiece(piece)) return;

        if (this.#isMustJumpPieceViolation(row, col)) return;

        if (this.#isToggleDeselect(row, col)) {
            this.#deselect();
            return;
        }

        const validMoves = this.#model.getValidMoves(row, col);
        if (validMoves.length > 0) {
            this.#select(row, col, validMoves);
        }
    }

    #isOwnPiece(piece) {
        return piece && piece.direction === this.#model.currentTurnDir;
    }

    #isMustJumpPieceViolation(row, col) {
        const mustJumpPiece = this.#model.mustJumpPiece;
        return mustJumpPiece && (mustJumpPiece.row !== row || mustJumpPiece.col !== col);
    }

    #isToggleDeselect(row, col) {
        return this.#selectedChecker?.row === row &&
            this.#selectedChecker?.col === col &&
            !this.#model.mustJumpPiece;
    }

    #deselect() {
        this.#selectedChecker = null;
        this.#validMoves = [];
        this.#view.clearHighlights();
    }

    #select(row, col, validMoves) {
        this.#selectedChecker = {row, col};
        this.#validMoves = validMoves;
        this.#view.highlightMoves(this.#selectedChecker, this.#validMoves);
    }

    #handleCellClick(row, col) {
        if (this.#view.isTransitioning) return;
        this.#view.clearHistoryHighlights();
        if (!this.#selectedChecker) return;

        const move = this.#validMoves.find(m => m.row === row && m.col === col);
        if (!move) return;

        this.#stopTimer();
        this.#view.animateMove(
            this.#selectedChecker,
            {row, col},
            () => {
                this.#recordMoveState(move);
                this.#model.executeMove(this.#selectedChecker, move);
                this.#cursorRow = row;
                this.#cursorCol = col;
                this.#processMoveResult();
                this.#checkWinCondition();
            }
        );
    }

    #recordMoveState(move) {
        if (this.#gameEnded) return;

        this.#prevState = this.#model.getClonedState();
        this.#lastMove = {
            from: {row: this.#selectedChecker.row, col: this.#selectedChecker.col},
            to: {row: move.row, col: move.col},
            captured: move.captured ? {...move.captured} : null
        };
        this.#notifyUndoStateChange();
    }

    #processMoveResult() {
        const mustJumpPiece = this.#model.mustJumpPiece;
        this.#init();

        if (mustJumpPiece) {
            this.#handleMultiJump(mustJumpPiece);
            this.#cursorRow = mustJumpPiece.row;
            this.#cursorCol = mustJumpPiece.col;
            this.#view.setCursor(this.#cursorRow, this.#cursorCol);
        } else {
            this.#deselect();
            this.#startTimer();
        }

        if (this.#onMoveExecuted) {
            this.#onMoveExecuted(this.#model.moveHistory);
        }

        if (this.#onTurnChange) {
            this.#onTurnChange(this.#model.currentTurnDir);
        }
        this.#saveStateToLocalStorage();
    }

    #saveStateToLocalStorage() {
        const liveState = this.#model.getLiveState();
        liveState.playerTimes = this.#timerController.playerTimes;
        this.#storage.saveToLocalStorage(liveState);
    }

    #checkWinCondition() {
        const activeDir = this.#model.currentTurnDir;
        if (!this.#model.hasAnyValidMoves(activeDir)) {
            this.#handleWin(activeDir === GAME_RULES.MOVE_DIR_UP ? 'PLAYER_2' : 'PLAYER_1');
        }
    }

    #handleWin(winner) {
        this.#gameEnded = true;
        this.#stopTimer();
        this.#notifyUndoStateChange();
        this.#storage.clearSavedState();
        if (this.#onWin) {
            this.#onWin(winner);
        }
    }

    #notifyUndoStateChange() {
        if (this.#onUndoStateChange) {
            this.#onUndoStateChange(this.#prevState !== null && !this.#gameEnded);
        }
    }

    undo() {
        if (this.#view.isTransitioning || !this.#prevState || this.#gameEnded) return;

        this.#stopTimer();
        const originalLastMove = this.#lastMove;
        this.#view.animateUndoMove(
            originalLastMove.from,
            originalLastMove.to,
            () => {
                this.#model.restoreState(this.#prevState);
                this.#prevState = null;
                this.#lastMove = null;
                this.#gameEnded = false;
                this.#cursorRow = originalLastMove.from.row;
                this.#cursorCol = originalLastMove.from.col;
                
                this.#notifyUndoStateChange();
                this.#deselect();
                this.#init();
                this.#startTimer();
                if (this.#onMoveExecuted) {
                    this.#onMoveExecuted(this.#model.moveHistory);
                }
                if (this.#onTurnChange) {
                    this.#onTurnChange(this.#model.currentTurnDir);
                }
                this.#saveStateToLocalStorage();
            }
        );
    }

    #handleMultiJump(mustJumpPiece) {
        this.#selectedChecker = {row: mustJumpPiece.row, col: mustJumpPiece.col};
        this.#validMoves = this.#model.getValidMoves(mustJumpPiece.row, mustJumpPiece.col);
        this.#view.highlightMoves(this.#selectedChecker, this.#validMoves);
    }

    reset() {
        this.#model.reset();
        this.#storage.clearSavedState();
        this.#selectedChecker = null;
        this.#validMoves = [];
        this.#prevState = null;
        this.#lastMove = null;
        this.#gameEnded = false;
        this.#cursorRow = 0;
        this.#cursorCol = 0;
        this.#timerController.reset();
        this.#notifyUndoStateChange();
        this.#init();
        this.#startTimer();
        if (this.#onMoveExecuted) {
            this.#onMoveExecuted(this.#model.moveHistory);
        }
        if (this.#onTurnChange) {
            this.#onTurnChange(this.#model.currentTurnDir);
        }
    }

    #startTimer() {
        if (this.#gameEnded) return;
        const activePlayerNum = this.#model.currentTurnDir === GAME_RULES.MOVE_DIR_UP ? 1 : 2;
        this.#timerController.start(activePlayerNum);
    }

    #stopTimer() {
        this.#timerController.stop();
    }

    #handleTimeOut(timedOutPlayer) {
        const winner = timedOutPlayer === 1 ? 'PLAYER_2' : 'PLAYER_1';
        this.#handleWin(winner);
    }
}
