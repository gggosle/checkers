export class InfoModel {
    #currentPlayer;

    constructor(initialPlayer) {
        this.#currentPlayer = initialPlayer;
    }

    get currentPlayer() {
        return this.#currentPlayer;
    }

    setCurrentPlayer(player) {
        this.#currentPlayer = player;
    }
}
