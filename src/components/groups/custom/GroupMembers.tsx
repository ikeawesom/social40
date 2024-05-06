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
import {
  GROUP_MEMBERS_SELECT_OPTIONS,
  GROUP_ROLES_HEIRARCHY,
} from "@/src/utils/constants";
import InviteMemberForm from "./InviteMemberForm";
import HRow from "../../utils/HRow";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import SecondaryButton from "../../utils/SecondaryButton";
import AnnouncementTag from "../../announcements/AnnouncementTag";
import FormInputContainer from "../../utils/FormInputContainer";
import PrimaryButton from "../../utils/PrimaryButton";
import Modal from "../../utils/Modal";
import ModalLoading from "../../utils/ModalLoading";
import { useHandleSelectActions } from "@/src/hooks/groups/custom/useHandleSelectActions";

export default function GroupMembers({
  membersList,
  groupID,
  curMember,
}: {
  membersList: GroupDetailsType;
  groupID: string;
  curMember: GROUP_MEMBERS_SCHEMA;
}) {
  const [show, setShow] = useState(false);
  const [online, setOnline] = useState(0);
  const { itemList, search, handleSearch } = useQueryObj({ obj: membersList });
  const isAdmin =
    GROUP_ROLES_HEIRARCHY[curMember.role].rank >=
    GROUP_ROLES_HEIRARCHY["admin"].rank;

  const owner = Object.keys(membersList).filter(
    (id: string) => membersList[id].role === "owner"
  )[0];

  const addOnline = () => setOnline((online) => online + 1);

  const { loading, handleSubmit, select, setActions, setSelect } =
    useHandleSelectActions(groupID);

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
