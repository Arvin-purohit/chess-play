"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HumanSetup from "@/components/HumanSetup";

export default function HumanSetupPage() {
  const router = useRouter();

  const [selectedTime, setSelectedTime] = useState(10);

  function startGame() {
    router.push(`/game?mode=human&time=${selectedTime}`);
  }

  return (
    <HumanSetup
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      onStartGame={startGame}
      onBack={() => router.push("/")}
    />
  );
}