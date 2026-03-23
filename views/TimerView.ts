import {CSS_INFO} from "../constants.js";

export class TimerView {
    #timerPlayer1Element;
    #timerPlayer2Element;

    constructor() {
        this.#timerPlayer1Element = document.getElementById(CSS_INFO.TIMER_PLAYER_1_ID);
        this.#timerPlayer2Element = document.getElementById(CSS_INFO.TIMER_PLAYER_2_ID);
    }

    updateTimerDisplay(playerNum, seconds) {
        const element = playerNum === 1 ? this.#timerPlayer1Element : this.#timerPlayer2Element;
        if (element) {
            element.textContent = this.#formatTime(seconds);
        }
    }

    #formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.max(0, totalSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    reset(player1Seconds, player2Seconds) {
        this.updateTimerDisplay(1, player1Seconds);
        this.updateTimerDisplay(2, player2Seconds);
    }
}
