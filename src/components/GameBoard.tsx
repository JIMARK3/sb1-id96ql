import React from 'react';

type GameBoardProps = {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: { x: number; y: number };
    color: string;
  } | null;
};

export const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  const renderCell = (x: number, y: number) => {
    // Check if cell is part of current piece
    if (currentPiece) {
      const { shape, position, color } = currentPiece;
      const pieceX = x - position.x;
      const pieceY = y - position.y;
      
      if (
        pieceX >= 0 &&
        pieceX < shape[0].length &&
        pieceY >= 0 &&
        pieceY < shape.length &&
        shape[pieceY][pieceX]
      ) {
        return color;
      }
    }
    
    return board[y][x] ? 'bg-gray-400' : 'bg-gray-900';
  };

  return (
    <div className="grid gap-[1px] bg-gray-700 p-1 rounded-lg">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-6 h-6 ${renderCell(x, y)} rounded-sm`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};