import {CSS_BOARD, CSS_HISTORY} from "../constants.js";

export class UIHelper {
    #boardElement;

    constructor(boardElement) {
        this.#boardElement = boardElement;
    }

    highlightMoves(checkerCoords, validMoves) {
        this.clearHighlights();
        
        const checkerElement = this.#boardElement.querySelector(`.cell[data-row="${checkerCoords.row}"][data-col="${checkerCoords.col}"] .${CSS_BOARD.CHECKER_CLASS}`);
        if (checkerElement) {
            checkerElement.classList.add(CSS_BOARD.HIGHLIGHT_CLASS);
        }

        validMoves.forEach(move => {
            const cellElement = this.#boardElement.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
            if (cellElement) {
                cellElement.classList.add(CSS_BOARD.VALID_MOVE_CLASS);
            }
        });
    }

    clearHighlights() {
        this.#boardElement.querySelectorAll(`.${CSS_BOARD.HIGHLIGHT_CLASS}`).forEach(c => c.classList.remove(CSS_BOARD.HIGHLIGHT_CLASS));
        this.#boardElement.querySelectorAll(`.${CSS_BOARD.VALID_MOVE_CLASS}`).forEach(c => c.classList.remove(CSS_BOARD.VALID_MOVE_CLASS));
        this.clearHistoryHighlights();
    }

    highlightHistoryMove(move) {
        this.clearHistoryHighlights();
        if (!move) return;

        const fromCell = this.#boardElement.querySelector(`.cell[data-row="${move.from.row}"][data-col="${move.from.col}"]`);
        const toCell = this.#boardElement.querySelector(`.cell[data-row="${move.to.row}"][data-col="${move.to.col}"]`);

        if (fromCell) fromCell.classList.add(CSS_HISTORY.HIGHLIGHT_CLASS);
        if (toCell) toCell.classList.add(CSS_HISTORY.HIGHLIGHT_CLASS);
    }

    setCursor(row, col) {
        this.clearCursor();
        const cell = this.#boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add(CSS_BOARD.CURSOR_CLASS);
        }
    }

    clearCursor() {
        this.#boardElement.querySelectorAll(`.${CSS_BOARD.CURSOR_CLASS}`).forEach(c => c.classList.remove(CSS_BOARD.CURSOR_CLASS));
    }

    clearHistoryHighlights() {
        this.#boardElement.querySelectorAll(`.${CSS_HISTORY.HIGHLIGHT_CLASS}`).forEach(c => c.classList.remove(CSS_HISTORY.HIGHLIGHT_CLASS));
    }
}
