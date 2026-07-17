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