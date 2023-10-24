import getCurrentDate from "../getCurrentDate";

export type MEMBER_SCHEMA = {
  memberID: string;
  displayName: string;
  bookedIn: boolean;
  points: number;
  rank: string;
  role: string;
  badges: BADGE_SCHEMA[];

  // stats
  ipptID: string;
  shootingID: string;
  statisticsID: string;

  createdOn: string; // date format
};

export type BADGE_SCHEMA = {
  index: number; // poition of list (current length of list)
  name: string;
  color: string;
};

export type FRIENDS_SCHEMA = {
  acceptedOn: string; // date format
  friendID: string; // memberID
};

export type MEMBER_CREATED_GROUPS_SCHEMA = {
  groupID: string;
  createdOn: string; // date format
};

export type MEMBER_JOINED_GROUPS_SCHEMA = {
  groupID: string;
  dateJoined: string; // date format
};

export function initMemberObject({
  memberID,
  displayName,
  role,
}: {
  memberID: string;
  displayName: string;
  role: string;
}) {
  return {
    memberID,
    displayName,
    bookedIn: false,
    points: 0,
    rank: "",
    role,
    badges: [],
    shootingID: "", // need to create and assign
    statisticsID: "", // need to create and assign
    ipptID: "", // need to create and assign
    createdOn: getCurrentDate(), // date format
  } as MEMBER_SCHEMA;
}
