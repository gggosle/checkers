import { Checker } from './Checker.js';

export class GameModel {
    static ROWS_NUM = 8;
    static COLS_NUM = 8;
    static PIECE_ROWS_COUNT = 3;
    static BLACK_PIECE = 2;
    static WHITE_PIECE = 1;

    #board;

    constructor() {
        this.#board = this.#initializeBoardData();
    }

    getBoard() {
        return this.#board;
    }

    #initializeBoardData() {
        const data = [];
        for (let row = 0; row < GameModel.ROWS_NUM; row++) {
            const rowArray = [];
            for (let col = 0; col < GameModel.COLS_NUM; col++) {
                let pieceToCreate = null;

                if (this.isBlackSquare(row, col)) {
                    if (row < GameModel.PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(GameModel.WHITE_PIECE, row, col, 1);
                    } else if (row >= GameModel.ROWS_NUM - GameModel.PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(GameModel.BLACK_PIECE, row, col, -1);
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
