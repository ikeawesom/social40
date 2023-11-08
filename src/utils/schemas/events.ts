import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../getCurrentDate";

export type EVENT_SCHEMA = {
  eventID: string;
  eventTitle: string;
  eventDesc: string;
  eventDate: Timestamp; // date format
  createdBy: string; // memberID of owner
  createdOn: Timestamp; // date format
};

export type REMARKS_SCHEMA = {
  remarkID: string;
  memberID: string; // memberID of member who added the remark
  remarks: string; // remarks made
};

export type EVENTS_PARTICIPANTS_SCHEMA = {
  [memberID: string]: {
    memberID: string;
  };
};

export function initEventsObject({
  eventID,
  eventTitle,
  eventDesc,
  createdBy,
}: EVENT_SCHEMA) {
  return {
    eventID: eventID,
    eventTitle: eventTitle,
    eventDesc: eventDesc,
    createdBy: createdBy,
    createdOn: getCurrentDate(),
  } as EVENT_SCHEMA;
}
