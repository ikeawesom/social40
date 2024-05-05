import { dbHandler } from "@/src/firebase/db";
import GroupActivities, { GroupActivitiesType } from "./GroupActivities";

export async function GroupActivitiesServer({
  admin,
  groupID,
}: {
  admin: boolean;
  groupID: string;
}) {
  try {
    // get group activities
    const { error, data } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
    });
    if (error) throw new Error(error);

    const groupActivitiesData = data as GroupActivitiesType;

    return (
      <GroupActivities
        groupID={groupID}
        admin={admin}
        activitiesData={groupActivitiesData}
      />
    );
  } catch (err: any) {
    return (
      <div className="min-h-[10vh] bg-white grid place-items-center p-4 rounded-md">
        <p className="text-sm text-custom-grey-text text-center">
          Hmm, something went wrong here. <br /> ERROR: {err.message}
        </p>
      </div>
    );
  }
}
