import { Checker } from './Checker.js';
import { Color } from './Color.js';

const BOARD_SIZE = 8;
const PIECE_ROWS_COUNT = 3;

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
                        pieceToCreate = new Checker(Color.WHITE, row, col, 1);
                    } else if (row >= BOARD_SIZE - PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(Color.BLACK, row, col, -1);
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
