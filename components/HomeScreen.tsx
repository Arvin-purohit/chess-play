interface HomeScreenProps {
  onHumanMode: () => void;
  onComputerMode: () => void;
}

export default function HomeScreen({
  onHumanMode,
  onComputerMode,
}: HomeScreenProps) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-8 px-6">

        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">
            ♟ Chess Arena
          </h1>

          <p className="mt-3 text-slate-400">
            Choose your game mode
          </p>
        </div>

        <button
          onClick={onHumanMode}
          className="w-full rounded-2xl bg-slate-800 p-6 text-left transition hover:bg-slate-700"
        >
          <h2 className="text-2xl font-semibold text-white">
            👥 Human vs Human
          </h2>

          <p className="mt-2 text-slate-400">
            Play locally with a friend.
          </p>
        </button>

        <button
          onClick={onComputerMode}
          className="w-full rounded-2xl bg-slate-800 p-6 text-left transition hover:bg-slate-700"
        >
          <h2 className="text-2xl font-semibold text-white">
            🤖 Human vs Computer
          </h2>

          <p className="mt-2 text-slate-400">
            Challenge Stockfish.
          </p>
        </button>

      </div>
    </main>
  );
}