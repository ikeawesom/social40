"use client";
import React, { FormEvent, useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import DefaultCard from "../DefaultCard";
import submitPost, { handleSearchGroup } from "./submitPostData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ANNOUNCEMENT_SCHEMA,
  getDefaultAnnouncement,
} from "@/src/utils/schemas/announcements";
import SecondaryButton from "../utils/SecondaryButton";
import Image from "next/image";
import InnerContainer from "../utils/InnerContainer";
import FormInputContainer from "../utils/FormInputContainer";
import AnnouncementTag from "./AnnouncementTag";
import HRow from "../utils/HRow";

export default function CreateAnnouncementForm({
  memberID,
}: {
  memberID: string;
}) {
  const router = useRouter();
  const defaultAnnouce = getDefaultAnnouncement(memberID);

  const [postData, setPostData] = useState<ANNOUNCEMENT_SCHEMA>(defaultAnnouce);

  const [tempGrp, setGrp] = useState("");
  const [searching, setSearching] = useState(false);

  const [loading, setLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const resetForm = () => setPostData(defaultAnnouce);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { status, error } = await submitPost(postData);
      if (!status) throw new Error(error);
      resetForm();
      router.refresh();
      toast.success("Announcement has been posted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleAddGroup = async () => {
    setSearching(true);
    try {
      // handle group
      const { error } = await handleSearchGroup(tempGrp);
      if (error) throw new Error(error);

      const tempArr = postData.groups as string[];
      if (!tempArr.includes(tempGrp)) {
        tempArr.push(tempGrp);
        setPostData({ ...postData, groups: tempArr });
      }
    } catch (err: any) {
      const { message } = err;
      if (message.includes("not found")) {
        toast.error("Invalid group ID");
      } else {
        toast.error(err.message);
      }
    }
    setSearching(false);
  };

  const handleRemoveGroup = (group: string) => {
    const tempArr = postData.groups as string[];
    tempArr.splice(tempArr.indexOf(group), 1);
    setPostData({ ...postData, groups: tempArr });
  };

  return (
    <DefaultCard className="w-full">
      <h1 className="font-bold text-custom-dark-text">Create Announcement</h1>
      <form
        onSubmit={handleSubmit}
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
              <SecondaryButton
                activated={postData.pin}
                onClick={() => setPostData({ ...postData, pin: !postData.pin })}
                className="w-full flex items-center justify-center gap-2"
              >
                <Image
                  alt="Pin"
                  src="/icons/icon_pin.svg"
                  width={10}
                  height={10}
                />
                Pin Post
              </SecondaryButton>
              <HRow className="-mb-1 mt-2" />
              <h1 className="font-bold text-sm text-start text-custom-dark-text mt-2 mb-1">
                Visible to following groups
              </h1>
              <InnerContainer className="mb-2 border-[1px] border-custom-light-text flex-row items-center justify-start gap-2 flex-wrap p-2">
                {postData.groups?.length === 0 ? (
                  <AnnouncementTag>public</AnnouncementTag>
                ) : (
                  postData.groups?.map((tag: string, index: number) => (
                    <AnnouncementTag
                      isDelete
                      onClick={() => handleRemoveGroup(tag)}
                      key={index}
                    >
                      {tag}
                    </AnnouncementTag>
                  ))
                )}
              </InnerContainer>

              <FormInputContainer labelText="Add a group" inputName="group">
                <div className="flex w-full items-start justify-between gap-3 mb-4">
                  <input
                    value={tempGrp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGrp(e.target.value)
                    }
                    name="group"
                    type="text"
                    placeholder="e.g. stallion, scouts, etc."
                  />
                  <SecondaryButton
                    onClick={handleAddGroup}
                    className="w-fit px-2"
                    disabled={searching || tempGrp === ""}
                  >
                    {searching ? "Searching..." : "Search"}
                  </SecondaryButton>
                </div>
              </FormInputContainer>
            </>
          )}
        </div>

        <PrimaryButton disabled={loading} type="submit">
          {loading ? "Posting..." : "Post it"}
        </PrimaryButton>
      </form>
    </DefaultCard>
  );
}
