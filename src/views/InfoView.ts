import {CSS_INFO} from "../constants.js";
import {OnPlayAgainCallback} from "../models/interfaces";

export class InfoView {
    #turnDotElement: HTMLElement | null;
    #turnTextElement: HTMLElement | null;
    #winModalElement: HTMLElement | null;
    #winnerTextElement: HTMLElement | null;
    #playAgainBtn: HTMLButtonElement | null;

    constructor() {
        this.#turnDotElement = document.getElementById(CSS_INFO.TURN_DOT_ID);
        this.#turnTextElement = document.getElementById(CSS_INFO.TURN_NEXT_ID);
        this.#winModalElement = document.getElementById(CSS_INFO.WIN_MODAL_ID);
        this.#winnerTextElement = document.getElementById(CSS_INFO.WINNER_TEXT_ID);
        this.#playAgainBtn = document.getElementById(CSS_INFO.PLAY_AGAIN_BTN_ID) as HTMLButtonElement | null;
    }

    updateTurnDisplay(playerColor: string, playerName: string): void {
        if (this.#turnDotElement && this.#turnTextElement) {
            this.#turnDotElement.className = `turn-dot ${playerColor}`;
            this.#turnTextElement.textContent = `${playerName}'s Turn`;
        }
    }

    showWinModal(playerName: string): void {
        if (this.#winModalElement && this.#winnerTextElement) {
            this.#winnerTextElement.textContent = `${playerName} Wins!`;
            this.#winModalElement.classList.add(CSS_INFO.ACTIVE_CLASS);
        }
    }

    hideWinModal(): void {
        if (this.#winModalElement) {
            this.#winModalElement.classList.remove(CSS_INFO.ACTIVE_CLASS);
        }
    }

    setOnPlayAgain(callback: OnPlayAgainCallback): void {
        if (this.#playAgainBtn) {
            this.#playAgainBtn.addEventListener('click', () => {
                this.hideWinModal();
                callback();
            });
        }
    }
}
