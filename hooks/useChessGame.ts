import { useState } from "react";
import { Chess } from "chess.js";

export function useChessGame() {
  const [game, setGame] = useState(() => new Chess());

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const [moveSquares, setMoveSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);

  return {
    game,
    setGame,

    selectedSquare,
    setSelectedSquare,

    moveSquares,
    setMoveSquares,

    lastMove,
    setLastMove,

    pendingPromotion,
    setPendingPromotion,
  };
}