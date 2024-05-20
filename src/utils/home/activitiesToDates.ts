import { FullActivityType } from "@/src/components/feed/views/ActivityCalendarClientView";
import { DateToString } from "../helpers/getCurrentDate";

export function activitiesToDates({
  activities,
}: {
  activities: FullActivityType;
}) {
  let data = {} as { [date: string]: FullActivityType };
  let sortedData = {} as { [date: string]: FullActivityType };
  Object.keys(activities).forEach((id: string) => {
    const { activityDate, activityID } = activities[id];
    const dateStr = DateToString(new Date(activityDate.seconds * 1000)).split(
      " "
    )[0];
    data[dateStr] = { ...data[dateStr], [activityID]: activities[activityID] };
  });

  Object.keys(data).forEach((date: string) => {
    const actsArr = Object.keys(data[date]);
    actsArr.sort((a, b) => {
      const timeA = new Date(
        data[date][a].activityDate.seconds * 1000
      ).getTime();
      const timeB = new Date(
        data[date][b].activityDate.seconds * 1000
      ).getTime();
      return timeA - timeB;
    });

    actsArr.forEach((id: string) => {
      sortedData[date] = { ...sortedData[date], [id]: data[date][id] };
    });
  });
  return { sortedData };
}
