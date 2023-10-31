import { GroupDetailsType } from "@/src/components/groups/custom/GroupMembers";
import { dbHandler } from "@/src/firebase/db";
import { WaitListData } from "@/src/hooks/groups/custom/requests/useGroupRequests";
import { getMethod } from "@/src/utils/API/getAPIMethod";
import { getJoinedGroups } from "@/src/utils/groups/getJoinedGroups";
import { getOwnedGroups } from "@/src/utils/groups/getOwnedGroups";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { option } = getMethod(request.url);
  const fetchedData = await request.json();

  const { memberID, groupID } = fetchedData;

  if (option === "owned") {
    // fetch owned groups
    const res = await getOwnedGroups({ memberID });
    return NextResponse.json({ status: true, data: res });
  } else if (option === "joined") {
    // fetched joined groups
    const res = await getJoinedGroups({ memberID });
    return NextResponse.json({ status: true, data: res });
  } else if (option === "memberof") {
    // check if member in group
    const res = await dbHandler.get({
      col_name: `GROUPS/${groupID}/MEMBERS`,
      id: memberID,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });

    const memberData = res.data as GROUP_MEMBERS_SCHEMA;
    return NextResponse.json({ status: true, data: memberData });
  } else if (option === "custom") {
    // custom group data
    const res = await dbHandler.get({ col_name: "GROUPS", id: groupID });
    if (!res.status)
      return NextResponse.json({
        status: false,
        error: res.error,
      });

    const groupData = res.data as GROUP_SCHEMA;
    return NextResponse.json({ status: true, data: groupData });
  } else if (option === "waitlist") {
    // manage waitlist methods
    const { sub } = fetchedData;

    if (sub === "get") {
      // fetch all members from waitlist
      const res = await dbHandler.getDocs({
        col_name: `GROUPS/${groupID}/WAITLIST`,
      });

      if (!res.status)
        return NextResponse.json({
          status: false,
          error: res.error,
        });

      const waitlistArr = res.data as any;
      var obj = {} as WaitListData;
      var empty = waitlistArr.length === 0;

      if (empty) return NextResponse.json({ status: true, data: null });

      waitlistArr.forEach((doc: any) => {
        const data = doc.data() as WAITLIST_SCHEMA;
        obj[data.memberID] = data;
      });

      return NextResponse.json({ status: true, data: obj });
    }
  } else if (option === "members") {
    const res = await dbHandler.getDocs({
      col_name: `GROUPS/${groupID}/MEMBERS`,
    });

    if (!res.status)
      return NextResponse.json({ status: false, error: res.error });
    const fetched = res.data as GROUP_MEMBERS_SCHEMA[];

    // group is empty
    const empty = fetched.length === 0;
    if (empty) return NextResponse.json({ status: true, data: null });

    var temp = {} as GroupDetailsType;

    const promises = fetched.map(async (doc: any) => {
      const data = doc.data() as GROUP_MEMBERS_SCHEMA;
      const memberID = data.memberID;
      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
      if (res.status) {
        const memberData = res.data as MEMBER_SCHEMA;
        const displayName = memberData.displayName;
        const bookedIn = memberData.bookedIn;

        return {
          ...temp,
          [memberID]: {
            ...data,
            displayName: displayName,
            bookedIn: bookedIn,
          },
        };
      }
    });

    const groupMemberDetails = await Promise.all(promises);

    // convert from list to object
    var tempA = {} as GroupDetailsType;
    groupMemberDetails.forEach((item: any) => {
      Object.keys(item).forEach((memberIDFetched: string) => {
        tempA = { ...tempA, [memberIDFetched]: item[memberIDFetched] };
      });
    });

    return NextResponse.json({ status: true, data: tempA });
  }
  return NextResponse.json({
    status: false,
    error: "Invalid method provided to API request.",
  });
}
