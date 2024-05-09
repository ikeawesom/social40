import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import { dbHandler } from "@/src/firebase/db";
import { getUpdatedMembers, sortMembersList } from "./handleGroupStrength";
import { Suspense } from "react";
import { GroupNumbersServer } from "./GroupNumbersServer";
import StrengthSkeleton from "./StrengthSkeleton";
import { GroupStatusesServer } from "./GroupStatusesServer";
import HRow from "@/src/components/utils/HRow";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import CalculateHAButton from "../HA/CalculateHAButton";
import ErrorSection from "@/src/components/utils/ErrorSection";

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
      <>
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
                  "text-start underline text-sm duration-150 text-custom-grey-text hover:text-custom-primary"
                )}
              >
                View HA Reports
              </Link>
            </>
          </>
        )}
      </>
    );
  } catch (err: any) {
    return <ErrorSection errorMsg={err.message} />;
  }
}
