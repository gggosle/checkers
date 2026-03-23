import {CSS_INFO} from "../constants.js";

export class TimerView {
    #timerPlayer1Element: HTMLElement | null;
    #timerPlayer2Element: HTMLElement | null;

    constructor() {
        this.#timerPlayer1Element = document.getElementById(CSS_INFO.TIMER_PLAYER_1_ID);
        this.#timerPlayer2Element = document.getElementById(CSS_INFO.TIMER_PLAYER_2_ID);
    }

    updateTimerDisplay(playerNum: number, seconds: number): void {
        const element = playerNum === 1 ? this.#timerPlayer1Element : this.#timerPlayer2Element;
        if (element) {
            element.textContent = this.#formatTime(seconds);
        }
    }

    #formatTime(totalSeconds: number): string {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.max(0, totalSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    reset(player1Seconds: number, player2Seconds: number): void {
        this.updateTimerDisplay(1, player1Seconds);
        this.updateTimerDisplay(2, player2Seconds);
    }
}
