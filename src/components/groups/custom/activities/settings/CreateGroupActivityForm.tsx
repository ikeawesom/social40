"use client";
import React, { useEffect, useState } from "react";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ACTIVITY_TYPE,
  GROUP_ACTIVITY_PARTICIPANTS,
} from "@/src/utils/constants";
import SelectMembers from "./SelectMembers";
import Toggle from "@/src/components/utils/Toggle";
import HRow from "@/src/components/utils/HRow";

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
    pt: false,
    needHA: false,
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

  const [addMembers, setAddMembers] = useState({
    check: Object.keys(GROUP_ACTIVITY_PARTICIPANTS)[0],
    members: [] as string[],
  });
  const [done, setDone] = useState("");

  useEffect(() => {
    if (done !== "")
      sessionStorage.setItem("url", `${window.location.origin}${done}`);
  }, [done]);

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
      setDone(
        `/groups/${groupID}/activity?${new URLSearchParams({ id: body.data })}`
      );
      toast.success("Created activity. Bringing you there now...");
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
      <div className="w-full">
        <h1 className="font-bold text-custom-dark-text">General</h1>
        <HRow className="" />
      </div>
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
      </FormInputContainer>

      <div className="w-full mt-2">
        <h1 className="text-custom-dark-text font-bold">
          Heat Acclimitisation (HA)
        </h1>
        <HRow />
        <div className="w-full">
          <div className="w-full flex items-center justify-between gap-2 py-2">
            <p className="text-sm">This is a HA activity</p>
            <Toggle
              className="shadow-none border-none"
              buttonClassName="border-[1px]"
              disable={() => setInput({ ...input, pt: false })}
              enable={() => setInput({ ...input, pt: true })}
              disabled={!input.pt}
            />
          </div>

          <div className="w-full flex items-center justify-between gap-2 py-2 cursor-not-allowed">
            <div>
              <p className="text-sm opacity-50">This activity requires HA</p>
              <p className="text-xs text-custom-grey-text opacity-50">
                Coming soon...
              </p>
            </div>
            <Toggle
              forceDisable={true}
              className="shadow-none border-none"
              buttonClassName="border-[1px]"
              disable={() => setInput({ ...input, needHA: false })}
              enable={() => setInput({ ...input, needHA: true })}
              disabled={!input.needHA}
            />
          </div>
        </div>
      </div>

      <div className="w-full mt-2">
        <h1 className="text-custom-dark-text font-bold">Advanced Settings</h1>
        <HRow />
      </div>

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
        <FormInputContainer
          inputName="type"
          labelText="Who will join this activity?"
        >
          <select
            className="w-full"
            name="type"
            onChange={(e) =>
              setAddMembers({ ...addMembers, check: e.target.value })
            }
          >
            {Object.keys(GROUP_ACTIVITY_PARTICIPANTS).map((type: string) => {
              const { text, isDefault } = GROUP_ACTIVITY_PARTICIPANTS[type];
              return (
                <option
                  className="text-xs px-2 self-stretch w-fit"
                  key={type}
                  value={type}

                  // activated={addMembers.check === type}
                  // onChange={() => setAddMembers({ ...addMembers, check: type })}
                >
                  {text} {isDefault && "(Default)"}
                </option>
              );
            })}
          </select>
        </FormInputContainer>
      </div>
      {addMembers.check === "custom" && (
        <SelectMembers addMembers={addMembers} setMembers={setAddMembers} />
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
