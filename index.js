const ROWS_NUM = 8;
const COLS_NUM = 8;
const PIECE_ROWS_COUNT = 3;
const BLACK_PIECE = 2;
const WHITE_PIECE = 1;
const EMPTY_CELL = 0;
const CELL_CLASS = 'cell';
const BLACK_CELL_CLASS = 'black';
const WHITE_CELL_CLASS = 'white';
const CHECKER_CLASS = 'checker';
const WHITE_CHECKER_CLASS = 'white-piece';
const BLACK_CHECKER_CLASS = 'black-piece';
const HIGHLIGHT_CLASS = 'highlight';
const boardElement = document.getElementById('board');
const boardData = initializeBoardData();


function initializeBoardData() {
    const data = [];
    for (let row = 0; row < ROWS_NUM; row++) {
        const rowArray = [];
        for (let col = 0; col < COLS_NUM; col++) {
            if (isBlackSquare(row, col)) {
                if (row < PIECE_ROWS_COUNT) {
                    rowArray.push(WHITE_PIECE);
                } else if (row >= ROWS_NUM - PIECE_ROWS_COUNT) {
                    rowArray.push(BLACK_PIECE);
                } else {
                    rowArray.push(EMPTY_CELL);
                }
            } else {
                rowArray.push(EMPTY_CELL);
            }
        }
        data.push(rowArray);
    }
    return data;
}
function isBlackSquare(row, col) {
    return (row + col) % 2 !== 0;
}

function renderBoard() {
    boardElement.innerHTML = '';

    for (let r = 0; r < ROWS_NUM; r++) {
        for (let c = 0; c < COLS_NUM; c++) {
            const cell = createCellElement(r, c);
            const pieceType = boardData[r][c];

            if (pieceType !== EMPTY_CELL) {
                const checker = createCheckerElement(pieceType);
                cell.appendChild(checker);
            }

            boardElement.appendChild(cell);
        }
    }
}

function createCellElement(row, col) {
    const cell = document.createElement('div');
    cell.classList.add(CELL_CLASS);
    cell.classList.add(isBlackSquare(row, col) ? BLACK_CELL_CLASS : WHITE_CELL_CLASS);
    return cell;
}

function createCheckerElement(pieceType) {
    const checker = document.createElement('div');
    checker.classList.add(CHECKER_CLASS);
    checker.classList.add(pieceType === WHITE_PIECE ? WHITE_CHECKER_CLASS : BLACK_CHECKER_CLASS);

    checker.addEventListener('click', (e) => {
        toggleHighlight(checker);
        e.stopPropagation();
    });

    return checker;
}

function toggleHighlight(checker) {
    const isAlreadyHighlighted = checker.classList.contains(HIGHLIGHT_CLASS);

    document.querySelectorAll('.checker').forEach(c => c.classList.remove(HIGHLIGHT_CLASS));

    if (!isAlreadyHighlighted) {
        checker.classList.add(HIGHLIGHT_CLASS);
    }
}


renderBoard();
