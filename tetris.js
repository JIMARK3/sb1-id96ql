class Tetris {
    constructor() {
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.gameBoard = document.getElementById('game-board');
        this.nextPieceDisplay = document.getElementById('next-piece');
        this.scoreDisplay = document.getElementById('score');
        this.levelDisplay = document.getElementById('level');
        this.linesDisplay = document.getElementById('lines');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');

        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.currentPiece = null;
        this.nextPiece = null;

        this.pieces = {
            'I': { shape: [[1, 1, 1, 1]], color: 'I' },
            'O': { shape: [[1, 1], [1, 1]], color: 'O' },
            'T': { shape: [[0, 1, 0], [1, 1, 1]], color: 'T' },
            'S': { shape: [[0, 1, 1], [1, 1, 0]], color: 'S' },
            'Z': { shape: [[1, 1, 0], [0, 1, 1]], color: 'Z' },
            'J': { shape: [[1, 0, 0], [1, 1, 1]], color: 'J' },
            'L': { shape: [[0, 0, 1], [1, 1, 1]], color: 'L' }
        };

        this.initBoard();
        this.bindControls();
    }

    initBoard() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                this.gameBoard.appendChild(cell);
            }
        }

        this.nextPieceDisplay.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            this.nextPieceDisplay.appendChild(cell);
        }
    }

    bindControls() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
    }

    handleKeyPress(event) {
        if (this.gameOver || this.isPaused) return;

        switch (event.key) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case ' ':
                this.hardDrop();
                break;
            case 'p':
                this.togglePause();
                break;
        }
    }

    startGame() {
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.updateScore();
        this.currentPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece();
        this.draw();
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.gameLoop(), this.getGameSpeed());
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    getRandomPiece() {
        const pieces = Object.keys(this.pieces);
        const piece = this.pieces[pieces[Math.floor(Math.random() * pieces.length)]];
        return {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor((this.boardWidth - piece.shape[0].length) / 2),
            y: 0
        };
    }

    isValidMove(piece, x, y) {
        return piece.shape.every((row, dy) =>
            row.every((value, dx) => {
                let newX = x + dx;
                let newY = y + dy;
                return (
                    value === 0 ||
                    (newX >= 0 &&
                        newX < this.boardWidth &&
                        newY < this.boardHeight &&
                        !this.board[newY]?.[newX])
                );
            })
        );
    }

    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;

        if (this.isValidMove(this.currentPiece, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            this.draw();
            return true;
        }
        return false;
    }

    rotatePiece() {
        const rotated = {
            ...this.currentPiece,
            shape: this.currentPiece.shape[0].map((_, i) =>
                this.currentPiece.shape.map(row => row[i]).reverse()
            )
        };

        if (this.isValidMove(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece = rotated;
            this.draw();
        }
    }

    hardDrop() {
        while (this.movePiece(0, 1)) {}
        this.mergePiece();
    }

    mergePiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = y + this.currentPiece.y;
                    const boardX = x + this.currentPiece.x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            });
        });

        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece();
        
        if (!this.isValidMove(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver = true;
            clearInterval(this.gameInterval);
            alert('Game Over! Score: ' + this.score);
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += this.getLineClearPoints(linesCleared);
            this.level = Math.floor(this.lines / 10) + 1;
            this.updateScore();
            
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(() => this.gameLoop(), this.getGameSpeed());
            }
        }
    }

    getLineClearPoints(lines) {
        const points = [0, 40, 100, 300, 1200];
        return points[lines] * this.level;
    }

    getGameSpeed() {
        return Math.max(100, 1000 - (this.level - 1) * 100);
    }

    gameLoop() {
        if (!this.isPaused && !this.gameOver) {
            if (!this.movePiece(0, 1)) {
                this.mergePiece();
            }
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
        this.levelDisplay.textContent = this.level;
        this.linesDisplay.textContent = this.lines;
    }

    draw() {
        // Clear board
        const cells = this.gameBoard.getElementsByClassName('cell');
        Array.from(cells).forEach(cell => {
            cell.className = 'cell';
        });

        // Draw board
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    cells[y * this.boardWidth + x].classList.add('filled', value);
                }
            });
        });

        // Draw current piece
        if (this.currentPiece) {
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        const boardY = y + this.currentPiece.y;
                        const boardX = x + this.currentPiece.x;
                        if (boardY >= 0 && cells[boardY * this.boardWidth + boardX]) {
                            cells[boardY * this.boardWidth + boardX].classList.add('filled', this.currentPiece.color);
                        }
                    }
                });
            });
        }

        // Draw next piece
        const nextCells = this.nextPieceDisplay.getElementsByClassName('cell');
        Array.from(nextCells).forEach(cell => {
            cell.className = 'cell';
        });

        if (this.nextPiece) {
            this.nextPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        nextCells[y * 4 + x].classList.add('filled', this.nextPiece.color);
                    }
                });
            });
        }
    }
}

// Start the game
const game = new Tetris();