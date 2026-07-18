interface ComputerSetupProps {
  selectedTime: number;
  setSelectedTime: (time: number) => void;
  playerColor: "white" | "black";
  setPlayerColor: (color: "white" | "black") => void;
  difficulty: number;
  setDifficulty: (level: number) => void;
  onStartGame: () => void;
  onBack: () => void;
}

export default function ComputerSetup({
  selectedTime,
  setSelectedTime,
  playerColor,
  setPlayerColor,
  difficulty,
  setDifficulty,
  onStartGame,
  onBack,
}: ComputerSetupProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-4xl rounded-2xl bg-zinc-900 p-8 shadow-2xl">

        <h1 className="mb-2 text-center text-5xl font-bold text-white">
          🤖 Human vs Computer
        </h1>

        <p className="mb-8 text-center text-zinc-400">
          Configure your match
        </p>

        {/* Color */}
        <h2 className="mb-4 text-xl font-semibold text-white">
          Choose Your Color
        </h2>

        <div className="mb-8 grid grid-cols-2 gap-4">
          {(["white", "black"] as const).map((color) => (
            <button
              key={color}
              onClick={() => setPlayerColor(color)}
              className={`rounded-xl border p-4 ${
                playerColor === color
                  ? "border-green-500 bg-green-500/10"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              {color === "white" ? "⚪ White" : "⚫ Black"}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <h2 className="mb-4 text-xl font-semibold text-white">
          Difficulty
        </h2>

        <div className="mb-8 grid grid-cols-2 gap-4">
          {[
            { name: "Easy", value: 1 },
            { name: "Medium", value: 5 },
            { name: "Hard", value: 10 },
            { name: "Master", value: 20 },
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => setDifficulty(level.value)}
              className={`rounded-xl border p-4 ${
                difficulty === level.value
                  ? "border-green-500 bg-green-500/10"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>

        {/* Time */}
        <h2 className="mb-4 text-xl font-semibold text-white">
          Time Control
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {[1, 3, 5, 10, 15, 30].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`rounded-xl border p-4 ${
                selectedTime === time
                  ? "border-green-500 bg-green-500/10"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              {time} min
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onBack}
            className="rounded-xl border border-zinc-700 px-6 py-4 text-white"
          >
            ← Back
          </button>

          <button
            onClick={onStartGame}
            className="flex-1 rounded-xl bg-green-600 py-4 text-white font-bold"
          >
            Start Game
          </button>
        </div>

      </div>
    </main>
  );
}