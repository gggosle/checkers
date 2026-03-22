import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';
import { Storage } from './services/Storage.js';
import { InfoModel } from './models/InfoModel.js';
import { InfoView } from './views/InfoView.js';
import { InfoController } from './controllers/InfoController.js';
import { HistoryView } from './views/HistoryView.js';
import {CSS_BOARD} from "./constants.js";
import { TimerModel } from './models/TimerModel.js';
import { TimerView } from './views/TimerView.js';
import { TimerController } from './controllers/TimerController.js';
import { UndoController } from './controllers/UndoController.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById(CSS_BOARD.BOARD_CLASS);
    const storage = new Storage();
    const currentState = storage.getStateFromLocalStorage();
    const model = new GameModel();

    if (currentState) {
        try {
            model.restoreState(currentState);
        } catch (e) {
            console.error('Failed to restore state from localStorage, clearing it.', e);
            storage.clearSavedState();
        }
    }

    const timerModel = new TimerModel(currentState?.playerTimes);
    const timerView = new TimerView();
    const timerController = new TimerController(timerModel, timerView);

    const undoController = new UndoController(CSS_BOARD.UNDO_BTN, () => {
        controller.undo();
    });

    const view = new GameView(boardElement, () => controller.getSelectedChecker());
    const controller = new GameController(model, view, storage, timerController, undoController);
    const infoModel = new InfoModel(model.currentPlayer);
    const infoView = new InfoView();
    const infoController = new InfoController(infoModel, infoView);

    const historyView = new HistoryView((move) => {
        view.highlightHistoryMove(move);
    });

    controller.setOnMoveExecuted((history) => {
        historyView.render(history);
    });

    historyView.render(model.moveHistory);

    controller.setOnTurnChange((player) => {
        infoController.updateTurn(player);
    });

    controller.setOnWin((winnerPlayer) => {
        infoController.notifyWin(winnerPlayer);
    });
    
    infoController.setOnPlayAgain(() => {
        controller.reset();
        infoController.reset(model.currentPlayer);
    });
});
