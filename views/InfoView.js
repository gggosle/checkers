import {CSS_CLASSES_INFO} from "../constants.js";

export class InfoView {
    #turnDotElement;
    #turnTextElement;
    #winModalElement;
    #winnerTextElement;
    #playAgainBtn;

    constructor() {
        this.#turnDotElement = document.getElementById(CSS_CLASSES_INFO.TURN_DOT_CLASS);
        this.#turnTextElement = document.getElementById(CSS_CLASSES_INFO.TURN_NEXT_CLASS);
        this.#winModalElement = document.getElementById(CSS_CLASSES_INFO.WIN_MODAL_CLASS);
        this.#winnerTextElement = document.getElementById(CSS_CLASSES_INFO.WINNER_TEXT_CLASS);
        this.#playAgainBtn = document.getElementById(CSS_CLASSES_INFO.PLAY_AGAIN_BTN_CLASS);
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
            this.#winModalElement.classList.add(CSS_CLASSES_INFO.ACTIVE_CLASS);
        }
    }

    hideWinModal() {
        if (this.#winModalElement) {
            this.#winModalElement.classList.remove(CSS_CLASSES_INFO.ACTIVE_CLASS);
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
