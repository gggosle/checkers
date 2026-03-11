export class GameController {
    #model;
    #view;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        
        this.#init();
    }

    #init() {
        this.#view.render(
            this.#model.getBoard(),
            (row, col) => this.#model.isBlackSquare(row, col),
            (checkerElement) => this.#handleCheckerClick(checkerElement)
        );
    }

    #handleCheckerClick(checkerElement) {
        this.#view.toggleHighlight(checkerElement);
    }
}
