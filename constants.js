export const GAME_CONFIG = {
    BOARD_SIZE: 8,
};

export const GAME_RULES = {
    PIECE_ROWS_COUNT: 3,
    MOVE_STEP: 1,
    JUMP_STEP: 2,

    DARK_CELL_MOD: 2,
    DARK_CELL_REMAINDER: 1,

    MOVE_DIR_UP: 1,
    MOVE_DIR_DOWN: -1,

    SIDES: [-1, 1],
};

export const CSS_CLASSES = {
    CELL_CLASS: 'cell',
    BLACK_CELL_CLASS: 'color-2-cell',
    WHITE_CELL_CLASS: 'color-1-cell',
    CHECKER_CLASS: 'checker',
    PLAYER_1_CHECKER_CLASS: 'player-1-piece',
    PLAYER_2_CHECKER_CLASS: 'player-2-piece',
    KING_CLASS: 'king',
    HIGHLIGHT_CLASS: 'highlight',
    VALID_MOVE_CLASS: 'valid-move',
};

export const CSS_CLASSES_INFO = {
    TURN_DOT_CLASS: 'turn-dot',
    TURN_NEXT_CLASS: 'turn-text',
    WIN_MODAL_CLASS: 'win-modal',
    WINNER_TEXT_CLASS: 'winner-text',
    PLAY_AGAIN_BTN_CLASS: 'play-again-btn',
    ACTIVE_CLASS: 'active',
};