export class InfoView {
    #turnDotElement;
    #turnTextElement;
    #winModalElement;
    #winnerTextElement;
    #playAgainBtn;

    constructor() {
        this.#turnDotElement = document.getElementById('turn-dot');
        this.#turnTextElement = document.getElementById('turn-text');
        this.#winModalElement = document.getElementById('win-modal');
        this.#winnerTextElement = document.getElementById('winner-text');
        this.#playAgainBtn = document.getElementById('play-again-btn');
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
            this.#winModalElement.classList.add('active');
        }
    }

    hideWinModal() {
        if (this.#winModalElement) {
            this.#winModalElement.classList.remove('active');
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
