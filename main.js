import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    
    const model = new GameModel();
    const view = new GameView(boardElement);
    const controller = new GameController(model, view);

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = true;
        controller.setOnUndoStateChange((canUndo) => {
            undoBtn.disabled = !canUndo;
        });
        undoBtn.addEventListener('click', () => {
            controller.undo();
        });
    }
});
