"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [moveSquares, setMoveSquares] = useState<Record<string, React.CSSProperties>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{
  from: string;
  to: string;
} | null>(null);

const moveHistory = game.history();

const verboseHistory = game.history({ verbose: true });

const capturedByWhite = verboseHistory
  .filter((move) => move.color === "w" && move.captured)
  .map((move) => move.captured!);

const capturedByBlack = verboseHistory
  .filter((move) => move.color === "b" && move.captured)
  .map((move) => move.captured!);

  const pieceSymbols: Record<string, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
};

function getMoveOptions(square: string) {
  const moves = game.moves({
    square: square as any,
    verbose: true,
  });

  if (moves.length === 0) {
    setMoveSquares({});
    return false;
  }

  const newSquares: Record<string, React.CSSProperties> = {};

  moves.forEach((move) => {
    newSquares[move.to] = {
      background:
        game.get(move.to as any) &&
        game.get(move.to as any)?.color !== game.get(square as any)?.color
          ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
          : "radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)",
      borderRadius: "50%",
    };
  });

  setMoveSquares(newSquares);
  return true;
}

  function makeMove(sourceSquare: string, targetSquare: string) {
  try {
    const gameCopy = new Chess();

    // Replay all previous moves to preserve history
    game.history().forEach((move) => {
      gameCopy.move(move);
    });

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) {
      return false;
    }

    setGame(gameCopy);

    setLastMove({
      from: sourceSquare,
      to: targetSquare,
    });

    setSelectedSquare(null);
    setMoveSquares({});

    return true;
  } catch {
    return false;
  }
}

  return (
<main className="min-h-screen bg-zinc-950 px-4 py-6">
  <div className="mx-auto max-w-[900px]">

    {/* Status fields */}
    <div className="mb-4 flex justify-between rounded-lg bg-zinc-900 p-4 text-white">
      <div>
        <p className="text-sm text-zinc-400">Turn</p>
        <p className="font-semibold">
          {game.turn() === "w" ? "White" : "Black"}
        </p>
      </div>

      <div>
        <p className="text-sm text-zinc-400">Check</p>
        <p className="font-semibold">
          {game.inCheck() ? "✓ Yes" : "No"}
        </p>
      </div>

      <div>
        <p className="text-sm text-zinc-400">Checkmate</p>
        <p className="font-semibold">
          {game.isCheckmate() ? "✓ Yes" : "No"}
        </p>
      </div>
    </div>

    {/* Game area */}
    <div className="flex items-start gap-4">

      {/* Chessboard */}
      <div className="w-full max-w-[500px]">


        <div className="mb-2 flex min-h-8 items-center gap-1 text-2xl text-white">
  <span className="mr-2 text-sm text-zinc-400">Black captured:</span>

  {capturedByBlack.length === 0 ? (
    <span className="text-sm text-zinc-600">None</span>
  ) : (
    capturedByBlack.map((piece, index) => (
      <span key={index}>{pieceSymbols[piece]}</span>
    ))
  )}
</div>
        <Chessboard
          options={{
            position: game.fen(),

            onSquareClick: ({ square }) => {
              if (!selectedSquare) {
                const hasMoves = getMoveOptions(square);

                if (hasMoves) {
                  setSelectedSquare(square);
                }

                return;
              }

              const moved = makeMove(selectedSquare, square);

              if (moved) {
                setSelectedSquare(null);
                setMoveSquares({});
                return;
              }

              const hasMoves = getMoveOptions(square);

              if (hasMoves) {
                setSelectedSquare(square);
              } else {
                setSelectedSquare(null);
                setMoveSquares({});
              }
            },

            squareStyles: {
              ...(lastMove && {
                [lastMove.from]: {
                  background: "rgba(255, 255, 0, 0.35)",
                },
                [lastMove.to]: {
                  background: "rgba(255, 255, 0, 0.35)",
                },
              }),

              ...moveSquares,
            },

            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!targetSquare) return false;

              return makeMove(sourceSquare, targetSquare);
            },
          }}
        />

        <div className="mt-2 flex min-h-8 items-center gap-1 text-2xl text-white">
  <span className="mr-2 text-sm text-zinc-400">White captured:</span>

  {capturedByWhite.length === 0 ? (
    <span className="text-sm text-zinc-600">None</span>
  ) : (
    capturedByWhite.map((piece, index) => (
      <span key={index}>{pieceSymbols[piece]}</span>
    ))
  )}
</div>
      </div>

      {/* Move History */}
      <div className="h-[500px] w-[300px] overflow-y-auto rounded-lg bg-zinc-900 p-4 text-white">
  <h2 className="mb-4 text-lg font-semibold">Move History</h2>

  {moveHistory.length === 0 ? (
    <p className="text-sm text-zinc-500">No moves yet</p>
  ) : (
    <div className="space-y-2">
      {Array.from({
        length: Math.ceil(moveHistory.length / 2),
      }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[30px_1fr_1fr] gap-2 text-sm"
        >
          <span className="text-zinc-500">
            {index + 1}.
          </span>

          <span>
            {moveHistory[index * 2] || ""}
          </span>

          <span>
            {moveHistory[index * 2 + 1] || ""}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  </div>
</main>
  );
}