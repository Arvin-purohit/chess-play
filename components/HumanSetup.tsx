interface HumanSetupProps {
  selectedTime: number;
  setSelectedTime: (time: number) => void;
  onStartGame: () => void;
  onBack: () => void;
}

export default function HumanSetup({
  selectedTime,
  setSelectedTime,
  onStartGame,
  onBack,
}: HumanSetupProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-4xl rounded-2xl bg-zinc-900 p-8 shadow-2xl">

        <h1 className="mb-2 text-center text-5xl font-bold text-white">
          ♟ Chess Arena
        </h1>

        <p className="mb-8 text-center text-zinc-400">
          Choose your time control
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            { title: "Bullet", time: 1 },
            { title: "Blitz", time: 3 },
            { title: "Blitz", time: 5 },
            { title: "Rapid", time: 10 },
            { title: "Rapid", time: 15 },
            { title: "Rapid", time: 30 },
          ].map((item) => (
            <button
              key={item.time}
              onClick={() => setSelectedTime(item.time)}
              className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
                selectedTime === item.time
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/30"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-500 hover:bg-zinc-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <span className="text-lg">⚡</span>

                <span className="text-sm uppercase tracking-widest">
                  {item.title}
                </span>
              </div>

              <p className="mt-2 text-4xl font-bold text-white">
                {item.time} min
              </p>

              {selectedTime === item.time && (
                <p className="mt-3 text-sm font-semibold text-green-400">
                  ✓ Selected
                </p>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onBack}
            className="rounded-2xl border border-zinc-700 px-6 py-4 text-white hover:bg-zinc-800"
          >
            ← Back
          </button>

          <button
            onClick={onStartGame}
            className="flex-1 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 py-4 text-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/40 active:scale-95"
          >
            Start Game
          </button>
        </div>

      </div>
    </main>
  );
}