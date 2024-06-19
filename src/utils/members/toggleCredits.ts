"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";

export async function toggleViewCredits(memberID: string) {
  const { error } = await dbHandler.edit({
    col_name: "MEMBERS",
    data: { viewCredits: true },
    id: memberID,
  });
  if (error) return handleResponses({ status: false, error });
  return handleResponses();
}
