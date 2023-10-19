import { EVENTS_SCHEMA } from "./event";
import { MEDICAL_SCHEMA } from "./member";

export type GROUP_SCHEMA = {
  uid: string; // admin ID
  owner: string; // UID of owner
  groupName: string;
  groupDesc: string;
  members: string[]; // List of UID of members
  requestedMembers: string[]; // List of UID of members requested
  createdEvents: EVENTS_SCHEMA[];
  medicalStatus: MEDICAL_SCHEMA[];
};
