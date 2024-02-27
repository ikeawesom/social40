import { Timestamp } from "firebase/firestore";

export type ANNOUNCEMENT_SCHEMA = {
  announcementID: string;
  title: string;
  desc: string;
  createdBy: string; // memberID
  createdOn: Timestamp;
};
