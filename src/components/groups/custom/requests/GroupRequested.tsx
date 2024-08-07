"use client";
import React from "react";
import RequestsSection from "./RequestsSection";
import { useGroupRequests } from "@/src/hooks/groups/custom/requests/useGroupRequests";

export default function GroupRequested({ groupID }: { groupID: string }) {
  const { requested, setSuccess } = useGroupRequests(groupID);

  if (requested)
    return (
      <div className="w-full">
        <RequestsSection
          groupID={groupID}
          data={requested}
          reload={setSuccess}
        />
      </div>
    );
}
