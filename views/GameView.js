import { Color } from '../models/Color.js';

const CELL_CLASS = 'cell';
const BLACK_CELL_CLASS = 'black';
const WHITE_CELL_CLASS = 'white';
const CHECKER_CLASS = 'checker';
const WHITE_CHECKER_CLASS = 'white-piece';
const BLACK_CHECKER_CLASS = 'black-piece';
const HIGHLIGHT_CLASS = 'highlight';

export class GameView {
    #boardElement;
    #onCheckerClick;

    constructor(boardElement) {
        this.#boardElement = boardElement;
        this.#initEvents();
    }

    #initEvents() {
        this.#boardElement.addEventListener('click', (e) => {
            const checkerElement = e.target.closest(`.${CHECKER_CLASS}`);
            if (checkerElement && this.#onCheckerClick) {
                this.#onCheckerClick(checkerElement);
            }
        });
    }

    render(board, isBlackSquareCallback, onCheckerClickCallback) {
        this.#onCheckerClick = onCheckerClickCallback;
        this.#boardElement.replaceChildren();

        const fragment = document.createDocumentFragment();

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                const cell = this.#createCellElement(r, c, isBlackSquareCallback(r, c));
                const checkerData = board[r][c];

                if (checkerData) {
                    const checkerElement = this.#createCheckerElement(checkerData);
                    cell.appendChild(checkerElement);
                }
                fragment.appendChild(cell);
            }
        }

        this.#boardElement.appendChild(fragment);
    }

    #createCellElement(row, col, isBlack) {
        const cell = document.createElement('div');
        cell.classList.add(CELL_CLASS);
        cell.classList.add(isBlack ? BLACK_CELL_CLASS : WHITE_CELL_CLASS);
        return cell;
    }

    #createCheckerElement(checkerData) {
        const checker = document.createElement('div');
        checker.classList.add(CHECKER_CLASS);
        checker.classList.add(checkerData.color === Color.WHITE ? WHITE_CHECKER_CLASS : BLACK_CHECKER_CLASS); 
        return checker;
    }

    toggleHighlight(checkerElement) {
        const isAlreadyHighlighted = checkerElement.classList.contains(HIGHLIGHT_CLASS);
        this.#clearAllHighlights();

        if (!isAlreadyHighlighted) {
            checkerElement.classList.add(HIGHLIGHT_CLASS);
        }
    }

    #clearAllHighlights() {
        document.querySelectorAll(`.${CHECKER_CLASS}`).forEach(c => c.classList.remove(HIGHLIGHT_CLASS));
    }
}
