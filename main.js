import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';
import { InfoModel } from './models/InfoModel.js';
import { InfoView } from './views/InfoView.js';
import { InfoController } from './controllers/InfoController.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    
    const model = new GameModel();
    const view = new GameView(boardElement, () => controller.getSelectedChecker());
    const controller = new GameController(model, view);

    const infoModel = new InfoModel(model.currentTurnDir);
    const infoView = new InfoView();
    const infoController = new InfoController(infoModel, infoView);

    controller.setOnTurnChange((newDir) => {
        infoController.updateTurn(newDir);
    });

    controller.setOnWin((winner) => {
        infoController.notifyWin(winner);
    });

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        controller.setOnUndoStateChange((canUndo) => {
            undoBtn.disabled = !canUndo;
        });
        undoBtn.addEventListener('click', () => {
            controller.undo();
        });
    }

    infoController.setOnPlayAgain(() => {
        controller.reset();
        infoController.reset(model.currentTurnDir);
    });
});
