"use client";
import DefaultCard from "@/src/components/DefaultCard";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  DateToString,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";

export default function GroupActivitySettings({
  activityData,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
}) {
  const oldTitle = activityData.activityTitle;
  const oldDesc = activityData.activityDesc;
  const oldRestrict = activityData.groupRestriction;

  console.log(
    "timestamp client:",
    TimestampToDateString(activityData.activityDate)
  );

  const tempTimestamp = new Date(activityData.activityDate.seconds * 1000);
  tempTimestamp.setHours(tempTimestamp.getHours() - 8);
  const timestampStr = DateToString(tempTimestamp);
  const oldDate = timestampStr.split(" ")[0];
  const oldTime = timestampStr.split(" ")[1];

  const router = useRouter();
  const { host } = useHostname();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: oldTitle,
    desc: oldDesc,
    restrict: oldRestrict,
    user: "",
    date: timestampStr,
  });

  const [newD, setNewD] = useState({
    day: oldDate.split("/")[0],
    month: oldDate.split("/")[1],
    year: oldDate.split("/")[2],
  });

  const [newTime, setNewTime] = useState({
    hour: oldTime.split(":")[0],
    min: oldTime.split(":")[1],
  });

  useEffect(() => {
    const dateStr = `${newD.day}/${newD.month}/${newD.year} ${newTime.hour}:${newTime.min}`;
    setInput({
      ...input,
      date: dateStr,
    });
  }, [newD, newTime]);

  const invalidUser = activityData.createdBy !== input.user;

  const noChanges =
    oldTitle === input.title &&
    oldDesc === input.desc &&
    oldRestrict === input.restrict &&
    timestampStr === input.date;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { activityID, groupID } = activityData;
      const ActivityObj = GetPostObj({ activityID, input, groupID });
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
                  value={newD.day}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setNewD({ ...newD, day: e.target.value });
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
                  value={newD.month}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setNewD({ ...newD, month: e.target.value });
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
                  value={newD.year}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setNewD({ ...newD, year: e.target.value });
                  }}
                >
                  {new Array(5).fill(1).map((item: number, index: number) => (
                    <option key={index} value={index + 2024}>
                      {index + 2024}
                    </option>
                  ))}
                </select>
              </div>
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
                  value={newTime.hour}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setNewTime({ ...newTime, hour: e.target.value });
                  }}
                >
                  {new Array(24).fill(1).map((item: number, index: number) => (
                    <option
                      key={index}
                      value={`${index < 10 ? `0${index}` : index}`}
                    >
                      {`${index < 10 ? `0${index}` : index}`}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full"
                  id="min"
                  name="min"
                  required
                  value={newTime.min}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setNewTime({ ...newTime, min: e.target.value });
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

            {!noChanges && (
              <FormInputContainer
                inputName="desc"
                labelText="Enter owner's member ID to confirm the changes"
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

// removed option temporarily
{
  /* <div className="flex items-center justify-start gap-2">
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
            </div> */
}
