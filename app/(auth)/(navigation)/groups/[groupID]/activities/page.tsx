import GroupFeedCard from "@/src/components/feed/GroupFeedCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { cookies } from "next/headers";

export default async function GroupPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  const memberID = data.value;

  const res = await dbHandler.getSpecific({
    path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
    orderCol: "activityDate",
    ascending: false,
  });

  if (!res.status) return ErrorScreenHandler(res.error);

  const groupActivities = res.data as {
    [groupID: string]: GROUP_ACTIVITY_SCHEMA;
  };

  return (
    <>
      <HeaderBar back text={`Activities`} />
      <div className="grid place-items-center">
        <div className="max-w-[500px] w-full">
          <div className="flex flex-col items-center justify-start w-full gap-4">
            {Object.keys(groupActivities).map((activityID: string) => {
              const data = groupActivities[activityID] as GROUP_ACTIVITY_SCHEMA;
              return (
                <GroupFeedCard
                  memberID={memberID}
                  key={activityID}
                  activityData={data}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
