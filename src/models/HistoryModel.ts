import {GAME_CONFIG} from "../constants.js";
import {MoveType} from "./MoveType.js";
import { Position, MoveEntry } from './interfaces';

export class HistoryModel {
    #moveHistory: MoveEntry[];

    constructor() {
        this.#moveHistory = [];
    }

    get moves(): MoveEntry[] {
        return [...this.#moveHistory];
    }

    get length(): number {
        return this.#moveHistory.length;
    }

    addMove(from: Position, to: Position & { type: string }): MoveEntry {
        const notation = this.#generateNotation(from, to);
        const moveEntry: MoveEntry = {
            notation,
            from: {...from},
            to: {row: to.row, col: to.col}
        };
        this.#moveHistory.push(moveEntry);
        return moveEntry;
    }

    #generateNotation(from: Position, to: Position & { type: string }): string {
        const turnNumber = Math.floor(this.#moveHistory.length / 2) + 1;
        const prefix = `${turnNumber}. `;
        const fromAlg = HistoryModel.toAlgebraic(from.row, from.col);
        const toAlg = HistoryModel.toAlgebraic(to.row, to.col);
        const separator = to.type === MoveType.JUMP ? 'x' : '-';
        return `${prefix}${fromAlg}${separator}${toAlg}`;
    }

    static toAlgebraic(row: number, col: number): string {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const letter = letters[col];
        const rank = GAME_CONFIG.BOARD_SIZE - row;
        return `${letter}${rank}`;
    }

    reset(): void {
        this.#moveHistory = [];
    }

    restore(moves: MoveEntry[]): void {
        this.#moveHistory = Array.isArray(moves) ? [...moves] : [];
    }

    toJSON(): MoveEntry[] {
        return [...this.#moveHistory];
    }
}
