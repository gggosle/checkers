import { Checker } from './Checker.js';
import { Color } from './Color.js';

const BOARD_SIZE = 8;
const PIECE_ROWS_COUNT = 3;
const MOVE_DIR_UP = 1;
const MOVE_DIR_DOWN = -1;

export class GameModel {
    #board;
    #currentTurn;
    #mustJumpPiece;
    #hasJumpsAvailable;

    constructor() {
        this.#board = this.#initializeBoardData();
        this.#currentTurn = Color.WHITE;
        this.#mustJumpPiece = null;
        this.#hasJumpsAvailable = false;
    }

    get currentTurn() {
        return this.#currentTurn;
    }

    get mustJumpPiece() {
        return this.#mustJumpPiece;
    }

    getBoard() {
        return this.#board;
    }

    getPiece(row, col) {
        if (!this.#isInBounds(row, col)) return null;
        return this.#board[row][col];
    }

    getValidMoves(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece || piece.color !== this.#currentTurn) return [];

        if (this.#mustJumpPiece && (this.#mustJumpPiece.row !== row || this.#mustJumpPiece.col !== col)) {
            return [];
        }

        const moves = this.#calculatePotentialMoves(row, col);

        if (this.#hasJumpsAvailable) {
            return moves.filter(m => m.type === 'jump');
        }

        return moves;
    }

    #calculatePotentialMoves(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece) return [];

        const moves = [];
        this.#forEachPossibleDirection(piece, (dr, dc) => {
            const move = this.#calculateTargetMove(piece, row, col, dr, dc);
            if (move) moves.push(move);
        });

        return moves;
    }

    #hasJumpAvailable(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece) return false;

        let hasJump = false;
        this.#forEachPossibleDirection(piece, (dr, dc) => {
            if (hasJump) return;
            const move = this.#calculateTargetMove(piece, row, col, dr, dc);
            if (move?.type === 'jump') hasJump = true;
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
        if (!this.#isInBounds(targetRow, targetCol)) return null;

        const targetPiece = this.#board[targetRow][targetCol];
        if (!targetPiece) return { row: targetRow, col: targetCol, type: 'move' };

        return this.#tryCalculateJump(piece, targetPiece, dr, dc);
    }

    #tryCalculateJump(piece, targetPiece, dr, dc) {
        if (targetPiece.color === piece.color) return null;

        const jumpRow = targetPiece.row + dr;
        const jumpCol = targetPiece.col + dc;

        if (this.#isInBounds(jumpRow, jumpCol) && !this.#board[jumpRow][jumpCol]) {
            return {
                row: jumpRow,
                col: jumpCol,
                type: 'jump',
                captured: { row: targetPiece.row, col: targetPiece.col }
            };
        }
        return null;
    }

    #anyPlayerJumpsAvailable() {
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = this.#board[r][c];
                if (piece && piece.color === this.#currentTurn) {
                    if (this.#hasJumpAvailable(r, c)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    executeMove(from, toMove) {
        const piece = this.getPiece(from.row, from.col);
        if (!piece) return false;

        this.#movePiece(piece, from, toMove);
        if (toMove.type === 'jump') {
            this.#capturePiece(toMove.captured);
        }

        const promoted = this.#checkPromotion(piece, toMove.row);
        this.#handlePostMove(piece, toMove, promoted);
        return true;
    }

    #movePiece(piece, from, to) {
        this.#board[from.row][from.col] = null;
        this.#board[to.row][to.col] = piece;
        piece.setPosition(to.row, to.col);
    }

    #capturePiece(capturedPos) {
        this.#board[capturedPos.row][capturedPos.col] = null;
    }

    #checkPromotion(piece, row) {
        if (!piece.isKing && ((piece.color === Color.WHITE && row === BOARD_SIZE - 1) ||
            (piece.color === Color.BLACK && row === 0))) {
            piece.makeKing();
            return true;
        }
        return false;
    }

    #handlePostMove(piece, toMove, promoted) {
        if (toMove.type === 'jump' && !promoted) {
            if (this.#hasJumpAvailable(toMove.row, toMove.col)) {
                this.#mustJumpPiece = { row: toMove.row, col: toMove.col };
                this.#hasJumpsAvailable = true;
                return;
            }
        }

        this.#mustJumpPiece = null;
        this.#switchTurn();
    }

    #switchTurn() {
        this.#currentTurn = this.#currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
        this.#hasJumpsAvailable = this.#anyPlayerJumpsAvailable();
    }

    #isInBounds(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    #initializeBoardData() {
        const data = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            data.push(this.#createRow(row));
        }
        return data;
    }

    #createRow(row) {
        const rowArray = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            rowArray.push(this.#createPiece(row, col));
        }
        return rowArray;
    }

    #createPiece(row, col) {
        if (!this.isBlackSquare(row, col)) return null;

        if (row < PIECE_ROWS_COUNT) {
            return new Checker(Color.WHITE, row, col, MOVE_DIR_UP);
        } else if (row >= BOARD_SIZE - PIECE_ROWS_COUNT) {
            return new Checker(Color.BLACK, row, col, MOVE_DIR_DOWN);
        }
        return null;
    }

    isBlackSquare(row, col) {
        return (row + col) % 2 !== 0;
    }
}
