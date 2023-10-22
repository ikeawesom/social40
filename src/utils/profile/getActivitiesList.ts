import { dbHandler } from "@/src/firebase/db";
import { MemberIDType } from "./getFriendsList";
import { ACTIVITY_SCHEMA } from "../schemas/activities";
import { MEMBER_SCHEMA } from "../schemas/members";

export async function getActivitiesList({ memberID }: MemberIDType) {
  var activitiesData = {} as { [activityID: string]: ACTIVITY_SCHEMA };
  var activitiesDataWithName = {} as { [activityID: string]: ACTIVITY_SCHEMA };

  const activities = await dbHandler.getSpecific({
    path: "ACTIVITIES",
    field: "createdBy",
    criteria: "==",
    value: memberID,
  });

  if (!activities.status) return activitiesData;

  Object.keys(activities.data).forEach((key: string) => {
    activitiesData[key] = activities.data[key];
  });

  const activitiesKeys = Object.keys(activitiesData);

  const promises = activitiesKeys.map(async (activityID: string) => {
    const memberID = activities.data[activityID]["createdBy"];
    const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });

    if (res.status) {
      const memberData = res.data as any as MEMBER_SCHEMA;
      const displayName = memberData.displayName;

      const temp = activitiesData[activityID];
      return {
        ...activitiesDataWithName,
        [activityID]: { ...temp, createdByName: displayName },
      };
    }
  });

  const updatedActivitiesData = await Promise.all(promises);

  if (!updatedActivitiesData)
    return activitiesData as { [activityID: string]: ACTIVITY_SCHEMA };

  updatedActivitiesData.forEach((item: any) => {
    Object.keys(item).forEach((activityID: string) => {
      activitiesData[activityID] = item[activityID];
    });
  });

  return activitiesData as { [activityID: string]: ACTIVITY_SCHEMA };
}
