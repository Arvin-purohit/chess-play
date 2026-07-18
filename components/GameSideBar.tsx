import ControlPanel from "./ControlPanel";
import MoveHistory from "./MoveHistory";

interface GameSidebarProps {
  moveHistory: string[];
  canUndo: boolean;
  onUndo: () => void;
  onFlip: () => void;
  onNewGame: () => void;
}

export default function GameSidebar({
  moveHistory,
  canUndo,
  onUndo,
  onFlip,
  onNewGame,
}: GameSidebarProps) {
  return (
    <div className="w-[320px] space-y-4">
      <ControlPanel
        onUndo={onUndo}
        onFlip={onFlip}
        onNewGame={onNewGame}
        canUndo={canUndo}
      />

      <MoveHistory moves={moveHistory} />
      <div className="mt-8 rounded-xl border border-zinc-700 p-4">
  <h3 className="mb-3 text-sm font-bold text-white">
    ⌨ Shortcuts
  </h3>

  <div className="space-y-2 text-sm text-zinc-300">
    <div className="flex justify-between">
      <span>Undo</span>
      <kbd>Ctrl + Z</kbd>
    </div>

    <div className="flex justify-between">
      <span>Flip Board</span>
      <kbd>F</kbd>
    </div>

    <div className="flex justify-between">
      <span>Close Dialog</span>
      <kbd>Esc</kbd>
    </div>
  </div>
</div>
    </div>

    
  );
}