export const COS_TYPES = {
  standard: 1,
  friday: 1.5,
  weekend: 2,
  public: 2,
};

export type CosDailyType = {
  memberID: string;
  day: number;
  month: number;
  type: "standard" | "friday" | "weekend" | "public";
  // points: number; inferred from COS type
};

export type COS_DAILY_SCHEMA = {
  plans: { [date: string]: CosDailyType };
  month: number;
  groupID: string;
  confirmed?: boolean;
};

export type COS_MONTHLY_SCHEMA = {
  [month: string]: COS_DAILY_SCHEMA;
};
