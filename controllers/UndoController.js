export class UndoController {
    #onUndo;
    #button;

    constructor(buttonId, onUndo) {
        this.#button = document.getElementById(buttonId);
        this.#onUndo = onUndo;
        this.#initEvents();
    }

    #initEvents() {
        if (this.#button) {
            this.#button.addEventListener('click', () => {
                this.#onUndo();
            });
        }
    }

    setEnabled(enabled) {
        if (this.#button) {
            this.#button.disabled = !enabled;
        }
    }
}
