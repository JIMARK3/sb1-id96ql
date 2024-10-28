import React from 'react';

type GameStatsProps = {
  score: number;
  level: number;
  lines: number;
};

export const GameStats: React.FC<GameStatsProps> = ({ score, level, lines }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-sm mb-1">Score</h3>
        <p className="text-2xl font-bold text-white">{score}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-sm mb-1">Level</h3>
        <p className="text-2xl font-bold text-white">{level}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-sm mb-1">Lines</h3>
        <p className="text-2xl font-bold text-white">{lines}</p>
      </div>
    </div>
  );
};