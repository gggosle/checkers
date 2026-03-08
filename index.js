"use strict";

const boardElement = document.getElementById('board');

class Checker {
    constructor(color, row, col, direction) {
        this.color = color;
        this.direction = direction;
        this.isKing = false;
    }
}

class CheckerGame {
    static ROWS_NUM = 8;
    static COLS_NUM = 8;
    static PIECE_ROWS_COUNT = 3;
    static BLACK_PIECE = 2;
    static WHITE_PIECE = 1;
    static CELL_CLASS = 'cell';
    static BLACK_CELL_CLASS = 'black';
    static WHITE_CELL_CLASS = 'white';
    static CHECKER_CLASS = 'checker';
    static WHITE_CHECKER_CLASS = 'white-piece';
    static BLACK_CHECKER_CLASS = 'black-piece';
    static HIGHLIGHT_CLASS = 'highlight';

    #board;
    #boardElement;

    constructor(boardElement) {
        this.#board = this.#initializeBoardData();
        this.#boardElement = boardElement;
        this.#renderBoard();
    }

    movePiece(from, to) {  }
    getBoard() { return this.#board; }

    #renderBoard() {
        this.#boardElement.innerHTML = '';

        for (let r = 0; r < CheckerGame.ROWS_NUM; r++) {
            for (let c = 0; c < CheckerGame.COLS_NUM; c++) {
                const cell = this.#createCellElement(r, c);
                const checkerData = this.getBoard()[r][c];

                if (checkerData) {
                    const checker = this.#createCheckerElement(checkerData);
                    cell.appendChild(checker);
                }

                this.#boardElement.appendChild(cell);
            }
        }
    }

    #initializeBoardData() {
        const data = [];
        for (let row = 0; row < CheckerGame.ROWS_NUM; row++) {
            const rowArray = [];
            for (let col = 0; col < CheckerGame.COLS_NUM; col++) {
                let pieceToCreate = null;

                if (this.#isBlackSquare(row, col)) {
                    if (row < CheckerGame.PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(CheckerGame.WHITE_PIECE, 1);
                    } else if (row >= CheckerGame.ROWS_NUM - CheckerGame.PIECE_ROWS_COUNT) {
                        pieceToCreate = new Checker(CheckerGame.BLACK_PIECE, -1);
                    }
                }

                rowArray.push(pieceToCreate);
            }
            data.push(rowArray);
        }
        return data;
    }

    #isBlackSquare(row, col) {
        return (row + col) % 2 !== 0;
    }

    #createCellElement(row, col) {
        const cell = document.createElement('div');
        cell.classList.add(CheckerGame.CELL_CLASS);
        cell.classList.add(this.#isBlackSquare(row, col) ? CheckerGame.BLACK_CELL_CLASS : CheckerGame.WHITE_CELL_CLASS);
        return cell;
    }

    #createCheckerElement(checkerData) {
        const checker = document.createElement('div');
        checker.classList.add(CheckerGame.CHECKER_CLASS);
        checker.classList.add(checkerData.color === CheckerGame.WHITE_PIECE ? CheckerGame.WHITE_CHECKER_CLASS : CheckerGame.BLACK_CHECKER_CLASS);

        checker.addEventListener('click', (e) => {
            this.#toggleHighlight(checker);
            e.stopPropagation();
        });

        return checker;
    }

    #toggleHighlight(checker) {
        const isAlreadyHighlighted = checker.classList.contains(CheckerGame.HIGHLIGHT_CLASS);

        document.querySelectorAll(`.${CheckerGame.CHECKER_CLASS}`).forEach(c => c.classList.remove(CheckerGame.HIGHLIGHT_CLASS));

        if (!isAlreadyHighlighted) {
            checker.classList.add(CheckerGame.HIGHLIGHT_CLASS);
        }
    }
}

new CheckerGame(boardElement);
