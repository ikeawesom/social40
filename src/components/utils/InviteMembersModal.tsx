"use client";
import AnnouncementTag from "@/src/components/announcements/AnnouncementTag";
import ErrorSection from "@/src/components/utils/ErrorSection";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import InnerContainer from "@/src/components/utils/InnerContainer";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";
import ModalLoading from "@/src/components/utils/ModalLoading";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useQueryDrop } from "@/src/hooks/members/useQueryMember";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Notice from "@/src/components/utils/Notice";
import { getMembersData } from "@/src/utils/members/SetStatistics";

export default function InviteMembersModal({
  handleSubmit,
  setMembers,
  participants,
  config,
  resetError,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  setMembers: React.Dispatch<React.SetStateAction<string[]>>;
  participants: string[];
  config: { loading: boolean; errors: string[] };
  resetError: () => void;
}) {
  const [show, setShow] = useState(false);
  const { errors, loading } = config;
  //   const [allMembers, setAllMembers] = useState<MemberIDNameType[]>();
  const {
    filtered,
    membersList,
    handleAdd,
    handleRemove,
    members,
    query,
    resetQueryMember,
    setQuery,
  } = useQueryDrop({
    fetchFunction: getMembersData,
    secondaryKey: "displayName",
  });

  useEffect(() => {
    setMembers(members);
  }, [members]);

  const resetModal = () => {
    resetQueryMember();
    setShow(false);
    resetError();
  };

  let filteredObj = {} as { [id: string]: MEMBER_SCHEMA };
  if (membersList && filtered.length > 0) {
    const temp = Object.keys(membersList).filter((id: string) =>
      filtered.includes(id)
    );
    temp.forEach((id: string) => (filteredObj[id] = membersList[id]));
  }

  return (
    <>
      {show && (
        <Modal>
          <ModalHeader close={resetModal} heading="Invite Members" />
          {loading ? (
            <ModalLoading />
          ) : (
            <>
              {errors.length > 0 && (
                <Notice containerClassName="mb-2" status="error">
                  {errors.map((text: string, index: number) => (
                    <p key={index}>{text}</p>
                  ))}
                </Notice>
              )}
              <form className="w-full" onSubmit={handleSubmit}>
                <FormInputContainer inputName="name" labelText="Search">
                  <input
                    name="name"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </FormInputContainer>
                {members.length > 0 && (
                  <>
                    <p className="text-xs mt-2 mb-1 text-custom-grey-text">
                      Inviting ({members.length})
                    </p>
                    <InnerContainer className="w-full flex flex-row p-2 items-center justify-start gap-1 border-[1px] border-custom-light-text overflow-x-scroll overscroll-y-none">
                      {members.map((user: string) => (
                        <AnnouncementTag
                          key={user}
                          isDelete
                          onClick={() => handleRemove(user)}
                          className="min-w-fit"
                        >
                          <p className="text-sm">{user} </p>
                        </AnnouncementTag>
                      ))}
                    </InnerContainer>
                  </>
                )}

                <InnerContainer className="w-full h-[20vh] mt-2">
                  {query !== "" && filtered.length === 0 ? (
                    <ErrorSection>
                      <p className="text-xs text-custom-grey-text">
                        No member matches that search!
                      </p>
                    </ErrorSection>
                  ) : (
                    Object.keys(filteredObj).map(
                      (id: string, index: number) => {
                        const { displayName, rank } = filteredObj[id];
                        const name = `${rank} ${displayName}`.trim();
                        return (
                          <div
                            key={index}
                            className="w-full flex items-center hover:bg-custom-light-text/80 duration-150 justify-between px-2 py-1"
                          >
                            <div>
                              <Link
                                href={`/members/${id}`}
                                className="font-bold text-sm text-custom-dark-text hover:opacity-70 duration-150"
                              >
                                {name}
                              </Link>
                              <p className="text-xs text-custom-grey-text">
                                {id}
                              </p>
                            </div>
                            {members.includes(id) ? (
                              <SecondaryButton
                                onClick={() => handleRemove(id)}
                                className="w-fit px-2 py-1 bg-custom-light-red border-custom-red text-custom-red"
                              >
                                Remove
                              </SecondaryButton>
                            ) : (
                              <SecondaryButton
                                disabled={participants.includes(id)}
                                onClick={() => handleAdd(id)}
                                className={twMerge(
                                  "w-fit px-2 py-1 bg-custom-light-orange border-custom-orange text-custom-orange",
                                  participants.includes(id) &&
                                    "border-custom-green text-custom-green bg-custom-light-text"
                                )}
                              >
                                {participants.includes(id) ? "Added" : "Invite"}
                              </SecondaryButton>
                            )}
                          </div>
                        );
                      }
                    )
                  )}
                </InnerContainer>
                <PrimaryButton
                  type="submit"
                  className="mt-2"
                  disabled={members.length === 0}
                >
                  Invite Selected
                </PrimaryButton>
              </form>
            </>
          )}
        </Modal>
      )}
      <PrimaryButton onClick={() => setShow(true)}>
        Invite Members
      </PrimaryButton>
    </>
  );
}
