"use client";
import React, { useState } from "react";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import {
  GROUP_MEMBERS_SCHEMA,
  GroupDetailsType,
} from "@/src/utils/schemas/groups";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";
import { twMerge } from "tailwind-merge";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import InviteMemberForm from "./InviteMemberForm";
import HRow from "../../utils/HRow";
import PrimaryButton from "../../utils/PrimaryButton";
import handleBookIn from "@/src/hooks/groups/custom/handleBookIn";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import SecondaryButton from "../../utils/SecondaryButton";

export default function GroupMembers({
  membersList,
  groupID,
  curMember,
}: {
  membersList: GroupDetailsType;
  groupID: string;
  curMember: GROUP_MEMBERS_SCHEMA;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [online, setOnline] = useState(0);
  const { itemList, search, handleSearch } = useQueryObj({ obj: membersList });
  const admin =
    GROUP_ROLES_HEIRARCHY[curMember.role].rank >=
    GROUP_ROLES_HEIRARCHY["admin"].rank;

  const [biboLoad, setBiboLoad] = useState(false);
  const [bookingIn, setBookingIn] = useState({
    state: false,
    members: [] as string[],
  });

  const confirmBookIn = async () => {
    if (
      confirm(
        "Are you sure you want to book in selected members of this group?"
      )
    ) {
      setBiboLoad(true);
      try {
        const res = await handleBookIn(bookingIn.members);
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully booked in selected members in group");
        router.refresh();
        setBookingIn({ members: [], state: false });
      } catch (err: any) {
        toast.error(err.message);
      }
      setBiboLoad(false);
    }
  };

  const addOnline = () => setOnline((online) => online + 1);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <h1
        onClick={() => setShow(!show)}
        className={twMerge(
          "text-start cursor-pointer underline text-sm duration-150",
          !show ? "text-custom-grey-text" : "text-custom-primary"
        )}
      >
        {show ? "Hide Breakdown" : "View Breakdown"}
      </h1>
      {show && (
        <>
          <QueryInput
            placeholder="Search for Member ID"
            handleSearch={handleSearch}
            search={search}
          />
          {/* <div className="flex items-center justify-end gap-1 w-fit">
            <p className="text-xs text-custom-grey-text">{online} in camp</p>
            <StatusDot className="w-1 h-1" status />
          </div> */}
          <InnerContainer className="max-h-[60vh] relative">
            {admin && (
              <div className="w-full flex flex-col gap-2 items-start justify-start p-2 pt-0 sticky top-0 left-0 z-10 bg-white shadow-sm">
                <SecondaryButton
                  disabled={biboLoad}
                  onClick={() => {
                    if (bookingIn.state) {
                      setBookingIn({ ...bookingIn, members: [], state: false });
                    } else {
                      setBookingIn({ ...bookingIn, state: true });
                    }
                  }}
                  className="w-fit"
                >
                  {biboLoad ? (
                    <LoadingIconBright width={20} height={20} />
                  ) : bookingIn.state ? (
                    "Cancel"
                  ) : (
                    "Book In Members"
                  )}
                </SecondaryButton>
                {bookingIn.state && (
                  <form className="w-full flex items-center justify-between gap-4">
                    <p
                      className="underline text-sm text-custom-grey-text cursor-pointer"
                      onClick={() => {
                        const curArray = bookingIn.members;
                        Object.keys(membersList).forEach((id: string) => {
                          if (!bookingIn.members.includes(id))
                            curArray.push(id);
                        });
                        setBookingIn({ ...bookingIn, members: curArray });
                      }}
                    >
                      Select All
                    </p>
                    <div className="flex gap-2 items-center justify-end">
                      <p className="text-sm text-custom-grey-text">
                        Selected: {bookingIn.members.length}
                      </p>
                      <PrimaryButton
                        disabled={biboLoad || bookingIn.members.length < 1}
                        onClick={confirmBookIn}
                        className="w-fit"
                      >
                        {biboLoad ? (
                          <LoadingIconBright width={20} height={20} />
                        ) : (
                          "Confirm"
                        )}
                      </PrimaryButton>
                    </div>
                  </form>
                )}
              </div>
            )}
            {Object.keys(itemList).map((item) => (
              <GroupMemberTab
                handleBibo={{ state: bookingIn, action: setBookingIn }}
                addOnline={addOnline}
                curMember={curMember}
                groupID={groupID}
                key={item}
                data={itemList[item]}
              />
            ))}
          </InnerContainer>
          {admin && (
            <>
              <HRow />
              <InviteMemberForm membersList={membersList} groupID={groupID} />
            </>
          )}
        </>
      )}
    </div>
  );
}
