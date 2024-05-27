"use server";

import { dbHandler } from "@/src/firebase/db";
import getCurrentDate from "@/src/utils/helpers/getCurrentDate";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";

export default async function submitPost(
  formData: ANNOUNCEMENT_SCHEMA,
  groups: string[]
) {
  const { createdBy, desc, title, pin } = formData;
  const createdOn = getCurrentDate();
  const newDesc = desc.split("\n").join("$a");

  const to_add = {
    title,
    desc: newDesc,
    createdOn,
    createdBy,
    groups,
    pin,
  } as ANNOUNCEMENT_SCHEMA;

  const {
    status,
    error,
    data: { id },
  } = await dbHandler.addGeneral({
    path: "ANNOUNCEMENTS",
    to_add,
  });
  if (!status) return handleResponses({ status: false, error });

  await dbHandler.edit({
    col_name: "ANNOUNCEMENTS",
    id,
    data: {
      announcementID: id,
    },
  });

  return handleResponses();
}

export async function deletePost(id: string) {
  const res = await dbHandler.delete({ col_name: "ANNOUNCEMENTS", id });
  if (!res.status) return handleResponses({ status: false, error: res.error });
  return handleResponses();
}

export async function handleSearchGroup(group: string) {
  try {
    const { error } = await dbHandler.get({
      col_name: "GROUPS",
      id: group,
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
