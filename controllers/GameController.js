import {KeyboardController} from "./KeyboardController.js";
import {MoveProcessor} from "./MoveProcessor.js";
import {GameStateManager} from "../services/GameStateManager.js";

export class GameController {
    #model;
    #view;
    #storage;
    #timerController;
    #keyboardController;
    #undoController;
    #moveProcessor;
    #stateManager;
    #selectedChecker = null;
    #validMoves = [];
    #prevState = null;
    #lastMove = null;
    #gameEnded = false;
    #onTurnChange = null;
    #onMoveExecuted = null;

    constructor(model, view, storage, timerController, undoController) {
        this.#model = model;
        this.#view = view;
        this.#storage = storage;
        this.#timerController = timerController;
        this.#undoController = undoController;
        
        this.#keyboardController = new KeyboardController(this.#view, () => this.#handleCursorAction());
        this.#moveProcessor = new MoveProcessor(this.#model, this.#view, this.#keyboardController, () => this.#handleMoveCompleted());
        this.#stateManager = new GameStateManager(model, storage, timerController, undoController, (winner) => this.#handleWin(winner));
        
        this.#timerController.setOnTimeout((playerNum) => this.#handleTimeOut(playerNum));
        this.#init();
        this.#startTimer();
    }

    setOnMoveExecuted(callback) { this.#onMoveExecuted = callback; }
    setOnTurnChange(callback) { this.#onTurnChange = callback; }
    setOnWin(callback) { this.#stateManager.onWin = callback; } 

    getSelectedChecker() { return this.#selectedChecker; }

    #init() {
        this.#view.render(
            this.#model.boardClone,
            (row, col) => this.#model.isBlackSquare(row, col),
            (row, col) => this.#handleCheckerClick(row, col),
            (row, col) => this.#handleCellClick(row, col)
        );
    }

    #handleCursorAction() {
        const {cursorRow: r, cursorCol: c} = this.#keyboardController;
        const piece = this.#model.getPiece(r, c);
        if (piece && piece.direction === this.#model.currentTurnDir) this.#handleCheckerClick(r, c);
        else this.#handleCellClick(r, c);
    }

    #handleCheckerClick(row, col) {
        if (this.#view.isTransitioning) return;
        this.#view.clearHistoryHighlights();
        const piece = this.#model.getPiece(row, col);
        if (!piece || piece.direction !== this.#model.currentTurnDir) return;

        const mustJump = this.#model.mustJumpPiece;
        if (mustJump && (mustJump.row !== row || mustJump.col !== col)) return;

        if (this.#selectedChecker?.row === row && this.#selectedChecker?.col === col && !mustJump) {
            this.#deselect();
            return;
        }

        const validMoves = this.#model.getValidMoves(row, col);
        if (validMoves.length > 0) this.#select(row, col, validMoves);
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
        this.#moveProcessor.executeMove(
            this.#selectedChecker, 
            move, 
            (m) => this.#recordMoveState(m)
        );
    }

    #handleMoveCompleted() {
        this.#selectedChecker = this.#moveProcessor.selectedCheckerAfterMove;
        this.#validMoves = this.#moveProcessor.validMovesAfterMove;
        this.#init();

        if (!this.#selectedChecker) this.#startTimer();

        if (this.#onMoveExecuted) this.#onMoveExecuted(this.#model.moveHistory);
        if (this.#onTurnChange) this.#onTurnChange(this.#model.currentPlayer);
        
        const winner = this.#stateManager.checkWinCondition();
        if (winner) this.#handleWin(winner);
        this.#stateManager.saveState();
    }

    #handleWin(winner) {
        this.#gameEnded = true;
        this.#stateManager.handleWin(winner, this.#keyboardController);
        this.#notifyUndoStateChange();
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

    #notifyUndoStateChange() {
        this.#undoController.setEnabled(this.#prevState !== null && !this.#gameEnded);
    }

    undo() {
        if (this.#view.isTransitioning || !this.#prevState || this.#gameEnded) return;

        this.#stopTimer();
        const originalLastMove = this.#lastMove;
        this.#view.animateUndoMove(originalLastMove.from, originalLastMove.to, () => {
            this.#model.restoreState(this.#prevState);
            this.#prevState = null;
            this.#lastMove = null;
            this.#gameEnded = false;
            this.#keyboardController.setCursor(originalLastMove.from.row, originalLastMove.from.col);
            this.#notifyUndoStateChange();
            this.#deselect();
            this.#init();
            this.#startTimer();
            if (this.#onMoveExecuted) this.#onMoveExecuted(this.#model.moveHistory);
            if (this.#onTurnChange) this.#onTurnChange(this.#model.currentPlayer);
            this.#stateManager.saveState();
        });
    }

    reset() {
        this.#model.reset();
        this.#stateManager.saveState();
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
        if (this.#onMoveExecuted) this.#onMoveExecuted(this.#model.moveHistory);
        if (this.#onTurnChange) this.#onTurnChange(this.#model.currentPlayer);
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
