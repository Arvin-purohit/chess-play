interface ControlPanelProps {
  onUndo: () => void;
  onFlip: () => void;
  onNewGame: () => void;
  canUndo: boolean;
}

export default function ControlPanel({
  onUndo,
  onFlip,
  onNewGame,
  canUndo,
}: ControlPanelProps) {
  return (
    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg">
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700 disabled:opacity-40"
        >
          <div className="text-2xl">⟲</div>
          <p className="mt-1 text-xs text-zinc-300">Undo</p>
        </button>

        <button
          onClick={onFlip}
          className="rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700"
        >
          <div className="text-2xl">🔄</div>
          <p className="mt-1 text-xs text-zinc-300">Flip</p>
        </button>

        <button
          onClick={onNewGame}
          className="rounded-xl bg-zinc-800 p-3 transition hover:bg-zinc-700"
        >
          <div className="text-2xl">↺</div>
          <p className="mt-1 text-xs text-zinc-300">New Game</p>
        </button>
      </div>
    </div>
  );
}