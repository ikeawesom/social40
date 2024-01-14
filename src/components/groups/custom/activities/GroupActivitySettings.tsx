"use client";
import DefaultCard from "@/src/components/DefaultCard";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";

export default function GroupActivitySettings({
  activityData,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
}) {
  const oldTitle = activityData.activityTitle;
  const oldDesc = activityData.activityDesc;
  const oldRestrict = activityData.groupRestriction;

  const router = useRouter();
  const { host } = useHostname();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: oldTitle,
    desc: oldDesc,
    restrict: oldRestrict,
    user: "",
  });

  const invalidUser = activityData.createdBy !== input.user;

  const noChanges =
    oldTitle === input.title &&
    oldDesc === input.desc &&
    oldRestrict === input.restrict;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const activityID = activityData.activityID;
      const ActivityObj = GetPostObj({ activityID, input });
      const res = await fetch(`${host}/api/activity/group-edit`, ActivityObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      router.refresh();
      toast.success(
        "Changes saved successfully. Please wait a few seconds before changes are reflected."
      );
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-custom-dark-text font-semibold text-start">
          Activity Settings
        </h1>

        <Image
          onClick={() => setShow(!show)}
          src="/icons/icon_arrow-down.svg"
          alt="Show"
          width={30}
          height={30}
          className={`duration-300 ease-in-out ${show ? "rotate-180" : ""}`}
        />
      </div>
      {show && (
        <>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-start justify-start gap-3"
          >
            <FormInputContainer
              inputName="title"
              labelText="Enter a title for this activity"
            >
              <input
                type="text"
                name="title"
                placeholder="e.g. IPPT 1, SOC TEST, etc."
                value={input.title}
                onChange={handleChange}
              />
            </FormInputContainer>
            <FormInputContainer
              inputName="desc"
              labelText="Enter a short description of this activity"
            >
              <input
                type="text"
                name="desc"
                placeholder="e.g. First IPPT conduct for 40SAR, etc."
                value={input.desc}
                onChange={handleChange}
              />
            </FormInputContainer>

            {/* <div className="flex items-center justify-start gap-2">
              <input
                type="checkbox"
                id="restrict"
                className="h-fit flex-1"
                checked={input.restrict}
                onChange={() =>
                  setInput({
                    ...input,
                    restrict: !input.restrict,
                  })
                }
              />
              <label htmlFor="restrict" className="flex-3 text-sm">
                Restrict this activity for group members only
              </label>
            </div> */}
            {!noChanges && (
              <FormInputContainer
                inputName="desc"
                labelText="Enter your member ID to confirm the changes"
              >
                <input
                  type="text"
                  name="user"
                  placeholder={activityData.createdBy}
                  value={input.user}
                  onChange={handleChange}
                />
              </FormInputContainer>
            )}
            <PrimaryButton
              disabled={loading || noChanges || invalidUser}
              type="submit"
              className="grid place-items-center mt-2"
            >
              {loading ? (
                <LoadingIconBright width={20} height={20} />
              ) : (
                "Save Changes"
              )}
            </PrimaryButton>
          </form>
        </>
      )}
    </DefaultCard>
  );
}
