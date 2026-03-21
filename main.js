import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';
import { Storage } from './models/Storage.js';
import { InfoModel } from './models/InfoModel.js';
import { InfoView } from './views/InfoView.js';
import { InfoController } from './controllers/InfoController.js';
import { HistoryView } from './views/HistoryView.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const storage = new Storage();
    const currentState = storage.getStateFromLocalStorage();
    const model = new GameModel();

    if (currentState) {
        model.restoreState(currentState);
    }

    const view = new GameView(boardElement, () => controller.getSelectedChecker());
    const controller = new GameController(model, view, storage);
    const infoModel = new InfoModel(model.currentTurnDir);
    const infoView = new InfoView();
    const infoController = new InfoController(infoModel, infoView);

    const historyView = new HistoryView((move) => {
        view.highlightHistoryMove(move);
    });

    controller.setOnMoveExecuted((history) => {
        historyView.render(history);
    });

    controller.setOnUndoStateChange((canUndo) => {
        undoBtn.disabled = !canUndo;
        historyView.clearSelection();
        view.clearHistoryHighlights();
    });

    historyView.render(model.moveHistory);

    controller.setOnTurnChange((newDir) => {
        infoController.updateTurn(newDir);
    });

    controller.setOnWin((winner) => {
        infoController.notifyWin(winner);
    });

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            controller.undo();
        });
    }

    infoController.setOnPlayAgain(() => {
        controller.reset();
        infoController.reset(model.currentTurnDir);
    });
});
