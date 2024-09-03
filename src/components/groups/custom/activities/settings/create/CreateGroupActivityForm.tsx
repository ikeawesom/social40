"use client";
import React, { useEffect, useState } from "react";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import LoadingIcon, {
  LoadingIconBright,
} from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ACTIVITY_TYPE,
  GROUP_ACTIVITY_CREATION_PROGRESS,
  GROUP_ACTIVITY_PARTICIPANTS,
} from "@/src/utils/constants";
import SelectMembers from "../SelectMembers";
import HRow from "@/src/components/utils/HRow";
import { createGroupActivityClass } from "@/src/utils/groups/createGroupActivityClass";
import Image from "next/image";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";
import Notice from "@/src/components/utils/Notice";
import { getNonHAMembers } from "../../../HA/getNonHAMembers";
import ModalLoading from "@/src/components/utils/ModalLoading";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { second } from "@/src/utils/groups/handleGroupActivityCreate";
import Link from "next/link";
import ToggleContainer from "@/src/components/utils/toggle/ToggleContainer";

export default function CreateGroupActivityForm({
  groupID,
  memberID,
}: {
  groupID: string;
  memberID: string;
}) {
  const router = useRouter();
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
  const [loadingStage, setLoadingStage] = useState(0);
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
  const [useHA, setUseHA] = useState({
    warning: false,
    loading: false,
  });

  const [nonHAmembers, setNonHAMembers] = useState<string[]>();

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

  const handleLogic = async () => {
    setLoading(true);
    setUseHA({ warning: false, loading: false });
    try {
      const createGroupClass = new createGroupActivityClass({
        addMembers,
        groupID,
        input,
        memberID,
      });

      const { error: errA } = await createGroupClass.createGroupActivity();
      if (errA) throw new Error(errA);
      setLoadingStage((loadingStage) => loadingStage + 1);

      const { error: errB } = await createGroupClass.verifyMembers();
      if (errB) throw new Error(errB);
      setLoadingStage((loadingStage) => loadingStage + 1);

      if (input.needHA) {
        createGroupClass.setNonHAMembers(nonHAmembers ?? []);
      }
      console.log("DEBUG: Verified members");

      const { error: errC } = await createGroupClass.addParticipants();
      if (errC) throw new Error(errC);
      setLoadingStage((loadingStage) => loadingStage + 1);

      console.log("DEBUG: finished adding participants");
      const { error: errD, data } = await createGroupClass.addToGroupCol();
      if (errD) throw new Error(errD);
      setLoadingStage((loadingStage) => loadingStage + 1);
      console.log("DEBUG: finished adding to group col");

      router.refresh();
      router.replace(
        `/groups/${groupID}/activity?${new URLSearchParams({ id: data })}`,
        { scroll: false }
      );
      setDone(
        `/groups/${groupID}/activity?${new URLSearchParams({ id: data })}`
      );
      toast.success("Created activity. Bringing you there now...");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const resetModal = () => {
    setLoading(true);
    setUseHA({ warning: false, loading: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (input.needHA) {
      // show warning modal
      setUseHA({ warning: true, loading: true });

      // get filtered group members based on selection
      const { data: filtered, error: filterErr } = await second(
        addMembers,
        groupID
      );
      if (filterErr) throw new Error(filterErr);

      // filter who are not HA
      const { data, error } = await getNonHAMembers(filtered);
      if (error) throw new Error(error);

      if (Object.keys(data).length > 0) {
        // if have members not HA, display warning
        setNonHAMembers(Object.keys(data));
        setUseHA({ warning: true, loading: false });
      } else {
        // if no not HA, remove modal
        resetModal();
        await handleLogic();
      }
    } else {
      await handleLogic();
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const enableIsHA = () => setInput({ ...input, pt: true });
  const disableIsHA = () => setInput({ ...input, pt: false });
  const enableNeedHA = () => setInput({ ...input, needHA: true });
  const disableNeedHA = () => setInput({ ...input, needHA: false });

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-start justify-start gap-3"
    >
      {useHA.warning && (
        <Modal>
          <ModalHeader
            close={() => setUseHA({ ...useHA, warning: false })}
            heading="HA Warning"
          />
          {useHA.loading ? (
            <ModalLoading />
          ) : (
            <div className="flex flex-col items-start justify-start gap-3">
              <Notice status="error" noHeader>
                <h1 className="font-bold">
                  WARNING: The following members are not Heat Acclimitised (HA).
                </h1>
              </Notice>
              <InnerContainer className="w-full max-h-[20vh]">
                {nonHAmembers?.map((id: string, index: number) => (
                  <div
                    key={index}
                    className="text-sm w-full px-2 py-2 border-b-[1px] border-custom-light-text flex items-center justify-between gap-3"
                  >
                    <h1 className="font-bold text-custom-dark-text">{id}</h1>
                    <Link
                      scroll={false}
                      className="text-xs text-custom-primary underline hover:opacity-70"
                      href={`/members/${id}`}
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </InnerContainer>
              <div className="w-full flex items-start justify-center gap-2 flex-col">
                <p className="text-sm text-custom-red text-center">
                  Due to safety reasons, these members will{" "}
                  <span className="font-bold">not</span> be added into the
                  activity.
                </p>
                <PrimaryButton onClick={handleLogic}>
                  Accept & Continue
                </PrimaryButton>
              </div>
            </div>
          )}
        </Modal>
      )}
      {loading && !useHA.warning && !useHA.loading ? (
        <div className="w-full rounded-md bg-custom-light-green/50 p-2">
          {GROUP_ACTIVITY_CREATION_PROGRESS.map(
            (text: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-start gap-2"
              >
                {loadingStage > index ? (
                  <Image
                    alt="Done"
                    src="/icons/features/icon_tick.svg"
                    height={18}
                    width={18}
                  />
                ) : loadingStage === index ? (
                  <LoadingIcon height={18} width={18} />
                ) : (
                  <LoadingIcon height={18} width={18} className="opacity-0" />
                )}
                <p className="text-custom-green text-sm">{text}</p>
              </div>
            )
          )}
        </div>
      ) : (
        <>
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
              <ToggleContainer
                flex
                className="justify-between"
                text="This is a HA activity"
                disable={disableIsHA}
                enable={enableIsHA}
                disabled={!input.pt}
              />

              <ToggleContainer
                flex
                className="justify-between mt-2"
                text="This activity requires HA"
                disable={disableNeedHA}
                enable={enableNeedHA}
                disabled={!input.needHA}
              />
            </div>
          </div>

          <div className="w-full mt-2">
            <h1 className="text-custom-dark-text font-bold">
              Advanced Settings
            </h1>
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
                {Object.keys(GROUP_ACTIVITY_PARTICIPANTS).map(
                  (type: string) => {
                    const { text, isDefault } =
                      GROUP_ACTIVITY_PARTICIPANTS[type];
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
                  }
                )}
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
        </>
      )}
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
