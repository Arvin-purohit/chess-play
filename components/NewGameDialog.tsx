interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function NewGameDialog({
  isOpen,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[360px] rounded-3xl bg-zinc-900 border border-zinc-700 p-6">

        <h2 className="text-2xl font-bold text-white">
          Start New Game?
        </h2>

        <p className="mt-3 text-zinc-400">
          Your current game will be lost.
        </p>

        <div className="mt-8 flex gap-3">

          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-zinc-700 py-3 text-white hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-500"
          >
            New Game
          </button>

        </div>

      </div>
    </div>
  );
}