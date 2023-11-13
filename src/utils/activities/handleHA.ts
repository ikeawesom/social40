import { Timestamp } from "firebase/firestore";
import getCurrentDate, {
  ActiveTimestamp,
  CompareTimestamp,
} from "../getCurrentDate";
import { GROUP_ACTIVITY_SCHEMA } from "../schemas/group-activities";
import handleResponses from "../handleResponses";

function getLatestTimestamp(
  today: Timestamp,
  activitiesData: {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  }
) {
  let curTimestamp = today;
  Object.keys(activitiesData).forEach((activitiyID: string) => {
    const tempTimestamp = activitiesData[activitiyID].activityDate;
    if (ActiveTimestamp(tempTimestamp)) return curTimestamp;
    curTimestamp = tempTimestamp;
  });
  return curTimestamp;
}
export function handleHA(activitiesData: {
  [activityID: string]: GROUP_ACTIVITY_SCHEMA;
}) {
  const empty = Object.keys(activitiesData).length === 0;
  let HA = handleResponses({ status: false });

  if (!empty) {
    const today = getCurrentDate();
    const curTimestamp = getLatestTimestamp(today, activitiesData);
    const diff = CompareTimestamp(today, curTimestamp);
    const daysDiff = Math.floor(diff / 24);
    HA = handleResponses({ status: daysDiff <= 14, data: daysDiff });
  }

  return { empty, HA };
}
