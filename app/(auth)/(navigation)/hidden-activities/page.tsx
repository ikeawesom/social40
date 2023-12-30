import GroupFeedCard from "@/src/components/feed/GroupFeedCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import handleResponses from "@/src/utils/handleResponses";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { cookies } from "next/headers";

export default async function EditProfilePage() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  const memberID = data.value;
  try {
    const host = process.env.HOST;

    const PostObj = GetPostObj({
      memberID: memberID,
    });

    // fetch member data from server
    const res = await fetch(`${host}/api/profile/member`, PostObj);
    const data = await res.json();

    if (!data.status) throw new Error(data.error);

    const memberData = data.data as MEMBER_SCHEMA;

    const { hiddenActivities } = memberData;

    var groupActivitiesData = {} as {
      [activiyID: string]: GROUP_ACTIVITY_SCHEMA;
    };

    if (hiddenActivities === undefined || hiddenActivities.length === 0) {
      return (
        <>
          <HeaderBar text="Hidden Activities" back />
          <ErrorActivities text="Well, looks like there are no activites here for you." />
        </>
      );
    }

    const activitiesPromise = hiddenActivities.map(
      async (activityID: string) => {
        try {
          const ActivityObj = GetPostObj({ activityID });
          const res = await fetch(
            `${host}/api/activity/group-get`,
            ActivityObj
          );
          const body = await res.json();
          if (!body.status) throw new Error(body.error);

          return handleResponses({ data: body.data });
        } catch (err: any) {
          return handleResponses({ status: false, error: err.message });
        }
      }
    );

    const activitiesArr = await Promise.all(activitiesPromise);

    activitiesArr.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
      const activityData = item.data.activityData as GROUP_ACTIVITY_SCHEMA;
      groupActivitiesData[activityData.activityID] = activityData;
    });

    return (
      <>
        <HeaderBar text="Hidden Activities" back />
        <div className="flex w-full flex-col items-start justify-start gap-4">
          {Object.keys(groupActivitiesData).map((activityID: string) => {
            const data = groupActivitiesData[
              activityID
            ] as GROUP_ACTIVITY_SCHEMA;
            return (
              <GroupFeedCard
                show
                key={activityID}
                memberID={memberID}
                activityData={data}
              />
            );
          })}
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
