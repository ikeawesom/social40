export type BIBO_DB_TYPE = { [date: string]: BIBO_SCHEMA };
export type BIBO_SCHEMA = {
  [time: string]: {
    bookedInDate: string;
    bookedInTime: string;
    bookedIn: boolean;
    memberID: string; // member ID
    verifiedBy: string;
  }; // admin who booked member in
};
