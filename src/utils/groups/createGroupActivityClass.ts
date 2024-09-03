import { Timestamp } from "firebase/firestore/lite";
import getCurrentDate, {
  DateToTimestamp,
  TimestampToDate,
} from "../helpers/getCurrentDate";
import handleResponses from "../helpers/handleResponses";
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
  nonHAMembers: string[];
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
    this.nonHAMembers = [];
  }

  async createGroupActivity() {
    const { groupID, input, memberID } = this.config;
    try {
      const { error, data } = await first(groupID, input, memberID);
      if (error) throw new Error(error);
      const { timestamp, fetchedID, groupData } = data;

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
    const membersData = this.members.filter(
      (id: string) => !this.nonHAMembers.includes(id)
    );
    const fetchedID = this.fetchedID ?? "";

    try {
      const { error } = await third(
        this.config.addMembers.check,
        memberID,
        fetchedID,
        this.members,
        this.timestamp,
        this.nonHAMembers
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

  setNonHAMembers(members: string[]) {
    this.nonHAMembers = members;
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
