export class TimerController {
    #model;
    #view;
    #timerInterval = null;
    #onTimeout = null;
    #onTick = null;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        this.#updateDisplays();
    }

    setOnTimeout(callback) {
        this.#onTimeout = callback;
    }

    start(activePlayerNum) {
        this.stop();
        this.#model.setActivePlayer(activePlayerNum);
        
        this.#timerInterval = setInterval(() => {
            const remainingTime = this.#model.decrementActivePlayer();
            const playerNum = this.#model.activePlayer;
            
            this.#view.updateTimerDisplay(playerNum, remainingTime);
            
            if (this.#onTick) {
                this.#onTick(this.#model.playerTimes);
            }

            if (remainingTime <= 0) {
                this.stop();
                if (this.#onTimeout) {
                    this.#onTimeout(playerNum);
                }
            }
        }, 1000);
    }

    stop() {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        }
    }

    reset(initialTimes = null) {
        this.stop();
        if (initialTimes) {
            this.#model.setTime(1, initialTimes[1]);
            this.#model.setTime(2, initialTimes[2]);
        } else {
            this.#model.reset();
        }
        this.#updateDisplays();
    }

    #updateDisplays() {
        this.#view.updateTimerDisplay(1, this.#model.getTime(1));
        this.#view.updateTimerDisplay(2, this.#model.getTime(2));
    }

    get playerTimes() {
        return this.#model.playerTimes;
    }
}
