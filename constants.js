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
    BLACK_CELL_CLASS: 'black',
    WHITE_CELL_CLASS: 'white',
    CHECKER_CLASS: 'checker',
    WHITE_CHECKER_CLASS: 'white-piece',
    BLACK_CHECKER_CLASS: 'black-piece',
    KING_CLASS: 'king',
    HIGHLIGHT_CLASS: 'highlight',
    VALID_MOVE_CLASS: 'valid-move',
};