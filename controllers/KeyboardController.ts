import {GAME_CONFIG} from "../constants.js";

export class KeyboardController {
    #view;
    #onAction;
    #cursorRow = 0;
    #cursorCol = 0;
    #gameEnded = false;

    constructor(view, onAction) {
        this.#view = view;
        this.#onAction = onAction;
        this.#initEvents();
        this.#updateCursor();
    }

    setGameEnded(ended) {
        this.#gameEnded = ended;
    }

    setCursor(row, col) {
        this.#cursorRow = row;
        this.#cursorCol = col;
        this.#updateCursor();
    }

    #initEvents() {
        document.addEventListener('keydown', (e) => {
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
                    this.#onAction(this.#cursorRow, this.#cursorCol);
                    break;
            }
        });
    }

    #moveCursor(dr, dc) {
        const newRow = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - 1, this.#cursorRow + dr));
        const newCol = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - 1, this.#cursorCol + dc));

        if (newRow !== this.#cursorRow || newCol !== this.#cursorCol) {
            this.#cursorRow = newRow;
            this.#cursorCol = newCol;
            this.#updateCursor();
        }
    }

    #updateCursor() {
        this.#view.setCursor(this.#cursorRow, this.#cursorCol);
    }

    get cursorRow() { return this.#cursorRow; }
    get cursorCol() { return this.#cursorCol; }
}
