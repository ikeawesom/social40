"use client";
import React, { useState } from "react";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HRow from "@/src/components/utils/HRow";
import Notice from "@/src/components/utils/Notice";

export default function CreateGroupActivityForm({
  groupID,
  memberID,
}: {
  groupID: string;
  memberID: string;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const [input, setInput] = useState({
    title: "",
    desc: "",
    date: "",
    time: "",
    duration: {
      active: false,
      endDate: "",
      endTime: "",
    },
    restrict: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const PostObj = GetPostObj({ groupID, memberID, input });
      const res = await fetch(`${host}/api/activity/group-create`, PostObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);

      router.refresh();
      router.replace(
        `/groups/${groupID}/activity?${new URLSearchParams({ id: body.data })}`
      );
      toast.success("Created activity");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      duration: { ...input.duration, [e.target.name]: e.target.value },
    });
  };
  return (
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
      <FormInputContainer
        inputName="date"
        labelText="When will this activity take place?"
      >
        <input
          type="text"
          name="date"
          placeholder="DD/MM/YYYY"
          value={input.date}
          onChange={handleChange}
        />
      </FormInputContainer>

      <FormInputContainer
        inputName="time"
        labelText="What time will this activity begin?"
      >
        <input
          type="text"
          name="time"
          placeholder="HH:MM"
          value={input.time}
          onChange={handleChange}
        />
      </FormInputContainer>
      <div className="flex items-center justify-start gap-2">
        <input
          type="checkbox"
          id="restrict"
          className="h-fit flex-1"
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
      </div>
      <div className="flex items-center justify-start gap-2">
        <input
          type="checkbox"
          id="duration"
          className="h-fit flex-1"
          onChange={() =>
            setInput({
              ...input,
              duration: { ...input.duration, active: !input.duration.active },
            })
          }
        />
        <label htmlFor="duration" className="flex-3 text-sm">
          Set a time limit for members to join this activity
        </label>
      </div>
      {input.duration.active && (
        <>
          <HRow />

          <FormInputContainer
            inputName="endDate"
            labelText="Last date that members can join this activity"
          >
            <input
              type="text"
              name="endDate"
              placeholder="DD/MM/YYYY"
              value={input.duration.endDate}
              onChange={durationChange}
            />
          </FormInputContainer>
          <FormInputContainer
            inputName="endTime"
            labelText="Last time that members can join this activity"
          >
            <input
              type="text"
              name="endTime"
              placeholder="HH:MM"
              value={input.duration.endTime}
              onChange={durationChange}
            />
          </FormInputContainer>
          <Notice
            status="warning"
            text="Members will not be able to join this activity anymore after this
            time."
          />
        </>
      )}
      <PrimaryButton
        disabled={loading}
        type="submit"
        className="grid place-items-center mt-2"
      >
        {loading ? (
          <LoadingIconBright width={20} height={20} />
        ) : (
          "Create Activity"
        )}
      </PrimaryButton>
    </form>
  );
}
