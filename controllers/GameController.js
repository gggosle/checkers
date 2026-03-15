import {GAME_RULES} from "../constants.js";

export class GameController {
    #model;
    #view;
    #selectedChecker = null;
    #validMoves = [];

    constructor(model, view) {
        this.#model = model;
        this.#view = view;

        this.#init();
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

        this.#model.executeMove(this.#selectedChecker, move);

        const mustJumpPiece = this.#model.mustJumpPiece;
        this.#init();
        if (mustJumpPiece) {
            this.#handleMultiJump(mustJumpPiece);
        } else {
            this.#deselect();
        }
        this.#checkWinCondition();
    }

    #checkWinCondition() {
        const activeDir = this.#model.currentTurnDir;
        if (!this.#model.hasAnyValidMoves(activeDir)) {
            const winner = activeDir === GAME_RULES.MOVE_DIR_UP ? 'PLAYER_2' : 'PLAYER_1';
            setTimeout(() => alert(`Game Over! ${winner} wins!`), 100);
        }
    }

    #handleMultiJump(mustJumpPiece) {
        this.#selectedChecker = {row: mustJumpPiece.row, col: mustJumpPiece.col};
        this.#validMoves = this.#model.getValidMoves(mustJumpPiece.row, mustJumpPiece.col);
        this.#view.highlightMoves(this.#selectedChecker, this.#validMoves);
    }
}
