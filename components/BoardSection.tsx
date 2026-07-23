import TimerCard from "./TimerCard";
import CapturedPieces from "./CapturedPieces";
import ChessBoard from "./ChessBoard";
import { getMaterialDifference } from "@/lib/chessHelpers";

interface BoardSectionProps {
  blackTime: string;
  whiteTime: string;
  activePlayer: "w" | "b";

  capturedByBlack: string[];
  capturedByWhite: string[];

  position: string;
  boardOrientation: "white" | "black";
  isAiThinking: boolean;

  lastMove: {
    from: string;
    to: string;
  } | null;

  checkSquare?: string;

  moveSquares: Record<string, React.CSSProperties>;

  onSquareClick: (square: string) => void;

  onPieceDrop: (
    sourceSquare: string,
    targetSquare: string
  ) => boolean;
}

export default function BoardSection({
  blackTime,
  whiteTime,
  activePlayer,
  capturedByBlack,
  capturedByWhite,
  position,
  boardOrientation,
  lastMove,
  checkSquare,
  moveSquares,
  onSquareClick,
  onPieceDrop,
  isAiThinking
}: BoardSectionProps) {
  const { whiteAdvantage, blackAdvantage } =
  getMaterialDifference(
    capturedByWhite,
    capturedByBlack
  );
  return (
<div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
    {/* Left Side - Timers */}
<div className="flex w-full flex-row justify-between lg:w-36 lg:flex-col lg:self-stretch">
      <TimerCard
        player="Black"
        time={blackTime}
        active={activePlayer === "b"}
      />

      <TimerCard
        player="White"
        time={whiteTime}
        active={activePlayer === "w"}
      />
     

    </div>

    {/* Board */}
<div className="mx-auto w-full max-w-[500px] lg:mx-0">
      <div className="mb-2">
        <CapturedPieces
        title="Black"
  pieces={capturedByBlack}
  advantage={blackAdvantage}
/>

        
      </div>

      

      <ChessBoard
        position={position}
        boardOrientation={boardOrientation}
        lastMove={lastMove}
        checkSquare={checkSquare}
        moveSquares={moveSquares}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
      />

      <div className="mt-2">
        <CapturedPieces
  title="White"
  pieces={capturedByWhite}
  advantage={whiteAdvantage}
/>
      </div>

    </div>

  </div>
)}