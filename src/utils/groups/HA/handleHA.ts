import { Timestamp } from "firebase/firestore";
import { TimestampToDate } from "../../getCurrentDate";

const MAX_BREAK = 2;
const MAX_ACTIVITIES = 10;

// takes in the start timestamp to calculate from
// takes in a list of sorted timestamps
export function handleHA(start: Timestamp, timestampList: Timestamp[]) {
  // phase 1: clock initial HA
  // - 10 dates in a row
  // - a maximum of 1 break
  // - break has maximum length of 2 days
  let clockedHA = false;
  let breakDuration = 0;
  let finalIndex = -1;

  // automatically returns false if trimmed list contains no activities
  const trimmedList = trimList(start, timestampList);
  console.log("Trimmed:", trimmedList);
  if (trimmedList.length < 1) return { clockedHA, finalIndex };

  let checkedDates = [] as Date[];
  const firstDay = resetDay(trimmedList[0]);
  console.log("First day:", firstDay);
  checkedDates.push(firstDay);

  for (let i = 1; i < trimmedList.length; i++) {
    const day = resetDay(trimmedList[i]);
    console.log("Current day:", day);
    if (checkedDates.includes(day))
      // checked for the day, continue to next day
      continue;

    // new date and not the first date
    const prevDay = checkedDates[i - 1];

    // day difference is 1 day
    const validDay = checkValid(day, prevDay);
    if (validDay) {
      checkedDates.push(day);
    } else {
      // day difference exceeded 1 day
      if (breakDuration === MAX_BREAK) {
        // break has exceed 2 days
        break;
      } else {
        // break has not exceeded 2 days
        // add break to breakDuration variable
        // add activity to checkedDates
        // increment break days
        checkedDates.push(day);
        breakDuration += 1;
      }
    }
    if (checkedDates.length === MAX_ACTIVITIES) {
      // if criterias have been met, set final index to continue searching from
      finalIndex = i;
      clockedHA = true;
      break;
    }
    console.log("Checked dates:", checkedDates);
  }

  return { clockedHA, finalIndex };

  // phase 2: maintain HA
  // - 2 HA activities with a maximum of 7 days within each other
  // - can be on the same day
}

export function resetDay(timestamp: Timestamp) {
  const temp = new Date(timestamp.seconds * 1000);
  temp.setHours(0, 0, 0, 0);
  return temp;
}

export function checkValid(day: Date, prevDay: Date) {
  const dayDate = day.getDate();
  const prevDate = prevDay.getDate();
  return dayDate - prevDate === 1;
}

export function trimList(start: Timestamp, timestampList: Timestamp[]) {
  let temp = timestampList.map((time: Timestamp) => TimestampToDate(time));
  console.log("Initial List:", temp);

  const startDate = resetDay(start);
  let trimmedList = [] as Timestamp[];

  // removes all activities before start date
  timestampList.forEach((day: Timestamp) => {
    const curDay = resetDay(day);
    if (curDay >= startDate) {
      trimmedList.push(day);
    }
    console.log("[PROG] Trimmed:", trimmedList);
  });

  return trimmedList;
}

// const DAYS = Math.floor(Math.random() * 50);
// console.log("Days:", DAYS);
// let list = [] as Timestamp[];

// for (let i = 1; i < DAYS; i++) {
//   const date = new Date();
//   date.setDate(i + 10);
//   const timestampTemp = DateToTimestamp(date);
//   list.push(timestampTemp);
// }

// const startDate = new Date();
// startDate.setDate(4);
// console.log("Start date:", startDate);
// const startTimestamp = DateToTimestamp(startDate);

// console.log(handleHA(startTimestamp, list));
