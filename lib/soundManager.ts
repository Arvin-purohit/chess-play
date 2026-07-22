let sounds: Record<string, HTMLAudioElement> | null = null;

function getSounds() {
  if (!sounds) {
    sounds = {
      move: new Audio("/sounds/move.mp3"),
      capture: new Audio("/sounds/capture.mp3"),
      check: new Audio("/sounds/check.mp3"),
      win: new Audio("/sounds/win.mp3"),
lose: new Audio("/sounds/lose.mp3"),
draw: new Audio("/sounds/draw.mp3"),
    };

    Object.values(sounds).forEach((sound) => {
      sound.preload = "auto";
      sound.load();
    });
  }

  return sounds;
}

export function playSound(
  type: "move" | "capture" | "check" | "win"
  | "lose"
  | "draw"
) {
  if (typeof window === "undefined") return;

  console.log("🔊 Playing sound:", type);

  const sound = getSounds()[type];
  sound.currentTime = 0;
  sound.play().catch((err) => {
    console.error("Sound error:", err);
  });
}