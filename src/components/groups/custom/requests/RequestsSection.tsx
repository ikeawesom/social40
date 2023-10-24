import React from "react";
import DefaultCard from "../../../DefaultCard";
import Image from "next/image";
import RequestedUser from "./RequestedUser";
import { WaitListData } from "@/src/hooks/groups/custom/requests/useGroupRequests";

export default function RequestsSection({
  data,
  empty,
}: {
  data?: WaitListData;
  empty?: boolean;
}) {
  if (data)
    return (
      <DefaultCard className="py-2 px-3">
        {empty ? (
          <p className="text-sm text-custom-grey-text text-center">
            No requests for now! Invite others.
          </p>
        ) : (
          <div className="flex flex-col items-center justify-start w-full">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-custom-dark-text font-semibold text-sm">
                Requests
              </h1>
              <Image
                src="/icons/icon_arrow-down.svg"
                alt="Show"
                width={30}
                height={30}
              />
            </div>
            <div className="w-full flex-col flex items-center justify-start max-h-[20vh] overflow-scroll bg-custom-light-text rounded-lg">
              {Object.keys(data).map((item) => (
                <RequestedUser
                  className="py-1 px-2 rounded-none"
                  key={data[item].memberID}
                  displayName={data[item].displayName}
                  memberID={data[item].memberID}
                />
              ))}
            </div>
          </div>
        )}
      </DefaultCard>
    );
}
