"use client";

import { useEffect , useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { RotateCcw, RotateCw, RefreshCw } from "lucide-react";

export default function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [moveSquares, setMoveSquares] = useState<Record<string, React.CSSProperties>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{
  
  from: string;
  to: string;
} | null>(null);


const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
  "white"
);
const [selectedTime, setSelectedTime] = useState(10);
const [gameStarted, setGameStarted] = useState(false);

const [whiteTime, setWhiteTime] = useState(10 * 60);
const [blackTime, setBlackTime] = useState(10 * 60);


const [activePlayer, setActivePlayer] = useState<"w" | "b">("w");

const [isClockRunning, setIsClockRunning] = useState(true);

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

  const pieceSymbols: Record<string, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
};

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

 
const [pendingPromotion, setPendingPromotion] = useState<{
  from: string;
  to: string;
} | null>(null);
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

function getMoveOptions(square: string) {
  const moves = game.moves({
    square: square as any,
    verbose: true,
  });

  if (moves.length === 0) {
    setMoveSquares({});
    return false;
  }

  const newSquares: Record<string, React.CSSProperties> = {};

  moves.forEach((move) => {
    newSquares[move.to] = {
      background:
        game.get(move.to as any) &&
        game.get(move.to as any)?.color !== game.get(square as any)?.color
          ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
          : "radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)",
      borderRadius: "50%",
    };
  });

  setMoveSquares(newSquares);
  return true;
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
    const gameCopy = new Chess();

    game.history().forEach((move) => {
      gameCopy.move(move);
    });

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion,
    });

    if (move === null) {
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
  }
}, [game]);

useEffect(() => {
  if (!isClockRunning) return;

  const interval = setInterval(() => {
    if (activePlayer === "w") {
      setWhiteTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWinnerByTime("b");
          setIsClockRunning(false);
          return 0;
        }

        return prev - 1;
      });
    } else {
      setBlackTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWinnerByTime("w");
          setIsClockRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }
  }, 1000);

  return () => clearInterval(interval);
}, [activePlayer, isClockRunning]);


function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

let checkSquare: string | undefined;

if (game.inCheck()) {
  const board = game.board();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];

      if (
        piece &&
        piece.type === "k" &&
        piece.color === game.turn()
      ) {
        checkSquare = String.fromCharCode(97 + col) + (8 - row);
      }
    }
  }
}

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
  return (
<main className="min-h-screen bg-zinc-950 px-4 py-6">
  <div className="mx-auto max-w-[900px]">

 {/* Header */}
<div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl">

  <div className="flex items-center justify-between">

    <div>
      <h1 className="text-3xl font-bold tracking-wide text-white">
        ♟ Chess Arena
      </h1>

      <p className="mt-1 text-sm text-zinc-400">
        {game.turn() === "w"
          ? "⚪ White to move"
          : "⚫ Black to move"}
      </p>
    </div>

    <div className="flex gap-10 text-center">

      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Check
        </p>

        <p
          className={`mt-1 font-semibold ${
            game.inCheck()
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {game.inCheck() ? "YES" : "NO"}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Checkmate
        </p>

        <p
          className={`mt-1 font-semibold ${
            game.isCheckmate()
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {game.isCheckmate() ? "YES" : "NO"}
        </p>
      </div>

    </div>

  </div>

  {gameResult && (
    <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">

      <p className="text-xs uppercase tracking-widest text-red-400">
        Game Over
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {gameResult}
      </p>

    </div>
  )}

</div>

    {/* Game area */}
    <div className="flex items-start gap-4">

      {/* Chessboard */}
      <div className="w-full max-w-[500px]">
       <div
  className={`mb-4 rounded-2xl border p-5 transition-all duration-300 ${
    activePlayer === "b"
      ? "border-emerald-500 bg-zinc-900 shadow-xl shadow-emerald-500/20"
      : "border-zinc-800 bg-zinc-900"
  }`}
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        ⚫ BLACK
      </p>

      <p className="mt-3 font-mono text-5xl font-bold text-white">
        {formatTime(blackTime)}
      </p>
    </div>

    {activePlayer === "b" && (
      <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
        ACTIVE
      </div>
    )}
  </div>
</div>


        <div className="mb-2 flex min-h-8 items-center gap-1 text-2xl text-white">
  <span className="mr-2 text-sm text-zinc-400">Black captured:</span>

  {capturedByBlack.length === 0 ? (
    <span className="text-sm text-zinc-600">None</span>
  ) : (
    capturedByBlack.map((piece, index) => (
      <span key={index}>{pieceSymbols[piece]}</span>
    ))
  )}
</div>


        <Chessboard

options={{
   boardOrientation: boardOrientation,
  position: game.fen(),
     

            onSquareClick: ({ square }) => {
              if (!selectedSquare) {
                const hasMoves = getMoveOptions(square);

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

              const hasMoves = getMoveOptions(square);

              if (hasMoves) {
                setSelectedSquare(square);
              } else {
                setSelectedSquare(null);
                setMoveSquares({});
              }
              
            },
            
            
           squareStyles: {
  ...(lastMove && {
    [lastMove.from]: {
      background: "rgba(255, 255, 0, 0.35)",
    },
    [lastMove.to]: {
      background: "rgba(255, 255, 0, 0.35)",
    },
  }),

  ...(checkSquare && {
    [checkSquare]: {
      background: "rgba(255, 0, 0, 0.45)",
      borderRadius: "50%",
    },
  }),

  ...moveSquares,
},

            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!targetSquare) return false;

              return makeMove(sourceSquare, targetSquare);
            },
          }}
        />

     <div
  className={`mt-4 rounded-2xl border p-5 transition-all duration-300 ${
    activePlayer === "w"
      ? "border-emerald-500 bg-zinc-900 shadow-xl shadow-emerald-500/20"
      : "border-zinc-800 bg-zinc-900"
  }`}
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        ⚪ WHITE
      </p>

      <p className="mt-3 font-mono text-5xl font-bold text-white">
        {formatTime(whiteTime)}
      </p>
    </div>

    {activePlayer === "w" && (
      <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
        ACTIVE
      </div>
    )}
  </div>
</div>

        <div className="mt-2 flex min-h-8 items-center gap-1 text-2xl text-white">
  <span className="mr-2 text-sm text-zinc-400">White captured:</span>

  {capturedByWhite.length === 0 ? (
    <span className="text-sm text-zinc-600">None</span>
  ) : (
    capturedByWhite.map((piece, index) => (
      <span key={index}>{pieceSymbols[piece]}</span>
    ))
  )}
</div>
      </div>

      {/* Move History */}
      <div className="h-[500px] w-[300px] overflow-y-auto rounded-lg bg-zinc-900 p-4 text-white">
  <div className="mb-4 flex items-center justify-between">
  <h2 className="text-lg font-semibold">Move History</h2>

    <div className="flex gap-2">
    <button
      onClick={undoMove}
      disabled={moveHistory.length === 0}
      className="cursor-pointer rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Undo
    </button>

    <button
    onClick={() =>
      setBoardOrientation((prev) =>
        prev === "white" ? "black" : "white"
      )
    }
    className="rounded-lg bg-zinc-800 p-3 hover:bg-zinc-700"
    title="Flip Board"
  >
    <RefreshCw size={18} />
  </button>

  <button
    onClick={resetGame}
    className="cursor-pointer rounded-md bg-zinc-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-600"
  >
    New Game
  </button>
</div>
</div>

  {moveHistory.length === 0 ? (
    <p className="text-sm text-zinc-500">No moves yet</p>
  ) : (
    <div className="space-y-2">
      {Array.from({
        length: Math.ceil(moveHistory.length / 2),
      }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[30px_1fr_1fr] gap-2 text-sm"
        >
          <span className="text-zinc-500">
            {index + 1}.
          </span>

          <span>
            {moveHistory[index * 2] || ""}
          </span>

          <span>
            {moveHistory[index * 2 + 1] || ""}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  </div>

  {pendingPromotion && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="rounded-xl bg-zinc-900 p-6 text-white shadow-2xl">
      <h2 className="mb-4 text-center text-lg font-semibold">
        Promote your pawn
      </h2>

    

      <div className="flex gap-3">
        {[
          { type: "q" as const, symbol: "♛", label: "Queen" },
          { type: "r" as const, symbol: "♜", label: "Rook" },
          { type: "b" as const, symbol: "♝", label: "Bishop" },
          { type: "n" as const, symbol: "♞", label: "Knight" },
        ].map((piece) => (
          <button
            key={piece.type}
            onClick={() =>
              makeMove(
                pendingPromotion.from,
                pendingPromotion.to,
                piece.type,
              )
            }
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg bg-zinc-800 transition hover:bg-zinc-700"
          >
            <span className="text-4xl">{piece.symbol}</span>
            <span className="mt-1 text-xs text-zinc-400">
              {piece.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
)}
</main>
  );
}