import getCurrentDate, { ActiveTimestamp } from "../getCurrentDate";
import { GROUP_ACTIVITY_SCHEMA } from "../schemas/group-activities";

export function handleHA(activitiesData: {
  [activityID: string]: GROUP_ACTIVITY_SCHEMA;
}) {
  const empty = Object.keys(activitiesData).length === 0;
  let HA = false;

  if (!empty) {
    const curTimestamp = getCurrentDate();
    const lastTimestamp =
      activitiesData[Object.keys(activitiesData)[0]].activityDate;
    // if activity hasn't begun
    const active = ActiveTimestamp(lastTimestamp);
  }

  return { empty, HA };
}
