import {CheckerData} from "./interfaces/CheckerData.js";

export class Checker {
    #color: string;
    #row: number;
    #col: number;
    #direction: number;
    #isKing: boolean;

    constructor(color: string, row: number, col: number, direction: number, isKing: boolean = false) {
        this.#color = color;
        this.#row = row;
        this.#col = col;
        this.#direction = direction;
        this.#isKing = isKing;
    }

    get color(): string {
        return this.#color;
    }

    get row(): number {
        return this.#row;
    }

    get col(): number {
        return this.#col;
    }

    get direction(): number {
        return this.#direction;
    }

    get isKing(): boolean {
        return this.#isKing;
    }

    setPosition(row: number, col: number): void {
        this.#row = row;
        this.#col = col;
    }

    makeKing(): void {
        this.#isKing = true;
    }

    clone(): Checker {
        return new Checker(this.#color, this.#row, this.#col, this.#direction, this.#isKing);
    }

    toJSON(): CheckerData {
        return {
            color: this.#color,
            row: this.#row,
            col: this.#col,
            direction: this.#direction,
            isKing: this.#isKing
        };
    }

    static fromJSON(json: Partial<CheckerData> | null | undefined): Checker {
        if (!json?.color || json.row == null || json.col == null || json.direction == null || json.isKing == null) {
            throw new Error("fromJSON: Missing critical Checker data ");
        }

        return new Checker(json.color, json.row, json.col, json.direction, json.isKing);
    }
}
