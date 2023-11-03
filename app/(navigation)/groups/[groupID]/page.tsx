import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { cookies } from "next/headers";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import GroupHeader from "@/src/components/groups/custom/GroupHeader";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import GroupMembers, {
  GroupDetailsType,
} from "@/src/components/groups/custom/GroupMembers";
import GroupRequested from "@/src/components/groups/custom/GroupRequested";
import SettingsSection from "@/src/components/groups/custom/settings/SettingsSection";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import GroupStatusSection, {
  GroupStatusType,
} from "@/src/components/groups/custom/GroupStatusSection";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import GroupLeaderboard, {
  MembersDataType,
} from "@/src/components/groups/custom/GroupLeaderboard";
import GroupTraining from "@/src/components/groups/custom/GroupTraining";

export async function generateMetadata({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  return {
    title: groupID,
  };
}

export default async function GroupPage({
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

      // check if member is in group
      const groupPostObj = GetPostObj({ groupID, memberID });
      const res = await fetch(`${host}/api/groups/memberof`, groupPostObj);
      const body = await res.json();
      if (!body.status) return <RestrictedScreen />;

      const { role } = body.data as GROUP_MEMBERS_SCHEMA;
      const owner = role === "owner";
      const admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;

      // get group data
      const PostObj = GetPostObj({ groupID });
      const resA = await fetch(`${host}/api/groups/custom`, PostObj);
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);
      const { createdBy, groupName, groupDesc } = bodyA.data as GROUP_SCHEMA;

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

      const resC = await fetch(`${host}/api/groups/statuses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(to_send),
        cache: "no-store" as "no-store",
      });

      const bodyC = await resC.json();

      if (!bodyC.status) throw new Error(bodyC.error);

      const groupStatusList = {} as GroupStatusType;

      const dataC = bodyC.data as any[];

      const memberPromises = dataC.map(async (item: any) => {
        // handle group members
        const data = item.data;
        const memberID = Object.keys(data)[0];
        const memberStatusObj = data[memberID];
        groupStatusList[memberID] = memberStatusObj;

        // handle members list
        const PostObjA = GetPostObj({ memberID });
        const res = await fetch(`${host}/api/profile/member`, PostObjA);
        const body = await res.json();

        if (!body.status) return { status: false, error: body.error };
        return { status: true, data: body.data };
      });

      const membersPromiseList = await Promise.all(memberPromises);

      var groupMembersDataObj = {} as any;

      membersPromiseList.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
        const memberData = item.data as MEMBER_SCHEMA;
        const memberID = memberData.memberID as string;
        groupMembersDataObj[memberID] = memberData;
      });

      const groupMembersData = groupMembersDataObj as MembersDataType;

      return (
        <>
          <HeaderBar back text={groupID} />
          <div className="grid place-items-center">
            <div className="max-w-[500px] w-full">
              <div className="flex flex-col items-center justify-start w-full gap-4">
                <GroupHeader
                  owner={createdBy}
                  title={groupName}
                  desc={groupDesc}
                />
                {owner && <GroupRequested groupID={groupID} />}
                <GroupMembers membersList={groupMembers} />
                <GroupLeaderboard memberData={groupMembersData} />
                <GroupTraining />
                {admin && (
                  <GroupStatusSection
                    adminID={memberID}
                    GroupStatusList={groupStatusList}
                  />
                )}
                {owner && <SettingsSection groupID={groupID} />}
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
