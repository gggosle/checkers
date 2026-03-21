export class Checker {
    #color;
    #row;
    #col;
    #direction;
    #isKing;

    constructor(color, row, col, direction, isKing = false) {
        this.#color = color;
        this.#row = row;
        this.#col = col;
        this.#direction = direction;
        this.#isKing = isKing;
    }

    get color() {
        return this.#color;
    }

    get row() {
        return this.#row;
    }

    get col() {
        return this.#col;
    }

    get direction() {
        return this.#direction;
    }

    get isKing() {
        return this.#isKing;
    }

    setPosition(row, col) {
        this.#row = row;
        this.#col = col;
    }

    makeKing() {
        this.#isKing = true;
    }

    clone() {
        return new Checker(this.#color, this.#row, this.#col, this.#direction, this.#isKing);
    }

    toJSON() {
        return {
            color: this.#color,
            row: this.#row,
            col: this.#col,
            direction: this.#direction,
            isKing: this.#isKing
        };
    }

    static fromJSON(json) {
        if (!json?.color || json.row == null || json.col == null || json.direction == null || json.isKing == null) {
            throw new Error("fromJSON: Missing critical Checker data ");
        }
        return new Checker(json.color, json.row, json.col, json.direction, json.isKing);
    }
}
