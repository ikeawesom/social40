"use server";

import { dbHandler } from "@/src/firebase/db";
import { PostType } from "./CreateAnnouncementForm";
import getCurrentDate from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";

export default async function submitPost(formData: PostType) {
  const { createdBy, desc, title } = formData;
  const createdOn = getCurrentDate();
  const newDesc = desc.split("\n").join("$a");
  const to_add = {
    title,
    desc: newDesc,
    createdOn,
    createdBy,
  };

  const res = await dbHandler.addGeneral({ path: "ANNOUNCEMENTS", to_add });
  if (!res.status) return handleResponses({ status: false, error: res.error });

  await dbHandler.edit({
    col_name: "ANNOUNCEMENTS",
    id: res.data.id,
    data: {
      announcementID: res.data.id,
    },
  });

  return handleResponses();
}

export async function deletePost(id: string) {
  const res = await dbHandler.delete({ col_name: "ANNOUNCEMENTS", id });
  if (!res.status) return handleResponses({ status: false, error: res.error });
  return handleResponses();
}
