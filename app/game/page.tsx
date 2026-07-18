"use client";

import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import GameHeader from "@/components/GameHeader";
import BoardSection from "@/components/BoardSection";
import GameSidebar from "@/components/GameSideBar";
import PromotionModal from "@/components/PromotionModel";
import GameResultPopup from "@/components/GameResultPopup";
import NewGameDialog from "@/components/NewGameDialog";
import { useChessGame } from "@/hooks/useChessGame";
import { useChessClock } from "@/hooks/useChessClock";
import { formatTime } from "@/lib/time";
import { getCheckSquare } from "@/lib/chessHelpers";
import { makeChessMove, getMoveOptions } from "@/lib/chessGame";

import { useSearchParams, useRouter } from "next/navigation";

import LeaveGameDialog from "@/components/LeaveGameDialog";


export default function GamePage() {

    function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
   const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") as
    | "human"
    | "computer"
    | null;

  const time = Number(searchParams.get("time") ?? 10);

  const [showLeaveDialog, setShowLeaveDialog] =
  useState(false);

const [pendingNavigation, setPendingNavigation] =
  useState<(() => void) | null>(null);

  const color = (searchParams.get("color") ?? "white") as
    | "white"
    | "black";

  const difficulty = Number(
    searchParams.get("difficulty") ?? 5
  );

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

  const [whiteTime, setWhiteTime] = useState(time * 60);
  const [blackTime, setBlackTime] = useState(time * 60);
  const [activePlayer, setActivePlayer] =
    useState<"w" | "b">("w");
  const [isClockRunning, setIsClockRunning] =
    useState(true);
  const [winnerByTime, setWinnerByTime] =
    useState<"w" | "b" | null>(null);

    const [boardOrientation, setBoardOrientation] =
  useState<"white" | "black">(
    color === "black" ? "black" : "white"
  );

const [showResultPopup, setShowResultPopup] =
  useState(false);

const [showNewGameDialog, setShowNewGameDialog] =
  useState(false);
  useChessClock({
    activePlayer,
    isClockRunning,
    setWhiteTime,
    setBlackTime,
    setWinnerByTime,
    setIsClockRunning,
  });
  const moveHistory = useMemo(() => game.history(), [game]);

const verboseHistory = useMemo(
  () => game.history({ verbose: true }),
  [game]
);

const checkSquare = useMemo(
  () => getCheckSquare(game),
  [game]
);
const capturedByWhite = useMemo(() => {
  return verboseHistory
    .filter((move) => move.captured)
    .filter((move) => move.color === "w")
    .map((move) => move.captured!);
}, [verboseHistory]);

const capturedByBlack = useMemo(() => {
  return verboseHistory
    .filter((move) => move.captured)
    .filter((move) => move.color === "b")
    .map((move) => move.captured!);
}, [verboseHistory]);

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

let popupTitle = "";
let popupSubtitle = "";
let popupEmoji = "🏆";

if (winnerByTime) {
  popupTitle =
    winnerByTime === "w"
      ? "White Wins!"
      : "Black Wins!";
  popupSubtitle = "Won on Time";
  popupEmoji = "⏰";
} else if (game.isCheckmate()) {
  popupTitle =
    winner === "White"
      ? "White Wins!"
      : "Black Wins!";
  popupSubtitle = "By Checkmate";
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
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);

function resetGame() {
  const newGame = new Chess();

  setGame(newGame);

  setSelectedSquare(null);
  setMoveSquares({});
  setLastMove(null);
  setPendingPromotion(null);

  setWhiteTime(time * 60);
  setBlackTime(time * 60);

  setActivePlayer("w");
  setWinnerByTime(null);
  setIsClockRunning(true);

setPendingNavigation(() => () => router.push("/"));
setShowLeaveDialog(true);
}

function undoMove() {
  const history = game.history({ verbose: true });

  if (history.length === 0) return;

  const remainingMoves = history.slice(0, -1);

  const newGame = new Chess();

  remainingMoves.forEach((move) => {
    newGame.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    });
  });

  setGame(newGame);

  const previousMove =
    remainingMoves[remainingMoves.length - 1];

  if (previousMove) {
    setLastMove({
      from: previousMove.from,
      to: previousMove.to,
    });
  } else {
    setLastMove(null);
  }

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
  
  return (
  <main className="min-h-screen bg-zinc-950 px-4 py-6">
    <div className="mx-auto max-w-7xl">

<button
  onClick={() => {
    setPendingNavigation(() => () => router.push("/"));
    setShowLeaveDialog(true);
  }}
  className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
>
  ← Back to Home
</button>
<div className="mb-4 flex items-center justify-between">
  <div className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white">
    {mode === "human" ? "👥 Human vs Human" : "🤖 Human vs Computer"}
  </div>

  {mode === "computer" && (
    <div className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
      🤖 Level {difficulty}
    </div>
  )}
</div>
      <GameHeader
        turn={game.turn()}
        inCheck={game.inCheck()}
        isCheckmate={game.isCheckmate()}
        gameResult={gameResult}
      />

      <div className="flex items-start justify-center gap-8">

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

        <GameSidebar
          moveHistory={moveHistory}
          canUndo={moveHistory.length > 0}
          onUndo={undoMove}
          onFlip={() =>
            setBoardOrientation((prev) =>
              prev === "white" ? "black" : "white"
            )
          }
          onNewGame={() =>
            setShowNewGameDialog(true)
          }
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
      onCancel={() =>
        setShowNewGameDialog(false)
      }
      onConfirm={() => {
        setShowNewGameDialog(false);
        resetGame();
      }}
    />
     
     <LeaveGameDialog
  isOpen={showLeaveDialog}
  onStay={() => {
    setShowLeaveDialog(false);
    setPendingNavigation(null);
  }}
  onLeave={() => {
    setShowLeaveDialog(false);

    if (pendingNavigation) {
      pendingNavigation();
    }
  }}
/>
    
  </main>
);
}