import React from 'react';

type NextPieceProps = {
  piece: {
    shape: number[][];
    color: string;
  } | null;
};

export const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  if (!piece) return null;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-sm mb-2">Next Piece</h3>
      <div className="grid gap-[1px] bg-gray-700 p-1 rounded-lg">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-4 h-4 ${
                  cell ? piece.color : 'bg-gray-900'
                } rounded-sm`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};