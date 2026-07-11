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

const winner = game.isCheckmate()
  ? game.turn() === "w"
    ? "Black"
    : "White"
  : null;

  const isDraw = game.isDraw();
  

let gameResult: string | null = null;

if (game.isCheckmate()) {
  gameResult = `${winner} wins by checkmate!`;
} else if (game.isStalemate()) {
  gameResult = "Draw by stalemate";
} else if (game.isThreefoldRepetition()) {
  gameResult = "Draw by threefold repetition";
} else if (game.isInsufficientMaterial()) {
  gameResult = "Draw by insufficient material";
} else if (isDraw) {
  gameResult = "Draw";
}
const [pendingPromotion, setPendingPromotion] = useState<{
  from: string;
  to: string;
} | null>(null);
function resetGame() {
  setGame(new Chess());
  setSelectedSquare(null);
  setMoveSquares({});
  setLastMove(null);
  setPendingPromotion(null);
}

function undoMove() {
  const history = game.history({ verbose: true });

  if (history.length === 0) {
    return;
  }

  // Remove the latest move
  const remainingMoves = history.slice(0, -1);

  // Create a fresh game and replay all remaining moves
  const newGame = new Chess();

  remainingMoves.forEach((move) => {
    newGame.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    });
  });

  setGame(newGame);

  // Update last-move highlight
  const previousMove = remainingMoves[remainingMoves.length - 1];

  if (previousMove) {
    setLastMove({
      from: previousMove.from,
      to: previousMove.to,
    });
  } else {
    setLastMove(null);
  }

  // Clear any active selections
  setSelectedSquare(null);
  setMoveSquares({});
  setPendingPromotion(null);
}

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

  function makeMove(
  sourceSquare: string,
  targetSquare: string,
  promotion?: "q" | "r" | "b" | "n",
) {
  const piece = game.get(sourceSquare as any);

  const isPromotion =
    piece?.type === "p" &&
    ((piece.color === "w" && targetSquare.endsWith("8")) ||
      (piece.color === "b" && targetSquare.endsWith("1")));

  if (isPromotion && !promotion) {
    setPendingPromotion({
      from: sourceSquare,
      to: targetSquare,
    });

    return false;
  }

  try {
    const gameCopy = new Chess();

    game.history().forEach((move) => {
      gameCopy.move(move);
    });

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion,
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
    setPendingPromotion(null);

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

      {gameResult && (
  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-white">
    <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
      Game Over
    </p>

    <p className="mt-1 text-2xl font-bold">
      {gameResult}
    </p>
  </div>
)}

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
  <div className="mb-4 flex items-center justify-between">
  <h2 className="text-lg font-semibold">Move History</h2>

    <div className="flex gap-2">
    <button
      onClick={undoMove}
      disabled={moveHistory.length === 0}
      className="cursor-pointer rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Undo
    </button>

  <button
    onClick={resetGame}
    className="cursor-pointer rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-600"
  >
    New Game
  </button>
</div>
</div>

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

  {pendingPromotion && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="rounded-xl bg-zinc-900 p-6 text-white shadow-2xl">
      <h2 className="mb-4 text-center text-lg font-semibold">
        Promote your pawn
      </h2>

      <div className="flex gap-3">
        {[
          { type: "q" as const, symbol: "♛", label: "Queen" },
          { type: "r" as const, symbol: "♜", label: "Rook" },
          { type: "b" as const, symbol: "♝", label: "Bishop" },
          { type: "n" as const, symbol: "♞", label: "Knight" },
        ].map((piece) => (
          <button
            key={piece.type}
            onClick={() =>
              makeMove(
                pendingPromotion.from,
                pendingPromotion.to,
                piece.type,
              )
            }
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg bg-zinc-800 transition hover:bg-zinc-700"
          >
            <span className="text-4xl">{piece.symbol}</span>
            <span className="mt-1 text-xs text-zinc-400">
              {piece.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
)}
</main>
  );
}