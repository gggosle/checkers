import {Checker} from './Checker.js';
import {Color} from './Color.js';
import {GAME_CONFIG} from "../constants.js";
import {GAME_RULES} from "../constants.js";
import { Position } from './interfaces';
import { CheckerData } from './interfaces';

export class Board {
    #board: (Checker | null)[][];

    constructor() {
        this.#board = this.#initializeBoardData();
    }

    getBoardClone(): (Checker | null)[][] {
        return this.#board.map(row => row.map(cell => cell ? cell.clone() : null));
    }

    getOriginalBoard(): (Checker | null)[][] {
        return this.#board;
    }

    restoreBoard(boardData: (CheckerData | null)[][]): void {
        if (!Array.isArray(boardData)) return;
        this.#board = boardData.map(row => row.map(cell => {
            if (!cell) return null;
            return cell instanceof Checker ? cell.clone() : Checker.fromJSON(cell);
        }));
    }

    getPiece(row: number, col: number): Checker | null {
        if (!this.isInBounds(row, col)) return null;
        return this.#board[row][col];
    }

    movePiece(piece: Checker, from: Position, to: Position): void {
        this.#board[from.row][from.col] = null;
        this.#board[to.row][to.col] = piece;
        piece.setPosition(to.row, to.col);
    }

    removePiece(capturedPos: Position): void {
        this.#board[capturedPos.row][capturedPos.col] = null;
    }

    checkPromotion(piece: Checker, row: number): boolean {
        if (piece.isKing) return false;

        const promotionRow = piece.direction === GAME_RULES.MOVE_DIR_UP 
            ? GAME_CONFIG.BOARD_SIZE - 1 
            : 0;

        if (row === promotionRow) {
            piece.makeKing();
            return true;
        }
        return false;
    }

    isInBounds(row: number, col: number): boolean {
        return row >= 0 && row < GAME_CONFIG.BOARD_SIZE && col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
    }

    #initializeBoardData(): (Checker | null)[][] {
        const data: (Checker | null)[][] = [];
        for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            data.push(this.#createRow(row));
        }
        return data;
    }

    #createRow(row: number): (Checker | null)[] {
        const rowArray: (Checker | null)[] = [];
        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            rowArray.push(this.#createPiece(row, col));
        }
        return rowArray;
    }

    #createPiece(row: number, col: number): Checker | null {
        if (!Board.isBlackSquare(row, col)) return null;

        if (row < GAME_RULES.PIECE_ROWS_COUNT) {
            return new Checker(Color.WHITE, row, col, GAME_RULES.MOVE_DIR_UP);
        } else if (row >= GAME_CONFIG.BOARD_SIZE - GAME_RULES.PIECE_ROWS_COUNT) {
            return new Checker(Color.BLACK, row, col, GAME_RULES.MOVE_DIR_DOWN);
        }
        return null;
    }

    static isBlackSquare(row: number, col: number): boolean {
        return (row + col) % 2 !== 0;
    }
}
