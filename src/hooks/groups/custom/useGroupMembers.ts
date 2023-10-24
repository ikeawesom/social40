import { dbHandler } from "@/src/firebase/db";
import {
  GROUP_EVENTS_SCHEMA,
  GROUP_MEMBERS_SCHEMA,
} from "@/src/utils/schemas/groups";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useEffect, useState } from "react";

type GroupDetailsType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};
export function useGroupMembers(groupID: string) {
  const [membersList, setMembersList] = useState<GroupDetailsType | null>();
  const [error, setError] = useState();

  useEffect(() => {
    const handleFetch = async (groupID: string) => {
      const res = await dbHandler.getDocs({
        col_name: `GROUPS/${groupID}/MEMBERS`,
      });

      if (!res.status) return setError(res.error.message);
      const fetched = res.data as GROUP_MEMBERS_SCHEMA[];

      // group is empty
      const empty = fetched.length === 0;
      if (empty) return setMembersList({});

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

      setMembersList(tempA);
    };

    if (membersList === undefined) handleFetch(groupID);
  }, [groupID]);

  return { error, membersList };
}
