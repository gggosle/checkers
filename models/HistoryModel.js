import {GAME_CONFIG} from "../constants.js";
import {MoveType} from "./MoveType.js";

export class HistoryModel {
    #moveHistory;

    constructor() {
        this.#moveHistory = [];
    }

    get moves() {
        return [...this.#moveHistory];
    }

    get length() {
        return this.#moveHistory.length;
    }

    addMove(from, to) {
        const notation = this.#generateNotation(from, to);
        const moveEntry = {
            notation,
            from: {...from},
            to: {row: to.row, col: to.col}
        };
        this.#moveHistory.push(moveEntry);
        return moveEntry;
    }

    #generateNotation(from, to) {
        const turnNumber = Math.floor(this.#moveHistory.length / 2) + 1;
        const prefix = `${turnNumber}. `;
        const fromAlg = HistoryModel.toAlgebraic(from.row, from.col);
        const toAlg = HistoryModel.toAlgebraic(to.row, to.col);
        const separator = to.type === MoveType.JUMP ? 'x' : '-';
        return `${prefix}${fromAlg}${separator}${toAlg}`;
    }

    static toAlgebraic(row, col) {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const letter = letters[col];
        const rank = GAME_CONFIG.BOARD_SIZE - row;
        return `${letter}${rank}`;
    }

    reset() {
        this.#moveHistory = [];
    }

    restore(moves) {
        this.#moveHistory = Array.isArray(moves) ? [...moves] : [];
    }

    toJSON() {
        return [...this.#moveHistory];
    }
}
