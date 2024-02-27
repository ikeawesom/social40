"use server";

import { dbHandler } from "@/src/firebase/db";
import { PostType } from "./CreateAnnouncementForm";
import getCurrentDate from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";

export default async function submitPost(formData: PostType) {
  const { createdBy, desc, title } = formData;
  const createdOn = getCurrentDate();
  const to_add = {
    title,
    desc,
    createdOn,
    createdBy,
  };

  const res = await dbHandler.addGeneral({ path: "ANNOUNCEMENTS", to_add });
  if (!res.status) return handleResponses({ status: false, error: res.error });
  return handleResponses();
}
