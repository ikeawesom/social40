import { Timestamp } from "firebase/firestore";
import { DateToTimestamp } from "../../getCurrentDate";

// takes in the start timestamp to calculate from
// takes in a list of sorted timestamps
export function handleHA(
  start: Timestamp,
  timestampList: Timestamp[],
  isCommander: boolean
) {
  // phase 1: clock initial HA
  // - 10 dates in a row
  // - a maximum of 1 break
  // - break has maximum length of 2 days

  const MAX_BREAKS = 1;
  const MAX_INTERVAL_BREAK = 2;
  const MAX_ACTIVITIES = isCommander ? 7 : 10;

  const MAX_INTERVAL = 7;
  const MAX_SECOND_INTERVAL = 14;

  // console.log(
  //   "Original:",
  //   timestampList.map((t) => new Date(t.seconds * 1000))
  // );
  // automatically returns false if trimmed list contains no activities
  const trimmedList = trimList(start, timestampList);

  const debugTrim = trimmedList.map((item) => new Date(item.seconds * 1000));
  console.log("Trimmed:", debugTrim);

  if (trimmedList.length < 1) return false;

  let checkedDates = [] as Date[];
  const firstDay = resetDay(trimmedList[0]);
  let prevDay = resetDay(trimmedList[0]);
  // console.log("First day:", firstDay);
  checkedDates.push(firstDay);

  let breaksTaken = 0;
  let clockedHA = false;
  let haCurrency = true;
  let lastBreakIndex = 0;

  function reset() {
    breaksTaken = 0;
    clockedHA = false;
    haCurrency = true;
  }

  let i = 0;
  while (i < trimmedList.length) {
    const day = resetDay(trimmedList[i]);
    console.log("Current day:", day);
    if (checkedDates.includes(day))
      // checked for the day, continue to next day
      continue;

    // day difference is 1 day
    const dayDiff = getDateDiff(day, prevDay);

    console.log(
      `Cur: ${day.getDate()} | Prev: ${prevDay.getDate()} | DayDiff: ${dayDiff}`
    );

    prevDay = resetDay(trimmedList[i]);

    if (dayDiff > MAX_INTERVAL_BREAK + 1) {
      // break has exceed 2 days
      // reset variables
      console.log("break has exceed 2 days, reset");
      // console.log("----\n\n");
      checkedDates = [day];
      breaksTaken = 0;
      i = lastBreakIndex;
      continue;
    }

    if (dayDiff <= 1) {
      console.log("Valid");
      checkedDates.push(day);
    } else {
      // day difference exceeded 1 day
      // increment breaks taken
      console.log("break taken");
      breaksTaken += 1;
      lastBreakIndex = i;
      checkedDates.push(day);
    }

    if (breaksTaken > MAX_BREAKS) {
      // more than 1 break taken during 10 day period
      // reset variables
      console.log("more than 1 break, reset");
      checkedDates = [day];
      breaksTaken = 0;
      continue;
    }

    if (checkedDates.length === MAX_ACTIVITIES) {
      // if criterias have been met, set final index to continue searching from
      console.log("Passed dates:", checkedDates);
      console.log("Clocked initial HA");
      clockedHA = true;
      // console.log("checked dates:", checkedDates);

      // phase 2: maintain HA
      // - 2 HA activities within 14 days
      // - 2 HA activities must be within a maximum of 7 days within each other
      // - can be on the same day

      // iterate through dates, from second item
      const secondCheckDates = [] as Date[];

      // init 14 day window
      let startDate = resetDay(trimmedList[i]);
      let endDate = resetDay(trimmedList[i]);
      endDate.setDate(endDate.getDate() + MAX_SECOND_INTERVAL);

      for (let j = i + 1; j < trimmedList.length; j++) {
        // check if activity is within 14 day window
        const curDay = resetDay(trimmedList[j]);
        // console.log("CurDay:", curDay);
        if (curDay > endDate) {
          reset();
          console.log("activity is after 14 day window, HA has broken");
          break;
        } // activity is after 14 day window, HA has broken

        // activity is still within 14 day window
        // check if activity is within 7 days of start date
        const diffDay = getDateDiff(startDate, curDay);

        if (diffDay > MAX_INTERVAL) {
          reset();
          console.log(
            "activity within 14 day window has exceeded 7 days, HA has broken"
          );
          break;
        } // activity within 14 day window has exceeded 7 days, HA has broken

        // current activity and prev activity is within 14 day window
        // current activity and prev activity is within 7 days of each other

        // assign new start date to current day
        // resets 14 day window
        secondCheckDates.push(curDay);
        // console.log("Checked:", secondCheckDates);

        startDate = resetDay(trimmedList[j]);
        endDate = resetDay(trimmedList[j]);
        endDate.setDate(endDate.getDate() + MAX_SECOND_INTERVAL);
      }
      console.log("second checked:", secondCheckDates);
    }

    if (clockedHA && haCurrency) {
      console.log("Clocked overall HA");
      return true;
    }
    i++;
  }

  return false;
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
  let temp = timestampList.map(
    (time: Timestamp) => new Date(time.seconds * 1000)
  );
  console.log("Initial List:", temp);

  const startDate = resetDay(start);
  let trimmedList = [] as Timestamp[];
  let checked = [] as number[];
  const nowDate = new Date();
  nowDate.setHours(nowDate.getHours() + 8);
  // nowDate.setHours(23,59)

  console.log("Final:", nowDate);

  // removes all activities before start date
  timestampList.forEach((day: Timestamp) => {
    const curDay = new Date(day.seconds * 1000);
    const resetCurDay = resetDay(day);
    // console.log("Cur:", curDay);
    // console.log("First:", curDay >= startDate);
    // console.log("Second:", !checked.includes(resetCurDay.getTime()));
    // console.log("Third:", curDay <= nowDate);
    if (
      curDay >= startDate &&
      !checked.includes(resetCurDay.getTime()) &&
      curDay <= nowDate
    ) {
      trimmedList.push(day);
      checked.push(resetCurDay.getTime());
    }
  });
  // const debugTrim = trimmedList.map((item) => new Date(item.seconds * 1000));
  // console.log("[PROG] Trimmed:", debugTrim);

  return trimmedList;
}

// debug

let list = [] as Timestamp[];
list.push(DateToTimestamp(new Date(2024, 3, 11, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 15, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 16, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 17, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 18, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 19, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 22, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 22, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 23, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 24, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 25, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 26, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 3, 29, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 4, 2, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 4, 2, 12, 0, 0)));
list.push(DateToTimestamp(new Date(2024, 4, 6, 12, 0, 0)));

// list.push(DateToTimestamp(new Date(2024, 3, 1)));
// list.push(DateToTimestamp(new Date(2024, 3, 5)));
// list.push(DateToTimestamp(new Date(2024, 3, 6)));
// list.push(DateToTimestamp(new Date(2024, 3, 7)));
// list.push(DateToTimestamp(new Date(2024, 3, 8)));
// list.push(DateToTimestamp(new Date(2024, 3, 9)));
// list.push(DateToTimestamp(new Date(2024, 3, 15)));
// list.push(DateToTimestamp(new Date(2024, 3, 16)));
// list.push(DateToTimestamp(new Date(2024, 3, 17)));
// list.push(DateToTimestamp(new Date(2024, 3, 18)));
// list.push(DateToTimestamp(new Date(2024, 3, 19)));
// list.push(DateToTimestamp(new Date(2024, 3, 22)));
// list.push(DateToTimestamp(new Date(2024, 3, 23)));
// list.push(DateToTimestamp(new Date(2024, 3, 24)));
// list.push(DateToTimestamp(new Date(2024, 3, 25)));
// list.push(DateToTimestamp(new Date(2024, 3, 26)));

const startDate = new Date(2024, 1, 1);
const startTimestamp = DateToTimestamp(startDate);

console.log(handleHA(startTimestamp, list, true));
