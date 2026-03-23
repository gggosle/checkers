import { Player } from './Player';

export class InfoModel {
    #currentPlayer: Player;

    constructor(initialPlayer: Player) {
        this.#currentPlayer = initialPlayer;
    }

    get currentPlayer(): Player {
        return this.#currentPlayer;
    }

    setCurrentPlayer(player: Player): void {
        this.#currentPlayer = player;
    }
}
