import { Timestamp } from "firebase/firestore";

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
  return DateToString(timestamp.toDate());
}

// to register into firestore
export default function getCurrentDate() {
  const currentdate = new Date();
  const stamp = Timestamp.fromDate(currentdate);
  return stamp;
}
