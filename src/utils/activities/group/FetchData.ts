import { ActivityWaitlistType } from "@/src/components/groups/custom/activities/ActivityWaitlist";
import { GetPostObj } from "../../API/GetPostObj";
import { TimestampToDateString, ActiveTimestamp } from "../../getCurrentDate";
import {
  GROUP_ACTIVITY_SCHEMA,
  GROUP_ACTIVITY_PARTICIPANT,
} from "../../schemas/group-activities";
import handleResponses from "../../handleResponses";
import { ROLES_HIERARCHY } from "../../constants";
import { dbHandler } from "@/src/firebase/db";

type GroupActivityClassType = {
  memberID: string;
  groupID: string;
  activityID: string;
  host: string;
};

class FetchGroupActivityClass {
  async getMain({
    memberID,
    groupID,
    activityID,
    host,
  }: GroupActivityClassType) {
    try {
      // check if logged in member is member of group
      const UserObj = GetPostObj({
        memberID: memberID,
        groupID: groupID,
      });
      const res = await fetch(`${host}/api/groups/memberof`, UserObj);
      const body = await res.json();

      // get group activity data
      const PostObjActivity = GetPostObj({ activityID: activityID });
      const resA = await fetch(
        `${host}/api/activity/group-get`,
        PostObjActivity
      );
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);

      const activityData = bodyA.data.activityData as GROUP_ACTIVITY_SCHEMA;
      const participantsData = bodyA.data.participantsData as {
        [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
      };

      let currentParticipant = false;

      if (memberID in participantsData) currentParticipant = true;

      const date = activityData.activityDate;
      const dateStr = TimestampToDateString(date);

      const active = ActiveTimestamp(date);
      const restrictionStatus = activityData.groupRestriction;
      const currentMember = body.status;

      const canJoin =
        (!restrictionStatus || (currentMember && restrictionStatus)) &&
        !currentParticipant;

      const owner = activityData.createdBy === memberID;

      let admin = false;
      if (body.status) {
        const role = body.data.role;
        admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;
      }

      const resB = await dbHandler.getSpecific({
        path: `GROUP-ACTIVITIES/${activityID}/FALLOUTS`,
        orderCol: "memberID",
        ascending: true,
      });

      if (!resB.status) throw new Error(resB.error);

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
          fallouts: resB.data,
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
