"use client";
import React, { useState } from "react";
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
import AddMedia from "./media/AddMedia";
import SecondaryButton from "../utils/SecondaryButton";

export default function CreateAnnouncementForm({
  memberID,
}: {
  memberID: string;
}) {
  const [page, setPage] = useState(false);

  const {
    setShowModal,
    loading,
    showModal,
    reset,
    handleSubmit,
    handleChange,
    postData,
    enablePin,
    disablePin,
    isPriv,
    disablePriv,
    enablePriv,
    handleMediaChange,
    mediaFiles,
    removeFile,
  } = useHandleAnnouncements(memberID);

  const { filtered, query, setQuery, handleAdd, handleRemove, members } =
    useQueryDrop({
      fetchFunction: getGroups,
      secondaryKey: "groupName",
    });

  const resetAll = () => {
    setPage(false);
    reset();
  };

  const toggleModal = () => {
    setShowModal(true);
    setPage(false);
  };

  return (
    <>
      {showModal && (
        <Modal>
          <ModalHeader close={resetAll} heading="Create Post" />
          <form
            onSubmit={(e) => handleSubmit(e, members)}
            className="flex flex-col items-center justify-start mt-2 gap-2"
          >
            {!page ? (
              <>
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

                <AddMedia
                  removeFile={removeFile}
                  handleMediaChange={handleMediaChange}
                  mediaFiles={mediaFiles}
                />
              </>
            ) : (
              <div className="w-full flex flex-col items-start justify-start gap-1">
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
                                  <div className="text-xs flex items-center justify-start gap-2">
                                    {id}{" "}
                                    {members.includes(id) && (
                                      <Badge>Added</Badge>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              </div>
            )}

            <div className="w-full flex items-center justify-center gap-2 mt-1">
              <SecondaryButton
                disabled={postData.title === "" || postData.desc === ""}
                onClick={() => setPage(!page)}
                className="flex items-center justify-center"
              >
                {page && (
                  <Image
                    alt=""
                    src="/icons/icon_arrow-down.svg"
                    className="rotate-90 translate-y-[1px] translate-x-[2px]"
                    width={25}
                    height={25}
                  />
                )}
                {page ? "Back" : "Next"}
                {!page && (
                  <Image
                    alt=""
                    src="/icons/icon_arrow-down.svg"
                    className="-rotate-90 translate-y-[1px] -translate-x-[2px]"
                    width={25}
                    height={25}
                  />
                )}
              </SecondaryButton>
              <PrimaryButton
                disabled={!page || loading || (isPriv && members.length === 0)}
                type="submit"
                className="w-full self-stretch"
              >
                {loading ? "Posting..." : "Post it"}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
      <PrimaryButton onClick={toggleModal}>Post Something</PrimaryButton>
    </>
  );
}
