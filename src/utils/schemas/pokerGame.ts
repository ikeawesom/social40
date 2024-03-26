import { Timestamp } from "firebase/firestore";

export type PokerHandType = {
  player: string;
  hand: string[] | null;
};

export type PokerRoomType = {
  roomCode: string;
  createdBy: string;
  createdOn: Timestamp;
  players: PokerHandType[];
};
