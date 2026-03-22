import {MoveType} from './MoveType.js';
import {GAME_CONFIG} from "../constants.js";

export class MoveEngine {
    #board;

    constructor(board) {
        this.#board = board;
    }

    getValidMoves(row, col, currentPlayerDir, mustJumpPiece, hasJumpsAvailable) {
        const piece = this.#board.getPiece(row, col);
        if (!piece || piece.direction !== currentPlayerDir) return [];

        if (mustJumpPiece && (mustJumpPiece.row !== row || mustJumpPiece.col !== col)) {
            return [];
        }

        const moves = this.calculatePotentialMoves(row, col);

        if (hasJumpsAvailable) {
            return moves.filter(m => m.type === MoveType.JUMP);
        }

        return moves;
    }

    calculatePotentialMoves(row, col) {
        const piece = this.#board.getPiece(row, col);
        if (!piece) return [];

        const moves = [];
        this.#forEachPossibleDirection(piece, (dr, dc) => {
            const move = this.#calculateTargetMove(piece, row, col, dr, dc);
            if (move) moves.push(move);
        });

        return moves;
    }

    hasJumpAvailable(row, col) {
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

    anyPlayerJumpsAvailable(currentPlayerDir) {
        for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
            for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
                const piece = this.#board.getPiece(r, c);
                if (piece && piece.direction === currentPlayerDir) {
                    if (this.hasJumpAvailable(r, c)) {
                        return true;
                    }
                }
            }
        }
        return false;
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
}
