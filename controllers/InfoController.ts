import { Player } from '../models/Player.js';
import { OnPlayAgainCallback } from '../models/interfaces';

export class InfoController {
    #model: import('../models/InfoModel.js').InfoModel;
    #view: import('../views/InfoView.js').InfoView;

    constructor(model: import('../models/InfoModel.js').InfoModel, view: import('../views/InfoView.js').InfoView) {
        this.#model = model;
        this.#view = view;
        this.updateTurnDisplay();
    }

    updateTurn(player: Player): void {
        this.#model.setCurrentPlayer(player);
        this.updateTurnDisplay();
    }

    updateTurnDisplay(): void {
        const player = this.#model.currentPlayer;
        this.#view.updateTurnDisplay(player.color, player.name);
    }

    notifyWin(player: Player): void {
        this.#view.showWinModal(player.name);
    }

    setOnPlayAgain(callback: OnPlayAgainCallback): void {
        this.#view.setOnPlayAgain(callback);
    }

    reset(initialPlayer: Player): void {
        this.#model.setCurrentPlayer(initialPlayer);
        this.updateTurnDisplay();
        this.#view.hideWinModal();
    }
}
