import { Color } from '../models/Color.js';
import {CSS_CLASSES} from "../constants.js";



export class GameView {
    #boardElement;
    #onCheckerClick;
    #onCellClick;
    #isTransitioning = false;

    constructor(boardElement) {
        this.#boardElement = boardElement;
        this.#initEvents();
    }

    #initEvents() {
        this.#boardElement.addEventListener('click', (e) => {
            if (this.#isTransitioning) return;
            this.#handleBoardClick(e);
        });
    }

    #handleBoardClick(e) {
        const checkerElement = e.target.closest(`.${CSS_CLASSES.CHECKER_CLASS}`);
        if (checkerElement && this.#onCheckerClick) {
            this.#handleCheckerClickEvent(checkerElement);
            return;
        }

        const cellElement = e.target.closest(`.${CSS_CLASSES.CELL_CLASS}`);
        if (this.#isValidCellClick(cellElement)) {
            this.#handleCellClickEvent(cellElement);
        }
    }

    #handleCheckerClickEvent(checkerElement) {
        const row = parseInt(checkerElement.parentElement.dataset.row);
        const col = parseInt(checkerElement.parentElement.dataset.col);
        this.#onCheckerClick(row, col);
    }

    #isValidCellClick(cellElement) {
        return cellElement && this.#onCellClick && cellElement.classList.contains(CSS_CLASSES.VALID_MOVE_CLASS);
    }

    #handleCellClickEvent(cellElement) {
        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);
        
        const checkerElement = document.querySelector(`.${CSS_CLASSES.HIGHLIGHT_CLASS}`);
        if (checkerElement && checkerElement.classList.contains(CSS_CLASSES.CHECKER_CLASS)) {
            this.animatePieceMove(checkerElement, cellElement, () => {
                this.#onCellClick(row, col);
            });
        } else {
            this.#onCellClick(row, col);
        }
    }

    animatePieceMove(checkerElement, targetCell, onComplete) {
        this.#animate(checkerElement, targetCell, onComplete);
    }

    #animate(checkerElement, targetCell, onComplete) {
        this.#isTransitioning = true;
        const delta = this.#calculateDelta(checkerElement, targetCell);
        
        checkerElement.style.transition = 'transform 0.4s ease-in-out';
        checkerElement.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
        checkerElement.style.zIndex = '100';
        
        checkerElement.addEventListener('transitionend', () => {
            this.#isTransitioning = false;
            checkerElement.style.transition = '';
            checkerElement.style.transform = '';
            checkerElement.style.zIndex = '';
            if (onComplete) onComplete();
        }, { once: true });
    }

    #calculateDelta(checkerElement, targetCell) {
        const startRect = checkerElement.getBoundingClientRect();
        const endRect = targetCell.getBoundingClientRect();
        
        return {
            x: (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2),
            y: (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2)
        };
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
        cell.classList.add(CSS_CLASSES.CELL_CLASS);
        cell.classList.add(isBlack ? CSS_CLASSES.BLACK_CELL_CLASS : CSS_CLASSES.WHITE_CELL_CLASS);
        cell.dataset.row = row;
        cell.dataset.col = col;
        return cell;
    }

    #createCheckerElement(checkerData) {
        const checker = document.createElement('div');
        checker.classList.add(CSS_CLASSES.CHECKER_CLASS);
        checker.classList.add(checkerData.color === Color.PLAYER_1 ? CSS_CLASSES.PLAYER_1_CHECKER_CLASS : CSS_CLASSES.PLAYER_2_CHECKER_CLASS);
        if (checkerData.isKing) {
            checker.classList.add(CSS_CLASSES.KING_CLASS);
        }
        return checker;
    }

    highlightMoves(checkerCoords, validMoves) {
        this.clearHighlights();
        
        const checkerElement = document.querySelector(`.cell[data-row="${checkerCoords.row}"][data-col="${checkerCoords.col}"] .${CSS_CLASSES.CHECKER_CLASS}`);
        if (checkerElement) {
            checkerElement.classList.add(CSS_CLASSES.HIGHLIGHT_CLASS);
        }

        validMoves.forEach(move => {
            const cellElement = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
            if (cellElement) {
                cellElement.classList.add(CSS_CLASSES.VALID_MOVE_CLASS);
            }
        });
    }

    clearHighlights() {
        document.querySelectorAll(`.${CSS_CLASSES.HIGHLIGHT_CLASS}`).forEach(c => c.classList.remove(CSS_CLASSES.HIGHLIGHT_CLASS));
        document.querySelectorAll(`.${CSS_CLASSES.VALID_MOVE_CLASS}`).forEach(c => c.classList.remove(CSS_CLASSES.VALID_MOVE_CLASS));
    }

    animateUndoMove(from, to, onComplete) {
        const checkerElement = document.querySelector(`.cell[data-row="${to.row}"][data-col="${to.col}"] .${CSS_CLASSES.CHECKER_CLASS}`);
        const targetCell = document.querySelector(`.cell[data-row="${from.row}"][data-col="${from.col}"]`);
        
        if (!checkerElement || !targetCell) {
            if (onComplete) onComplete();
            return;
        }

        this.#animate(checkerElement, targetCell, onComplete);
    }
}
