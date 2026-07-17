import { Chess } from "chess.js";

interface MakeMoveParams {
  game: Chess;
  sourceSquare: string;
  targetSquare: string;
  promotion?: "q" | "r" | "b" | "n";
}

export function makeChessMove({
  game,
  sourceSquare,
  targetSquare,
  promotion,
}: MakeMoveParams) {
  const gameCopy = new Chess();

  game.history().forEach((move) => {
    gameCopy.move(move);
  });

  const move = gameCopy.move({
    from: sourceSquare,
    to: targetSquare,
    promotion,
  });

  if (!move) {
    return null;
  }

  return gameCopy;
}

export function getMoveOptions(
  game: Chess,
  square: string
) {
  const moves = game.moves({
    square: square as any,
    verbose: true,
  });

  if (moves.length === 0) {
    return {};
  }

  const moveSquares: Record<string, React.CSSProperties> = {};

  moves.forEach((move) => {
    moveSquares[move.to] = {
      background:
        game.get(move.to as any) &&
        game.get(move.to as any)?.color !==
          game.get(square as any)?.color
          ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
          : "radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)",
      borderRadius: "50%",
    };
  });

  return moveSquares;
}