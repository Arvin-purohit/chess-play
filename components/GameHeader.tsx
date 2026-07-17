interface GameHeaderProps {
  turn: "w" | "b";
  inCheck: boolean;
  isCheckmate: boolean;
  gameResult: string | null;
}

export default function GameHeader({
  turn,
  inCheck,
  isCheckmate,
  gameResult,
}: GameHeaderProps) {
  return (
    <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-white">
            ♟ Chess Arena
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            {turn === "w"
              ? "⚪ White to move"
              : "⚫ Black to move"}
          </p>
        </div>

        <div className="flex gap-10 text-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Check
            </p>

            <p
              className={`mt-1 font-semibold ${
                inCheck
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {inCheck ? "YES" : "NO"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Checkmate
            </p>

            <p
              className={`mt-1 font-semibold ${
                isCheckmate
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {isCheckmate ? "YES" : "NO"}
            </p>
          </div>
        </div>
      </div>

      {gameResult && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-red-400">
            Game Over
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {gameResult}
          </p>
        </div>
      )}
    </div>
  );
}