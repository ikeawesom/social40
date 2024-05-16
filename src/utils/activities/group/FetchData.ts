import { ActivityWaitlistType } from "@/src/components/groups/custom/activities/ActivityWaitlist";
import { GetPostObj } from "../../API/GetPostObj";
import {
  TimestampToDateString,
  ActiveTimestamp,
} from "../../helpers/getCurrentDate";
import {
  GROUP_ACTIVITY_SCHEMA,
  GROUP_ACTIVITY_PARTICIPANT,
} from "../../schemas/group-activities";
import handleResponses from "../../helpers/handleResponses";
import { ROLES_HIERARCHY } from "../../constants";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "../../schemas/members";
import { DailyHAType } from "../../schemas/ha";

type GroupActivityClassType = {
  memberID: string;
  groupID: string;
  activityID: string;
  host: string;
};

async function addDisplayName(obj: any) {
  try {
    const memberIDArr = Object.keys(obj);

    const promiseArr = memberIDArr.map(async (memberID: string) => {
      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
      const data = res.data as MEMBER_SCHEMA;
      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses({
        data: {
          id: memberID,
          display: `${data.rank} ${data.displayName}`.trim(),
        },
      });
    });

    const arrPromise = await Promise.all(promiseArr);
    type sortables = { id: string; name: string };
    let displayArr = [] as sortables[];

    arrPromise.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
      const data = item.data as any;
      obj[data.id] = {
        ...obj[data.id],
        displayName: data.display,
      };
      displayArr.push({ id: data.id, name: data.display });
    });

    displayArr.sort((a: sortables, b: sortables) => {
      return a.name < b.name ? -1 : 1;
    });

    let objB = {} as any;
    displayArr.forEach((item: sortables) => {
      objB[item.id] = obj[item.id];
    });

    return handleResponses({ data: objB });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

class FetchGroupActivityClass {
  async getMain({
    memberID,
    groupID,
    activityID,
    host,
  }: GroupActivityClassType) {
    try {
      // check if member in group
      const { data: memData, error: memErr } = await dbHandler.get({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
      });

      if (memErr) throw new Error(memErr);

      // fetch activity data
      const { data, error } = await dbHandler.get({
        col_name: "GROUP-ACTIVITIES",
        id: activityID,
      });
      if (error) throw new Error(error);

      // fetch participants data
      const { data: dataA, error: errA } = await dbHandler.getDocs({
        col_name: `GROUP-ACTIVITIES/${activityID}/PARTICIPANTS`,
      });
      if (errA) throw new Error(errA);

      const resData = dataA as any[];
      const participants = {} as {
        [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
      };

      resData.forEach((item: any) => {
        const data = item.data() as GROUP_ACTIVITY_PARTICIPANT;
        const member = data.memberID as string;
        participants[member] = data;
      });

      const activityData = data as GROUP_ACTIVITY_SCHEMA;
      const { needsHA } = activityData;

      const { data: memberHARes, error: haErr } = await dbHandler.get({
        col_name: "HA",
        id: memberID,
      });

      if (haErr) throw new Error(haErr);

      const haData = memberHARes as DailyHAType;
      const { isHA } = haData;

      const notHA = needsHA ? (isHA ? false : true) : false;

      const participantsDataRes = await addDisplayName(participants);
      if (!participantsDataRes.status)
        throw new Error(participantsDataRes.error);

      const participantsData = participantsDataRes.data as {
        [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
      };

      let currentParticipant = false;

      if (memberID in participantsData) currentParticipant = true;

      const date = activityData.activityDate;
      const dateStr = TimestampToDateString(date);
      const active = ActiveTimestamp(date);

      const restrictionStatus = activityData.groupRestriction;
      // const currentMember = true;

      const resB = await dbHandler.getSpecific({
        path: `GROUP-ACTIVITIES/${activityID}/FALLOUTS`,
        orderCol: "memberID",
        ascending: true,
      });

      if (!resB.status) throw new Error(resB.error);
      const falloutsRes = await addDisplayName(resB.data);
      if (!falloutsRes.status) throw new Error(falloutsRes.error);

      const fallouts = falloutsRes.data;

      const canJoin = (!restrictionStatus || !currentParticipant) && !notHA;
      // (currentMember && restrictionStatus)

      const owner = activityData.createdBy === memberID;

      let admin = false;

      const role = memData.role;
      admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;

      return handleResponses({
        data: {
          activityData,
          owner,
          canJoin,
          active,
          dateStr,
          currentParticipant,
          participantsData,
          admin,
          fallouts,
        },
      });
    } catch (err: any) {
      return handleResponses({ status: false, error: err });
    }
  }

  async getRequests({ memberID, activityID, host }: GroupActivityClassType) {
    try {
      // get group activity requests
      const PostObjActivity = GetPostObj({ activityID: activityID });
      const resB = await fetch(
        `${host}/api/activity/group-get-requests`,
        PostObjActivity
      );
      const bodyB = await resB.json();

      if (!bodyB.status) throw new Error(bodyB.error);

      const requestsData = bodyB.data as ActivityWaitlistType;
      const noRequests = Object.keys(requestsData).length === 0;

      // check if current member is in waiting list
      const requested = memberID in requestsData;

      return handleResponses({
        data: {
          requested,
          noRequests,
          requestsData,
        },
      });
    } catch (err: any) {
      return handleResponses({ status: false, error: err });
    }
  }
}

export const FetchGroupActivityData = new FetchGroupActivityClass();
