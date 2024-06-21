"use client";
import React from "react";
import PrimaryButton from "../utils/PrimaryButton";
import InnerContainer from "../utils/InnerContainer";
import FormInputContainer from "../utils/FormInputContainer";
import AnnouncementTag from "./AnnouncementTag";
import Modal from "../utils/Modal";
import ModalHeader from "../utils/ModalHeader";
import { useHandleAnnouncements } from "@/src/hooks/announcements/useHandleAnnouncements";
import ToggleContainer from "../utils/toggle/ToggleContainer";
import { useQueryMember } from "@/src/hooks/members/useQueryMember";
import { getGroups } from "@/src/utils/groups/getGroupData";
import Badge from "../utils/Badge";
import AddMedia from "./media/AddMedia";
import ModalNext from "../utils/modal/ModalNext";
import ModalLoading from "../utils/ModalLoading";
import { usePageNum } from "@/src/hooks/usePageNum";

export default function CreateAnnouncementForm({
  memberID,
}: {
  memberID: string;
}) {
  const { page, nextPage, prevPage, resetPage } = usePageNum();

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

  const getCustomGroups = async () => await getGroups(memberID);

  const { filtered, query, setQuery, handleAdd, handleRemove, members } =
    useQueryMember({
      fetchFunction: getCustomGroups,
      secondaryKey: "groupName",
    });

  const resetAll = () => {
    resetPage();
    reset();
  };

  const toggleModal = () => {
    resetPage();
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <Modal>
          <ModalHeader close={resetAll} heading="Create Post" />
          {loading ? (
            <ModalLoading />
          ) : (
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
                                  <p className="text-xs">
                                    None of your groups match{" "}
                                    <span className="font-bold italic">
                                      {query}
                                    </span>
                                  </p>
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

              <ModalNext
                finalNum={1}
                pageNum={page}
                toggleBack={prevPage}
                toggleNext={nextPage}
                primaryText="Post it"
                primaryDisabled={
                  postData.title === "" ||
                  postData.desc === "" ||
                  (isPriv && members.length === 0)
                }
                className="mt-1"
              />
            </form>
          )}
        </Modal>
      )}
      <PrimaryButton onClick={toggleModal}>Post Something</PrimaryButton>
    </>
  );
}
