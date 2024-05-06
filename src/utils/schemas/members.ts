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
  isOnCourse?: boolean;

  // stats
  ipptID: string;
  shootingID: string;
  statisticsID: string;
  dutyPoints: {
    cos: number;
    gd: number; // TBC
    days: {
      weekends: number;
      weekdays: number;
      publics: number;
      fridays: number;
    };
  };

  // dismissed updates
  dismissedUpdates?: string[];

  // hidden activities
  hiddenActivities?: string[];

  // feedback
  feedback?: false;

  createdOn: Timestamp; // date format
};

export type BadgeColorsType = {
  bg: string;
  text: string;
};

export type BADGE_SCHEMA = {
  name: string;
  colors: BadgeColorsType;
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
    dutyPoints: {
      cos: 0,
      gd: 0,
      days: {
        fridays: 0,
        publics: 0,
        weekdays: 0,
        weekends: 0,
      },
    },
    badges: [],
    shootingID: "", // need to create and assign
    statisticsID: "", // need to create and assign
    ipptID: "", // need to create and assign
    createdOn: getCurrentDate(), // date format
  } as MEMBER_SCHEMA;
}
