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
import ErrorSection from "@/src/components/utils/ErrorSection";
import { Timestamp } from "firebase/firestore";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import Image from "next/image";

export async function GroupStrengthServer({
  groupID,
  admin,
  currentMember,
  lastUpdatedHA,
}: {
  groupID: string;
  currentMember: GROUP_MEMBERS_SCHEMA;
  admin: boolean;
  lastUpdatedHA: Timestamp;
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
              <Link
                scroll={false}
                href={`/groups/${groupID}/HA-report`}
                className={twMerge("w-full")}
              >
                <PrimaryButton className="flex items-center justify-center gap-2">
                  View Group HA Reports
                  <Image
                    alt=""
                    src="/icons/features/icon_bolt.svg"
                    width={13}
                    height={13}
                  />
                </PrimaryButton>
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
