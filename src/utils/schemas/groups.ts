import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../helpers/getCurrentDate";
import { STATUS_SCHEMA } from "./statuses";

export type GroupStatusType = {
  [memberID: string]: { [statusID: string]: STATUS_SCHEMA };
};

export type GroupDetailsType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};

export type GROUP_SCHEMA = {
  groupID: string;
  groupName: string;
  groupDesc: string;
  cos?: { state: boolean; admins: string[]; members: string[] };
  createdBy: string; // memberID of owner
  createdOn: Timestamp;
  lastUpdatedHA?: Timestamp;
};

export type GROUP_ACTIVITIES_SCHEMA = {
  activityID: string; // activityID of activity linked to group
  groupID: string; // groupID of group
  activityTitle: string; // title of activity
  activityDesc: string; // description of activity
  activityDate: Timestamp; // date of activity
  isPT?: boolean; //
};

export type GROUP_MEMBERS_SCHEMA = {
  dateJoined: Timestamp; // date member joined group
  memberID: string; // memberID of member joined
  role: string; // role of member
  displayName: string; // display name of member
  bookedIn?: boolean;
  pfp?: string;
  isOnCourse?: boolean;
  points?: number; // points
};

export function initGroupObject({
  groupID,
  groupName,
  groupDesc,
  createdBy,
  cos,
}: GROUP_SCHEMA) {
  return {
    groupID,
    groupName,
    groupDesc,
    createdBy,
    createdOn: getCurrentDate(),
    cos,
  } as GROUP_SCHEMA;
}
