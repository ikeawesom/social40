import { Timestamp } from "firebase/firestore/lite";
import getCurrentDate, {
  DateToTimestamp,
  TimestampToDate,
} from "../getCurrentDate";
import handleResponses from "../handleResponses";
import { dbHandler } from "@/src/firebase/db";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
} from "../schemas/group-activities";
import { ACTIVITY_PARTICIPANT_SCHEMA } from "../schemas/members";
import { GROUP_ACTIVITIES_SCHEMA } from "../schemas/groups";
import { first, fourth, second, third } from "./handleGroupActivityCreate";

export type createGroupActivityConfig = {
  memberID: string;
  groupID: string;
  input: any;
  addMembers: { check: string; members: string[] };
};
export class createGroupActivityClass {
  config: createGroupActivityConfig;
  timestamp: Timestamp | null;
  fetchedID: string | null;
  groupData: GROUP_ACTIVITIES_SCHEMA | null;
  members: string[];
  constructor({
    addMembers,
    groupID,
    input,
    memberID,
  }: createGroupActivityConfig) {
    this.config = { addMembers, groupID, input, memberID };
    this.timestamp = null;
    this.fetchedID = null;
    this.groupData = null;
    this.members = [];
  }

  async createGroupActivity() {
    const { groupID, input, memberID } = this.config;
    try {
      const { error, data } = await first(groupID, input, memberID);
      if (error) throw new Error(error);
      const { timestamp, fetchedID, groupData } = data;
      console.log(data);
      this.timestamp = timestamp;
      this.fetchedID = fetchedID;
      this.groupData = groupData;

      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  }

  async verifyMembers() {
    const { addMembers, groupID } = this.config;
    try {
      const { error, data } = await second(addMembers, groupID);
      if (error) throw new Error(error);
      this.members = data;
      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  }

  async addParticipants() {
    const { memberID } = this.config;
    const membersData = this.members;
    const fetchedID = this.fetchedID ?? "";

    try {
      const { error } = await third(
        memberID,
        fetchedID,
        membersData,
        this.timestamp
      );
      if (error) throw new Error(error);
      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  }

  async addToGroupCol() {
    // add group activity to sub collection of group path
    const { activityDesc, activityTitle, groupID, isPT } = this.groupData ?? {};

    const timestamp = this.timestamp ?? DateToTimestamp(new Date());
    try {
      const { error } = await fourth(
        this.fetchedID ?? "",
        timestamp,
        activityDesc ?? "",
        activityTitle ?? "",
        groupID ?? "",
        isPT ?? false
      );
      if (error) throw new Error(error);
      return handleResponses({ data: this.fetchedID });
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  }

  async helperParticipate(memberID: string, activityID: string) {
    try {
      const date = getCurrentDate();
      // add to group participants subcollection
      const to_add = {
        memberID,
        dateJoined: date,
        activityID,
      } as GROUP_ACTIVITY_PARTICIPANT;

      const res = await dbHandler.add({
        col_name: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
        id: memberID,
        to_add,
      });

      if (!res.status) throw new Error(res.error);

      // remove from activity waitlist
      const resB = await dbHandler.delete({
        col_name: `GROUP-ACTIVITIES/${activityID}/WAITLIST`,
        id: memberID,
      });
      if (!resB.status) throw new Error(resB.error);

      const resC = await dbHandler.get({
        col_name: `GROUP-ACTIVITIES`,
        id: activityID,
      });

      if (!resC.status) throw new Error(resC.error);

      const { activityDate } = resC.data as GROUP_ACTIVITY_SCHEMA;

      // see if member fell out
      await dbHandler.delete({
        col_name: `GROUP-ACTIVITIES/${activityID}/FALLOUTS`,
        id: memberID,
      });

      // add to member's group activities subcollection
      const to_addA = {
        activityID,
        dateJoined: date,
        activityDate,
      } as ACTIVITY_PARTICIPANT_SCHEMA;

      const resA = await dbHandler.add({
        col_name: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
        id: activityID,
        to_add: to_addA,
      });

      if (!resA.status) throw new Error(resA.error);

      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  }

  isActive(a: any, start: Timestamp, end: Timestamp) {
    const date = TimestampToDate(a);
    const startDate = TimestampToDate(start);
    const endDate = TimestampToDate(end);
    return date <= endDate && date >= startDate;
  }

  isActivePlusOne(a: any, start: Timestamp, end: Timestamp) {
    const date = TimestampToDate(a);
    const startDate = TimestampToDate(start);
    const endDate = TimestampToDate(end);
    endDate.setDate(endDate.getDate() + 1);
    return date <= endDate && date >= startDate;
  }
}
