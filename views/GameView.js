export class GameView {
    static CELL_CLASS = 'cell';
    static BLACK_CELL_CLASS = 'black';
    static WHITE_CELL_CLASS = 'white';
    static CHECKER_CLASS = 'checker';
    static WHITE_CHECKER_CLASS = 'white-piece';
    static BLACK_CHECKER_CLASS = 'black-piece';
    static HIGHLIGHT_CLASS = 'highlight';

    #boardElement;

    constructor(boardElement) {
        this.#boardElement = boardElement;
    }

    render(board, isBlackSquareCallback, onCheckerClickCallback) {
        this.#boardElement.replaceChildren();

        const fragment = document.createDocumentFragment();

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                const cell = this.#createCellElement(r, c, isBlackSquareCallback(r, c));
                const checkerData = board[r][c];

                if (checkerData) {
                    const checkerElement = this.#createCheckerElement(checkerData);
                    checkerElement.addEventListener('click', (e) => {
                        onCheckerClickCallback(checkerElement);
                        e.stopPropagation();
                    });
                    cell.appendChild(checkerElement);
                }
                fragment.appendChild(cell);
            }
        }

        this.#boardElement.appendChild(fragment);
    }

    #createCellElement(row, col, isBlack) {
        const cell = document.createElement('div');
        cell.classList.add(GameView.CELL_CLASS);
        cell.classList.add(isBlack ? GameView.BLACK_CELL_CLASS : GameView.WHITE_CELL_CLASS);
        return cell;
    }

    #createCheckerElement(checkerData) {
        const checker = document.createElement('div');
        checker.classList.add(GameView.CHECKER_CLASS);
        checker.classList.add(checkerData.color === 1 ? GameView.WHITE_CHECKER_CLASS : GameView.BLACK_CHECKER_CLASS); // Assuming 1 is WHITE_PIECE
        return checker;
    }

    toggleHighlight(checkerElement) {
        const isAlreadyHighlighted = checkerElement.classList.contains(GameView.HIGHLIGHT_CLASS);
        this.clearAllHighlights();

        if (!isAlreadyHighlighted) {
            checkerElement.classList.add(GameView.HIGHLIGHT_CLASS);
        }
    }

    clearAllHighlights() {
        document.querySelectorAll(`.${GameView.CHECKER_CLASS}`).forEach(c => c.classList.remove(GameView.HIGHLIGHT_CLASS));
    }
}
