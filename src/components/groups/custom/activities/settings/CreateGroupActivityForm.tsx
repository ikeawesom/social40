"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ACTIVITY_TYPE } from "@/src/utils/constants";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import SelectMembers from "./SelectMembers";

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
    level: "Light",
  });
  const [loading, setLoading] = useState(false);
  const [startD, setStartD] = useState({
    day: "01",
    month: "01",
    year: "2024",
  });
  const [startT, setStartT] = useState({
    hour: "00",
    min: "00",
  });

  const [advancedMode, setMode] = useState(false);
  const [addMembers, setAddMembers] = useState({
    check: false,
    members: [] as string[],
  });

  useEffect(() => {
    setInput({
      ...input,
      date: `${startD.day}/${startD.month}/${startD.year}`,
    });
  }, [startD]);

  useEffect(() => {
    setInput({ ...input, time: `${startT.hour}:${startT.min}` });
  }, [startT]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const PostObj = GetPostObj({ groupID, memberID, input, addMembers });
      const res = await fetch(`${host}/api/activity/group-create`, PostObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);

      router.refresh();
      router.replace(
        `/groups/${groupID}/activity?${new URLSearchParams({ id: body.data })}`,
        { scroll: false }
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
          required
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
          required
          placeholder="e.g. First IPPT conduct for 40SAR, etc."
          value={input.desc}
          onChange={handleChange}
        />
      </FormInputContainer>
      <FormInputContainer
        inputName="date"
        labelText="When will this activity take place?"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <select
            className="w-full"
            id="day"
            name="day"
            required
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStartD({ ...startD, day: e.target.value });
            }}
          >
            {new Array(31).fill(1).map((item: number, index: number) => (
              <option
                key={index}
                value={`${index + 1 < 10 ? `0${index + 1}` : index + 1}`}
              >
                {`${index + 1 < 10 ? `0${index + 1}` : index + 1}`}
              </option>
            ))}
          </select>
          <select
            className="w-full"
            id="month"
            name="month"
            required
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStartD({ ...startD, month: e.target.value });
            }}
          >
            {new Array(12).fill(1).map((item: number, index: number) => (
              <option
                key={index}
                value={`${index + 1 < 10 ? `0${index + 1}` : index + 1}`}
              >
                {`${index + 1 < 10 ? `0${index + 1}` : index + 1}`}
              </option>
            ))}
          </select>
          <select
            className="w-full"
            id="year"
            name="year"
            required
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStartD({ ...startD, year: e.target.value });
            }}
          >
            {new Array(5).fill(1).map((item: number, index: number) => (
              <option key={index} value={index + 2024}>
                {index + 2024}
              </option>
            ))}
          </select>
        </div>
        {/* <input
          type="text"
          name="date"
          required
          placeholder="DD/MM/YYYY"
          value={input.date}
          onChange={handleChange}
        /> */}
      </FormInputContainer>

      <FormInputContainer
        inputName="time"
        labelText="What time will this activity begin?"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <select
            className="w-full"
            id="hour"
            name="hour"
            required
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStartT({ ...startT, hour: e.target.value });
            }}
          >
            {new Array(24).fill(1).map((item: number, index: number) => (
              <option key={index} value={`${index < 10 ? `0${index}` : index}`}>
                {`${index < 10 ? `0${index}` : index}`}
              </option>
            ))}
          </select>
          <select
            className="w-full"
            id="min"
            name="min"
            required
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStartT({ ...startT, min: e.target.value });
            }}
          >
            {new Array(12).fill(1).map((item: number, index: number) => (
              <option
                key={index}
                value={`${index * 5 < 10 ? `0${index * 5}` : index * 5}`}
              >
                {`${index * 5 < 10 ? `0${index * 5}` : index * 5}`}
              </option>
            ))}
          </select>
        </div>
        {/* <input
          type="text"
          name="time"
          required
          placeholder="HH:MM"
          value={input.time}
          onChange={handleChange}
        /> */}
      </FormInputContainer>

      <div className="w-full flex items-center justify-between">
        <h1 className="text-sm text-custom-dark-text font-bold">
          Advanced Settings
        </h1>

        <Image
          onClick={() => setMode(!advancedMode)}
          src="/icons/icon_arrow-down.svg"
          alt="Show"
          width={30}
          height={30}
          className={`duration-300 ease-in-out ${
            advancedMode ? "rotate-180" : ""
          }`}
        />
      </div>
      {advancedMode && (
        <>
          <FormInputContainer
            inputName="type"
            labelText="What kind of activity is this?"
          >
            <select
              className="w-full"
              id="type"
              name="type"
              required
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setInput({ ...input, level: e.target.value });
              }}
            >
              {ACTIVITY_TYPE.map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormInputContainer>
          <div className="w-full flex items-center justify-between gap-2 flex-wrap">
            <SecondaryButton
              className={twMerge(
                !addMembers.check &&
                  "bg-custom-light-orange border-custom-orange"
              )}
              onClick={() => setAddMembers({ ...addMembers, check: false })}
            >
              Select All Members (Default)
            </SecondaryButton>
            <SecondaryButton
              className={twMerge(
                addMembers.check &&
                  "bg-custom-light-orange border-custom-orange"
              )}
              onClick={() => setAddMembers({ ...addMembers, check: true })}
            >
              Select Custom Members{" "}
              {addMembers.check &&
                addMembers.members.length > 0 &&
                `( ${addMembers.members.length} )`}
            </SecondaryButton>
          </div>
          {addMembers.check && (
            <SelectMembers addMembers={addMembers} setMembers={setAddMembers} />
          )}
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
{
  // remove options temporarily
  /* <div className="flex items-center justify-start gap-2">
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
        required
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
        required
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
)} */
}
