import {CSS_BOARD} from "../constants.js";
import {Color} from "../models/Color.js";

export class BoardRenderer {
    #boardElement;

    constructor(boardElement) {
        this.#boardElement = boardElement;
    }

    render(board, isBlackSquareCallback) {
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
        cell.classList.add(CSS_BOARD.CELL_CLASS);
        cell.classList.add(isBlack ? CSS_BOARD.BLACK_CELL_CLASS : CSS_BOARD.WHITE_CELL_CLASS);
        cell.dataset.row = row;
        cell.dataset.col = col;
        return cell;
    }

    #createCheckerElement(checkerData) {
        const checker = document.createElement('div');
        checker.classList.add(CSS_BOARD.CHECKER_CLASS);
        checker.classList.add(checkerData.color === Color.WHITE ? CSS_BOARD.PLAYER_1_CHECKER_CLASS : CSS_BOARD.PLAYER_2_CHECKER_CLASS);
        if (checkerData.isKing) {
            checker.classList.add(CSS_BOARD.KING_CLASS);
        }
        checker.draggable = true;
        return checker;
    }
}
