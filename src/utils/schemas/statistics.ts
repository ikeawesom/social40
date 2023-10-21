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

export type IPPT_SCHEMA = {
  ipptID: string;
  memberID: string;
  ipptDate: string; // date format
  pushups: number;
  situps: number;
  score: number;
  timing: number; // in seconds
};

export function initIpptObject({
  ipptID,
  memberID,
  ipptDate,
  pushups,
  situps,
  score,
  timing,
}: IPPT_SCHEMA) {
  return {
    ipptID,
    memberID,
    ipptDate,
    pushups,
    situps,
    score,
    timing,
  } as IPPT_SCHEMA;
}

export type SHOOTING_SCHEMA = {
  memberID: string;
  shootingID: string;
  shots: number;
  shootingDate: string; // date format
};

export function initShootingObject({
  memberID,
  shootingID,
  shootingDate,
  shots,
}: SHOOTING_SCHEMA) {
  return { memberID, shootingID, shots, shootingDate } as SHOOTING_SCHEMA;
}
