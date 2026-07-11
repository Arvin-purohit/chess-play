"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [moveSquares, setMoveSquares] = useState<Record<string, React.CSSProperties>>({});

  function makeMove(sourceSquare: string, targetSquare: string) {
    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        return false;
      }

      setGame(gameCopy);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-[600px]">
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!targetSquare) return false;

              return makeMove(sourceSquare, targetSquare);
            },
          }}
        />
      </div>
    </main>
  );
}