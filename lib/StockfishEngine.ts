export class StockfishEngine {
  private worker: Worker;
  private ready = false;

  constructor() {
    console.log("🚀 Starting Stockfish...");

    this.worker = new Worker("/stockfish/stockfish-18-lite-single.js");

    this.worker.onmessage = (event) => {
      const message = event.data;

      console.log("ENGINE >", message);

      if (message === "uciok") {
        this.worker.postMessage("isready");
      }

      if (message === "readyok") {
        this.ready = true;
        console.log("✅ Stockfish Ready");
      }
    };

    this.worker.onerror = (e) => {
      console.error("❌ Worker Error", e);
    };

    this.worker.postMessage("uci");
  }

  public setSkill(level: number) {
    this.worker.postMessage(`setoption name Skill Level value ${level}`);
  }

  public getBestMove(
    fen: string,
    depth: number = 12
  ): Promise<string> {
    return new Promise((resolve) => {
      const listener = (event: MessageEvent) => {
        const message = event.data as string;

        console.log("ENGINE >", message);

        if (message.startsWith("bestmove")) {
          this.worker.removeEventListener("message", listener);

          const move = message.split(" ")[1];
          resolve(move);
        }
      };

      this.worker.addEventListener("message", listener);

      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  public terminate() {
    this.worker.terminate();
  }
}