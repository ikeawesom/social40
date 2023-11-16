import { Timestamp } from "firebase/firestore";
import getCurrentDate, {
  ActiveTimestamp,
  CompareTimestamp,
  TimestampToDateString,
} from "../getCurrentDate";
import { GROUP_ACTIVITY_SCHEMA } from "../schemas/group-activities";
import handleResponses from "../handleResponses";

function getLatestTimestamp(
  today: Timestamp,
  activitiesData: {
    [activityID: string]: GROUP_ACTIVITY_SCHEMA;
  }
) {
  const test = Object.keys(activitiesData).map((activityID: string) => {
    const tempTimestamp = activitiesData[activityID].activityDate;
    if (!ActiveTimestamp(tempTimestamp)) {
      return { status: true, data: tempTimestamp };
    }

    return { status: false, data: today };
  });

  for (const activity of test) {
    const { data } = activity;
    if (data !== today) return data;
  }

  return today;
}

export function handleHA(activitiesData: {
  [activityID: string]: GROUP_ACTIVITY_SCHEMA;
}) {
  const empty = Object.keys(activitiesData).length === 0;
  let HA = handleResponses({ status: false });

  if (!empty) {
    const today = getCurrentDate();
    const curTimestamp = getLatestTimestamp(today, activitiesData);
    // never particiapte in activity before
    if (curTimestamp === today) {
      HA = handleResponses({
        status: false,
        data: "This member has not tracked their participated activities before.",
      });
    } else {
      const diffHours = CompareTimestamp(today, curTimestamp);
      const daysDiff = Math.floor(diffHours / 24);

      const good = daysDiff <= 14;
      HA = handleResponses({
        status: good,
        data: `${daysDiff.toString()} days ${good ? "ahead" : "behind"}.`,
      });
    }
  }
  return { empty, HA };
}
