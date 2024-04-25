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
  data: GroupDatesActivitiesType;
};

export type EachActivityType = {
  activityID: string;
  activityTitle: string;
  activityDateStr: string;
  createdBy: string;
};

export type EachDateActivitiesType = {
  [activityID: string]: EachActivityType;
};

export type AllDatesActivitiesType = {
  [dateStr: string]: EachDateActivitiesType;
};

export type GroupDatesActivitiesType = {
  [memberID: string]: AllDatesActivitiesType;
};
