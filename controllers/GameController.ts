import { GameModel } from '../models/GameModel.js';
import { GameView } from '../views/GameView.js';
import { Storage } from '../services/Storage.js';
import { TimerController } from './TimerController.js';
import { KeyboardController } from './KeyboardController.js';
import { UndoController } from './UndoController.js';
import { Move, SelectedChecker, OnMoveExecutedCallback, OnTurnChangeCallback, OnWinCallback } from '../models/interfaces';
import { Player } from '../models/Player.js';

export class GameController {
    #model: GameModel;
    #view: GameView;
    #storage: Storage;
    #timerController: TimerController;
    #keyboardController: KeyboardController;
    #undoController: UndoController;
    #selectedChecker: SelectedChecker | null = null;
    #validMoves: Move[] = [];
    #prevState: ReturnType<GameModel['getClonedState']> | null = null;
    #lastMove: { from: SelectedChecker; to: SelectedChecker; captured: SelectedChecker | null } | null = null;
    #gameEnded = false;
    #onTurnChange: OnTurnChangeCallback | null = null;
    #onMoveExecuted: OnMoveExecutedCallback | null = null;
    #onWin: OnWinCallback | null = null;

    constructor(model: GameModel, view: GameView, storage: Storage, timerController: TimerController, undoController: UndoController) {
        this.#model = model;
        this.#view = view;
        this.#storage = storage;
        this.#timerController = timerController;
        this.#undoController = undoController;
        
        this.#keyboardController = new KeyboardController(this.#view, () => this.#handleCursorAction());
        
        this.#timerController.setOnTimeout((playerNum: number) => this.#handleTimeOut(playerNum));

        this.#init();
        this.#startTimer();
    }

    setOnMoveExecuted(callback: OnMoveExecutedCallback): void {
        this.#onMoveExecuted = callback;
    }

    setOnTurnChange(callback: OnTurnChangeCallback): void {
        this.#onTurnChange = callback;
    }

    setOnWin(callback: OnWinCallback): void {
        this.#onWin = callback;
    }

    getSelectedChecker(): SelectedChecker | null {
        return this.#selectedChecker;
    }

    #init(): void {
        this.#view.render(
            this.#model.boardClone,
            (row: number, col: number) => this.#model.isBlackSquare(row, col),
            (row: number, col: number) => this.#handleCheckerClick(row, col),
            (row: number, col: number) => this.#handleCellClick(row, col)
        );
    }

    #handleCursorAction(): void {
        const row = this.#keyboardController.cursorRow;
        const col = this.#keyboardController.cursorCol;
        const piece = this.#model.getPiece(row, col);
        if (piece && this.#isOwnPiece(piece)) {
            this.#handleCheckerClick(row, col);
        } else {
            this.#handleCellClick(row, col);
        }
    }

    #handleCheckerClick(row: number, col: number): void {
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

    #isOwnPiece(piece: ReturnType<GameModel['getPiece']>): piece is NonNullable<ReturnType<GameModel['getPiece']>> {
        return piece !== null && piece.direction === this.#model.currentTurnDir;
    }

    #isMustJumpPieceViolation(row: number, col: number): boolean {
        const mustJumpPiece = this.#model.mustJumpPiece;
        return mustJumpPiece !== null && (mustJumpPiece.row !== row || mustJumpPiece.col !== col);
    }

    #isToggleDeselect(row: number, col: number): boolean {
        return this.#selectedChecker !== null &&
            this.#selectedChecker.row === row &&
            this.#selectedChecker.col === col &&
            this.#model.mustJumpPiece === null;
    }

    #deselect(): void {
        this.#selectedChecker = null;
        this.#validMoves = [];
        this.#view.clearHighlights();
    }

    #select(row: number, col: number, validMoves: Move[]): void {
        this.#selectedChecker = {row, col};
        this.#validMoves = validMoves;
        this.#view.highlightMoves(this.#selectedChecker, this.#validMoves);
    }

    #handleCellClick(row: number, col: number): void {
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
                this.#model.executeMove(this.#selectedChecker as SelectedChecker, move);
                this.#keyboardController.setCursor(row, col);
                this.#processMoveResult();
                this.#checkWinCondition();
            }
        );
    }

    #recordMoveState(move: Move): void {
        if (this.#gameEnded) return;

        this.#prevState = this.#model.getClonedState();
        this.#lastMove = {
            from: {row: (this.#selectedChecker as SelectedChecker).row, col: (this.#selectedChecker as SelectedChecker).col},
            to: {row: move.row, col: move.col},
            captured: move.captured ? {...move.captured} : null
        };
        this.#notifyUndoStateChange();
    }

    #processMoveResult(): void {
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

    #saveStateToLocalStorage(): void {
        const liveState = this.#model.getLiveState();
        liveState.playerTimes = this.#timerController.playerTimes;
        this.#storage.saveToLocalStorage(liveState);
    }

    #checkWinCondition(): void {
        const activeDir = this.#model.currentTurnDir;
        if (!this.#model.hasAnyValidMoves(activeDir)) {
            const winner = this.#model.players.find(p => p.moveDir !== activeDir);
            if (winner) {
                this.#handleWin(winner);
            }
        }
    }

    #handleWin(winner: Player): void {
        this.#gameEnded = true;
        this.#keyboardController.setGameEnded(true);
        this.#stopTimer();
        this.#notifyUndoStateChange();
        this.#storage.clearSavedState();
        if (this.#onWin) {
            this.#onWin(winner);
        }
    }

    #notifyUndoStateChange(): void {
        this.#undoController.setEnabled(this.#prevState !== null && !this.#gameEnded);
    }

    undo(): void {
        if (this.#view.isTransitioning || !this.#prevState || this.#gameEnded) return;

        this.#stopTimer();
        const originalLastMove = this.#lastMove;
        this.#view.animateUndoMove(
            originalLastMove!.from,
            originalLastMove!.to,
            () => {
                this.#model.restoreState(this.#prevState!);
                this.#prevState = null;
                this.#lastMove = null;
                this.#gameEnded = false;
                this.#keyboardController.setCursor(originalLastMove!.from.row, originalLastMove!.from.col);
                
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

    #handleMultiJump(mustJumpPiece: { row: number; col: number }): void {
        this.#selectedChecker = {row: mustJumpPiece.row, col: mustJumpPiece.col};
        this.#validMoves = this.#model.getValidMoves(mustJumpPiece.row, mustJumpPiece.col);
        this.#view.highlightMoves(this.#selectedChecker, this.#validMoves);
    }

    reset(): void {
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

    #startTimer(): void {
        if (this.#gameEnded) return;
        this.#timerController.start(this.#model.currentPlayer.id);
    }

    #stopTimer(): void {
        this.#timerController.stop();
    }

    #handleTimeOut(timedOutPlayerId: number): void {
        const winner = this.#model.players.find(p => p.id !== timedOutPlayerId);
        if (winner) {
            this.#handleWin(winner);
        }
    }
}
