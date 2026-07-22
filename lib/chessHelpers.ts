import { Chess } from "chess.js";

export function getCheckSquare(game: Chess) {
  if (!game.inCheck()) return undefined;

  const board = game.board();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];

      if (
        piece &&
        piece.type === "k" &&
        piece.color === game.turn()
      ) {
        return String.fromCharCode(97 + col) + (8 - row);
      }
    }
  }

  return undefined;
}
const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
} as const;

export function getMaterialDifference(
  capturedByWhite: string[],
  capturedByBlack: string[],
) {
  const whiteMaterial = capturedByWhite.reduce(
    (sum, piece) => sum + (PIECE_VALUES[piece as keyof typeof PIECE_VALUES] ?? 0),
    0
  );

  const blackMaterial = capturedByBlack.reduce(
    (sum, piece) => sum + (PIECE_VALUES[piece as keyof typeof PIECE_VALUES] ?? 0),
    0
  );

  return {
    whiteAdvantage: Math.max(0, whiteMaterial - blackMaterial),
    blackAdvantage: Math.max(0, blackMaterial - whiteMaterial),
  };
}
