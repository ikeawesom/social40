"use client";
import React, { useState } from "react";
import ActivityDownloadButton from "./ActivityDownloadButton";
import {
  ACTIVITY_DATA_SCHEMA,
  MEMBER_SCHEMA,
} from "@/src/utils/schemas/members";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import { useHostname } from "@/src/hooks/useHostname";
import { toast } from "sonner";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import handleResponses from "@/src/utils/handleResponses";
import { twMerge } from "tailwind-merge";

export default function ActivityDownloadSection({
  activityData,
  memberID,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
  memberID: string;
}) {
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const [activityDownload, setActivityDownload] =
    useState<ACTIVITY_DATA_SCHEMA>({
      activityID: activityData.activityID,
      activityTitle: activityData.activityTitle,
      participants: {},
    });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await FetchGroupActivityData.getMain({
        activityID: activityData.activityID,
        groupID: activityData.groupID,
        memberID,
        host,
      });
      if (!res.status) throw new Error(res.error);
      const { participantsData, fallouts } = res.data;
      const participantKeys = Object.keys(participantsData)
        .concat(Object.keys(fallouts))
        .sort();

      const promiseArr = participantKeys.map(async (memberID: string) => {
        const postObj = GetPostObj({ memberID });
        const res = await fetch(`${host}/api/profile/member`, postObj);
        const body = await res.json();
        if (!body.status)
          return handleResponses({ status: false, error: body.error });
        const { rank, displayName } = body.data as MEMBER_SCHEMA;
        const participated = Object.keys(participantsData).includes(memberID);
        return handleResponses({
          data: { displayName, rank, memberID, participated },
        });
      });

      const arrData = await Promise.all(promiseArr);
      let participants = {} as any;

      arrData.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
        const { displayName, rank, memberID, participated } = item.data;

        participants[memberID] = {
          displayName: displayName.toUpperCase(),
          rank: rank.toUpperCase(),
          memberID,
          participated,
        };
      });
      setActivityDownload({ ...activityDownload, participants });
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-2">
      <p
        className={twMerge(
          "text-sm text-custom-grey-text text-center duration-150",
          loading ? "" : "underline cursor-pointer hover:opacity-70"
        )}
        onClick={handleGenerate}
      >
        {loading ? "Generating..." : "Download Activity Data"}
      </p>
      {!loading && activityDownload && (
        <ActivityDownloadButton activityData={activityDownload} />
      )}
    </div>
  );
}
