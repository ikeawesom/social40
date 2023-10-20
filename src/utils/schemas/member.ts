import { GROUP_SCHEMA } from "./group";

export type MEMBER_SCHEMA = {
  // general
  uid: string;
  displayName: string;
  rank: string;
  username: string;
  dateCreated: string;

  // fun
  points: number;
  badges: BADGE_SCHEMA[] | [];
  friends: string[]; // list of friends UIDs

  // tracking
  bookedIn: boolean;
  activities: ACTIVITY_SCHEMA[] | []; // aka their posts
  statistics: STATISTICS_SCHEMA[] | [];
  participatedEvents: PARTICIPATED_EVENTS[] | []; // VOC, IPPT, HA, etc...
  medicalStatus: MEDICAL_SCHEMA[] | [];

  // Groups
  joinedGroups: GROUP_SCHEMA[]; // uid of groups
  ownedGroups: GROUP_SCHEMA[]; // uid of groups (only for mods)

  moderator: boolean;
};

export type STATISTICS_SCHEMA = {
  index: number; // poition of list (current length of list)
  ippt: IPPT_SCHEMA;
  shooting: SHOOTING_SCHEMA;
  distanceRan: number;
};

export type IPPT_SCHEMA = {
  timing: number; // number of seconds
  pushUps: number;
  sitUps: number;
  points: number;
};

export type SHOOTING_SCHEMA = {
  shots: number;
};

export type PARTICIPATED_EVENTS = {
  index: number; // poition of list (current length of list)
  uid: string; // UID of event
  remarks: string;
};

export type BADGE_SCHEMA = {
  index: number; // poition of list (current length of list)
  name: string;
  color: string;
};

export type ACTIVITY_SCHEMA = {
  index: number; // poition of list (current length of list)
  uid: string;
  owner: string; // UID of member
  title: string;
  desc: string;
  type: string;
  likes: string[]; // list of UIDs of members
  dateCreated: string;
};

export type MEDICAL_SCHEMA = {
  index: number; // poition of list (current length of list)
  recepient: string; // UID of member
  doctorName: string;
  statusName: string;
  statusDesc: string;
  startDate: string;
  endDate: string;
  endorsed: ENDORSED_SCHEMA;
};

export type ENDORSED_SCHEMA = {
  endorsed: boolean;
  endorsedBy: string; // UID of member
};
