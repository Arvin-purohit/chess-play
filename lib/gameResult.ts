import { Chess } from "chess.js";

export type GameResult =
  | {
      type: "checkmate";
      winner: "White" | "Black";
      message: string;
    }
  | {
      type:
        | "stalemate"
        | "threefold"
        | "insufficient"
        | "fiftyMove";
      winner: null;
      message: string;
    }
  | null;

export function getGameResult(game: Chess): GameResult {
  if (game.isCheckmate()) {
    return {
      type: "checkmate",
      winner: game.turn() === "w" ? "Black" : "White",
      message: "Checkmate!",
    };
  }

  if (game.isStalemate()) {
    return {
      type: "stalemate",
      winner: null,     
      message: "Draw by Stalemate",
    };
  }

  if (game.isThreefoldRepetition()) {
    return {
      type: "threefold",
      winner: null,
      message: "Draw by Threefold Repetition",
    };
  }

  if (game.isInsufficientMaterial()) {
    return  {
      type: "insufficient",
      winner: null,
      message: "Draw by Insufficient Material",
    };
  }

  // Depending on chess.js version this may differ
  if ("isDrawByFiftyMoves" in game && game.isDrawByFiftyMoves()) {
    return {
      type: "fiftyMove",
      winner: null,
      message: "Draw by 50-Move Rule",
    };
  }

  return null;
}