import { Chess } from "chess.js";
import { MutableRefObject } from "react";
import { StockfishEngine } from "@/lib/StockfishEngine";
import { AI_DIFFICULTY } from "@/lib/aiDifficulty";

interface PlayComputerMoveProps {
  engine: MutableRefObject<StockfishEngine | null>;
  difficulty: number;
  game: Chess;
  setGame: (game: Chess) => void;
  setLastMove: (move: { from: string; to: string }) => void;
  setActivePlayer: (player: "w" | "b") => void;
}

export async function playComputerMove({
  engine,
  difficulty,
  game,
  setGame,
  setLastMove,
  setActivePlayer,
}: PlayComputerMoveProps) {
  console.log("🤖 playComputerMove called");

  if (!engine.current) {
    console.log("❌ Engine is null");
    return;
  }

  console.log("✅ Engine exists");

  engine.current.setSkill(difficulty);

const settings = AI_DIFFICULTY[difficulty];

const bestMove = await engine.current.getBestMove(
  game.fen(),
  settings.depth
);

  console.log("🎯 Best move:", bestMove);

  if (!bestMove || bestMove === "(none)") return;


  console.log("Current FEN:", game.fen());
console.log("Current history:", game.history());
const aiGame = new Chess();

game.history({ verbose: true }).forEach((move) => {
  aiGame.move({
    from: move.from,
    to: move.to,
    promotion: move.promotion,
  });
});

  aiGame.move({
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4),
    promotion:
      bestMove.length === 5
        ? (bestMove[4] as "q" | "r" | "b" | "n")
        : undefined,
  });
console.log("🤖 AI setGame");
  setGame(aiGame);
  
console.log(aiGame.history());
console.log("🤖 AI lastMove");
  setLastMove({
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4),
  });

  setActivePlayer(aiGame.turn());
}