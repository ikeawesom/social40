"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { FeedbackDetailsType } from "@/src/contexts/FeedbackContext";
import { NOTIFS_SCHEMA } from "../schemas/notifs";
import getCurrentDate from "../helpers/getCurrentDate";

export interface FeedbackDBType extends FeedbackDetailsType {
  memberID: string;
}

export async function confirmFeedback({
  desc,
  memberID,
  rating,
}: FeedbackDBType) {
  try {
    rating = rating + 1;
    // toggle member feedback
    const { error } = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: { feedback: true },
    });
    if (error) throw new Error(error);

    // add to DB
    const { error: addErr } = await dbHandler.add({
      col_name: "FEEDBACK",
      id: memberID,
      to_add: { rating, desc },
    });
    if (addErr) throw new Error(addErr);

    // add to owner's notifs
    const notifData = {
      date: getCurrentDate(),
      desc: `${memberID} has given Social40 ${rating} ${
        rating > 1 ? "stars" : "star"
      }.`,
      title: "Social40 Feedback",
    } as NOTIFS_SCHEMA;

    const { error: notifErr } = await dbHandler.addGeneral({
      path: "MEMBERS/stallion-ike/NOTIFS",
      to_add: notifData,
    });
    if (notifErr) throw new Error(notifErr);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err });
  }
}
