import { Checker } from './Checker.js';
import { Color } from './Color.js';

const BOARD_SIZE = 8;
const PIECE_ROWS_COUNT = 3;
const MOVE_DIR_UP = 1;
const MOVE_DIR_DOWN = -1;

export class GameModel {
    #board;

    constructor() {
        this.#board = this.#initializeBoardData();
    }

    getBoard() {
        return this.#board;
    }

    #initializeBoardData() {
        const data = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            const rowArray = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                let pieceToCreate = null;

                if (this.isBlackSquare(row, col)) {
                    if (row < PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(Color.WHITE, row, col, MOVE_DIR_UP);
                    } else if (row >= BOARD_SIZE - PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(Color.BLACK, row, col, MOVE_DIR_DOWN);
                    }
                }

                rowArray.push(pieceToCreate);
            }
            data.push(rowArray);
        }
        return data;
    }

    isBlackSquare(row, col) {
        return (row + col) % 2 !== 0;
    }
}
