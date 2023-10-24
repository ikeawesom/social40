import React, { useState } from "react";
import DefaultCard from "../../../DefaultCard";
import Image from "next/image";
import RequestedUser from "./RequestedUser";
import { WaitListData } from "@/src/hooks/groups/custom/requests/useGroupRequests";

export default function RequestsSection({
  data,
  groupID,
}: {
  data?: WaitListData;
  groupID?: string;
}) {
  const [show, setShow] = useState(false);
  if (data)
    return (
      <DefaultCard className="py-2 px-3">
        {!groupID ? (
          <p className="text-sm text-custom-grey-text text-center">
            No requests for now! Invite others.
          </p>
        ) : (
          <div className="flex flex-col items-center justify-start w-full">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-custom-dark-text font-semibold text-sm flex gap-1 items-center justify-start text-start">
                Requests
                <span className="bg-custom-red text-custom-light-text font-medium px-1 rounded-full text-xs text-center">
                  {Object.keys(data).length > 10
                    ? "9+"
                    : Object.keys(data).length}
                </span>
              </h1>
              <Image
                onClick={() => setShow(!show)}
                src="/icons/icon_arrow-down.svg"
                alt="Show"
                width={30}
                height={30}
                className={`duration-300 ${show ? "rotate-180" : ""}`}
              />
            </div>
            {show && (
              <div className="w-full flex-col flex items-center justify-start max-h-[30vh] overflow-y-scroll rounded-lg">
                {Object.keys(data).map((item) => (
                  <RequestedUser
                    groupID={groupID}
                    className="py-2 px-3 rounded-none"
                    key={data[item].memberID}
                    data={data[item]}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </DefaultCard>
    );
}
