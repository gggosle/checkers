import {CSS_INFO} from "../constants.js";

export class InfoView {
    #turnDotElement;
    #turnTextElement;
    #winModalElement;
    #winnerTextElement;
    #playAgainBtn;
    #timerPlayer1Element;
    #timerPlayer2Element;

    constructor() {
        this.#turnDotElement = document.getElementById(CSS_INFO.TURN_DOT_ID);
        this.#turnTextElement = document.getElementById(CSS_INFO.TURN_NEXT_ID);
        this.#winModalElement = document.getElementById(CSS_INFO.WIN_MODAL_ID);
        this.#winnerTextElement = document.getElementById(CSS_INFO.WINNER_TEXT_ID);
        this.#playAgainBtn = document.getElementById(CSS_INFO.PLAY_AGAIN_BTN_ID);
        this.#timerPlayer1Element = document.getElementById(CSS_INFO.TIMER_PLAYER_1_ID);
        this.#timerPlayer2Element = document.getElementById(CSS_INFO.TIMER_PLAYER_2_ID);
    }

    updateTurnDisplay(playerNum) {
        if (this.#turnDotElement && this.#turnTextElement) {
            this.#turnDotElement.className = `turn-dot player-${playerNum}`;
            this.#turnTextElement.textContent = `Player ${playerNum}'s Turn`;
        }
    }

    updateTimerDisplay(playerNum, seconds) {
        const element = playerNum === 1 ? this.#timerPlayer1Element : this.#timerPlayer2Element;
        if (element) {
            element.textContent = this.#formatTime(seconds);
        }
    }

    #formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showWinModal(winner) {
        if (this.#winModalElement && this.#winnerTextElement) {
            this.#winnerTextElement.textContent = `${winner} Wins!`;
            this.#winModalElement.classList.add(CSS_INFO.ACTIVE_CLASS);
        }
    }

    hideWinModal() {
        if (this.#winModalElement) {
            this.#winModalElement.classList.remove(CSS_INFO.ACTIVE_CLASS);
        }
    }

    setOnPlayAgain(callback) {
        if (this.#playAgainBtn) {
            this.#playAgainBtn.addEventListener('click', () => {
                this.hideWinModal();
                if (callback) callback();
            });
        }
    }
}
