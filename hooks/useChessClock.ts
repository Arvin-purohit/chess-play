import { useEffect } from "react";

interface UseChessClockProps {
  activePlayer: "w" | "b";
  isClockRunning: boolean;
  setWhiteTime: React.Dispatch<React.SetStateAction<number>>;
  setBlackTime: React.Dispatch<React.SetStateAction<number>>;
  setWinnerByTime: React.Dispatch<
    React.SetStateAction<"w" | "b" | null>
  >;
  setIsClockRunning: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export function useChessClock({
  activePlayer,
  isClockRunning,
  setWhiteTime,
  setBlackTime,
  setWinnerByTime,
  setIsClockRunning,
}: UseChessClockProps) {
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
  }, [activePlayer, isClockRunning , setWhiteTime,
  setBlackTime,
  setWinnerByTime,
  setIsClockRunning,]);
}