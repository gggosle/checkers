import {MoveType} from './MoveType.js';
import {Board} from './Board.js';
import {GAME_CONFIG, GAME_RULES} from "../constants.js";

export class GameModel {
    #board;
    #currentTurnDir;
    #mustJumpPiece;
    #hasJumpsAvailable;

    constructor() {
        this.#board = new Board();
        this.#currentTurnDir = GAME_RULES.MOVE_DIR_UP;
        this.#mustJumpPiece = null;
        this.#hasJumpsAvailable = false;
    }
    
    get boardClone() {
        return this.#board.getBoardClone();
    }
    
    getPiece(row, col) {
        return this.#board.getPiece(row, col);
    }
    
    isBlackSquare(row, col) {
        return Board.isBlackSquare(row, col);
    }

    get currentTurnDir() {
        return this.#currentTurnDir;
    }

    get mustJumpPiece() {
        return this.#mustJumpPiece;
    }

    getValidMoves(row, col) {
        const piece = this.#board.getPiece(row, col);
        if (!piece || piece.direction !== this.#currentTurnDir) return [];

        if (this.#mustJumpPiece && (this.#mustJumpPiece.row !== row || this.#mustJumpPiece.col !== col)) {
            return [];
        }

        const moves = this.#calculatePotentialMoves(row, col);

        if (this.#hasJumpsAvailable) {
            return moves.filter(m => m.type === MoveType.JUMP);
        }

        return moves;
    }

    #calculatePotentialMoves(row, col) {
        const piece = this.#board.getPiece(row, col);
        if (!piece) return [];

        const moves = [];
        this.#forEachPossibleDirection(piece, (dr, dc) => {
            const move = this.#calculateTargetMove(piece, row, col, dr, dc);
            if (move) moves.push(move);
        });

        return moves;
    }

    #hasJumpAvailable(row, col) {
        const piece = this.#board.getPiece(row, col);
        if (!piece) return false;

        let hasJump = false;
        this.#forEachPossibleDirection(piece, (dr, dc) => {
            if (hasJump) return;
            const move = this.#calculateTargetMove(piece, row, col, dr, dc);
            if (move?.type === MoveType.JUMP) hasJump = true;
        });

        return hasJump;
    }

    #forEachPossibleDirection(piece, callback) {
        const directions = piece.isKing ? [1, -1] : [piece.direction];
        for (const dr of directions) {
            for (const dc of [1, -1]) {
                callback(dr, dc);
            }
        }
    }

    #calculateTargetMove(piece, row, col, dr, dc) {
        const targetRow = row + dr;
        const targetCol = col + dc;
        if (!this.#board.isInBounds(targetRow, targetCol)) return null;

        const targetPiece = this.#board.getPiece(targetRow, targetCol);
        if (!targetPiece) return {row: targetRow, col: targetCol, type: MoveType.MOVE};

        return this.#tryCalculateJump(piece, targetPiece, dr, dc);
    }

    #tryCalculateJump(piece, targetPiece, dr, dc) {
        if (targetPiece.direction === piece.direction) return null;

        const jumpRow = targetPiece.row + dr;
        const jumpCol = targetPiece.col + dc;

        if (this.#board.isInBounds(jumpRow, jumpCol) && !this.#board.getPiece(jumpRow, jumpCol)) {
            return {
                row: jumpRow,
                col: jumpCol,
                type: MoveType.JUMP,
                captured: {row: targetPiece.row, col: targetPiece.col}
            };
        }
        return null;
    }

    #anyPlayerJumpsAvailable() {
        for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
            for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
                const piece = this.#board.getPiece(r, c);
                if (piece && piece.direction === this.#currentTurnDir) {
                    if (this.#hasJumpAvailable(r, c)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    executeMove(from, toMove) {
        const piece = this.#board.getPiece(from.row, from.col);
        if (!piece) return false;

        this.#board.movePiece(piece, from, toMove);
        if (toMove.type === MoveType.JUMP) {
            this.#board.removePiece(toMove.captured);
        }

        const promoted = this.#checkPromotion(piece, toMove.row);
        this.#handlePostMove(piece, toMove, promoted);
        return true;
    }

    #checkPromotion(piece, row) {
        return this.#board.checkPromotion(piece, row);
    }

    #handlePostMove(piece, toMove, promoted) {
        if (toMove.type === MoveType.JUMP && !promoted) {
            if (this.#hasJumpAvailable(toMove.row, toMove.col)) {
                this.#mustJumpPiece = {row: toMove.row, col: toMove.col};
                this.#hasJumpsAvailable = true;
                return;
            }
        }

        this.#mustJumpPiece = null;
        this.#switchTurn();
    }

    #switchTurn() {
        this.#currentTurnDir = this.#currentTurnDir === GAME_RULES.MOVE_DIR_UP 
            ? GAME_RULES.MOVE_DIR_DOWN 
            : GAME_RULES.MOVE_DIR_UP;
        this.#hasJumpsAvailable = this.#anyPlayerJumpsAvailable();
    }

    hasAnyValidMoves(direction) {
        for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
            for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
                const piece = this.#board.getPiece(r, c);
                if (piece && piece.direction === direction) {
                    if (this.getValidMoves(r, c).length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    captureState() {
        return {
            board: this.#board.getBoardClone(),
            currentTurnDir: this.#currentTurnDir,
            mustJumpPiece: this.#mustJumpPiece ? {...this.#mustJumpPiece} : null,
            hasJumpsAvailable: this.#hasJumpsAvailable
        };
    }

    restoreState(state) {
        this.#board.restoreBoard(state.board);
        this.#currentTurnDir = state.currentTurnDir;
        this.#mustJumpPiece = state.mustJumpPiece;
        this.#hasJumpsAvailable = state.hasJumpsAvailable;
    }

    reset() {
        this.#board = new Board();
        this.#currentTurnDir = GAME_RULES.MOVE_DIR_UP;
        this.#mustJumpPiece = null;
        this.#hasJumpsAvailable = false;
        this.clearSavedState();
    }

    saveToLocalStorage() {
        localStorage.setItem('checkers_state', JSON.stringify(this.captureState()));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('checkers_state');
        if (saved) {
            try {
                this.restoreState(JSON.parse(saved));
                return true;
            } catch (e) {
                console.error("Failed to load state from localStorage", e);
            }
        }
        return false;
    }

    clearSavedState() {
        localStorage.removeItem('checkers_state');
    }
}
