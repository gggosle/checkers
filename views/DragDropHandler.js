import {CSS_BOARD} from "../constants.js";

export class DragDropHandler {
    #boardElement;
    #getSelectedCheckerInfo;
    #onCellClick;
    #dragData = null;

    constructor(boardElement, getSelectedCheckerInfo, onCellClick) {
        this.#boardElement = boardElement;
        this.#getSelectedCheckerInfo = getSelectedCheckerInfo;
        this.#onCellClick = onCellClick;
    }

    init() {
        this.#boardElement.addEventListener('dragstart', (e) => this.#handleDragStart(e));
        this.#boardElement.addEventListener('dragover', (e) => this.#handleDragOver(e));
        this.#boardElement.addEventListener('drop', (e) => this.#handleDrop(e));
    }

    #handleDragStart(e) {
        const checkerElement = e.target.closest(`.${CSS_BOARD.CHECKER_CLASS}`);
        if (!checkerElement) return;

        const selectedInfo = this.#getSelectedCheckerInfo ? this.#getSelectedCheckerInfo() : null;
        if (!selectedInfo) {
            e.preventDefault();
            return;
        }

        const cellElement = checkerElement.parentElement;
        this.#dragData = {
            row: parseInt(cellElement.dataset.row),
            col: parseInt(cellElement.dataset.col),
            element: checkerElement
        };
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(this.#dragData));
    }

    #handleDragOver(e) {
        const cellElement = e.target.closest(`.${CSS_BOARD.CELL_CLASS}`);
        if (!cellElement) return;
        
        if (cellElement.classList.contains(CSS_BOARD.VALID_MOVE_CLASS)) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }

    #handleDrop(e) {
        e.preventDefault();
        
        if (!this.#dragData) return;

        const cellElement = e.target.closest(`.${CSS_BOARD.CELL_CLASS}`);
        if (!cellElement || !cellElement.classList.contains(CSS_BOARD.VALID_MOVE_CLASS)) {
            this.#dragData = null;
            return;
        }

        const targetRow = parseInt(cellElement.dataset.row);
        const targetCol = parseInt(cellElement.dataset.col);

        if (this.#onCellClick) {
            this.#onCellClick(targetRow, targetCol);
        }

        this.#dragData = null;
    }
}
