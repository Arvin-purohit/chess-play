import { Chessboard } from "react-chessboard";
import React, { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(500);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setBoardWidth(entry.contentRect.width);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
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
    </div>
  );
}