interface GameResultPopupProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  emoji: string;
  onNewGame: () => void;
  onClose: () => void;
}

export default function GameResultPopup({
  isOpen,
  title,
  subtitle,
  emoji,
  onNewGame,
  onClose,
}: GameResultPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="
          w-[360px]
          rounded-3xl
          border
          border-zinc-700
          bg-zinc-900
          p-8
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
      >
        <div className="text-center">

          <div className="text-6xl">
            {emoji}
          </div>

          <h2 className="mt-4 text-3xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-2 text-zinc-400">
            {subtitle}
          </p>

          <div className="mt-8 flex gap-3">

            <button
              onClick={onNewGame}
              className="
                flex-1
                rounded-xl
                bg-green-600
                py-3
                font-semibold
                text-white
                transition
                hover:bg-green-500
              "
            >
              New Game
            </button>

            <button
              onClick={onClose}
              className="
                flex-1
                rounded-xl
                border
                border-zinc-700
                py-3
                font-semibold
                text-white
                transition
                hover:bg-zinc-800
              "
            >
              Review
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}