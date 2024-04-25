"use client";
import React from "react";
import Image from "next/image";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { useDownloadHA } from "@/src/hooks/groups/HA/useDownloadHA";

export type HATableRowType = { [date: string]: string };
export default function DownloadHAButton({
  groupID,
  reportID,
}: {
  groupID: string;
  reportID: string;
}) {
  const { download, loading } = useDownloadHA(groupID, reportID);
  return (
    <SecondaryButton
      disabled={loading}
      className="flex items-center justify-center gap-1"
      onClick={download}
    >
      Download data{" "}
      {loading ? (
        <LoadingIcon height={15} width={15} />
      ) : (
        <Image src="/icons/icon_download.svg" alt="" width={15} height={15} />
      )}
    </SecondaryButton>
  );
}
