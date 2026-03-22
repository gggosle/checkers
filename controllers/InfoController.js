import {GAME_RULES} from "../constants.js";

export class InfoController {
    #model;
    #view;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        this.updateTurnDisplay();
    }

    updateTurn(newDir) {
        this.#model.setCurrentTurnDir(newDir);
        this.updateTurnDisplay();
    }

    updateTurnDisplay() {
        const playerNum = this.#model.currentTurnDir === GAME_RULES.MOVE_DIR_UP ? 1 : 2;
        this.#view.updateTurnDisplay(playerNum);
    }

    notifyWin(winner) {
        this.#view.showWinModal(winner);
    }

    setOnPlayAgain(callback) {
        this.#view.setOnPlayAgain(callback);
    }

    reset(initialTurnDir) {
        this.#model.setCurrentTurnDir(initialTurnDir);
        this.updateTurnDisplay();
        this.#view.hideWinModal();
    }
}
