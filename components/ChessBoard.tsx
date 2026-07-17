import { Chessboard } from "react-chessboard";
import React from "react";

interface ChessBoardProps {
  position: string;
  boardOrientation: "white" | "black";
  lastMove: { from: string; to: string } | null;
  checkSquare?: string;
  moveSquares: Record<string, React.CSSProperties>;
  onSquareClick: (square: string) => void;
  onPieceDrop: (
    sourceSquare: string,
    targetSquare: string
  ) => boolean;
}

export default function ChessBoard({
  position,
  boardOrientation,
  lastMove,
  checkSquare,
  moveSquares,
  onSquareClick,
  onPieceDrop,
}: ChessBoardProps) {
  return (
    <Chessboard
      options={{
        boardOrientation,
        position,

        onSquareClick: ({ square }) => {
          onSquareClick(square);
        },

        squareStyles: {
          ...(lastMove && {
            [lastMove.from]: {
              background: "rgba(255,255,0,0.35)",
            },
            [lastMove.to]: {
              background: "rgba(255,255,0,0.35)",
            },
          }),

          ...(checkSquare && {
            [checkSquare]: {
              background: "rgba(255,0,0,0.45)",
              borderRadius: "50%",
            },
          }),

          ...moveSquares,
        },

        onPieceDrop: ({ sourceSquare, targetSquare }) => {
          if (!targetSquare) return false;
          return onPieceDrop(sourceSquare, targetSquare);
        },
      }}
    />
  );
}