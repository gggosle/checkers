import {KeyboardController} from "./KeyboardController.js";

export class GameController {
    #model;
    #view;
    #storage;
    #timerController;
    #keyboardController;
    #undoController;
    #selectedChecker = null;
    #validMoves = [];
    #prevState = null;
    #lastMove = null;
    #gameEnded = false;
    #onTurnChange = null;
    #onMoveExecuted = null;
    #onWin = null;

    constructor(model, view, storage, timerController, undoController) {
        this.#model = model;
        this.#view = view;
        this.#storage = storage;
        this.#timerController = timerController;
        this.#undoController = undoController;
        
        this.#keyboardController = new KeyboardController(this.#view, () => this.#handleCursorAction());
        
        this.#timerController.setOnTimeout((playerNum) => this.#handleTimeOut(playerNum));

        this.#init();
        this.#startTimer();
    }

    setOnMoveExecuted(callback) {
        this.#onMoveExecuted = callback;
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
    }

    #handleCursorAction() {
        const row = this.#keyboardController.cursorRow;
        const col = this.#keyboardController.cursorCol;
        const piece = this.#model.getPiece(row, col);
        if (piece && this.#isOwnPiece(piece)) {
            this.#handleCheckerClick(row, col);
        } else {
            this.#handleCellClick(row, col);
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
                this.#keyboardController.setCursor(row, col);
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
            this.#keyboardController.setCursor(mustJumpPiece.row, mustJumpPiece.col);
        } else {
            this.#deselect();
            this.#startTimer();
        }

        if (this.#onMoveExecuted) {
            this.#onMoveExecuted(this.#model.moveHistory);
        }

        if (this.#onTurnChange) {
            this.#onTurnChange(this.#model.currentPlayer);
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
            const winner = this.#model.players.find(p => p.moveDir !== activeDir);
            this.#handleWin(winner);
        }
    }

    #handleWin(winner) {
        this.#gameEnded = true;
        this.#keyboardController.setGameEnded(true);
        this.#stopTimer();
        this.#notifyUndoStateChange();
        this.#storage.clearSavedState();
        if (this.#onWin) {
            this.#onWin(winner);
        }
    }

    #notifyUndoStateChange() {
        this.#undoController.setEnabled(this.#prevState !== null && !this.#gameEnded);
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
                this.#keyboardController.setCursor(originalLastMove.from.row, originalLastMove.from.col);
                
                this.#notifyUndoStateChange();
                this.#deselect();
                this.#init();
                this.#startTimer();
                if (this.#onMoveExecuted) {
                    this.#onMoveExecuted(this.#model.moveHistory);
                }
                if (this.#onTurnChange) {
                    this.#onTurnChange(this.#model.currentPlayer);
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
        this.#keyboardController.setGameEnded(false);
        this.#keyboardController.setCursor(0, 0);
        this.#timerController.reset();
        this.#notifyUndoStateChange();
        this.#init();
        this.#startTimer();
        if (this.#onMoveExecuted) {
            this.#onMoveExecuted(this.#model.moveHistory);
        }
        if (this.#onTurnChange) {
            this.#onTurnChange(this.#model.currentPlayer);
        }
    }

    #startTimer() {
        if (this.#gameEnded) return;
        this.#timerController.start(this.#model.currentPlayer.id);
    }

    #stopTimer() {
        this.#timerController.stop();
    }

    #handleTimeOut(timedOutPlayerId) {
        const winner = this.#model.players.find(p => p.id !== timedOutPlayerId);
        this.#handleWin(winner);
    }
}
