export class UndoController {
    #onUndo: () => void;
    #button: HTMLButtonElement | null;

    constructor(buttonId: string, onUndo: () => void) {
        this.#button = document.getElementById(buttonId) as HTMLButtonElement | null;
        this.#onUndo = onUndo;
        this.#initEvents();
    }

    #initEvents(): void {
        if (this.#button) {
            this.#button.addEventListener('click', () => {
                this.#onUndo();
            });
        }
    }

    setEnabled(enabled: boolean): void {
        if (this.#button) {
            this.#button.disabled = !enabled;
        }
    }
}
