import { Timestamp } from "firebase/firestore";

export type COS_TYPES = {
  standard: 1;
  friday: 1.5;
  weekend: 2;
  public: 2;
};

export type CosDailyType = {
  memberID: string;
  date: Timestamp;
  month: number;
  type: "standard" | "friday" | "weekend" | "public";
  // points: number; inferred from COS type
};

export type COS_DAILY_SCHEMA = {
  [date: string]: CosDailyType;
};

export type COS_MONTHLY_SCHEMA = {
  [month: string]: COS_DAILY_SCHEMA;
};
