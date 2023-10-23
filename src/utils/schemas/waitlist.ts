import getCurrentDate from "../getCurrentDate";

export type WAITLIST_SCHEMA = {
  memberID: string; // member ID of waitlistee
  groupID: string; // group ID that waitlistee inputted
  displayName: string; // display name of waitlistee
  password?: string; // password of waitlistee
  dateRequested: string; // date format
};

export function initWaitListee({
  memberID,
  groupID,
  displayName,
  password,
}: WAITLIST_SCHEMA) {
  return {
    memberID,
    groupID,
    displayName,
    password: password ? password : "",
    dateRequested: getCurrentDate(),
  } as WAITLIST_SCHEMA;
}
