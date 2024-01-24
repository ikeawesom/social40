import { Timestamp } from "firebase/firestore";

export type STATUS_SCHEMA = {
  statusID: string;
  statusTitle: string;
  statusDesc: string;
  memberID: string;
  doctor: string; // name of doctor
  endorsed: {
    status: boolean;
    endorsedBy: string; // memberID of endorsed admin
    endorsedOn: Timestamp; // date endorsed
  };
  mc?: boolean;
  startDate: Timestamp; // date format
  endDate: Timestamp; // date format
};

export function initStatusObject({
  statusID,
  statusTitle,
  statusDesc,
  memberID,
  doctor,
  startDate,
  endDate,
}: STATUS_SCHEMA) {
  return {
    statusID,
    statusTitle,
    statusDesc,
    memberID,
    doctor,
    endorsed: {
      status: false,
      endorsedBy: "",
    },
    startDate,
    endDate,
  } as STATUS_SCHEMA;
}
