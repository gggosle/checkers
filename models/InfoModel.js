export class InfoModel {
    #currentTurnDir;

    constructor(initialTurnDir) {
        this.#currentTurnDir = initialTurnDir;
    }

    get currentTurnDir() {
        return this.#currentTurnDir;
    }

    setCurrentTurnDir(dir) {
        this.#currentTurnDir = dir;
    }
}
