import React from "react";
import Image from "next/image";
import { ExportExcel } from "@/src/utils/ExportExcel";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { ACTIVITY_DATA_SCHEMA } from "@/src/utils/schemas/members";

type ActivityCols = {
  "MEMBER ID": string;
  "RANK/4D": string;
  NAME: string;
  PARTICIPATED: string;
};

export default function ActivityDownloadButton({
  activityData,
}: {
  activityData: ACTIVITY_DATA_SCHEMA;
}) {
  const download = () => {
    let activityArr = [] as ActivityCols[];
    Object.keys(activityData.participants).forEach((memberID: string) => {
      const data = activityData.participants[memberID];
      const status = data.participated;

      const to_push = {
        "MEMBER ID": data.memberID,
        "RANK/4D": data.rank,
        NAME: data.displayName,
        PARTICIPATED: status ? "1" : "0",
      };
      activityArr.push(to_push);
    });
    const filename = `activity-logs`;
    ExportExcel({ excelData: activityArr, filename });
  };
  return (
    <SecondaryButton
      className="flex items-center justify-center gap-1"
      onClick={download}
    >
      Download data{" "}
      <Image src="/icons/icon_download.svg" alt="" width={15} height={15} />
    </SecondaryButton>
  );
}
