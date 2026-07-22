interface CapturedPiecesProps {
  title: "White" | "Black";
  pieces: string[];
  advantage: number;
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
  advantage,
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
      {advantage > 0 && (
  <span className="ml-2 text-sm font-semibold text-zinc-400">
    +{advantage}
  </span>
)}
    </div>
  );
}
const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
} as const;

export function getMaterialDifference(
  capturedByWhite: string[],
  capturedByBlack: string[],
) {
  const whiteMaterial = capturedByWhite.reduce(
    (sum, piece) => sum + (PIECE_VALUES[piece as keyof typeof PIECE_VALUES] ?? 0),
    0
  );

  const blackMaterial = capturedByBlack.reduce(
    (sum, piece) => sum + (PIECE_VALUES[piece as keyof typeof PIECE_VALUES] ?? 0),
    0
  );

  return {
    whiteAdvantage: Math.max(0, whiteMaterial - blackMaterial),
    blackAdvantage: Math.max(0, blackMaterial - whiteMaterial),
  };
}