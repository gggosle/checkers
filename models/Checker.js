export class Checker {
    #color;
    #row;
    #col;
    #direction;
    #isKing;

    constructor(color, row, col, direction) {
        this.#color = color;
        this.#row = row;
        this.#col = col;
        this.#direction = direction;
        this.#isKing = false;
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
}
