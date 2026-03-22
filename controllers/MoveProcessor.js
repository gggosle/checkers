export class MoveProcessor {
    #model;
    #view;
    #keyboardController;
    #onMoveCompleted;

    constructor(model, view, keyboardController, onMoveCompleted) {
        this.#model = model;
        this.#view = view;
        this.#keyboardController = keyboardController;
        this.#onMoveCompleted = onMoveCompleted;
    }

    executeMove(selectedChecker, move, recordMoveStateCallback) {
        this.#view.animateMove(
            selectedChecker,
            {row: move.row, col: move.col},
            () => {
                recordMoveStateCallback(move);
                this.#model.executeMove(selectedChecker, move);
                this.#keyboardController.setCursor(move.row, move.col);
                this.#processMoveResult();
                this.#onMoveCompleted();
            }
        );
    }

    #processMoveResult() {
        const mustJumpPiece = this.#model.mustJumpPiece;
        
        if (mustJumpPiece) {
            this.#handleMultiJump(mustJumpPiece);
            this.#keyboardController.setCursor(mustJumpPiece.row, mustJumpPiece.col);
        } else {
            this.#view.clearHighlights();
        }
    }

    #handleMultiJump(mustJumpPiece) {
        const validMoves = this.#model.getValidMoves(mustJumpPiece.row, mustJumpPiece.col);
        this.#view.highlightMoves({row: mustJumpPiece.row, col: mustJumpPiece.col}, validMoves);
    }
    
    get selectedCheckerAfterMove() {
        const mustJumpPiece = this.#model.mustJumpPiece;
        return mustJumpPiece ? {row: mustJumpPiece.row, col: mustJumpPiece.col} : null;
    }

    get validMovesAfterMove() {
        const mustJumpPiece = this.#model.mustJumpPiece;
        return mustJumpPiece ? this.#model.getValidMoves(mustJumpPiece.row, mustJumpPiece.col) : [];
    }
}
