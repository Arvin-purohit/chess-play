"use client";

interface LeaveGameDialogProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export default function LeaveGameDialog({
  isOpen,
  onStay,
  onLeave,
}: LeaveGameDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-2xl">

        <h2 className="text-2xl font-bold text-white">
          Leave Game?
        </h2>

        <p className="mt-3 text-zinc-400">
          Your current game will be lost if you leave.
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onStay}
            className="rounded-lg border border-zinc-700 px-5 py-2 text-white hover:bg-zinc-800"
          >
            Stay
          </button>

          <button
            onClick={onLeave}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Leave
          </button>

        </div>
      </div>
    </div>
  );
}