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
  score: number;
  pushups: number;
  situps: number;
  timing: number; // in seconds
};

export type IPPT_SCHEMA = {
  ipptID: string;
  memberID: string;
  ipptDate: Timestamp; // date format
  stats: IPPT_STATS_SCHEMA;
};

export function initIpptObject({
  ipptID,
  memberID,
  ipptDate,
  stats: { pushups, situps, score, timing },
}: IPPT_SCHEMA) {
  return {
    ipptID,
    memberID,
    ipptDate,
    stats: { pushups, situps, score, timing },
  } as IPPT_SCHEMA;
}

export type SHOOTING_SCHEMA = {
  memberID: string;
  shootingID: string;
  score: number;
  shootingDate: Timestamp; // date format
};

export function initShootingObject({
  memberID,
  shootingID,
  shootingDate,
  score,
}: SHOOTING_SCHEMA) {
  return { memberID, shootingID, score, shootingDate } as SHOOTING_SCHEMA;
}
