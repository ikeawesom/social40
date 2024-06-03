export const COS_TYPES = {
  standard: 1,
  friday: 1.5,
  weekend: 2,
  public: 2,
};

export type CosDailyType = {
  takenOver?: boolean;
  finished?: boolean;
  memberID: string;
  day: number;
  month: number;
  type: "standard" | "friday" | "weekend" | "public";
  customPoints?: number;
  disabled?: boolean;
  // points: number; inferred from COS type
};

export type COS_DAILY_SCHEMA = {
  plans: { [date: string]: CosDailyType };
  month: number;
  groupID: string;
  confirmed?: boolean;
  membersOriginalScores: { [id: string]: number };
};

export type COS_MONTHLY_SCHEMA = {
  [month: string]: COS_DAILY_SCHEMA;
};
