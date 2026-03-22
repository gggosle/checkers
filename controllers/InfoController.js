export class InfoController {
    #model;
    #view;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        this.updateTurnDisplay();
    }

    updateTurn(player) {
        this.#model.setCurrentPlayer(player);
        this.updateTurnDisplay();
    }

    updateTurnDisplay() {
        const player = this.#model.currentPlayer;
        this.#view.updateTurnDisplay(player.color, player.name);
    }

    notifyWin(player) {
        this.#view.showWinModal(player.name);
    }

    setOnPlayAgain(callback) {
        this.#view.setOnPlayAgain(callback);
    }

    reset(initialPlayer) {
        this.#model.setCurrentPlayer(initialPlayer);
        this.updateTurnDisplay();
        this.#view.hideWinModal();
    }
}
