import { Timestamp } from "firebase/firestore";
import { DateToTimestamp, TimestampToDate } from "../../getCurrentDate";

const MAX_BREAKS = 1;
const MAX_INTERVAL_BREAK = 2;
const MAX_ACTIVITIES = 10;

// takes in the start timestamp to calculate from
// takes in a list of sorted timestamps
export function handleHA(start: Timestamp, timestampList: Timestamp[]) {
  // phase 1: clock initial HA
  // - 10 dates in a row
  // - a maximum of 1 break
  // - break has maximum length of 2 days
  let clockedHA = false;
  let finalIndex = -1;
  let breaksTaken = 0;

  // automatically returns false if trimmed list contains no activities
  const trimmedList = trimList(start, timestampList);

  // const debugTrim = trimmedList.map((item) => new Date(item.seconds * 1000));
  // console.log("Trimmed:", debugTrim);

  if (trimmedList.length < 1) return false;

  let checkedDates = [] as Date[];
  const firstDay = resetDay(trimmedList[0]);
  let prevDay = resetDay(trimmedList[0]);
  // console.log("First day:", firstDay);
  checkedDates.push(firstDay);

  for (let i = 1; i < trimmedList.length; i++) {
    const day = resetDay(trimmedList[i]);
    // console.log("Current day:", day);
    if (checkedDates.includes(day))
      // checked for the day, continue to next day
      continue;

    // day difference is 1 day
    const dayDiff = getDateDiff(day, prevDay);

    // console.log(
    //   `Cur: ${day.getDate()} | Prev: ${prevDay.getDate()} | DayDiff: ${dayDiff}`
    // );

    if (dayDiff > MAX_INTERVAL_BREAK + 1) {
      // break has exceed 2 days
      // console.log("Exceeded");
      break;
    }

    if (dayDiff === 1) {
      // console.log("Valid");
      checkedDates.push(day);
    } else {
      // day difference exceeded 1 day
      // increment breaks taken
      breaksTaken += 1;
      // console.log("break taken");
      checkedDates.push(day);
    }
    prevDay = resetDay(trimmedList[i]);

    if (breaksTaken > MAX_BREAKS)
      // more than 1 break taken during 10 day period
      return false;

    if (checkedDates.length === MAX_ACTIVITIES) {
      // if criterias have been met, set final index to continue searching from
      finalIndex = i;
      clockedHA = true;
      break;
    }
    // console.log("Checked dates:", checkedDates);
  }

  if (!clockedHA) return false;

  // console.log("[SUCCESS] Clocked HA.");

  // phase 2: maintain HA
  // - 2 HA activities within 14 days
  // - 2 HA activities must be within a maximum of 7 days within each other
  // - can be on the same day

  const MAX_INTERVAL = 7;
  const MAX_SECOND_INTERVAL = 14;

  const secondStartDate = trimmedList[finalIndex];
  const secondTrimmedList = trimList(secondStartDate, trimmedList);
  // console.log(secondTrimmedList.map((item) => new Date(item.seconds * 1000)));

  const secondCheckDates = [] as Date[];

  // init 14 day window
  let startDate = resetDay(secondTrimmedList[0]);
  let endDate = resetDay(secondTrimmedList[0]);
  endDate.setDate(endDate.getDate() + MAX_SECOND_INTERVAL);

  // iterate through dates, from second ite
  for (let i = 1; i < secondTrimmedList.length; i++) {
    // check if activity is within 14 day window
    const curDay = resetDay(secondTrimmedList[i]);
    // console.log("CurDay:", curDay);
    if (curDay > endDate) return false; // activity is after 14 day window, HA has broken

    // activity is still within 14 day window
    // check if activity is within 7 days of start date
    const diffDay = getDateDiff(startDate, curDay);

    if (diffDay > MAX_INTERVAL) return false; // activity within 14 day window has exceeded 7 days, HA has broken

    // current activity and prev activity is within 14 day window
    // current activity and prev activity is within 7 days of each other

    // assign new start date to current day
    // resets 14 day window
    secondCheckDates.push(curDay);
    // console.log("Checked:", secondCheckDates);

    startDate = resetDay(secondTrimmedList[i]);
    endDate = resetDay(secondTrimmedList[i]);
    endDate.setDate(endDate.getDate() + MAX_SECOND_INTERVAL);
  }

  return true;
}

export function resetDay(timestamp: Timestamp) {
  const temp = new Date(timestamp.seconds * 1000);
  temp.setHours(0, 0, 0, 0);
  return temp;
}

export function getDateDiff(day: Date, prevDay: Date) {
  const prevTime = prevDay.getTime();
  const dayTime = day.getTime();

  const timeDiff = dayTime - prevTime;
  const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
  // console.log(`Prev: ${prevDay} | Curr: ${day} | Diff: ${dayDiff}`);

  return dayDiff;
}

export function trimList(start: Timestamp, timestampList: Timestamp[]) {
  // let temp = timestampList.map(
  //   (time: Timestamp) => new Date(time.seconds * 1000)
  // );
  // console.log("Initial List:", temp);

  const startDate = resetDay(start);
  let trimmedList = [] as Timestamp[];

  // removes all activities before start date
  timestampList.forEach((day: Timestamp) => {
    const curDay = resetDay(day);
    if (curDay >= startDate) {
      trimmedList.push(day);
    }

    // const debugTrim = trimmedList.map((item) => new Date(item.seconds * 1000));
    // console.log("[PROG] Trimmed:", debugTrim);
  });

  return trimmedList;
}

// debug

// let list = [] as Timestamp[];

// list.push(DateToTimestamp(new Date(2024, 3, 1)));
// list.push(DateToTimestamp(new Date(2024, 3, 2)));
// list.push(DateToTimestamp(new Date(2024, 3, 3)));
// list.push(DateToTimestamp(new Date(2024, 3, 4)));
// list.push(DateToTimestamp(new Date(2024, 3, 5)));
// list.push(DateToTimestamp(new Date(2024, 3, 6)));
// list.push(DateToTimestamp(new Date(2024, 3, 9)));
// list.push(DateToTimestamp(new Date(2024, 3, 10)));
// list.push(DateToTimestamp(new Date(2024, 3, 11)));
// list.push(DateToTimestamp(new Date(2024, 3, 12)));
// list.push(DateToTimestamp(new Date(2024, 3, 13)));
// list.push(DateToTimestamp(new Date(2024, 3, 28)));
// list.push(DateToTimestamp(new Date(2024, 3, 29)));

// const startDate = new Date(2024, 3, 1);
// const startTimestamp = DateToTimestamp(startDate);

// console.log(handleHA(startTimestamp, list));
