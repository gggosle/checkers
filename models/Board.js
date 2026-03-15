import {Checker} from './Checker.js';
import {Color} from './Color.js';
import {GAME_CONFIG} from "../constants.js";
import {GAME_RULES} from "../constants.js";


export class Board {
    #board;

    constructor() {
        this.#board = this.#initializeBoardData();
    }

    getBoardClone() {
        return this.#board.map(row => row.map(cell => cell ? cell.clone() : null));
    }

    getPiece(row, col) {
        if (!this.isInBounds(row, col)) return null;
        return this.#board[row][col];
    }

    movePiece(piece, from, to) {
        this.#board[from.row][from.col] = null;
        this.#board[to.row][to.col] = piece;
        piece.setPosition(to.row, to.col);
    }

    removePiece(capturedPos) {
        this.#board[capturedPos.row][capturedPos.col] = null;
    }

    checkPromotion(piece, row) {
        if (!piece.isKing && ((piece.color === Color.WHITE && row === GAME_CONFIG.BOARD_SIZE - 1) ||
            (piece.color === Color.BLACK && row === 0))) {
            piece.makeKing();
            return true;
        }
        return false;
    }

    isInBounds(row, col) {
        return row >= 0 && row < GAME_CONFIG.BOARD_SIZE && col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
    }

    #initializeBoardData() {
        const data = [];
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            data.push(this.#createRow(row));
        }
        return data;
    }

    #createRow(row) {
        const rowArray = [];
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            rowArray.push(this.#createPiece(row, col));
        }
        return rowArray;
    }

    #createPiece(row, col) {
        if (!Board.isBlackSquare(row, col)) return null;

        if (row < GAME_RULES.PIECE_ROWS_COUNT) {
            return new Checker(Color.WHITE, row, col, GAME_RULES.MOVE_DIR_UP);
        } else if (row >= GAME_CONFIG.BOARD_SIZE - GAME_RULES.PIECE_ROWS_COUNT) {
            return new Checker(Color.BLACK, row, col, GAME_RULES.MOVE_DIR_DOWN);
        }
        return null;
    }

    static isBlackSquare(row, col) {
        return (row + col) % 2 !== 0;
    }
}
