"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieStore = cookies();

export async function setGameToken(memberID: string) {
  cookieStore.set("token", memberID);
  revalidatePath("/game", "layout");
  redirect("/game");
}

export async function removeGameToken() {
  cookieStore.delete("token");
}
