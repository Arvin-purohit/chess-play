interface PromotionModalProps {
  isOpen: boolean;
  onSelect: (piece: "q" | "r" | "b" | "n") => void;
}

export default function PromotionModal({
  isOpen,
  onSelect,
}: PromotionModalProps) {
  if (!isOpen) return null;

  const pieces = [
    { type: "q" as const, symbol: "♛", label: "Queen" },
    { type: "r" as const, symbol: "♜", label: "Rook" },
    { type: "b" as const, symbol: "♝", label: "Bishop" },
    { type: "n" as const, symbol: "♞", label: "Knight" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-xl bg-zinc-900 p-6 text-white shadow-2xl">
        <h2 className="mb-4 text-center text-lg font-semibold">
          Promote your pawn
        </h2>

        <div className="flex gap-3">
          {pieces.map((piece) => (
            <button
              key={piece.type}
              onClick={() => onSelect(piece.type)}
              className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg bg-zinc-800 transition hover:bg-zinc-700"
            >
              <span className="text-4xl">{piece.symbol}</span>
              <span className="mt-1 text-xs text-zinc-400">
                {piece.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}