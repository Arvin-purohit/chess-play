interface TimerCardProps {
  player: "White" | "Black";
  time: string;
  active: boolean;
}

export default function TimerCard({
  player,
  time,
  active,
}: TimerCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        active
          ? "border-emerald-500 bg-zinc-900 shadow-xl shadow-emerald-500/20"
          : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            {player === "White" ? "⚪ WHITE" : "⚫ BLACK"}
          </p>

          <p className="mt-3 font-mono text-5xl font-bold text-white">
            {time}
          </p>
        </div>

        {active && (
          <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            ACTIVE
          </div>
        )}
      </div>
    </div>
  );
}