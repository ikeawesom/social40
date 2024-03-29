import React from "react";
import { GroupDetailsType } from "@/src/components/groups/custom/GroupMembers";
import { GroupStatusType } from "@/src/components/groups/custom/GroupStrengthSection";
import FullStatusList from "@/src/components/groups/custom/statuses/FullStatusList";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (data) {
    const memberID = data.value;

    try {
      const host = process.env.HOST;

      const PostObj = GetPostObj({ groupID });
      // check if member is in group
      const groupPostObj = GetPostObj({ groupID, memberID });
      const res = await fetch(`${host}/api/groups/memberof`, groupPostObj);
      const body = await res.json();
      if (!body.status) return <RestrictedScreen />;

      const currentMember = body.data as GROUP_MEMBERS_SCHEMA;
      const { role } = currentMember;
      const admin =
        GROUP_ROLES_HEIRARCHY[role].rank >= GROUP_ROLES_HEIRARCHY["admin"].rank;

      if (!admin) return <RestrictedScreen />;

      // get group members
      const resB = await fetch(`${host}/api/groups/members`, PostObj);
      const bodyB = await resB.json();

      if (!bodyB.status) throw new Error(bodyB.error);
      const groupMembers = bodyB.data as GroupDetailsType;

      // get group statuses
      const memberIDList = Object.keys(groupMembers);
      const to_send = {
        groupID: groupID,
        list: memberIDList,
      };

      const StatusObj = GetPostObj(to_send);
      const resC = await fetch(`${host}/api/groups/statuses`, StatusObj);
      const bodyC = await resC.json();

      if (!bodyC.status) throw new Error(bodyC.error);

      const groupStatusList = {} as GroupStatusType;

      const dataC = bodyC.data as any[];

      dataC.forEach((item: any) => {
        // handle group members
        const data = item.data;
        const memberID = Object.keys(data)[0];
        const memberStatusObj = data[memberID];
        groupStatusList[memberID] = memberStatusObj;
      });

      let sortedIDs = Object.keys(groupStatusList).sort(
        (a: string, b: string) => {
          return Object.keys(groupStatusList[a]).length >
            Object.keys(groupStatusList[b]).length
            ? -1
            : 1;
        }
      );

      const sortedGroupStatusList = {} as GroupStatusType;

      sortedIDs.forEach((id: string) => {
        sortedGroupStatusList[id] = groupStatusList[id];
      });

      return (
        <>
          <HeaderBar back text={`All Statuses`} />
          <div className="grid place-items-center">
            <div className="max-w-[500px] w-full">
              <div className="flex flex-col items-center justify-start w-full gap-4">
                <FullStatusList groupStatusList={sortedGroupStatusList} />
              </div>
            </div>
          </div>
        </>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
