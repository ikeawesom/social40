import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../helpers/getCurrentDate";

export type ACTIVITY_SCHEMA = {
  activityID: string;
  activityTitle: string;
  activityDesc: string;
  activityType: string; // type of activity (e.g. Gym, Run, etc.)
  likes: number;
  createdBy: string; // memberID of owner
  createdByName?: string;
  createdOn: Timestamp; // date formate
};

export type FALLOUTS_SCHEMA = {
  displayName: string;
  memberID: string;
  activityID: string;
  reason: string;
  verifiedBy: string;
};

export function initActivityObject({
  activityID,
  activityTitle,
  activityDesc,
  activityType,
  createdBy,
}: ACTIVITY_SCHEMA) {
  return {
    activityID,
    activityTitle,
    activityDesc,
    activityType,
    likes: 0,
    createdBy,
    createdOn: getCurrentDate(),
  } as ACTIVITY_SCHEMA;
}
