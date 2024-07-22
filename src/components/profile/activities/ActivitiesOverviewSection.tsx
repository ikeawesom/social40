import React from "react";
import CircleProgess from "../../utils/circular-progressbar/CircleProgess";
import ProfileStatSection from "../ProfileStatSection";
import { dbHandler } from "@/src/firebase/db";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import { getInvolvedGroups } from "@/src/utils/groups/getInvolvedGroups";
import { getMemberFallouts } from "@/src/utils/members/getMemberFallouts";
import { FALLOUTS_SCHEMA } from "@/src/utils/schemas/activities";
import ViewFalloutsModal from "./ViewFalloutsModal";

export default async function ActivitiesOverviewSection({
  memberID,
}: {
  memberID: string;
}) {
  const { groupsList } = await getInvolvedGroups(memberID);

  let {
    data: groupActivities,
  }: { data: { [id: string]: GROUP_ACTIVITY_SCHEMA } } =
    await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: true,
      field: "groupID",
      criteria: "in",
      value: groupsList,
    });

  if (groupActivities === null) groupActivities = {};

  const { data: activitiesFellout }: { data: FALLOUTS_SCHEMA[] } =
    await getMemberFallouts(memberID, Object.keys(groupActivities));

  const {
    data: participated,
  }: { data: { [id: string]: GROUP_ACTIVITY_PARTICIPANT } } =
    await dbHandler.getSpecific({
      path: `MEMBERS/${memberID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
    });

  const noParticipated = Object.keys(participated).length;
  const noFallouts = activitiesFellout.length;
  const total = noParticipated + noFallouts;
  const percentParticipated =
    total === 0
      ? 0
      : Math.round((Number.EPSILON + (noParticipated / total) * 100) * 10) / 10;
  const totalActivities = noParticipated + noFallouts;

  return (
    <div className="flex items-center justify-start flex-col w-full gap-1">
      <h1 className="text-xl mb-2 font-bold text-center text-custom-dark-text">
        Overview
      </h1>
      {/* <div className="flex items-center justify-center gap-2 flex-col">
        <div className="w-[120px] h-[120px] mb-2">
          <CircleProgess
            value={percentParticipated}
            config={{
              first: 75,
              second: 50,
              higherBetter: true,
            }}
          >
            <p className="text-xs max-w-[70px] text-center">
              Participation Rate
            </p>
          </CircleProgess>
        </div>
      </div> */}
      <div className="flex items-center justify-center gap-4 my-2 w-full">
        <ProfileStatSection
          title="Participated"
          config={{
            first: (75 / 100) * totalActivities,
            second: (50 / 100) * totalActivities,
            higherBetter: true,
          }}
          value={noParticipated}
          className="flex-1"
        />
        <ViewFalloutsModal
          activitiesFellout={activitiesFellout}
          totalActivities={totalActivities}
        />
      </div>
      <p className="text-xs text-custom-grey-text text-center max-w-[95%] mb-3">
        These values are calculated based on the activities from this {memberID}
        's groups.
      </p>
    </div>
  );
}
