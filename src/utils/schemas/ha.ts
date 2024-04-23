export type isHAType = {
  id: string;
  displayName: string;
  isHA: boolean;
};

export type HA_REPORT_SCHEMA = {
  groupID: string;
  reportID: string;
  members: isHAType[];
  time: {
    from: string; // when calculated HA from
    to: string; // last updated date
  };
};
