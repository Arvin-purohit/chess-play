interface GameHeaderProps {
  turn: "w" | "b";
  inCheck: boolean;
  isCheckmate: boolean;
  gameResult: string | null;

  mode: string;
  moveNumber: number;
  difficulty?: string;

  onBack: () => void;
}

export default function GameHeader({
  turn,
  inCheck,
  isCheckmate,
  gameResult,
  mode,
  moveNumber,
  difficulty,
  onBack,
}: GameHeaderProps) {
  return (
    <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-white">
            ♟ Chess Arena
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 px-3 py-1 text-sm font-semibold text-white">
            {mode === "human"
              ? "👥 Human vs Human"
              : "🤖 Human vs Computer"}
          </div>

          {mode === "computer" && difficulty && (
            <div className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
              🤖 Level {difficulty}
            </div>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-zinc-400">
          <span>
            {turn === "w"
              ? "⚪ White to move"
              : "⚫ Black to move"}
          </span>

          <span className="text-zinc-600">•</span>

          <span>Move {moveNumber}</span>
        </div>

        <div className="flex gap-6">
          <span>
            Check{" "}
            <strong
              className={
                inCheck
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {inCheck ? "YES" : "NO"}
            </strong>
          </span>

          <span>
            Mate{" "}
            <strong
              className={
                isCheckmate
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {isCheckmate ? "YES" : "NO"}
            </strong>
          </span>
        </div>
      </div>

      {gameResult && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-center">
          <p className="text-xs uppercase tracking-widest text-red-400">
            Game Over
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {gameResult}
          </p>
        </div>
      )}
    </div>
  );
}