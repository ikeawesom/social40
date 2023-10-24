import React from "react";
import LoadingScreenSmall from "../../screens/LoadingScreenSmall";
import RequestsSection from "./requests/RequestsSection";
import { useGroupRequests } from "@/src/hooks/groups/custom/requests/useGroupRequests";

export default function GroupRequested({ groupID }: { groupID: string }) {
  const { requested } = useGroupRequests(groupID);

  return (
    <div className="w-full">
      {requested === undefined ? (
        <LoadingScreenSmall width={30} height={30} />
      ) : requested === null ? (
        <RequestsSection />
      ) : (
        <RequestsSection groupID={groupID} data={requested} />
      )}
    </div>
  );
}
