import { Timestamp } from "firebase/firestore";

export const getDefaultAnnouncement = (memberID: string) => {
  return {
    title: "",
    desc: "",
    createdBy: memberID,
    groups: [] as string[],
    pin: false,
  } as ANNOUNCEMENT_SCHEMA;
};

export type ANNOUNCEMENT_SCHEMA = {
  announcementID?: string;
  title: string;
  desc: string;
  pin?: boolean;
  groups?: string[];
  media?: string[];
  likes?: string[]; // memberIDs
  createdBy: string; // memberID
  createdOn?: Timestamp;
};

export type PostType = {
  title: string;
  desc: string;
  createdBy: string;
};
