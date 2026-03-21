export class InfoModel {
    #currentTurnDir;
    #timePlayer1;
    #timePlayer2;

    constructor(initialTurnDir, defaultTime) {
        this.#currentTurnDir = initialTurnDir;
        this.#timePlayer1 = defaultTime;
        this.#timePlayer2 = defaultTime;
    }

    get currentTurnDir() {
        return this.#currentTurnDir;
    }

    setCurrentTurnDir(dir) {
        this.#currentTurnDir = dir;
    }

    get timePlayer1() {
        return this.#timePlayer1;
    }

    get timePlayer2() {
        return this.#timePlayer2;
    }

    setTimePlayer1(time) {
        this.#timePlayer1 = time;
    }

    setTimePlayer2(time) {
        this.#timePlayer2 = time;
    }
}
