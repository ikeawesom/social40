"use client";
import React from "react";
import PrimaryButton from "../utils/PrimaryButton";
import Image from "next/image";
import InnerContainer from "../utils/InnerContainer";
import FormInputContainer from "../utils/FormInputContainer";
import AnnouncementTag from "./AnnouncementTag";
import Modal from "../utils/Modal";
import ModalHeader from "../utils/ModalHeader";
import { useHandleAnnouncements } from "@/src/hooks/announcements/useHandleAnnouncements";
import ToggleContainer from "../utils/toggle/ToggleContainer";
import { useQueryDrop } from "@/src/hooks/members/useQueryMember";
import { getGroups } from "@/src/utils/groups/getGroupData";
import Badge from "../utils/Badge";

export default function CreateAnnouncementForm({
  memberID,
}: {
  memberID: string;
}) {
  const {
    setShowModal,
    loading,
    showModal,
    reset,
    handleSubmit,
    handleChange,
    postData,
    setAdvanced,
    advanced,
    enablePin,
    disablePin,
    isPriv,
    disablePriv,
    enablePriv,
  } = useHandleAnnouncements(memberID);

  const { filtered, query, setQuery, handleAdd, handleRemove, members } =
    useQueryDrop({
      fetchFunction: getGroups,
      secondaryKey: "groupName",
    });

  return (
    <>
      {showModal && (
        <Modal>
          <ModalHeader close={reset} heading="Create Announcement" />
          <form
            onSubmit={(e) => handleSubmit(e, members)}
            className="flex flex-col items-center justify-start mt-2 gap-2"
          >
            <div className="w-full flex flex-col items-center justify-start gap-2">
              <input
                name="title"
                type="text"
                onChange={handleChange}
                placeholder="Add a title..."
                value={postData.title}
                required
              />
              <textarea
                name="desc"
                onChange={handleChange}
                rows={5}
                placeholder="Type something here..."
                required
                value={postData.desc}
              />
            </div>

            <div className="w-full flex flex-col items-start justify-start gap-1">
              <div className="w-full flex items-center justify-between">
                <h1 className="text-sm text-custom-dark-text font-bold">
                  Advanced Settings
                </h1>

                <Image
                  onClick={() => setAdvanced(!advanced)}
                  src="/icons/icon_arrow-down.svg"
                  alt="Show"
                  width={30}
                  height={30}
                  className={`duration-300 ease-in-out ${
                    advanced ? "rotate-180" : ""
                  }`}
                />
              </div>
              {advanced && (
                <>
                  <ToggleContainer
                    flex
                    className="w-full justify-between"
                    disabled={postData.pin === false}
                    disable={disablePin}
                    enable={enablePin}
                    text="Pin Post"
                  />
                  <ToggleContainer
                    flex
                    className="w-full justify-between mt-2"
                    disabled={!isPriv}
                    disable={disablePriv}
                    enable={enablePriv}
                    text="Private Announcement"
                  />
                  {/* <HRow className="-mb-1 mt-2" /> */}
                  {isPriv && (
                    <>
                      {members.length > 0 && (
                        <>
                          <h1 className="font-bold text-sm text-start text-custom-dark-text mt-2 mb-1">
                            Visible to following groups
                          </h1>
                          <InnerContainer className="border-[1px] border-custom-light-text flex-row items-center justify-start gap-2 flex-wrap p-2 overflow-hidden overflow-x-scroll">
                            {members.map((tag: string, index: number) => (
                              <AnnouncementTag
                                isDelete
                                onClick={() => handleRemove(tag)}
                                key={index}
                              >
                                {tag}
                              </AnnouncementTag>
                            ))}
                          </InnerContainer>
                        </>
                      )}
                      <div className="w-full relative mt-2">
                        <FormInputContainer
                          labelText="Add a group"
                          inputName="group"
                        >
                          <div className="flex w-full items-start justify-between gap-3">
                            <input
                              value={query}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setQuery(e.target.value)}
                              name="group"
                              type="text"
                              placeholder="e.g. stallion, scouts, etc."
                            />
                          </div>
                        </FormInputContainer>
                        {query !== "" && (
                          <div className="flex flex-col items-start justify-start w-full absolute top-18 left-0 z-20 rounded-md border-[1px] border-custom-light-text overflow-x-hidden overflow-y-scroll max-h-[20vh]">
                            {filtered.length === 0 ? (
                              <div className="w-full px-3 py-2 bg-white">
                                <p className="text-xs">No groups found</p>
                              </div>
                            ) : (
                              filtered.map((id: string) => (
                                <div
                                  key={id}
                                  onClick={() => handleAdd(id)}
                                  className="w-full px-3 py-2 bg-white hover:bg-custom-light-text"
                                >
                                  <p className="text-xs flex items-center justify-start gap-2">
                                    {id}{" "}
                                    {members.includes(id) && (
                                      <Badge>Added</Badge>
                                    )}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <PrimaryButton
              disabled={loading || (isPriv && members.length === 0)}
              type="submit"
              className="mt-1"
            >
              {loading ? "Posting..." : "Post it"}
            </PrimaryButton>
          </form>
        </Modal>
      )}
      <PrimaryButton onClick={() => setShowModal(true)}>
        Create Announcement
      </PrimaryButton>
    </>
  );
}
