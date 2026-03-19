import {CSS_INFO} from "../constants.js";

export class InfoView {
    #turnDotElement;
    #turnTextElement;
    #winModalElement;
    #winnerTextElement;
    #playAgainBtn;

    constructor() {
        this.#turnDotElement = document.getElementById(CSS_INFO.TURN_DOT_ID);
        this.#turnTextElement = document.getElementById(CSS_INFO.TURN_NEXT_ID);
        this.#winModalElement = document.getElementById(CSS_INFO.WIN_MODAL_ID);
        this.#winnerTextElement = document.getElementById(CSS_INFO.WINNER_TEXT_ID);
        this.#playAgainBtn = document.getElementById(CSS_INFO.PLAY_AGAIN_BTN_ID);
    }

    updateTurnDisplay(playerNum) {
        if (this.#turnDotElement && this.#turnTextElement) {
            this.#turnDotElement.className = `turn-dot player-${playerNum}`;
            this.#turnTextElement.textContent = `Player ${playerNum}'s Turn`;
        }
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
