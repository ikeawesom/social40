"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { getSimple } from "../helpers/parser";

export async function getMemberData(id: string) {
  try {
    const { data, error } = await dbHandler.get({ col_name: "MEMBERS", id });
    if (error) throw new Error(error);
    return handleResponses({ data: getSimple(data) });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
