import { Player } from './Player.js';
import { Color } from './Color.js';
import { GAME_RULES } from '../constants.js';

export class PlayerGenerator {
    static generatePlayers() {
        const player1 = new Player(
            GAME_RULES.PLAYER_1_ID,
            'Player 1',
            Color.WHITE,
            GAME_RULES.MOVE_DIR_UP
        );
        const player2 = new Player(
            GAME_RULES.PLAYER_2_ID,
            'Player 2',
            Color.BLACK,
            GAME_RULES.MOVE_DIR_DOWN
        );
        return [player1, player2];
    }
}
