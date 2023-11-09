import { Timestamp } from "firebase/firestore";
import handleResponses from "./handleResponses";

export function DateToString(date: Date) {
  var datetime =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  return datetime;
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
  const stamp = Timestamp.fromDate(currentdate);
  return stamp;
}

export function getCurrentDateString() {
  const date = new Date();
  return DateToString(date);
}

export function StringToTimestamp(str: string) {
  const strArr = str.split("/");
  if (strArr.length === 3) {
    const day = strArr[0];
    const month = strArr[1];
    const year = strArr[2];
    if (year.length === 4 && month.length === 2 && day.length === 2) {
      const dayInt = Number.parseInt(day);
      const monthInt = Number.parseInt(month);
      const yearInt = Number.parseInt(year);
      if (yearInt >= 2023 && monthInt >= 1 && monthInt <= 12 && dayInt >= 1) {
        if (
          (monthInt === 2 && dayInt <= 29) ||
          (monthInt !== 2 && dayInt <= 31)
        ) {
          const date = new Date(yearInt, monthInt - 1, dayInt, 23, 59);
          const timestamp = Timestamp.fromDate(date) as Timestamp;
          return handleResponses({ data: timestamp });
        }
      }
    }
  }
  return handleResponses({
    status: false,
    error: "Invalid date format. Please check again.",
  });
}

export function ActiveTimestamp(timestamp: Timestamp) {
  const date = TimestampToDate(timestamp);
  const today = new Date();
  return date >= today;
}
