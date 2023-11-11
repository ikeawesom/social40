import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../getCurrentDate";

export type GROUP_ACTIVITY_SCHEMA = {
  activityID: string;
  groupID: string; // groupID of group the activity belongs to

  activityTitle: string;
  activityDesc: string;
  activityDate: Timestamp; // date format
  participants: string[]; // array of memberIDs of participants

  duration: {
    active: boolean;
    dateCutOff: Timestamp;
  };

  groupRestriction: boolean;

  createdBy: string; // memberID of owner
  createdOn: Timestamp; // date format
};

export type GROUP_ACTIVITY_PARTICIPANT = {
  memberID: string;
  dateJoined: Timestamp;
};

export type GROUP_ACTIVITY_WAITLIST = {
  memberID: string;
  dateRequested: Timestamp;
};

export type REMARKS_SCHEMA = {
  remarkID: string;
  memberID: string; // memberID of member who added the remark
  remarks: string; // remarks made
};

export function initGroupActivityObject({
  activityID,
  groupID,
  activityTitle,
  activityDesc,
  activityDate,
  createdBy,
}: GROUP_ACTIVITY_SCHEMA) {
  return {
    activityID,
    groupID,
    activityTitle,
    activityDesc,
    activityDate,
    participants: [createdBy],
    createdBy,
    createdOn: getCurrentDate(),
  } as GROUP_ACTIVITY_SCHEMA;
}
