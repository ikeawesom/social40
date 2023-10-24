import { dbHandler } from "@/src/firebase/db";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useEffect, useState } from "react";
import { useMemberID } from "../../useMemberID";

export function useGroupMembers(groupID: string) {
  const { memberID } = useMemberID();
  const [membersList, setMembersList] = useState<GROUP_MEMBERS_SCHEMA | null>();
  const [error, setError] = useState();

  useEffect(() => {
    const handleFetch = async (groupID: string) => {
      const res = await dbHandler.get({
        col_name: "GROUP_MEMBERS",
        id: groupID,
      });

      if (!res.status) return setError(res.error.message);
      const fetched = res.data as GROUP_MEMBERS_SCHEMA;

      // group is empty
      const empty = Object.keys(fetched).length === 0;
      if (empty) return setMembersList(fetched);

      // fetch members display name from memberID
      const promises = Object.keys(fetched).map(
        async (memberIDFetched: string) => {
          const res = await dbHandler.get({
            col_name: "MEMBERS",
            id: memberIDFetched,
          });

          if (res.status) {
            const data = res.data as MEMBER_SCHEMA;

            return {
              [memberIDFetched]: {
                ...fetched[memberIDFetched],
                displayName: data.displayName,
                bookedIn: data.bookedIn,
              },
            };
          }
        }
      );

      const membersData = await Promise.all(promises);

      // an error had occurred while fetching display name
      membersData.forEach((object) => {
        if (!object) return setMembersList(null);
      });

      // convert from list to object
      var temp = {} as GROUP_MEMBERS_SCHEMA;
      membersData.forEach((item: any) => {
        Object.keys(item).forEach((memberIDFetched: string) => {
          if (memberIDFetched !== memberID)
            temp = { ...temp, [memberIDFetched]: item[memberIDFetched] };
        });
      });

      setMembersList(temp);
    };

    if (membersList === undefined && memberID !== "") handleFetch(groupID);
  }, [groupID, memberID]);

  return { error, membersList };
}
