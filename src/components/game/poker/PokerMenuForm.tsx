import { useState } from "react";
import PrimaryButton from "../../utils/PrimaryButton";
import SecondaryButton from "../../utils/SecondaryButton";
import { usePokerState } from "@/src/contexts/PokerContext";
import { createRoom, joinRoom } from "./handlePokerSocket";
import { toast } from "sonner";

export function PokerMenuForm() {
  const [roomCode, setRoomCode] = useState("");
  const { gameState, setGameState } = usePokerState();

  const handleCreateRoom = async () => {
    if (gameState !== null) {
      try {
        const res = await createRoom(gameState.curPlayer);
        if (!res.status) throw new Error(res.error);
        setGameState({
          ...gameState,
          gameStage: "create",
          room: res.data,
        });
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleJoinRoom = async () => {
    if (gameState !== null) {
      try {
        const res = await joinRoom(gameState.curPlayer, roomCode);
        console.log(res);
        if (!res.status) throw new Error(res.error);
        setGameState({
          ...gameState,
          gameStage: "create",
          room: res.data,
        });
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <PrimaryButton onClick={handleCreateRoom}>Create Game</PrimaryButton>
      <form className="w-full flex flex-wrap gap-2">
        <input
          value={roomCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRoomCode(e.target.value);
          }}
          placeholder="Enter room code"
        />
        <SecondaryButton onClick={handleJoinRoom} className="w-fit">
          Join
        </SecondaryButton>
      </form>
    </div>
  );
}
