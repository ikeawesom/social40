import { Timestamp } from "firebase/firestore";
import getCurrentDate from "../getCurrentDate";

export type MEMBER_SCHEMA = {
  memberID: string;
  password: string;
  displayName: string;
  bookedIn: boolean;
  points: number;
  rank: string;
  role: string;
  badges: BADGE_SCHEMA[];
  pfp?: string;

  // stats
  ipptID: string;
  shootingID: string;
  statisticsID: string;

  // hidden activities
  hiddenActivities?: string[];

  // feedback
  feedback?: false;

  createdOn: Timestamp; // date format
};

export type BADGE_SCHEMA = {
  index: number; // poition of list (current length of list)
  name: string;
  color: string;
};

export type FRIENDS_SCHEMA = {
  acceptedOn: Timestamp; // date format
  friendID: string; // memberID
};

export type MEMBER_CREATED_GROUPS_SCHEMA = {
  groupID: string;
  createdOn: Timestamp; // date format
};

export type MEMBER_JOINED_GROUPS_SCHEMA = {
  groupID: string;
  dateJoined: Timestamp; // date format
};

export type ACTIVITY_PARTICIPANT_SCHEMA = {
  activityID: string;
  activityDate: Timestamp; // date format
  dateJoined: Timestamp; // date format
};

export type ACTIVITY_DATA_SCHEMA = {
  activityID: string;
  activityTitle: string;
  participants: {
    [memberID: string]: {
      memberID: string;
      rank: string;
      displayName: string;
      participated: boolean;
    };
  };
};

export function initMemberObject({
  memberID,
  displayName,
  password,
  role,
}: {
  memberID: string;
  displayName: string;
  password: string;
  role: string;
}) {
  return {
    memberID,
    password,
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
