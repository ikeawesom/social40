import React from "react";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import FeedGroupClient from "./FeedGroupClient";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { FetchPaginateActivity } from "@/src/utils/home/ActivityFeed";

export default async function FeedGroup({
  groupID,
  memberID,
  all,
}: {
  groupID: string;
  memberID: string;
  all?: string[] | null;
}) {
  try {
    // get all hidden activity IDs from member data
    const { data: memberRes, error: hiddenErr } = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });
    if (hiddenErr) throw new Error(hiddenErr);

    const memberData = memberRes as MEMBER_SCHEMA;
    const hiddenActivities = memberData.hiddenActivities ?? [];

    let path = `GROUPS/${groupID}/GROUP-ACTIVITIES`;
    let config = null as null | {
      field: string;
      criteria: string;
      value: any;
    };

    if (all) {
      path = "GROUP-ACTIVITIES";
      config = { field: "groupID", criteria: "in", value: all };
    }

    // fetch activities with groupID
    const { data: activitiesRes, error: actErr } = await FetchPaginateActivity({
      hidden: hiddenActivities,
      path,
      config: config ?? null,
    });

    if (actErr) throw new Error(actErr);
    const { data, lastPointer } = activitiesRes;
    const groupActivities = data as GROUP_ACTIVITIES_SCHEMA[];

    return (
      <FeedGroupClient
        lastPointerServer={lastPointer}
        activities={groupActivities}
        hidden={hiddenActivities}
        path={path}
        config={config}
      />
    );
  } catch (err) {
    return ErrorScreenHandler(err);
  }
}
