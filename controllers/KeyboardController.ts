import { GameView } from '../views/GameView.js';
import { GAME_CONFIG } from '../constants.js';
import { OnCursorActionCallback } from '../models/interfaces';

export class KeyboardController {
    #view: GameView;
    #onAction: OnCursorActionCallback;
    #cursorRow = 0;
    #cursorCol = 0;
    #gameEnded = false;

    constructor(view: GameView, onAction: OnCursorActionCallback) {
        this.#view = view;
        this.#onAction = onAction;
        this.#initEvents();
        this.#updateCursor();
    }

    setGameEnded(ended: boolean): void {
        this.#gameEnded = ended;
    }

    setCursor(row: number, col: number): void {
        this.#cursorRow = row;
        this.#cursorCol = col;
        this.#updateCursor();
    }

    #initEvents(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.#gameEnded) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.#moveCursor(-1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.#moveCursor(1, 0);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.#moveCursor(0, -1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.#moveCursor(0, 1);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.#onAction();
                    break;
            }
        });
    }

    #moveCursor(dr: number, dc: number): void {
        const newRow = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - 1, this.#cursorRow + dr));
        const newCol = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - 1, this.#cursorCol + dc));

        if (newRow !== this.#cursorRow || newCol !== this.#cursorCol) {
            this.#cursorRow = newRow;
            this.#cursorCol = newCol;
            this.#updateCursor();
        }
    }

    #updateCursor(): void {
        this.#view.setCursor(this.#cursorRow, this.#cursorCol);
    }

    get cursorRow(): number { return this.#cursorRow; }
    get cursorCol(): number { return this.#cursorCol; }
}
