import React from 'react';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { GameStats } from './components/GameStats';
import { Controls } from './components/Controls';
import { useTetris } from './hooks/useTetris';
import { Gamepad2, Pause, Play, RotateCcw } from 'lucide-react';

function App() {
  const {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    lines,
    gameOver,
    isPaused,
    startGame,
    togglePause
  } = useTetris();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2">
            <Gamepad2 className="w-8 h-8" />
            Tetris
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,auto] gap-8 items-start">
          <div className="space-y-4">
            <NextPiece piece={nextPiece} />
            <GameStats score={score} level={level} lines={lines} />
          </div>

          <div className="relative">
            {(gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {gameOver ? 'Game Over' : 'Paused'}
                  </h2>
                  <button
                    onClick={gameOver ? startGame : togglePause}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
                  >
                    {gameOver ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        New Game
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Continue
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            <GameBoard board={board} currentPiece={currentPiece} />
            <div className="mt-4 flex justify-center">
              <button
                onClick={togglePause}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                )}
              </button>
            </div>
          </div>

          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;