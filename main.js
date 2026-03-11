import { GameModel } from './models/GameModel.js';
import { GameView } from './views/GameView.js';
import { GameController } from './controllers/GameController.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    
    const model = new GameModel();
    const view = new GameView(boardElement);
    new GameController(model, view);
});
