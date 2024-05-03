"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import PrimaryButton from "../../utils/PrimaryButton";
import Modal from "../../utils/Modal";
import ModalHeader from "../../utils/ModalHeader";
import { DEFAULT_STATS } from "@/src/utils/constants";
import FormInputContainer from "../../utils/FormInputContainer";
import HRow from "../../utils/HRow";
import { toast } from "sonner";
import { setIPPT } from "@/src/utils/members/SetStatistics";
import { useRouter } from "next/navigation";
import { useSetIppt } from "@/src/hooks/members/useSetIppt";
import InnerContainer from "../../utils/InnerContainer";

export default function AddMemberStatForm({ id }: { id: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [statType, setStatType] = useState<string>(DEFAULT_STATS[0]);
  const [loading, setLoading] = useState(false);

  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [score, setScore] = useState(0);
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<string[]>([id]);

  useEffect(() => {
    setTimeout(() => {
      if (query !== "") {
        // handle
      }
    }, 400);
  }, [query]);

  const { handleAgeChange, handleIPPTChange, ipptStat, resetIppt } =
    useSetIppt();

  const [statDate, setStatDate] = useState({
    day: 1,
    month: 1,
    year: 2024,
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatDate({ ...statDate, [e.target.name]: e.target.value });
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setStatType(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (statType === "IPPT") {
        const { error } = await setIPPT(
          id,
          {
            age: ipptStat.age,
            pushups: ipptStat.pushups,
            situps: ipptStat.situps,
            timing: ipptStat.min * 60 + ipptStat.sec,
          },
          {
            day: statDate.day,
            month: statDate.month,
            year: statDate.year,
          }
        );
        if (error) throw new Error(error);
      }
      reset();
      router.refresh();
      toast.success("Excellent, statistic added successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const reset = () => {
    setShowModal(false);
    setLoading(false);
    setStatType("IPPT");
    resetIppt();
  };

  const type = statType === "VOC" ? "time" : "score";

  return (
    <>
      {showModal && (
        <Modal>
          <ModalHeader
            close={() => setShowModal(false)}
            heading="Add Statistic"
          />
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
                {DEFAULT_STATS.map((type: string) => (
                  <option key={type}>{type}</option>
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
                      {new Array(10)
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
                </>
              )}
              {statType !== "IPPT" && (
                <>
                  {type === "time" ? (
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
                  <FormInputContainer
                    inputName="query"
                    labelText="Add members to this activity"
                    className="mt-3"
                  >
                    <input
                      placeholder="Search for members"
                      name="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </FormInputContainer>
                  <InnerContainer className="w-full flex flex-row p-2 max-h-[15vh] items-center justify-start gap-1 flex-wrap">
                    {members.map((id: string) => (
                      <p
                        className="text-sm px-2 py-1 bg-custom-light-text rounded-md cursor-default hover:brightness-95"
                        key={id}
                      >
                        {id}
                      </p>
                    ))}
                  </InnerContainer>
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
            <PrimaryButton disabled={loading} type="submit" className="mt-2">
              {loading ? "Working..." : "Submit"}
            </PrimaryButton>
          </form>
        </Modal>
      )}
      <div className="w-full items-center justify-end flex mt-1">
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
      </div>
    </>
  );
}
