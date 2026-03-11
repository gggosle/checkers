import { Checker } from './Checker.js';
import { Color } from './Color.js';

export class GameModel {
    static BOARD_SIZE = 8;
    static PIECE_ROWS_COUNT = 3;

    #board;

    constructor() {
        this.#board = this.#initializeBoardData();
    }

    getBoard() {
        return this.#board;
    }

    #initializeBoardData() {
        const data = [];
        for (let row = 0; row < GameModel.BOARD_SIZE; row++) {
            const rowArray = [];
            for (let col = 0; col < GameModel.BOARD_SIZE; col++) {
                let pieceToCreate = null;

                if (this.isBlackSquare(row, col)) {
                    if (row < GameModel.PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(Color.WHITE, row, col, 1);
                    } else if (row >= GameModel.BOARD_SIZE - GameModel.PIECE_ROWS_COUNT) {
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
