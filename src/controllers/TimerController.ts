import { TimerModel } from '../models/TimerModel.js';
import { TimerView } from '../views/TimerView.js';
import { OnTimeoutCallback, OnTickCallback } from '../models/interfaces';

export class TimerController {
    #model: TimerModel;
    #view: TimerView;
    #timerInterval: ReturnType<typeof setInterval> | null = null;
    #onTimeout: OnTimeoutCallback | null = null;
    #onTick: OnTickCallback | null = null;

    constructor(model: TimerModel, view: TimerView) {
        this.#model = model;
        this.#view = view;
        this.#updateDisplays();
    }

    setOnTimeout(callback: OnTimeoutCallback): void {
        this.#onTimeout = callback;
    }

    setOnTick(callback: OnTickCallback): void {
        this.#onTick = callback;
    }

    start(activePlayerNum: number): void {
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

    stop(): void {
        if (this.#timerInterval) {
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        }
    }

    reset(initialTimes?: { 1: number; 2: number }): void {
        this.stop();
        if (initialTimes) {
            this.#model.setTime(1, initialTimes[1]);
            this.#model.setTime(2, initialTimes[2]);
        } else {
            this.#model.reset();
        }
        this.#updateDisplays();
    }

    #updateDisplays(): void {
        this.#view.updateTimerDisplay(1, this.#model.getTime(1));
        this.#view.updateTimerDisplay(2, this.#model.getTime(2));
    }

    get playerTimes(): { 1: number; 2: number } {
        return this.#model.playerTimes;
    }
}
