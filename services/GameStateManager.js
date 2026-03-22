export class GameStateManager {
    #model;
    #storage;
    #timerController;
    #undoController;
    #onWin;

    constructor(model, storage, timerController, undoController, onWin) {
        this.#model = model;
        this.#storage = storage;
        this.#timerController = timerController;
        this.#undoController = undoController;
        this.#onWin = onWin;
    }

    set onWin(callback) {
        this.#onWin = callback;
    }

    saveState() {
        const liveState = this.#model.getLiveState();
        liveState.playerTimes = this.#timerController.playerTimes;
        this.#storage.saveToLocalStorage(liveState);
    }

    checkWinCondition() {
        const activeDir = this.#model.currentTurnDir;
        if (!this.#model.hasAnyValidMoves(activeDir)) {
            return this.#model.players.find(p => p.moveDir !== activeDir);
        }
        return null;
    }

    handleWin(winner, keyboardController) {
        keyboardController.setGameEnded(true);
        this.#timerController.stop();
        this.#undoController.setEnabled(false);
        this.#storage.clearSavedState();
        if (this.#onWin) {
            this.#onWin(winner);
        }
    }
}
