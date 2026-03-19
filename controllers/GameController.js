import {GAME_RULES} from "../constants.js";

export class GameController {
    #model;
    #view;
    #selectedChecker = null;
    #validMoves = [];
    #prevState = null;
    #lastMove = null;
    #gameEnded = false;
    #onUndoStateChange = null;
    #onTurnChange = null;
    #onWin = null;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;

        this.#init();
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
    }

    #handleCheckerClick(row, col) {
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
        if (!this.#selectedChecker) return;

        const move = this.#validMoves.find(m => m.row === row && m.col === col);
        if (!move) return;

        this.#recordMoveState(move);
        this.#model.executeMove(this.#selectedChecker, move);
        this.#processMoveResult();
        this.#checkWinCondition();
    }

    #recordMoveState(move) {
        if (this.#gameEnded) return;

        this.#prevState = this.#model.captureState();
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
        } else {
            this.#deselect();
        }
        
        if (this.#onTurnChange) {
            this.#onTurnChange(this.#model.currentTurnDir);
        }
    }

    #checkWinCondition() {
        const activeDir = this.#model.currentTurnDir;
        if (!this.#model.hasAnyValidMoves(activeDir)) {
            this.#gameEnded = true;
            this.#notifyUndoStateChange();
            const winner = activeDir === GAME_RULES.MOVE_DIR_UP ? 'PLAYER_2' : 'PLAYER_1';
            if (this.#onWin) {
                this.#onWin(winner);
            }
        }
    }

    #notifyUndoStateChange() {
        if (this.#onUndoStateChange) {
            this.#onUndoStateChange(this.#prevState !== null && !this.#gameEnded);
        }
    }

    undo() {
        if (!this.#prevState || this.#gameEnded) return;

        this.#view.animateUndoMove(
            this.#lastMove.from,
            this.#lastMove.to,
            () => {
                this.#model.restoreState(this.#prevState);
                this.#prevState = null;
                this.#lastMove = null;
                this.#gameEnded = false;
                this.#notifyUndoStateChange();
                this.#deselect();
                this.#init();
                if (this.#onTurnChange) {
                    this.#onTurnChange(this.#model.currentTurnDir);
                }
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
        this.#selectedChecker = null;
        this.#validMoves = [];
        this.#prevState = null;
        this.#lastMove = null;
        this.#gameEnded = false;
        this.#notifyUndoStateChange();
        this.#init();
        if (this.#onTurnChange) {
            this.#onTurnChange(this.#model.currentTurnDir);
        }
    }
}
