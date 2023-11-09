import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../getCurrentDate";

export type GROUP_SCHEMA = {
  groupID: string;
  groupName: string;
  groupDesc: string;
  createdBy: string; // memberID of owner
  createdOn: Timestamp;
};

export type GROUP_EVENTS_SCHEMA = {
  eventID: string; // eventID of event linked to group
  groupID: string; // groupID of group containing event
};

export type GROUP_MEMBERS_SCHEMA = {
  dateJoined: Timestamp; // date member joined group
  memberID: string; // memberID of member joined
  role: string; // role of member
  displayName?: string; // display name of member
  bookedIn?: boolean;
};

export function initGroupObject({
  groupID,
  groupName,
  groupDesc,
  createdBy,
}: GROUP_SCHEMA) {
  return {
    groupID,
    groupName,
    groupDesc,
    createdBy,
    createdOn: getCurrentDate(),
  } as GROUP_SCHEMA;
}
