interface CapturedPiecesProps {
  title: "White" | "Black";
  pieces: string[];
}

const pieceSymbols: Record<string, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
};

export default function CapturedPieces({
  title,
  pieces,
}: CapturedPiecesProps) {
  return (
    <div className="flex min-h-8 items-center gap-1 text-2xl text-white">
      <span className="mr-2 text-sm text-zinc-400">
        {title} captured:
      </span>

      {pieces.length === 0 ? (
        <span className="text-sm text-zinc-600">
          None
        </span>
      ) : (
        pieces.map((piece, index) => (
          <span key={index}>
            {pieceSymbols[piece]}
          </span>
        ))
      )}
    </div>
  );
}