export type EVENTS_SCHEMA = {
  uid: string;
  title: string;
  desc: string;
  eventDate: string;
  dateCreated: string;
  assignedTo: string[]; // list of UIDs of members
};
