const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const redirectButton = document.getElementById('redirect');

let gameBoard = Array(9).fill(null);
let drawCount = 0;
const humanPlayer = 'X';
const aiPlayer = 'O';

function renderBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        if (cell) {
            cellElement.textContent = cell;
            cellElement.classList.add('taken');
        }
        cellElement.addEventListener('click', () => makeMove(index));
        board.appendChild(cellElement);
    });
}

function makeMove(index) {
    if (!gameBoard[index]) {
        gameBoard[index] = humanPlayer;
        if (checkWin(gameBoard, humanPlayer)) {
            statusDisplay.textContent = 'Adu, căng đấy!';
            redirectButton.style.display = 'block';
            endGame();
            return;
        }
        if (isDraw()) {
            drawCount++;
            statusDisplay.textContent = 'Hòa rùi nha!';
            if (drawCount >= 3) {
                redirectButton.style.display = 'block';
            }
            endGame();
            return;
        }
        aiMove();
    }
}

function aiMove() {
    const bestMove = minimax(gameBoard, aiPlayer).index;
    gameBoard[bestMove] = aiPlayer;
    renderBoard();
    if (checkWin(gameBoard, aiPlayer)) {
        statusDisplay.textContent = 'Thua rùi haha :vv!';
        endGame();
        return;
    }
    if (isDraw()) {
        drawCount++;
        statusDisplay.textContent = 'Draw!';
        if (drawCount >= 3) {
            redirectButton.style.display = 'block';
        }
        endGame();
    }
}

function checkWin(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
    );
}

function isDraw() {
    return gameBoard.every(cell => cell);
}

function endGame() {
    board.querySelectorAll('.cell').forEach(cell => cell.classList.add('taken'));
}

function restartGame() {
    gameBoard = Array(9).fill(null);
    statusDisplay.textContent = '';
    redirectButton.style.display = 'none';
    renderBoard();
}

function minimax(newBoard, player) {
    const emptyCells = newBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

    if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (emptyCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    emptyCells.forEach(index => {
        const move = {};
        move.index = index;
        newBoard[index] = player;

        if (player === aiPlayer) {
            move.score = minimax(newBoard, humanPlayer).score;
        } else {
            move.score = minimax(newBoard, aiPlayer).score;
        }

        newBoard[index] = null;
        moves.push(move);
    });

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

redirectButton.addEventListener('click', () => {
    window.location.href = '2.html';
});

restartButton.addEventListener('click', restartGame);
renderBoard();
