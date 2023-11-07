import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../getCurrentDate";

export type LIKE_SCHEMA = {
  likeID: string;
  activityID: string;
  memberID: string;
  createdOn: Timestamp; // date format
};

export function initLikeObject({ likeID, activityID, memberID }: LIKE_SCHEMA) {
  return {
    likeID,
    activityID,
    memberID,
    createdOn: getCurrentDate(),
  } as LIKE_SCHEMA;
}
