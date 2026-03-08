// Data model: 8x8 2D array (0 = empty, 1 = white, 2 = black)
const boardData = [];
for (let row = 0; row < 8; row++) {
    const rowArray = [];
    for (let col = 0; col < 8; col++) {
        // Place checkers in starting positions (rows 0-2 and 5-7)
        if ((row + col) % 2 !== 0) { // Black cells only
            if (row < 3) {
                rowArray.push(1); // white
            } else if (row > 4) {
                rowArray.push(2); // black
            } else {
                rowArray.push(0); // empty
            }
        } else {
            rowArray.push(0); // empty white cells
        }
    }
    boardData.push(rowArray);
}

const boardElement = document.getElementById('board');

function renderBoard() {
    boardElement.innerHTML = ''; // Clear previous board

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((r + c) % 2 === 0 ? 'white' : 'black');

            const pieceType = boardData[r][c];
            if (pieceType !== 0) {
                const checker = document.createElement('div');
                checker.classList.add('checker');
                checker.classList.add(pieceType === 1 ? 'white-piece' : 'black-piece');

                checker.addEventListener('click', (e) => {
                    // Toggle highlighting only for the clicked checker
                    checker.classList.toggle('highlight');
                    // Stop event propagation to prevent cell/board clicks if any
                    e.stopPropagation();
                });

                cell.appendChild(checker);
            }

            boardElement.appendChild(cell);
        }
    }
}

renderBoard();
