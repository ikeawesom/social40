import React from "react";
import { handleGroupStatuses } from "./handleGroupStatuses";
import GroupStatusesSection from "./GroupStatusesSection";
import { GroupDetailsType } from "@/src/utils/schemas/groups";

export async function GroupStatusesServer({
  membersList,
  groupID,
}: {
  membersList: GroupDetailsType;
  groupID: string;
}) {
  try {
    const { error, data } = await handleGroupStatuses(Object.keys(membersList));
    if (error) throw new Error(error);
    const parsed = JSON.parse(JSON.stringify(data));

    return <GroupStatusesSection GroupStatusList={parsed} groupID={groupID} />;
  } catch (err: any) {
    return (
      <div className="w-full h-[10vh] grid place-items-center p-4 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm">
            Hmm, an error has occurred and we are unable to load the strength.
            Please try again later.
          </p>
          <p className="text-sm text-custom-grey-text">
            ERROR: {err.message ?? "Unknown Error"}
          </p>
        </div>
      </div>
    );
  }
}
