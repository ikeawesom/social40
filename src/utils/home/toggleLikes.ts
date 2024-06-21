"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { MEMBER_SCHEMA } from "../schemas/members";
import { getSimple } from "../helpers/parser";

export async function getAnnouncementLikes(id: string) {
  try {
    const { data, error } = await dbHandler.get({
      col_name: "ANNOUNCEMENTS",
      id,
    });
    if (error) throw new Error(error);

    const { likes } = data;
    const postLikes = (likes ?? []) as string[];
    if (postLikes.length === 0) return handleResponses({ data: postLikes });

    const promArr = postLikes.map(async (id: string) => {
      const { data, error } = await dbHandler.get({ col_name: "MEMBERS", id });
      if (error) return handleResponses({ status: false, error });
      return handleResponses({ data });
    });

    const resArr = await Promise.all(promArr);

    let res = [] as MEMBER_SCHEMA[];
    for (const item of resArr) {
      if (item.error) throw new Error(error);
      res.push(item.data);
    }
    return handleResponses({ data: getSimple(res) });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message`` });
  }
}

export async function toggleLikes({
  id,
  pathname,
  memberID,
}: {
  id: string;
  pathname?: string;
  memberID: string;
}) {
  try {
    const { data, error: fetchErr } = await dbHandler.get({
      col_name: pathname ?? "ANNOUNCEMENTS",
      id,
    });
    if (fetchErr) throw new Error(fetchErr);

    const { likes } = data;
    let postLikes = (likes ?? []) as string[];
    if (!postLikes.includes(memberID)) {
      postLikes.push(memberID);
    } else {
      postLikes = postLikes.filter((id: string) => id !== memberID);
    }

    const { error } = await dbHandler.edit({
      col_name: pathname ?? `ANNOUNCEMENTS`,
      id,
      data: { likes: postLikes },
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
