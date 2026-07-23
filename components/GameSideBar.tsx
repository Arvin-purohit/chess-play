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
<div className="w-full min-w-0 lg:w-[300px] lg:flex-shrink-0 xl:w-[340px] space-y-4">        <ControlPanel
        onUndo={onUndo}
        onFlip={onFlip}
        onNewGame={onNewGame}
        canUndo={canUndo}
      />

      <MoveHistory moves={moveHistory} />
     
    </div>

    
  );
}