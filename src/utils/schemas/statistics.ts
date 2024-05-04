import { Timestamp } from "firebase/firestore";

export type STATISTICS_SCHEMA = {
  statisticsID: string;
  memberID: string; // member who
  totalDistanceRan: number;
  totalPushups: number;
  totalSitups: number;
  weeklyDistance: number;
  weeklyPushups: number;
  weeklySitups: number;
};

export function initStatisticsObject({
  statisticsID,
  memberID,
}: STATISTICS_SCHEMA) {
  return {
    statisticsID,
    memberID,
    totalDistanceRan: 0,
    totalPushups: 0,
    totalSitups: 0,
    weeklyDistance: 0,
    weeklyPushups: 0,
    weeklySitups: 0,
  } as STATISTICS_SCHEMA;
}

export type IPPT_STATS_SCHEMA = {
  pushups: number;
  situps: number;
  timing: number; // in seconds
};

export type IPPT_SCHEMA = {
  ipptID: string;
  memberID: string;
  dateCompleted: Timestamp; // date format
  stats: IPPT_STATS_SCHEMA;

  // common property among stats
  statType: "IPPT";
  score: number;
};

export type VOC_SCHEMA = {
  memberID: string;
  vocID: string;

  // common property among stats
  dateCompleted: Timestamp; // date format
  statType: "VOC" | "SOC";
  score: number; // in seconds
};

export type ATP_SCHEMA = {
  memberID: string;
  atpID: string;

  // common property among stats
  dateCompleted: Timestamp; // date format
  statType: "ATP";
  score: number;
};
