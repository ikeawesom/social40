import { Timestamp } from "firebase/firestore";

export type NOTIFS_SCHEMA = {
  title: string;
  desc: string;
  date: Timestamp;
  link?: string;
  img?: string;
};
