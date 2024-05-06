"use client";
import React, { FormEvent, useState } from "react";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import {
  GROUP_MEMBERS_SCHEMA,
  GroupDetailsType,
} from "@/src/utils/schemas/groups";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";
import { twMerge } from "tailwind-merge";
import {
  GROUP_MEMBERS_SELECT_OPTIONS,
  GROUP_ROLES_HEIRARCHY,
} from "@/src/utils/constants";
import InviteMemberForm from "./InviteMemberForm";
import HRow from "../../utils/HRow";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import SecondaryButton from "../../utils/SecondaryButton";
import AnnouncementTag from "../../announcements/AnnouncementTag";
import FormInputContainer from "../../utils/FormInputContainer";
import PrimaryButton from "../../utils/PrimaryButton";
import Modal from "../../utils/Modal";
import ModalLoading from "../../utils/ModalLoading";
import { handleModify } from "@/src/hooks/groups/custom/handleSelectActions";
import {
  manageAdmin,
  removeMembers,
} from "@/src/hooks/groups/custom/handleMembers";

const DEFAULT_SELECT = {
  state: false,
  members: [] as string[],
};

const DEFAULT_ACTION = Object.keys(GROUP_MEMBERS_SELECT_OPTIONS)[0];

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
  const isAdmin =
    GROUP_ROLES_HEIRARCHY[curMember.role].rank >=
    GROUP_ROLES_HEIRARCHY["admin"].rank;

  const owner = Object.keys(membersList).filter(
    (id: string) => membersList[id].role === "owner"
  )[0];

  const [loading, setLoading] = useState(false);

  const [actions, setActions] = useState(DEFAULT_ACTION);

  const [select, setSelect] = useState(DEFAULT_SELECT);

  const reset = () => {
    setSelect(DEFAULT_SELECT);
    setActions(DEFAULT_ACTION);
  };

  const confirmBookIn = async () => {
    if (
      confirm(
        "Are you sure you want to book in selected members of this group?"
      )
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, { bookedIn: true });
        if (!res.status) throw new Error(res.error);
        toast.success("Successfully welcomed back selected members.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmBookOut = async () => {
    if (
      confirm(
        "Are you sure you want to book out selected members of this group?"
      )
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, { bookedIn: false });
        if (!res.status) throw new Error(res.error);
        toast.success("Happy book out selected members!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmCourse = async () => {
    if (
      confirm("Are you sure you want to mark the selected members on-course?")
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, {
          isOnCourse: true,
          bookedIn: false,
        });
        if (!res.status) throw new Error(res.error);
        toast.success("Great, we marked these members as on-course.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmUncourse = async () => {
    if (
      confirm("Are you sure you want to unmark the selected members on-course?")
    ) {
      setLoading(true);
      try {
        const res = await handleModify(select.members, {
          isOnCourse: false,
          bookedIn: true,
        });
        if (!res.status) throw new Error(res.error);
        toast.success("Welcome back, members as on-course!");
        router.refresh();
        setSelect({ members: [], state: false });
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmRemove = async () => {
    if (
      confirm("Are you sure you want to remove these members from this group?")
    ) {
      setLoading(true);
      try {
        const res = await removeMembers(groupID, select.members);
        if (!res.status) throw new Error(res.error);
        toast.success("Goodbye to those members.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmAdmin = async () => {
    if (confirm("Are you sure you want to make these members admins?")) {
      setLoading(true);
      try {
        const res = await manageAdmin(groupID, select.members, true);
        if (!res.status) throw new Error(res.error);
        toast.success("Great, new admins here!");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const confirmRemAdmin = async () => {
    if (
      confirm("Are you sure you want to remove permissions from these members?")
    ) {
      setLoading(true);
      try {
        const res = await manageAdmin(groupID, select.members, false);
        if (!res.status) throw new Error(res.error);
        toast.success("Well, that was unfortunate for those members.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (actions === "Book In") {
        await confirmBookIn();
      } else if (actions === "Book Out") {
        await confirmBookOut();
      } else if (actions === "Mark as On-Course") {
        await confirmCourse();
      } else if (actions === "Unmark as On-Course") {
        await confirmUncourse();
      } else if (actions === "Remove from Group") {
        await confirmRemove();
      } else if (actions === "Make Admin") {
        await confirmAdmin();
      } else if (actions === "Remove Admin") {
        await confirmRemAdmin();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
    reset();
  };

  const addOnline = () => setOnline((online) => online + 1);

  return (
    <>
      {loading && (
        <Modal className="h-[20vh] grid place-items-center">
          <ModalLoading />
        </Modal>
      )}
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
              {isAdmin && (
                <div className="w-full flex flex-col gap-2 items-start justify-start p-2 pt-0 sticky top-0 left-0 z-10 bg-white shadow-sm">
                  <SecondaryButton
                    disabled={loading}
                    onClick={() => {
                      if (select.state) {
                        setSelect({ ...select, members: [], state: false });
                      } else {
                        setSelect({ ...select, state: true });
                      }
                    }}
                    className="w-fit"
                  >
                    {loading ? (
                      <LoadingIconBright width={20} height={20} />
                    ) : select.state ? (
                      "Cancel"
                    ) : (
                      "Select"
                    )}
                  </SecondaryButton>
                  {select.state && (
                    <form
                      onSubmit={handleSubmit}
                      className="w-full flex flex-col items-start justify-start gap-2"
                    >
                      {select.members.length > 0 && (
                        <div className="w-full">
                          <p className="text-sm text-custom-grey-text">
                            Selected: {select.members.length}
                          </p>
                          <InnerContainer className="mb-2 border-[1px] border-custom-light-text flex-row items-center justify-start gap-2 flex-wrap p-2 max-h-[10vh]">
                            {select.members.map((id: string) => (
                              <AnnouncementTag
                                onClick={() =>
                                  setSelect({
                                    ...select,
                                    members: select.members.filter(
                                      (s: string) => s != id
                                    ),
                                  })
                                }
                                isDelete
                                key={id}
                              >
                                {id}
                              </AnnouncementTag>
                            ))}
                          </InnerContainer>
                        </div>
                      )}
                      <p
                        className="self-end underline text-sm text-custom-grey-text cursor-pointer"
                        onClick={() => {
                          const curArray = select.members;
                          Object.keys(membersList).forEach((id: string) => {
                            if (!select.members.includes(id)) curArray.push(id);
                          });
                          setSelect({ ...select, members: curArray });
                        }}
                      >
                        Select All
                      </p>
                      <div className="flex items-end justify-start gap-2 w-full">
                        <FormInputContainer
                          inputName="actions"
                          labelText="What actions to take?"
                        >
                          <select
                            name="actions"
                            onChange={(e) => setActions(e.target.value)}
                          >
                            {Object.keys(GROUP_MEMBERS_SELECT_OPTIONS).map(
                              (action: string, index: number) => {
                                if (
                                  !select.members.includes(owner) ||
                                  (select.members.includes(owner) &&
                                    GROUP_MEMBERS_SELECT_OPTIONS[action]
                                      .withOwner)
                                ) {
                                  return (
                                    <option value={action} key={index}>
                                      {action}
                                    </option>
                                  );
                                }
                              }
                            )}
                          </select>
                        </FormInputContainer>
                        <PrimaryButton
                          disabled={loading || select.members.length === 0}
                          type="submit"
                          className="w-fit border-[1px] border-custom-primary"
                        >
                          Go
                        </PrimaryButton>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {Object.keys(itemList).map((item) => (
                <GroupMemberTab
                  handleBibo={{ state: select, action: setSelect }}
                  addOnline={addOnline}
                  curMember={curMember}
                  groupID={groupID}
                  key={item}
                  data={itemList[item]}
                />
              ))}
            </InnerContainer>
            {isAdmin && (
              <>
                <HRow />
                <InviteMemberForm membersList={membersList} groupID={groupID} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
