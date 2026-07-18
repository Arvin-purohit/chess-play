"use client";

import { useRouter } from "next/navigation";
import HomeScreen from "@/components/HomeScreen";

export default function Home() {
  const router = useRouter();

  return (
    <HomeScreen
      onHumanMode={() => router.push("/human-setup")}
      onComputerMode={() => router.push("/computer-setup")}
    />
  );
}