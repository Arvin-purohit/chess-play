"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { useStockfish } from "@/hooks/useStockfish";
import { playComputerMove } from "@/hooks/useComputerPlayer";
import { AI_DIFFICULTY } from "@/lib/aiDifficulty";

import { playSound } from "@/lib/soundManager";

import { getGameResult } from "@/lib/gameResult";
export default function GamePage() {

  
   const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "human";

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

const stockfish = useStockfish();

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
  const moveNumber = Math.ceil(moveHistory.length / 2);

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

const [isAiThinking, setIsAiThinking] = useState(false);
const aiMoveTimeout = useRef<NodeJS.Timeout | null>(null);
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
useEffect(() => {
  return () => {
    if (aiMoveTimeout.current) {
      clearTimeout(aiMoveTimeout.current);
    }
  };
}, []);

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ctrl + Z -> Undo
    if (event.ctrlKey && event.key.toLowerCase() === "z") {
      event.preventDefault();

      if (moveHistory.length > 0 && !game.isGameOver()) {
        undoMove();
      }
    }

    // F -> Flip board
    if (event.key.toLowerCase() === "f") {
      setBoardOrientation((prev) =>
        prev === "white" ? "black" : "white"
      );
    }

    // Escape -> Close dialogs
    if (event.key === "Escape") {
      setShowLeaveDialog(false);
      setShowNewGameDialog(false);
      setShowResultPopup(false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [
  moveHistory.length,
  game,
  undoMove,
]);


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
if (aiMoveTimeout.current) {
    clearTimeout(aiMoveTimeout.current);
    aiMoveTimeout.current = null;
}

}
function undoMove() {
  const history = game.history({ verbose: true });
if (aiMoveTimeout.current) {
    clearTimeout(aiMoveTimeout.current);
    aiMoveTimeout.current = null;
}
  if (history.length === 0) return;

  let movesToRemove = 1;

  if (mode === "computer") {
    if (history.length < 2) return;

    movesToRemove = 2;
  }

  const remainingMoves = history.slice(0, -movesToRemove);

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

  setActivePlayer(newGame.turn());

  setIsAiThinking(false);

  if (!newGame.isGameOver()) {
    setShowResultPopup(false);
  }

  setWinnerByTime(null);
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
  if (isAiThinking) {
  return false;
}
  const piece = game.get(sourceSquare as any);

  const isPromotion =
    piece?.type === "p" &&
    ((piece.color === "w" && targetSquare.endsWith("8")) ||
      (piece.color === "b" && targetSquare.endsWith("1")));

      if (game.isGameOver() || winnerByTime) {
  return false;
}

  if (isPromotion && !promotion) {
    setPendingPromotion({
      from: sourceSquare,
      to: targetSquare,
    });

    return false;
  }

  try {
    const result = makeChessMove({
      game,
      sourceSquare,
      targetSquare,
      promotion,
    });

    if (!result) {
      return false;
    }
const { game: gameCopy, move } = result;
if (move.captured) {
  playSound("capture");
} else {
  playSound("move");
}

if (gameCopy.inCheck()) {
  playSound("check");
}
    setGame(gameCopy);

    if (
  mode === "computer" &&
  !gameCopy.isGameOver()
) {

setIsAiThinking(true);

  const settings = AI_DIFFICULTY[difficulty];

aiMoveTimeout.current = setTimeout(() => {
  void playComputerMove({
    engine: stockfish,
    difficulty,
    game: gameCopy,
    setGame,
    setLastMove,
    setActivePlayer,
    setIsAiThinking,
  });
}, settings.thinkingTime);
  
}



   

    setActivePlayer(gameCopy.turn());
console.log("👤 Human lastMove");
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
  <main className="min-h-screen bg-zinc-950 px-4 py-3">
   <div className="mx-auto flex h-[calc(100vh-24px)] max-w-7xl flex-col">



     <GameHeader
  turn={game.turn()}
  inCheck={game.inCheck()}
  isCheckmate={game.isCheckmate()}
  gameResult={gameResult}
  mode={mode}
  moveNumber={moveNumber}
  onBack={() => {
    setPendingNavigation(() => () => router.push("/"));
    setShowLeaveDialog(true);
  }}
/>
     

<div className="flex flex-1 items-start justify-center gap-6">
        <BoardSection
        isAiThinking={isAiThinking}
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
            if (game.isGameOver() || winnerByTime) return;
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
          onPieceDrop={(sourceSquare, targetSquare) => {
  if (game.isGameOver() || winnerByTime) {
    return false;
  }

  return makeMove(sourceSquare, targetSquare);
}}
        />

        <GameSidebar
          moveHistory={moveHistory}
        canUndo={
  moveHistory.length > 0 &&
  !game.isGameOver() &&
  !isAiThinking
}
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
        setShowNewGameDialog(false);
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

<footer className="mt-3 border-t border-zinc-800 pt-2">
  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
    <span className="font-semibold text-zinc-300">
      ⌨ Shortcuts
    </span>

    <span>
      <kbd className="rounded bg-zinc-800 px-2 py-1">Ctrl + Z</kbd>
      <span className="ml-2">Undo</span>
    </span>

    <span>
      <kbd className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-semibold text-white shadow-sm">F</kbd>
      <span className="ml-2">Flip Board</span>
    </span>

    <span>
      <kbd className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-semibold text-white shadow-sm">Esc</kbd>
      <span className="ml-2">Close Dialog</span>
    </span>
  </div>
</footer>
    
  </main>
);
}