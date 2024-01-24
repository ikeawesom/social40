import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../getCurrentDate";

export type GROUP_ACTIVITY_SCHEMA = {
  activityID: string;
  groupID: string; // groupID of group the activity belongs to

  activityTitle: string;
  activityDesc: string;
  activityDate: Timestamp; // date format
  activityLevel: string; // Light, Moderate or Strenuous

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
  activityID: string;
  dateJoined: Timestamp;
};

export type GROUP_ACTIVITY_WAITLIST = {
  memberID: string;
  dateRequested: Timestamp;
};

export type REMARKS_SCHEMA = {
  remarkID: string;
  activityID: string;
  memberID: string; // memberID of member who added the remark
  remarkTitle: string; // remark title
  remarks: string;
  read: {
    status: boolean;
    readOn: Timestamp;
  };
  createdOn: Timestamp;
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
    createdBy,
    createdOn: getCurrentDate(),
  } as GROUP_ACTIVITY_SCHEMA;
}
