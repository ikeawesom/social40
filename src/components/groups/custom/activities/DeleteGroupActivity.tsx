"use client";
import Image from "next/image";
import DefaultCard from "@/src/components/DefaultCard";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useHostname } from "@/src/hooks/useHostname";

export default function DeleteGroupActivity({
  activityData,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
}) {
  const router = useRouter();
  const { host } = useHostname();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [checks, setChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
  });
  const [confirm, setConfirm] = useState("");

  const allChecked = checks.check1 && checks.check2 && checks.check3;
  const confirmText = confirm === `Delete ${activityData.activityTitle}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const activityID = activityData.activityID;
      const groupID = activityData.groupID;
      const ActivityObj = GetPostObj({ activityID, groupID });
      const res = await fetch(`${host}/api/activity/group-delete`, ActivityObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);

      router.refresh();
      router.replace(`/groups/${groupID}`, { scroll: false });
      toast.success("Group activity deleted successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-custom-dark-text font-semibold text-start">
          Danger Zone
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
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-start justify-start gap-3"
        >
          <div className="flex items-center justify-start gap-2">
            <input
              type="checkbox"
              name="check1"
              className="h-fit flex-1"
              onChange={() => setChecks({ ...checks, check1: !checks.check1 })}
            />
            <label htmlFor="check1" className="flex-3 text-sm">
              I understand that deleting this activity will forfeit the
              participation of every member
            </label>
          </div>

          <div className="flex items-center justify-start gap-2">
            <input
              type="checkbox"
              name="check2"
              className="h-fit flex-1"
              onChange={() => setChecks({ ...checks, check2: !checks.check2 })}
            />
            <label htmlFor="check2" className="flex-3 text-sm">
              I understand that this action is irreversible and may affect heat
              acclimatisation (HA) tracking
            </label>
          </div>

          <div className="flex items-center justify-start gap-2">
            <input
              type="checkbox"
              name="check3"
              className="h-fit flex-1"
              onChange={() => setChecks({ ...checks, check3: !checks.check3 })}
            />
            <label htmlFor="check3" className="flex-3 text-sm">
              I want to delete this activity
            </label>
          </div>

          {allChecked && (
            <FormInputContainer
              inputName="desc"
              labelText={`Enter "Delete ${activityData.activityTitle}" to confirm the changes`}
            >
              <input
                type="text"
                name="user"
                placeholder={`Delete ${activityData.activityTitle}`}
                value={confirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirm(e.target.value)
                }
              />
            </FormInputContainer>
          )}

          <PrimaryButton
            disabled={loading || !confirmText || !allChecked}
            type="submit"
            className={twMerge("bg-custom-red grid place-items-center w-full")}
          >
            {loading ? (
              <LoadingIconBright width={20} height={20} />
            ) : (
              "Delete activity"
            )}
          </PrimaryButton>
        </form>
      )}
    </DefaultCard>
  );
}
