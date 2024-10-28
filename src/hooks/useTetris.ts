import { useState, useCallback, useEffect } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' }
};

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const useTetris = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [nextPiece, setNextPiece] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getRandomPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOS);
    const tetromino = TETROMINOS[pieces[Math.floor(Math.random() * pieces.length)] as keyof typeof TETROMINOS];
    return {
      shape: tetromino.shape,
      color: tetromino.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
    };
  }, []);

  const isValidMove = useCallback((piece: any, board: number[][], x: number, y: number) => {
    return piece.shape.every((row: number[], dy: number) =>
      row.every((value: number, dx: number) => {
        let newX = x + dx;
        let newY = y + dy;
        return (
          value === 0 ||
          (newX >= 0 &&
            newX < BOARD_WIDTH &&
            newY < BOARD_HEIGHT &&
            (newY < 0 || board[newY][newX] === 0))
        );
      })
    );
  }, []);

  const rotatePiece = useCallback((piece: any) => {
    const rotated = piece.shape[0].map((_: any, i: number) =>
      piece.shape.map((row: number[]) => row[i]).reverse()
    );
    
    if (isValidMove({ ...piece, shape: rotated }, board, piece.position.x, piece.position.y)) {
      return { ...piece, shape: rotated };
    }
    return piece;
  }, [board, isValidMove]);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return;

    const newX = currentPiece.position.x + dx;
    const newY = currentPiece.position.y + dy;

    if (isValidMove(currentPiece, board, newX, newY)) {
      setCurrentPiece({
        ...currentPiece,
        position: { x: newX, y: newY }
      });
      return true;
    }
    return false;
  }, [currentPiece, board, gameOver, isPaused, isValidMove]);

  const mergePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row: number[], y: number) => {
      row.forEach((value: number, x: number) => {
        if (value) {
          const newY = y + currentPiece.position.y;
          const newX = x + currentPiece.position.x;
          if (newY >= 0) {
            newBoard[newY][newX] = 1;
          }
        }
      });
    });

    setBoard(newBoard);
    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());

    // Check for completed lines
    let completedLines = 0;
    const updatedBoard = newBoard.filter(row => {
      if (row.every(cell => cell === 1)) {
        completedLines++;
        return false;
      }
      return true;
    });

    while (updatedBoard.length < BOARD_HEIGHT) {
      updatedBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    if (completedLines > 0) {
      setBoard(updatedBoard);
      setLines(prev => prev + completedLines);
      setScore(prev => prev + (completedLines * 100 * level));
      setLevel(prev => Math.floor(lines / 10) + 1);
    }

    // Check for game over
    if (newBoard[0].some(cell => cell === 1)) {
      setGameOver(true);
    }
  }, [board, currentPiece, nextPiece, getRandomPiece, level, lines]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        if (currentPiece) {
          setCurrentPiece(rotatePiece(currentPiece));
        }
        break;
      case 'p':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [currentPiece, gameOver, movePiece, rotatePiece]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!isPaused && !gameOver) {
        if (!movePiece(0, 1)) {
          mergePiece();
        }
      }
    }, Math.max(100, 1000 - (level - 1) * 100));

    return () => clearInterval(gameLoop);
  }, [isPaused, gameOver, level, movePiece, mergePiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
  }, [getRandomPiece]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  return {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    lines,
    gameOver,
    isPaused,
    startGame,
    togglePause: () => setIsPaused(prev => !prev)
  };
};