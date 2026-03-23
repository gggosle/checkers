import { Color } from '../models/Color.js';
import {GAME_CONFIG, CSS_BOARD, CSS_HISTORY} from "../constants.js";
import { OnCheckerClickCallback, OnCellClickCallback, IsBlackSquareCallback, GetSelectedCheckerInfoCallback, SelectedChecker, Move, MoveEntry } from '../models/interfaces';
import { Checker } from '../models/Checker.js';

interface DragData {
    row: number;
    col: number;
    element: HTMLElement;
}

export class GameView {
    #boardElement: HTMLElement;
    #onCheckerClick: OnCheckerClickCallback | null = null;
    #onCellClick: OnCellClickCallback | null = null;
    #isTransitioning = false;
    #dragData: DragData | null = null;
    #getSelectedCheckerInfo: GetSelectedCheckerInfoCallback | null = null;

    get isTransitioning(): boolean {
        return this.#isTransitioning;
    }

    constructor(boardElement: HTMLElement, getSelectedCheckerInfoCallback: GetSelectedCheckerInfoCallback) {
        this.#boardElement = boardElement;
        this.#getSelectedCheckerInfo = getSelectedCheckerInfoCallback;
        this.#initEvents();
    }

    #initEvents(): void {
        this.#boardElement.addEventListener('click', (e: MouseEvent) => {
            if (this.#isTransitioning) return;
            this.#handleBoardClick(e);
        });

        this.#boardElement.addEventListener('mousedown', (e: MouseEvent) => {
            this.#handleMouseDown(e);
        });

        this.#boardElement.addEventListener('dragstart', (e: DragEvent) => {
            this.#handleDragStart(e);
        });

        this.#boardElement.addEventListener('dragover', (e: DragEvent) => {
            this.#handleDragOver(e);
        });

        this.#boardElement.addEventListener('drop', (e: DragEvent) => {
            this.#handleDrop(e);
        });
    }

    #handleMouseDown(e: MouseEvent): void {
        const checkerElement = (e.target as HTMLElement).closest(`.${CSS_BOARD.CHECKER_CLASS}`);
        if (!checkerElement) return;

        const cellElement = checkerElement.parentElement;
        if (!cellElement) return;
        const row = parseInt((cellElement as HTMLElement).dataset.row || '0');
        const col = parseInt((cellElement as HTMLElement).dataset.col || '0');

        const selectedInfo = this.#getSelectedCheckerInfo ? this.#getSelectedCheckerInfo() : null;
        const isSelected = selectedInfo && selectedInfo.row === row && selectedInfo.col === col;

        if (!isSelected && this.#onCheckerClick) {
            this.#onCheckerClick(row, col);
        }
    }

    #handleDragStart(e: DragEvent): void {
        const checkerElement = (e.target as HTMLElement).closest(`.${CSS_BOARD.CHECKER_CLASS}`);
        if (!checkerElement) return;

        const selectedInfo = this.#getSelectedCheckerInfo ? this.#getSelectedCheckerInfo() : null;
        if (!selectedInfo) {
            e.preventDefault();
            return;
        }

        const cellElement = checkerElement.parentElement;
        if (!cellElement) return;
        this.#dragData = {
            row: parseInt((cellElement as HTMLElement).dataset.row || '0'),
            col: parseInt((cellElement as HTMLElement).dataset.col || '0'),
            element: checkerElement as HTMLElement
        };
        
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/plain', JSON.stringify(this.#dragData));
    }

    #handleDragOver(e: DragEvent): void {
        const cellElement = (e.target as HTMLElement).closest(`.${CSS_BOARD.CELL_CLASS}`);
        if (!cellElement) return;
        
        if ((cellElement as HTMLElement).classList.contains(CSS_BOARD.VALID_MOVE_CLASS)) {
            e.preventDefault();
            e.dataTransfer!.dropEffect = 'move';
        }
    }

    #handleDrop(e: DragEvent): void {
        e.preventDefault();
        
        if (!this.#dragData) return;

        const cellElement = (e.target as HTMLElement).closest(`.${CSS_BOARD.CELL_CLASS}`);
        if (!cellElement || !(cellElement as HTMLElement).classList.contains(CSS_BOARD.VALID_MOVE_CLASS)) {
            this.#dragData = null;
            return;
        }

        const targetRow = parseInt((cellElement as HTMLElement).dataset.row || '0');
        const targetCol = parseInt((cellElement as HTMLElement).dataset.col || '0');

        if (this.#onCellClick) {
            this.#onCellClick(targetRow, targetCol);
        }

        this.#dragData = null;
    }

    #handleBoardClick(e: MouseEvent): void {
        const cellElement = (e.target as HTMLElement).closest(`.${CSS_BOARD.CELL_CLASS}`);
        if (this.#isValidCellClick(cellElement as HTMLElement)) {
            this.#handleCellClickEvent(cellElement as HTMLElement);
        }
    }

    #isValidCellClick(cellElement: HTMLElement | null): boolean {
        return cellElement !== null && this.#onCellClick !== null && (cellElement as HTMLElement).classList.contains(CSS_BOARD.VALID_MOVE_CLASS);
    }

    #handleCellClickEvent(cellElement: HTMLElement): void {
        const row = parseInt(cellElement.dataset.row || '0');
        const col = parseInt(cellElement.dataset.col || '0');
        
        if (this.#onCellClick) {
            this.#onCellClick(row, col);
        }
    }

    animateMove(from: SelectedChecker, to: SelectedChecker, onComplete: (() => void) | undefined): void {
        const checkerElement = this.#boardElement.querySelector(`.cell[data-row="${from.row}"][data-col="${from.col}"] .${CSS_BOARD.CHECKER_CLASS}`);
        const targetCell = this.#boardElement.querySelector(`.cell[data-row="${to.row}"][data-col="${to.col}"]`);

        if (checkerElement && targetCell) {
            this.animatePieceMove(checkerElement as HTMLElement, targetCell as HTMLElement, onComplete);
        } else {
            if (onComplete) onComplete();
        }
    }

    animatePieceMove(checkerElement: HTMLElement, targetCell: HTMLElement, onComplete: (() => void) | undefined): void {
        this.#animate(checkerElement, targetCell, onComplete);
    }

    #animate(checkerElement: HTMLElement, targetCell: HTMLElement, onComplete: (() => void) | undefined): void {
        this.#isTransitioning = true;
        const delta = this.#calculateDelta(checkerElement, targetCell);
        
        checkerElement.style.transition = `transform ${GAME_CONFIG.ANIMATION_DURATION}ms ease-in-out`;
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

    #calculateDelta(checkerElement: HTMLElement, targetCell: HTMLElement): { x: number; y: number } {
        const startRect = checkerElement.getBoundingClientRect();
        const endRect = targetCell.getBoundingClientRect();
        
        return {
            x: (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2),
            y: (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2)
        };
    }

    render(board: (Checker | null)[][], isBlackSquareCallback: IsBlackSquareCallback, onCheckerClickCallback: OnCheckerClickCallback, onCellClickCallback: OnCellClickCallback): void {
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

    #createCellAndPiece(checkerData: Checker | null, r: number, c: number, isBlack: boolean): HTMLElement {
        const cell = this.#createCellElement(r, c, isBlack);
        if (checkerData) {
            const checkerElement = this.#createCheckerElement(checkerData);
            cell.appendChild(checkerElement);
        }
        return cell;
    }

    #createCellElement(row: number, col: number, isBlack: boolean): HTMLElement {
        const cell = document.createElement('div');
        cell.classList.add(CSS_BOARD.CELL_CLASS);
        cell.classList.add(isBlack ? CSS_BOARD.BLACK_CELL_CLASS : CSS_BOARD.WHITE_CELL_CLASS);
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        return cell;
    }

    #createCheckerElement(checkerData: Checker): HTMLElement {
        const checker = document.createElement('div');
        checker.classList.add(CSS_BOARD.CHECKER_CLASS);
        checker.classList.add(checkerData.color === Color.WHITE ? CSS_BOARD.PLAYER_1_CHECKER_CLASS : CSS_BOARD.PLAYER_2_CHECKER_CLASS);
        if (checkerData.isKing) {
            checker.classList.add(CSS_BOARD.KING_CLASS);
        }
        checker.draggable = true;
        return checker;
    }

    highlightMoves(checkerCoords: SelectedChecker, validMoves: Move[]): void {
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

    clearHighlights(): void {
        this.#boardElement.querySelectorAll(`.${CSS_BOARD.HIGHLIGHT_CLASS}`).forEach(c => c.classList.remove(CSS_BOARD.HIGHLIGHT_CLASS));
        this.#boardElement.querySelectorAll(`.${CSS_BOARD.VALID_MOVE_CLASS}`).forEach(c => c.classList.remove(CSS_BOARD.VALID_MOVE_CLASS));
        this.clearHistoryHighlights();
    }

    highlightHistoryMove(move: MoveEntry | undefined): void {
        this.clearHistoryHighlights();
        if (!move) return;

        const fromCell = this.#boardElement.querySelector(`.cell[data-row="${move.from.row}"][data-col="${move.from.col}"]`);
        const toCell = this.#boardElement.querySelector(`.cell[data-row="${move.to.row}"][data-col="${move.to.col}"]`);

        if (fromCell) fromCell.classList.add(CSS_HISTORY.HIGHLIGHT_CLASS);
        if (toCell) toCell.classList.add(CSS_HISTORY.HIGHLIGHT_CLASS);
    }

    setCursor(row: number, col: number): void {
        this.clearCursor();
        const cell = this.#boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add(CSS_BOARD.CURSOR_CLASS);
        }
    }

    clearCursor(): void {
        this.#boardElement.querySelectorAll(`.${CSS_BOARD.CURSOR_CLASS}`).forEach(c => c.classList.remove(CSS_BOARD.CURSOR_CLASS));
    }

    clearHistoryHighlights(): void {
        this.#boardElement.querySelectorAll(`.${CSS_HISTORY.HIGHLIGHT_CLASS}`).forEach(c => c.classList.remove(CSS_HISTORY.HIGHLIGHT_CLASS));
    }

    animateUndoMove(from: SelectedChecker, to: SelectedChecker, onComplete: (() => void) | undefined): void {
        const checkerElement = this.#boardElement.querySelector(`.cell[data-row="${to.row}"][data-col="${to.col}"] .${CSS_BOARD.CHECKER_CLASS}`);
        const targetCell = this.#boardElement.querySelector(`.cell[data-row="${from.row}"][data-col="${from.col}"]`);
        
        if (!checkerElement || !targetCell) {
            if (onComplete) onComplete();
            return;
        }

        this.#animate(checkerElement as HTMLElement, targetCell as HTMLElement, onComplete);
    }
}
