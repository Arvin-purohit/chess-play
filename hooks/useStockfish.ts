import { useEffect, useRef } from "react";
import { StockfishEngine } from "@/lib/StockfishEngine";

export function useStockfish() {
  const engine = useRef<StockfishEngine | null>(null);

  useEffect(() => {
  engine.current = new StockfishEngine();

  console.log("Stockfish engine created");

  return () => {
    engine.current?.terminate();
  };
}, []);

  return engine;
}