import {CSS_BOARD} from "../constants.js";
import {BoardRenderer} from "./BoardRenderer.js";
import {AnimationHelper} from "../utils/AnimationHelper.js";
import {UIHelper} from "./UIHelper.js";
import {DragDropHandler} from "./DragDropHandler.js";

export class GameView {
    #boardElement;
    #onCheckerClick;
    #onCellClick;
    #isTransitioning = false;
    #getSelectedCheckerInfo = null;
    #renderer;
    #uiHelper;
    #dragDropHandler;

    get isTransitioning() {
        return this.#isTransitioning;
    }

    constructor(boardElement, getSelectedCheckerInfoCallback) {
        this.#boardElement = boardElement;
        this.#getSelectedCheckerInfo = getSelectedCheckerInfoCallback;
        this.#renderer = new BoardRenderer(boardElement);
        this.#uiHelper = new UIHelper(boardElement);
        this.#dragDropHandler = new DragDropHandler(
            boardElement, 
            getSelectedCheckerInfoCallback, 
            (row, col) => this.#onCellClick(row, col)
        );
        this.#initEvents();
    }

    #initEvents() {
        this.#boardElement.addEventListener('click', (e) => {
            if (this.#isTransitioning) return;
            this.#handleBoardClick(e);
        });

        this.#boardElement.addEventListener('mousedown', (e) => {
            this.#handleMouseDown(e);
        });

        this.#dragDropHandler.init();
    }

    #handleMouseDown(e) {
        const checkerElement = e.target.closest(`.${CSS_BOARD.CHECKER_CLASS}`);
        if (!checkerElement) return;

        const cellElement = checkerElement.parentElement;
        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);

        const selectedInfo = this.#getSelectedCheckerInfo ? this.#getSelectedCheckerInfo() : null;
        const isSelected = selectedInfo && selectedInfo.row === row && selectedInfo.col === col;

        if (!isSelected && this.#onCheckerClick) {
            this.#onCheckerClick(row, col);
        }
    }

    #handleBoardClick(e) {
        const cellElement = e.target.closest(`.${CSS_BOARD.CELL_CLASS}`);
        if (cellElement && this.#onCellClick && cellElement.classList.contains(CSS_BOARD.VALID_MOVE_CLASS)) {
            this.#onCellClick(parseInt(cellElement.dataset.row), parseInt(cellElement.dataset.col));
        }
    }

    animateMove(from, to, onComplete) {
        const checkerElement = this.#boardElement.querySelector(`.cell[data-row="${from.row}"][data-col="${from.col}"] .${CSS_BOARD.CHECKER_CLASS}`);
        const targetCell = this.#boardElement.querySelector(`.cell[data-row="${to.row}"][data-col="${to.col}"]`);

        if (checkerElement && targetCell) {
            AnimationHelper.animate(
                checkerElement, 
                targetCell, 
                () => {
                    this.#isTransitioning = false;
                    if (onComplete) onComplete();
                },
                () => this.#isTransitioning = true
            );
        } else {
            if (onComplete) onComplete();
        }
    }

    render(board, isBlackSquareCallback, onCheckerClickCallback, onCellClickCallback) {
        this.#onCheckerClick = onCheckerClickCallback;
        this.#onCellClick = onCellClickCallback;
        this.#renderer.render(board, isBlackSquareCallback);
    }

    highlightMoves(checkerCoords, validMoves) {
        this.#uiHelper.highlightMoves(checkerCoords, validMoves);
    }

    clearHighlights() {
        this.#uiHelper.clearHighlights();
    }

    highlightHistoryMove(move) {
        this.#uiHelper.highlightHistoryMove(move);
    }

    setCursor(row, col) {
        this.#uiHelper.setCursor(row, col);
    }

    clearCursor() {
        this.#uiHelper.clearCursor();
    }

    clearHistoryHighlights() {
        this.#uiHelper.clearHistoryHighlights();
    }

    animateUndoMove(from, to, onComplete) {
        const checkerElement = this.#boardElement.querySelector(`.cell[data-row="${to.row}"][data-col="${to.col}"] .${CSS_BOARD.CHECKER_CLASS}`);
        const targetCell = this.#boardElement.querySelector(`.cell[data-row="${from.row}"][data-col="${from.col}"]`);
        
        if (!checkerElement || !targetCell) {
            if (onComplete) onComplete();
            return;
        }

        AnimationHelper.animate(
            checkerElement, 
            targetCell, 
            () => {
                this.#isTransitioning = false;
                if (onComplete) onComplete();
            },
            () => this.#isTransitioning = true
        );
    }
}
