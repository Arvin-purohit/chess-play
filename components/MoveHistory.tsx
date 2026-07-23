import { useEffect, useRef } from "react";
interface MoveHistoryProps {
  moves: string[];
}


export default function MoveHistory({
  moves,
}: MoveHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [moves]);
const moveRows = Array.from(
  { length: Math.ceil(moves.length / 2) },
  (_, index) => ({
    number: index + 1,
    white: moves[index * 2] || "",
    black: moves[index * 2 + 1] || "",
  })
);

const visibleRows = moveRows.slice(-6);

const emptyRows = Array.from({
  length: Math.max(0, 6 - visibleRows.length),
});
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
<h2 className="mb-4 text-lg font-semibold text-white">
  Move History
  <span className="ml-2 text-sm font-normal text-zinc-400">
    ({moves.length})
  </span>
</h2>
      <div className="mb-2 grid grid-cols-[45px_1fr_1fr] px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
  <span>#</span>
  <span className="text-center">White</span>
  <span className="text-center">Black</span>
</div>
<div className="space-y-1">
  {emptyRows.map((_, index) => (
    <div
      key={`empty-${index}`}
      className="grid grid-cols-[45px_1fr_1fr] items-center rounded-lg bg-zinc-900 px-2 py-1.5"
    >
      <span className="text-zinc-700">-</span>
<span className="text-center text-zinc-700">-</span>
<span className="text-center text-zinc-700">-</span>
    </div>
  ))}

  {visibleRows.map((move, index) => (
    <div
      key={move.number}
      className={`grid grid-cols-[45px_1fr_1fr] items-center rounded-lg px-2 py-1.5 transition ${
        index === visibleRows.length - 1
          ? "bg-zinc-700 ring-1 ring-zinc-500"
          : "bg-zinc-800 hover:bg-zinc-700"
      }`}
    >
      <span className="font-semibold text-zinc-400">
        {move.number}.
      </span>

      <span className="text-center font-mono font-semibold text-white">
        {move.white}
      </span>

      <span className="text-center font-mono font-semibold text-white">
        {move.black}
      </span>
    </div>
  ))}
</div>


    </div>
  );
}