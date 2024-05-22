"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import PrimaryButton from "../../utils/PrimaryButton";
import Modal from "../../utils/Modal";
import ModalHeader from "../../utils/ModalHeader";
import { DEFAULT_STATS } from "@/src/utils/constants";
import FormInputContainer from "../../utils/FormInputContainer";
import HRow from "../../utils/HRow";
import { toast } from "sonner";
import { setATP, setIPPT, setVOC } from "@/src/utils/members/SetStatistics";
import { useRouter } from "next/navigation";
import { useSetIppt } from "@/src/hooks/members/useSetIppt";
import InnerContainer from "../../utils/InnerContainer";
import Badge from "../../utils/Badge";
import SecondaryButton from "../../utils/SecondaryButton";
import { useQueryMember } from "@/src/hooks/members/useQueryMember";
import { useSetVOC } from "@/src/hooks/members/useSetVOC";
import { useSetATP } from "@/src/hooks/members/useSetATP";
import AnnouncementTag from "../../announcements/AnnouncementTag";

const DEFAULT_DATE = { day: 1, month: 1, year: 2024 };

export default function AddMemberStatForm({
  id,
  curID,
}: {
  id: string;
  curID: string;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [statType, setStatType] = useState<string>(
    Object.keys(DEFAULT_STATS)[0]
  );
  const [loading, setLoading] = useState(false);
  const [statDate, setStatDate] = useState(DEFAULT_DATE);

  const { resetScore, score, setScore } = useSetATP();

  const {
    filtered,
    handleAdd,
    isDetail,
    members,
    query,
    resetQueryMember,
    setIsDetail,
    setQuery,
    handleRemove,
  } = useQueryMember(id);

  const {
    handleAgeChange,
    handleIPPTChange,
    ipptStat,
    resetIppt,
    calculating,
  } = useSetIppt();

  const { resetTime, setTime, time } = useSetVOC();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatDate({ ...statDate, [e.target.name]: e.target.value });
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setStatType(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const date = {
        day: statDate.day,
        month: statDate.month,
        year: statDate.year,
      };
      if (statType === "IPPT") {
        const timing = Number(ipptStat.min) * 60 + Number(ipptStat.sec);
        const { error } = await setIPPT(
          id,
          {
            age: ipptStat.age,
            pushups: ipptStat.pushups,
            situps: ipptStat.situps,
            timing,
          },
          date,
          curID
        );
        if (error) throw new Error(error);
      } else if (statType === "ATP") {
        const { error } = await setATP(id, score, date, curID);
        if (error) throw new Error(error);
      } else if (statType === "VOC" || statType === "SOC") {
        const { error } = await setVOC(members, time, statType, date, curID);
        if (error) throw new Error(error);
      }
      reset();
      router.refresh();
      toast.success("Excellent, statistic added successfully.");
      setTimeout(() => {
        router.push(`/members/${id}/statistics?type=${statType}`);
      }, 400);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const reset = () => {
    setShowModal(false);
    setLoading(false);
    setStatType("IPPT");
    setStatDate(DEFAULT_DATE);
    resetIppt();
    resetTime();
    resetScore();
    resetQueryMember();
  };

  const type = statType === "ATP" ? "score" : "time";

  return (
    <>
      {showModal && (
        <Modal>
          <ModalHeader close={reset} heading="Add Statistic" />
          <form
            className="flex items-start justify-start flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <FormInputContainer
              inputName="type"
              labelText="Select Statistic Type"
            >
              <select
                id="type"
                className="w-fit"
                value={statType}
                onChange={handleChangeType}
              >
                {Object.keys(DEFAULT_STATS).map((type: string) => (
                  <option key={type}>{DEFAULT_STATS[type].name}</option>
                ))}
              </select>
            </FormInputContainer>
            <HRow className="mb-0" />
            <div className="flex flex-col items-center justify-start gap-1 w-full">
              {statType === "IPPT" && (
                <>
                  <FormInputContainer inputName="age" labelText="Choose Age">
                    <select
                      name="age"
                      value={ipptStat.age}
                      onChange={handleAgeChange}
                    >
                      {new Array(43)
                        .fill(1)
                        .map((value: number, index: number) => (
                          <option key={index} value={index + 18}>
                            {index + 18}
                          </option>
                        ))}
                    </select>
                  </FormInputContainer>
                  <h1 className="font-bold text-center">Statics</h1>
                  <div className="w-full flex items-center justify-start gap-2">
                    <FormInputContainer
                      labelText="Push Ups"
                      inputName="pushups"
                    >
                      <input
                        required
                        onChange={handleIPPTChange}
                        type="number"
                        name="pushups"
                        value={ipptStat.pushups}
                      />
                    </FormInputContainer>
                    <FormInputContainer labelText="Sit Ups" inputName="situps">
                      <input
                        required
                        type="number"
                        name="situps"
                        onChange={handleIPPTChange}
                        value={ipptStat.situps}
                      />
                    </FormInputContainer>
                  </div>
                  <h1 className="font-bold text-center mt-4">2.4 Run</h1>
                  <div className="w-full flex items-center justify-start gap-2">
                    <FormInputContainer labelText="Minute" inputName="min">
                      <input
                        required
                        onChange={handleIPPTChange}
                        type="number"
                        name="min"
                        value={ipptStat.min}
                      />
                    </FormInputContainer>
                    <FormInputContainer labelText="Seconds" inputName="sec">
                      <input
                        required
                        type="number"
                        name="sec"
                        onChange={handleIPPTChange}
                        value={ipptStat.sec}
                      />
                    </FormInputContainer>
                  </div>
                  <h1 className="font-bold text-center mt-4">Overall Score</h1>
                  {calculating && (
                    <p className="text-xs text-custom-grey-text">
                      Calculating score...
                    </p>
                  )}
                  <input
                    required
                    onChange={handleIPPTChange}
                    type="number"
                    name="score"
                    value={ipptStat.score}
                  />
                </>
              )}
              {statType !== "IPPT" && (
                <>
                  {type === "time" ? (
                    <>
                      <div className="w-full flex items-center justify-start gap-2">
                        <FormInputContainer inputName="min" labelText="Mins">
                          <input
                            type="number"
                            name="min"
                            value={time.min}
                            onChange={(e) =>
                              setTime({
                                ...time,
                                [e.target.name]: e.target.value,
                              })
                            }
                          />
                        </FormInputContainer>
                        <FormInputContainer inputName="sec" labelText="Secs">
                          <input
                            type="number"
                            name="sec"
                            value={time.sec}
                            onChange={(e) =>
                              setTime({
                                ...time,
                                [e.target.name]: e.target.value,
                              })
                            }
                          />
                        </FormInputContainer>
                      </div>
                      <div className="flex w-full items-center justify-start gap-3 mt-3">
                        <p className="text-sm text-custom-grey-text">
                          Was this activity done in detail level?
                        </p>
                        <SecondaryButton
                          activated={isDetail}
                          onClick={() => setIsDetail(true)}
                          className="w-fit px-3 py-1"
                        >
                          Yes
                        </SecondaryButton>
                        <SecondaryButton
                          onClick={() => setIsDetail(false)}
                          activated={!isDetail}
                          className="w-fit px-3 py-1"
                        >
                          No
                        </SecondaryButton>
                      </div>
                    </>
                  ) : (
                    <FormInputContainer inputName="score" labelText="Score">
                      <input
                        type="number"
                        name="score"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                      />
                    </FormInputContainer>
                  )}
                  {isDetail && (
                    <div className="w-full flex flex-col items-start justify-start gap-2 mt-2">
                      <div className="relative w-full">
                        <FormInputContainer
                          inputName="query"
                          labelText="Add members to this detail"
                        >
                          <input
                            placeholder="Search for members"
                            name="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </FormInputContainer>
                        {query !== "" && (
                          <div className="flex flex-col items-start justify-start w-full absolute top-18 left-0 z-20 rounded-md border-[1px] border-custom-light-text overflow-x-hidden overflow-y-scroll max-h-[20vh]">
                            {filtered.length === 0 ? (
                              <div className="w-full px-3 py-2 bg-white">
                                <p className="text-xs">No members found</p>
                              </div>
                            ) : (
                              filtered.map((id: string) => (
                                <div
                                  key={id}
                                  onClick={() => handleAdd(id)}
                                  className="w-full px-3 py-2 bg-white hover:bg-custom-light-text"
                                >
                                  <p className="text-xs flex items-center justify-start gap-2">
                                    {id}{" "}
                                    {members.includes(id) && (
                                      <Badge>Added</Badge>
                                    )}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      <InnerContainer className="w-full flex flex-row p-2 max-h-[15vh] items-center justify-start gap-1 flex-wrap border-[1px] border-custom-light-text">
                        {members.map((user: string) => (
                          // <div
                          //   className="flex items-center justify-start gap-1 px-2 py-1 bg-custom-light-text rounded-md cursor-default hover:brightness-95"
                          //   key={user}
                          // >
                          //   <p className="text-sm">{user} </p>
                          //   {user !== id && (
                          //     <div
                          //       onClick={() => handleRemove(user)}
                          //       className="bg-white/60 p-1 rounded-full hover:bg-white"
                          //     >
                          //       <Image
                          //         src="/icons/icon_close.svg"
                          //         alt="Close"
                          //         width={10}
                          //         height={10}
                          //       />
                          //     </div>
                          //   )}
                          // </div>
                          <AnnouncementTag
                            key={user}
                            isDelete={user !== id}
                            onClick={() => handleRemove(user)}
                          >
                            <p className="text-sm">{user} </p>
                          </AnnouncementTag>
                        ))}
                      </InnerContainer>
                    </div>
                  )}
                </>
              )}
            </div>
            <HRow />
            <div className="flex items-center justify-center w-full gap-1">
              <FormInputContainer inputName="day" labelText="Day">
                <input
                  required
                  value={statDate.day}
                  name="day"
                  onChange={handleDateChange}
                  type="number"
                />
              </FormInputContainer>
              <FormInputContainer inputName="month" labelText="Month">
                <input
                  required
                  value={statDate.month}
                  name="month"
                  onChange={handleDateChange}
                  type="number"
                />
              </FormInputContainer>
              <FormInputContainer inputName="year" labelText="Year">
                <input
                  required
                  value={statDate.year}
                  name="year"
                  onChange={handleDateChange}
                  type="number"
                />
              </FormInputContainer>
            </div>
            <PrimaryButton disabled={loading} type="submit">
              {loading ? "Working..." : "Submit"}
            </PrimaryButton>
          </form>
        </Modal>
      )}
      <PrimaryButton
        onClick={() => setShowModal(true)}
        className="w-fit px-4 pr-2 flex items-center justify-center"
      >
        Add Stats
        <Image
          alt="+"
          src="/icons/icon_right_bright.svg"
          width={25}
          height={25}
        />
      </PrimaryButton>
    </>
  );
}
