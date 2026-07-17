interface MoveHistoryProps {
  moves: string[];
}

export default function MoveHistory({
  moves,
}: MoveHistoryProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Move History
      </h2>

      <div className="max-h-[520px] space-y-2 overflow-y-auto pr-2">
        {Array.from({
          length: Math.ceil(moves.length / 2),
        }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[45px_1fr_1fr] items-center rounded-lg bg-zinc-800 px-3 py-2 transition hover:bg-zinc-700"
          >
            <span className="font-semibold text-zinc-500">
              {index + 1}.
            </span>

            <span className="rounded px-2 py-1 text-center font-mono font-semibold text-white">
              {moves[index * 2] || "-"}
            </span>

            <span className="rounded px-2 py-1 text-center font-mono font-semibold text-white">
              {moves[index * 2 + 1] || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}