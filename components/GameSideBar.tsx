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
     
    </div>

    
  );
}