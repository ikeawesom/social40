"use server";

import { dbHandler } from "@/src/firebase/db";
import { storageHandler } from "@/src/firebase/storage";
import getCurrentDate from "@/src/utils/helpers/getCurrentDate";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";

export default async function submitPost(
  formData: ANNOUNCEMENT_SCHEMA,
  groups: string[]
) {
  try {
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
      error,
      data: { id },
    } = await dbHandler.addGeneral({
      path: "ANNOUNCEMENTS",
      to_add,
    });
    if (error) throw new Error(error);

    await dbHandler.edit({
      col_name: "ANNOUNCEMENTS",
      id,
      data: {
        announcementID: id,
      },
    });

    return handleResponses({ data: id });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function addMedia(id: string, mediaLinks: string[]) {
  try {
    await dbHandler.edit({
      col_name: "ANNOUNCEMENTS",
      id,
      data: {
        media: mediaLinks,
      },
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function deletePost(id: string, haveMedia: boolean) {
  const res = await dbHandler.delete({ col_name: "ANNOUNCEMENTS", id });
  if (!res.status) return handleResponses({ status: false, error: res.error });
  if (haveMedia) {
    const { error } = await storageHandler.deleteMultiple({
      path: `ANNOUNCEMENTS/${id}`,
    });
    if (error) return handleResponses({ status: false, error });
  }
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
