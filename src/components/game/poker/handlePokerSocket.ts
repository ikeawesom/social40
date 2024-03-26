"use server";

import { dbHandler } from "@/src/firebase/db";
import getCurrentDate from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";
import { PokerRoomType } from "@/src/utils/schemas/pokerGame";

export async function createRoom(memberID: string) {
  try {
    // get current rooms
    const res = await dbHandler.getDocs({ col_name: "GAME-POKER" });
    const roomLists = res.data as string[];

    // create room codes
    let roomCode;
    roomCode = generateRoomCode();
    while (roomLists.includes(roomCode)) {
      roomCode = generateRoomCode();
    }

    const to_add = {
      roomCode,
      createdBy: memberID,
      createdOn: getCurrentDate(),
      players: [
        {
          player: memberID,
          hand: null,
        },
      ],
    } as PokerRoomType;

    await dbHandler.add({
      col_name: "GAME-POKER",
      id: roomCode,
      to_add,
    });

    return handleResponses({ data: to_add });
  } catch (err: any) {
    return handleResponses({ status: false, err: err });
  }
}

export async function joinRoom(member: string, code: string) {
  try {
    // check if room exists
    const res = await dbHandler.get({ col_name: "GAME-POKER", id: code });
    if (!res.status) throw new Error(res.error);

    // push player to room
    const roomData = res.data as PokerRoomType;
    const curPlayers = roomData.players;
    curPlayers.push({
      hand: null,
      player: member,
    });

    // add data back to room
    const resA = await dbHandler.edit({
      col_name: "GAME-POKER",
      id: code,
      data: {
        players: curPlayers,
      },
    });

    if (!resA.status) throw new Error(resA.error);

    // re-fetch data
    const resB = await dbHandler.get({ col_name: "GAME-POKER", id: code });
    if (!resB.status) throw new Error(resB.error);

    return handleResponses({ data: resB.data });
  } catch (err: any) {
    if ("not found" in err)
      return handleResponses({
        status: false,
        error: "Invalid room code entered",
      });
    return handleResponses({ status: false, error: err.message });
  }
}
function generateRoomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let roomCode = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }

  return roomCode;
}
