"use client";

import { useEffect , useState } from "react";
import { Chess } from "chess.js";
import GameHeader from "@/components/GameHeader";
import GameSidebar from "@/components/GameSideBar";
import PromotionModal from "@/components/PromotionModel";
import { formatTime } from "@/lib/time";
import GameResultPopup from "@/components/GameResultPopup";
import { getCheckSquare } from "@/lib/chessHelpers";
import { useChessClock } from "@/hooks/useChessClock";
import {
  makeChessMove,
  getMoveOptions,
} from "@/lib/chessGame";
import { useChessGame } from "@/hooks/useChessGame";
import NewGameDialog from "@/components/NewGameDialog";
import BoardSection from "@/components/BoardSection";

export default function Home() {
const {
  game,
  setGame,

  selectedSquare,
  setSelectedSquare,

  moveSquares,
  setMoveSquares,

  lastMove,
  setLastMove,

  pendingPromotion,
  setPendingPromotion,
} = useChessGame();

const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
  "white"
);
const [selectedTime, setSelectedTime] = useState(10);
const [gameStarted, setGameStarted] = useState(false);

const [whiteTime, setWhiteTime] = useState(10 * 60);
const [blackTime, setBlackTime] = useState(10 * 60);


const [activePlayer, setActivePlayer] = useState<"w" | "b">("w");

const [isClockRunning, setIsClockRunning] = useState(true);

const [showResultPopup, setShowResultPopup] = useState(false);

const [winnerByTime, setWinnerByTime] =
  useState<"w" | "b" | null>(null);

const moveHistory = game.history();

const verboseHistory = game.history({ verbose: true });

const capturedByWhite = verboseHistory
  .filter((move) => move.color === "w" && move.captured)
  .map((move) => move.captured!);

const capturedByBlack = verboseHistory
  .filter((move) => move.color === "b" && move.captured)
  .map((move) => move.captured!);

const [showNewGameDialog, setShowNewGameDialog] = useState(false);  

const winner = game.isCheckmate()
  ? game.turn() === "w"
    ? "Black"
    : "White"
  : null;

  const isDraw = game.isDraw();
  

let gameResult: string | null = null;

if (winnerByTime) {
  gameResult =
    winnerByTime === "w"
      ? "White wins on time!"
      : "Black wins on time!";
} else if (game.isCheckmate()) {
  gameResult = `${winner} wins by checkmate!`;
} else if (game.isStalemate()) {
  gameResult = "Draw by stalemate";
} else if (game.isThreefoldRepetition()) {
  gameResult = "Draw by threefold repetition";
} else if (game.isInsufficientMaterial()) {
  gameResult = "Draw by insufficient material";
} else if (isDraw) {
  gameResult = "Draw";
}

 

function resetGame() {
  const newGame = new Chess();

  setGame(newGame);

  setSelectedSquare(null);
  setMoveSquares({});
  setLastMove(null);
  setPendingPromotion(null);

  const initialSeconds = selectedTime * 60;

  setWhiteTime(initialSeconds);
  setBlackTime(initialSeconds);

  setActivePlayer("w");
  setWinnerByTime(null);
  setIsClockRunning(true);

  // Return to the time selection screen
  setGameStarted(false);
}

function startGame() {
  const initialSeconds = selectedTime * 60;

  setWhiteTime(initialSeconds);
  setBlackTime(initialSeconds);

  setActivePlayer("w");
  setWinnerByTime(null);
  setIsClockRunning(true);

  setGameStarted(true);
}

function undoMove() {
  const history = game.history({ verbose: true });

  if (history.length === 0) {
    return;
  }

  // Remove the latest move
  const remainingMoves = history.slice(0, -1);

  // Create a fresh game and replay all remaining moves
  const newGame = new Chess();

  remainingMoves.forEach((move) => {
    newGame.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    });
  });

  setGame(newGame);

  // Update last-move highlight
  const previousMove = remainingMoves[remainingMoves.length - 1];

  if (previousMove) {
    setLastMove({
      from: previousMove.from,
      to: previousMove.to,
    });
  } else {
    setLastMove(null);
  }

  // Clear any active selections
  setSelectedSquare(null);
  setMoveSquares({});
  setPendingPromotion(null);
}

function showMoveOptions(square: string) {
  const squares = getMoveOptions(game, square);

setMoveSquares(squares);

return Object.keys(squares).length > 0;
}
  function makeMove(
  sourceSquare: string,
  targetSquare: string,
  promotion?: "q" | "r" | "b" | "n",
) {
  const piece = game.get(sourceSquare as any);

  const isPromotion =
    piece?.type === "p" &&
    ((piece.color === "w" && targetSquare.endsWith("8")) ||
      (piece.color === "b" && targetSquare.endsWith("1")));

  if (isPromotion && !promotion) {
    setPendingPromotion({
      from: sourceSquare,
      to: targetSquare,
    });

    return false;
  }

  try {
   const gameCopy = makeChessMove({
  game,
  sourceSquare,
  targetSquare,
  promotion,
});

if (!gameCopy) {
  return false;
}

    setGame(gameCopy);

    // Switch the chess clock to the next player
setActivePlayer(gameCopy.turn());


    setLastMove({
      from: sourceSquare,
      to: targetSquare,
    });

    setSelectedSquare(null);
    setMoveSquares({});
    setPendingPromotion(null);

    return true;
  } catch {
    return false;
  }
}

useEffect(() => {
  if (game.isGameOver()) {
    setIsClockRunning(false);
    setShowResultPopup(true);
  }
}, [game]);

useEffect(() => {
  if (winnerByTime) {
    setShowResultPopup(true);
  }
}, [winnerByTime]);

useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    // Ctrl + Z
    if (event.ctrlKey && event.key.toLowerCase() === "z") {
      event.preventDefault();

      if (moveHistory.length > 0) {
        undoMove();
      }

      return;
    }

    // Flip board
    if (event.key.toLowerCase() === "f") {
      setBoardOrientation((prev) =>
        prev === "white" ? "black" : "white"
      );

      return;
    }

    // New Game
    if (event.key.toLowerCase() === "n") {
      setShowNewGameDialog(true);
      return;
    }

    // Escape
    if (event.key === "Escape") {
      setShowResultPopup(false);
      setShowNewGameDialog(false);
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () =>
    window.removeEventListener("keydown", handleKeyDown);
}, [moveHistory]);

useChessClock({
  activePlayer,
  isClockRunning,
  setWhiteTime,
  setBlackTime,
  setWinnerByTime,
  setIsClockRunning,
});



const checkSquare = getCheckSquare(game);

if (!gameStarted) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-4xl rounded-2xl bg-zinc-900 p-8 shadow-2xl">

        <h1 className="mb-2 text-center text-5xl font-bold text-white">
          ♟ Chess Arena
        </h1>
        <p className="mb-8 text-center text-zinc-400">
    Choose your battle
</p>

        <p className="mb-8 text-center text-zinc-400">
          Choose your time control
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

          {[
            { title: "Bullet", time: 1 },
            { title: "Blitz", time: 3 },
            { title: "Blitz", time: 5 },
            { title: "Rapid", time: 10 },
            { title: "Rapid", time: 15 },
            { title: "Rapid", time: 30 },
          ].map((item) => (
            <button
              key={item.time}
              onClick={() => setSelectedTime(item.time)}
             className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
  selectedTime === item.time
    ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/30"
    : "border-zinc-700 bg-zinc-800 hover:border-zinc-500 hover:bg-zinc-700"
}`}
            >
             <div className="flex items-center justify-center gap-2 text-zinc-400">
    <span className="text-lg">⚡</span>

    <span className="text-sm uppercase tracking-widest">
        {item.title}
    </span>
</div>

              <p className="mt-2 text-4xl font-bold text-white">
                {item.time} min

              </p>
              {selectedTime === item.time && (
    <p className="mt-3 text-sm font-semibold text-green-400">
        ✓ Selected
    </p>
)}
            </button>
          ))}

        </div>

        <button
          onClick={startGame}
className="
mt-8
w-full
rounded-2xl
bg-gradient-to-r
from-green-600
to-green-500
py-4
text-xl
font-bold
text-white
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-xl
hover:shadow-green-500/40
active:scale-95
"        >
          Start Game
        </button>

      </div>
    </main>
  );
}

let popupTitle = "";
let popupSubtitle = "";
let popupEmoji = "🏆";

if (winnerByTime) {
  popupTitle = winnerByTime === "w" ? "White Wins!" : "Black Wins!";
  popupSubtitle = "Won on Time";
  popupEmoji = "⏰";
} else if (game.isCheckmate()) {
  popupTitle = winner === "White" ? "White Wins!" : "Black Wins!";
  popupSubtitle = "By Checkmate";
  popupEmoji = "🏆";
} else if (game.isStalemate()) {
  popupTitle = "Draw";
  popupSubtitle = "By Stalemate";
  popupEmoji = "🤝";
} else if (game.isThreefoldRepetition()) {
  popupTitle = "Draw";
  popupSubtitle = "Threefold Repetition";
  popupEmoji = "🤝";
} else if (game.isInsufficientMaterial()) {
  popupTitle = "Draw";
  popupSubtitle = "Insufficient Material";
  popupEmoji = "🤝";
} else if (game.isDraw()) {
  popupTitle = "Draw";
  popupSubtitle = "Game Drawn";
  popupEmoji = "🤝";
}
  return (
<main className="min-h-screen bg-zinc-950 px-4 py-6">
  <div className="mx-auto max-w-7xl">

 {/* Header */}

 <GameHeader
  turn={game.turn()}
  inCheck={game.inCheck()}
  isCheckmate={game.isCheckmate()}
  gameResult={gameResult}
/>

{/* Game area */}
<div className="flex items-start justify-center gap-8">

  {/* Board Column */}
  
<BoardSection
  blackTime={formatTime(blackTime)}
  whiteTime={formatTime(whiteTime)}
  activePlayer={activePlayer}
  capturedByBlack={capturedByBlack}
  capturedByWhite={capturedByWhite}
  position={game.fen()}
  boardOrientation={boardOrientation}
  lastMove={lastMove}
  checkSquare={checkSquare}
  moveSquares={moveSquares}
  onSquareClick={(square) => {
    if (!selectedSquare) {
      const hasMoves = showMoveOptions(square);

      if (hasMoves) {
        setSelectedSquare(square);
      }

      return;
    }

    const moved = makeMove(selectedSquare, square);

    if (moved) {
      setSelectedSquare(null);
      setMoveSquares({});
      return;
    }

    const hasMoves = showMoveOptions(square);

    if (hasMoves) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
      setMoveSquares({});
    }
  }}
  onPieceDrop={(sourceSquare, targetSquare) =>
    makeMove(sourceSquare, targetSquare)
  }
/>
  {/* Sidebar */}
  <GameSidebar
    moveHistory={moveHistory}
    canUndo={moveHistory.length > 0}
    onUndo={undoMove}
    onFlip={() =>
      setBoardOrientation((prev) =>
        prev === "white" ? "black" : "white"
      )
    }
    onNewGame={() => setShowNewGameDialog(true)}
  />

</div>
    
  </div>

  <PromotionModal
  isOpen={!!pendingPromotion}
  onSelect={(piece) => {
    if (!pendingPromotion) return;

    makeMove(
      pendingPromotion.from,
      pendingPromotion.to,
      piece
    );
  }}
/>

<GameResultPopup
  isOpen={showResultPopup}
  title={popupTitle}
  subtitle={popupSubtitle}
  emoji={popupEmoji}
  onNewGame={() => {
    setShowResultPopup(false);
    resetGame();
  }}
  onClose={() => setShowResultPopup(false)}
/>
<NewGameDialog
  isOpen={showNewGameDialog}
  onCancel={() => setShowNewGameDialog(false)}
  onConfirm={() => {
    setShowNewGameDialog(false);
    resetGame();
  }}
/>


  
</main>
  );
}