import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';
import { Storage } from './models/Storage.js';
import { InfoModel } from './models/InfoModel.js';
import { InfoView } from './views/InfoView.js';
import { InfoController } from './controllers/InfoController.js';
import { HistoryView } from './views/HistoryView.js';
import {CSS_BOARD, GAME_CONFIG} from "./constants.js";

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById(CSS_BOARD.BOARD_CLASS);
    const undoBtn = document.getElementById(CSS_BOARD.UNDO_BTN);
    const storage = new Storage();
    const currentState = storage.getStateFromLocalStorage();
    const savedState = storage.getStateFromLocalStorage();
    const model = new GameModel();

    if (currentState) {
        try {
            model.restoreState(currentState);
        } catch (e) {
            console.error('Failed to restore state from localStorage, clearing it.', e);
            storage.clearSavedState();
        }
    }

    const view = new GameView(boardElement, () => controller.getSelectedChecker());
    const controller = new GameController(model, view, storage);
    const infoModel = new InfoModel(model.currentTurnDir, GAME_CONFIG.DEFAULT_GAME_TIME);
    if (savedState && savedState.playerTimes) {
        infoModel.setTimePlayer1(savedState.playerTimes[1]);
        infoModel.setTimePlayer2(savedState.playerTimes[2]);
    }
    const infoView = new InfoView();
    const infoController = new InfoController(infoModel, infoView);

    controller.setOnTimerUpdate((playerNum, seconds) => {
        infoController.updateTimer(playerNum, seconds);
    });

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
    
    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            controller.undo();
        });
    }

    infoController.setOnPlayAgain(() => {
        controller.reset();
        infoController.reset(model.currentTurnDir, GAME_CONFIG.DEFAULT_GAME_TIME);
    });
});
