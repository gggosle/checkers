import { Color } from '../models/Color.js';

const CELL_CLASS = 'cell';
const BLACK_CELL_CLASS = 'black';
const WHITE_CELL_CLASS = 'white';
const CHECKER_CLASS = 'checker';
const WHITE_CHECKER_CLASS = 'white-piece';
const BLACK_CHECKER_CLASS = 'black-piece';
const KING_CLASS = 'king';
const HIGHLIGHT_CLASS = 'highlight';
const VALID_MOVE_CLASS = 'valid-move';

export class GameView {
    #boardElement;
    #onCheckerClick;
    #onCellClick;

    constructor(boardElement) {
        this.#boardElement = boardElement;
        this.#initEvents();
    }

    #initEvents() {
        this.#boardElement.addEventListener('click', (e) => {
            const checkerElement = e.target.closest(`.${CHECKER_CLASS}`);
            if (checkerElement && this.#onCheckerClick) {
                this.#handleCheckerClickEvent(checkerElement);
                return;
            }

            const cellElement = e.target.closest(`.${CELL_CLASS}`);
            if (this.#isValidCellClick(cellElement)) {
                this.#handleCellClickEvent(cellElement);
            }
        });
    }

    #handleCheckerClickEvent(checkerElement) {
        const row = parseInt(checkerElement.parentElement.dataset.row);
        const col = parseInt(checkerElement.parentElement.dataset.col);
        this.#onCheckerClick(row, col);
    }

    #isValidCellClick(cellElement) {
        return cellElement && this.#onCellClick && cellElement.classList.contains(VALID_MOVE_CLASS);
    }

    #handleCellClickEvent(cellElement) {
        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);
        this.#onCellClick(row, col);
    }

    render(board, isBlackSquareCallback, onCheckerClickCallback, onCellClickCallback) {
        this.#onCheckerClick = onCheckerClickCallback;
        this.#onCellClick = onCellClickCallback;
        this.#boardElement.replaceChildren();

        const fragment = document.createDocumentFragment();

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                const cell = this.#createCellAndPiece(board[r][c], r, c, isBlackSquareCallback(r, c));
                fragment.appendChild(cell);
            }
        }

        this.#boardElement.appendChild(fragment);
    }

    #createCellAndPiece(checkerData, r, c, isBlack) {
        const cell = this.#createCellElement(r, c, isBlack);
        if (checkerData) {
            const checkerElement = this.#createCheckerElement(checkerData);
            cell.appendChild(checkerElement);
        }
        return cell;
    }

    #createCellElement(row, col, isBlack) {
        const cell = document.createElement('div');
        cell.classList.add(CELL_CLASS);
        cell.classList.add(isBlack ? BLACK_CELL_CLASS : WHITE_CELL_CLASS);
        cell.dataset.row = row;
        cell.dataset.col = col;
        return cell;
    }

    #createCheckerElement(checkerData) {
        const checker = document.createElement('div');
        checker.classList.add(CHECKER_CLASS);
        checker.classList.add(checkerData.color === Color.WHITE ? WHITE_CHECKER_CLASS : BLACK_CHECKER_CLASS); 
        if (checkerData.isKing) {
            checker.classList.add(KING_CLASS);
        }
        return checker;
    }

    highlightMoves(checkerCoords, validMoves) {
        this.#clearAllHighlights();
        
        const checkerElement = document.querySelector(`.cell[data-row="${checkerCoords.row}"][data-col="${checkerCoords.col}"] .${CHECKER_CLASS}`);
        if (checkerElement) {
            checkerElement.classList.add(HIGHLIGHT_CLASS);
        }

        validMoves.forEach(move => {
            const cellElement = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
            if (cellElement) {
                cellElement.classList.add(VALID_MOVE_CLASS);
            }
        });
    }

    #clearAllHighlights() {
        document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(c => c.classList.remove(HIGHLIGHT_CLASS));
        document.querySelectorAll(`.${VALID_MOVE_CLASS}`).forEach(c => c.classList.remove(VALID_MOVE_CLASS));
    }
}
