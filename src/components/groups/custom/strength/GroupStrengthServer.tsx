import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import { dbHandler } from "@/src/firebase/db";
import DefaultCard from "@/src/components/DefaultCard";
import { getUpdatedMembers, sortMembersList } from "./handleGroupStrength";
import { Suspense } from "react";
import { GroupNumbersServer } from "./GroupNumbersServer";
import StrengthSkeleton from "./StrengthSkeleton";
import { GroupStatusesServer } from "./GroupStatusesServer";
import HRow from "@/src/components/utils/HRow";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import CalculateHAButton from "../HA/CalculateHAButton";

export async function GroupStrengthServer({
  groupID,
  admin,
  currentMember,
}: {
  groupID: string;
  currentMember: GROUP_MEMBERS_SCHEMA;
  admin: boolean;
}) {
  try {
    // get group members
    const { error: groupMembersErr, data: groupMembersData } =
      await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        orderCol: "role",
        ascending: true,
        orderCol2: "memberID",
        ascending2: true,
      });

    if (groupMembersErr) throw new Error(groupMembersErr);

    const tempList = await getUpdatedMembers(groupMembersData);
    // sort members according to permissions
    const membersList = sortMembersList(tempList);

    const parsed = JSON.parse(JSON.stringify(membersList));

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start gap-2">
        <Suspense fallback={<StrengthSkeleton />}>
          <GroupNumbersServer
            membersList={parsed}
            currentMember={currentMember}
            groupID={groupID}
          />
        </Suspense>
        {admin && (
          <>
            <Suspense fallback={<StrengthSkeleton />}>
              <GroupStatusesServer groupID={groupID} membersList={parsed} />
            </Suspense>
            <>
              <HRow />
              <CalculateHAButton groupID={groupID} membersList={parsed} />
              <Link
                href={`/groups/${groupID}/HA-report`}
                className={twMerge(
                  "text-start cursor-pointer underline text-sm duration-150 text-custom-grey-text"
                )}
              >
                View HA Reports
              </Link>
            </>
          </>
        )}
      </DefaultCard>
    );
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
