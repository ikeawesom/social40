import { Timestamp } from "firebase/firestore";
import handleResponses from "./handleResponses";

export function DateToString(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  date.setHours(date.getHours() - 8);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const res = `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year} ${hour < 10 ? `0${hour}` : hour}:${
    minute < 10 ? `0${minute}` : minute
  }`;

  return res;
}

// to fetch from firestore
export function TimestampToDateString(timestamp: Timestamp) {
  const date = TimestampToDate(timestamp);
  return DateToString(date);
}

export function TimestampToDate(timestamp: Timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date;
}

// to register into firestore
export default function getCurrentDate() {
  const currentdate = new Date();
  return DateToTimestamp(currentdate);
}

export function DateToTimestamp(date: Date) {
  return Timestamp.fromDate(date);
}

export function getCurrentDateString() {
  const date = new Date();
  return DateToString(date);
}

export function StringToDate(str: string) {
  try {
    const strArr = str.split(" ");

    if (strArr.length === 2) {
      const dateStr = strArr[0];
      const timeStr = strArr[1];
      const timeArr = timeStr.split(":");
      const dateArr = dateStr.split("/");
      if (dateArr.length === 3 && timeArr.length === 2) {
        const day = dateArr[0];
        const month = dateArr[1];
        const year = dateArr[2];

        const hour = timeArr[0];
        const minute = timeArr[1];

        if (
          year.length === 4 &&
          month.length === 2 &&
          day.length === 2 &&
          hour.length === 2 &&
          minute.length === 2
        ) {
          const dayInt = Number.parseInt(day);
          const monthInt = Number.parseInt(month);
          const yearInt = Number.parseInt(year);

          const hourInt = Number.parseInt(hour);
          const minuteInt = Number.parseInt(minute);
          if (
            yearInt >= 2023 &&
            monthInt >= 1 &&
            monthInt <= 12 &&
            dayInt >= 1 &&
            hourInt >= 0 &&
            hourInt <= 23 &&
            minuteInt >= 0 &&
            minuteInt <= 59
          ) {
            if (
              (monthInt === 2 && dayInt <= 29) ||
              (monthInt !== 2 && dayInt <= 31)
            ) {
              const date = new Date(
                yearInt,
                monthInt - 1,
                dayInt,
                hourInt - 8,
                minuteInt
              );
              return handleResponses({ data: date });
            }
          }
        }
      }
    }
    throw new Error("Invalid date format. Please check again.");
  } catch (err: any) {
    return handleResponses({
      status: false,
      error: err.message,
    });
  }
}
export function StringToTimestamp(str: string) {
  const res = StringToDate(str);
  if (!res.status) return handleResponses({ status: false, error: res.error });
  return handleResponses({ data: DateToTimestamp(res.data) });
}

export function ActiveTimestamp(timestamp: Timestamp) {
  const date = TimestampToDate(timestamp);
  const today = new Date();
  return date >= today;
}

export function CompareTimestamp(timestampA: Timestamp, timestampB: Timestamp) {
  const dateA = TimestampToDate(timestampA);
  const dateB = TimestampToDate(timestampB);

  const diff = dateA.getTime() - dateB.getTime();
  const diffHours = diff / (1000 * 60 * 60);
  return diffHours;
}
