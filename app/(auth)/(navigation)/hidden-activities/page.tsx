import HiddenActivitiesSection from "@/src/components/feed/HiddenActivitiesSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import { dbHandler } from "@/src/firebase/db";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export default async function EditProfilePage() {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const host = process.env.HOST;

  try {
    const PostObj = GetPostObj({
      memberID: memberID,
    });

    // fetch member data from server
    const res = await fetch(`${host}/api/profile/member`, PostObj);
    const data = await res.json();

    if (!data.status) throw new Error(data.error);

    const memberData = data.data as MEMBER_SCHEMA;

    const { hiddenActivities } = memberData;

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
          const { error, data } = await dbHandler.get({
            col_name: "GROUP-ACTIVITIES",
            id: activityID,
          });
          if (error) {
            //// activity deleted
            // remove from hidden activities list
            hiddenActivities.filter((value: string) => value !== activityID);
            const resA = await dbHandler.edit({
              col_name: "MEMBERS",
              id: memberID,
              data: {
                hiddenActivities,
              },
            });
            if (!resA.status) throw new Error(resA.error);
          }
          return handleResponses({ data });
        } catch (err: any) {
          return handleResponses({ status: false, error: err.message });
        }
      }
    );

    const activitiesArr = await Promise.all(activitiesPromise);

    const actArr = [] as GROUP_ACTIVITY_SCHEMA[];
    activitiesArr.forEach((item: any) => {
      if (item.data) {
        const activityData = item.data as GROUP_ACTIVITY_SCHEMA;
        actArr.push(activityData);
      }
    });

    return (
      <>
        <HeaderBar text="Hidden Activities" back />
        <div className="grid place-items-center">
          <div className="max-w-[500px] flex w-full flex-col items-start justify-start gap-4">
            <HiddenActivitiesSection
              groupActivitiesData={JSON.parse(JSON.stringify(actArr))}
            />
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
