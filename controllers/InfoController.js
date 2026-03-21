import {GAME_RULES} from "../constants.js";

export class InfoController {
    #model;
    #view;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        this.updateTurnDisplay();
        this.updateTimerDisplay(1);
        this.updateTimerDisplay(2);
    }

    updateTurn(newDir) {
        this.#model.setCurrentTurnDir(newDir);
        this.updateTurnDisplay();
    }

    updateTurnDisplay() {
        const playerNum = this.#model.currentTurnDir === GAME_RULES.MOVE_DIR_UP ? 1 : 2;
        this.#view.updateTurnDisplay(playerNum);
    }

    updateTimer(playerNum, seconds) {
        if (playerNum === 1) {
            this.#model.setTimePlayer1(seconds);
        } else {
            this.#model.setTimePlayer2(seconds);
        }
        this.updateTimerDisplay(playerNum);
    }

    updateTimerDisplay(playerNum) {
        const seconds = playerNum === 1 ? this.#model.timePlayer1 : this.#model.timePlayer2;
        this.#view.updateTimerDisplay(playerNum, seconds);
    }

    notifyWin(winner) {
        this.#view.showWinModal(winner);
    }

    setOnPlayAgain(callback) {
        this.#view.setOnPlayAgain(callback);
    }

    reset(initialTurnDir, defaultTime) {
        this.#model.setCurrentTurnDir(initialTurnDir);
        this.#model.setTimePlayer1(defaultTime);
        this.#model.setTimePlayer2(defaultTime);
        this.updateTurnDisplay();
        this.updateTimerDisplay(1);
        this.updateTimerDisplay(2);
        this.#view.hideWinModal();
    }
}
