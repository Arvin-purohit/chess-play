"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComputerSetup from "@/components/ComputerSetup";

export default function ComputerSetupPage() {
  const router = useRouter();

  const [selectedTime, setSelectedTime] = useState(10);

  const [playerColor, setPlayerColor] = useState<"white" | "black">(
    "white"
  );

  const [difficulty, setDifficulty] = useState(5);

  function startGame() {
    router.push(
      `/game?mode=computer&time=${selectedTime}&color=${playerColor}&difficulty=${difficulty}`
    );
  }

  return (
    <ComputerSetup
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      playerColor={playerColor}
      setPlayerColor={setPlayerColor}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      onStartGame={startGame}
      onBack={() => router.push("/")}
    />
  );
}