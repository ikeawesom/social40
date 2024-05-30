"use client";
import React from "react";
import ToggleContainer from "../utils/toggle/ToggleContainer";
import { useCreateStatus } from "@/src/hooks/status/useCreateStatus";
import ModalNext from "../utils/modal/ModalNext";
import { usePageNum } from "@/src/hooks/usePageNum";
import ModalLoading from "../utils/ModalLoading";
import { useProfile } from "@/src/hooks/profile/useProfile";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import Clipboard from "../Clipboard";
import { toast } from "sonner";
import CopyToClipboard from "react-copy-to-clipboard";

export type StatusInputType = {
  title: string;
  desc: string;
  doctor: string;
  start: string;
  end: string;
};

export default function CreateStatus({
  memberID,
  alt,
  close,
}: {
  memberID: string;
  alt?: string;
  close?: () => void;
}) {
  const {
    disableMC,
    enableMC,
    handleChange,
    handleSubmit,
    statusDetails,
    checked,
    endD,
    ready,
    setChecked,
    setEndD,
    setStartD,
    startD,
    loading,
  } = useCreateStatus({ memberID, alt, close });

  const { nextPage, page, prevPage } = usePageNum();
  const { memberDetails } = useProfile(memberID);

  const rankName = `${memberDetails?.rank} ${memberDetails?.displayName}`
    .toUpperCase()
    .trim();

  const now = DateToString(new Date());

  const ir = `${rankName} experienced ${statusDetails.desc} and reported sick to ${statusDetails.doctor} on ${now}. ${rankName} received ${statusDetails.title} from ${statusDetails.start} to ${statusDetails.end}.`;

  const onCopy = () => toast.success("Copied IR to clipboard!");

  const incomplete =
    statusDetails.title === "" ||
    statusDetails.desc === "" ||
    statusDetails.doctor === "";

  return (
    <>
      {loading ? (
        <ModalLoading />
      ) : (
        <form
          className="w-full flex flex-col items-start justify-center gap-4"
          onSubmit={handleSubmit}
        >
          {page === 0 && (
            <>
              <div className="w-full flex flex-col items-start justify-center gap-1">
                <p className="text-custom-dark-text text-sm">Title of Status</p>
                <input
                  placeholder="Excuse RMJ, Light Duties, etc..."
                  name="title"
                  required
                  value={statusDetails.title}
                  onChange={handleChange}
                />

                <ToggleContainer
                  flex
                  className="mt-2"
                  text="This is a medical leave"
                  disable={disableMC}
                  enable={enableMC}
                  disabled={!checked.status}
                />
              </div>

              <div className="w-full flex flex-col items-start justify-center gap-1">
                <p className="text-custom-dark-text text-sm">
                  Short Description of Status
                </p>

                <input
                  placeholder="Sprained ankle while marching, etc..."
                  name="desc"
                  required
                  value={statusDetails.desc}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full flex flex-col items-start justify-center gap-1">
                <p className="text-custom-dark-text text-sm">
                  Name of Doctor Attended
                </p>

                <input
                  placeholder="CPT JOHN DOE, etc..."
                  name="doctor"
                  required
                  value={statusDetails.doctor}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full flex flex-col items-start justify-center gap-1">
                <p className="text-custom-dark-text text-sm">Start Date</p>

                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 justify-between w-full">
                    <select
                      className="w-full"
                      id="day"
                      name="day"
                      required
                      value={startD.day}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setStartD({ ...startD, day: e.target.value });
                      }}
                    >
                      {new Array(31)
                        .fill(1)
                        .map((item: number, index: number) => (
                          <option
                            key={index}
                            value={`${
                              index + 1 < 10 ? `0${index + 1}` : index + 1
                            }`}
                          >
                            {`${index + 1 < 10 ? `0${index + 1}` : index + 1}`}
                          </option>
                        ))}
                    </select>
                    <select
                      className="w-full"
                      id="months"
                      name="months"
                      required
                      value={startD.month}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setStartD({ ...startD, month: e.target.value });
                      }}
                    >
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>

                    <select
                      id="year"
                      name="year"
                      required
                      value={startD.year}
                      className="w-full"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setStartD({ ...startD, year: e.target.value });
                      }}
                    >
                      {new Array(5)
                        .fill(1)
                        .map((item: number, index: number) => (
                          <option key={index} value={index + 2024}>
                            {index + 2024}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-start justify-center gap-1">
                <p className="text-custom-dark-text text-sm">End Date</p>
                <div className="flex items-center gap-2 justify-between w-full">
                  <select
                    className="w-full"
                    id="day"
                    name="day"
                    required
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setEndD({ ...endD, day: e.target.value });
                    }}
                  >
                    {new Array(31)
                      .fill(1)
                      .map((item: number, index: number) => (
                        <option
                          key={index}
                          value={`${
                            index + 1 < 10 ? `0${index + 1}` : index + 1
                          }`}
                        >
                          {`${index + 1 < 10 ? `0${index + 1}` : index + 1}`}
                        </option>
                      ))}
                  </select>
                  <select
                    className="w-full"
                    id="months"
                    name="months"
                    required
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setEndD({ ...endD, month: e.target.value });
                    }}
                  >
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>

                  <select
                    id="year"
                    name="year"
                    required
                    className="w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setEndD({ ...endD, year: e.target.value });
                    }}
                  >
                    {new Array(5).fill(1).map((item: number, index: number) => (
                      <option key={index} value={index + 2024}>
                        {index + 2024}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {page === 1 && (
            <>
              <div className="items-start justify-center flex flex-col gap-1">
                {/* <div className="flex items-center justify-start gap-4">
            <input
              type="checkbox"
              required
              id="ir"
              className="h-fit flex-1"
              name="ir"
              onChange={handleCheck}
            />
            <label htmlFor="ir" className="flex-3 text-sm">
              I have completed and submitted an{" "}
              <span className="text-custom-primary">Incident Report</span> to my
              commanders.
            </label>
          </div> */}
                <ToggleContainer
                  text="I have confirmed that the details provided above is accurate to
              the best of my knowledge."
                  disable={() => setChecked({ ...checked, cfm: false })}
                  enable={() => setChecked({ ...checked, cfm: true })}
                  disabled={!checked.cfm}
                />

                <ToggleContainer
                  text="I consent that this information can be used for tracking when
              needed."
                  disable={() => setChecked({ ...checked, consent: false })}
                  enable={() => setChecked({ ...checked, consent: true })}
                  disabled={!checked.consent}
                />
              </div>
              {!incomplete && (
                <div className="w-full relative">
                  <h1 className="text-sm font-bold text-custom-dark-text">
                    Summarised IR
                  </h1>
                  <textarea rows={6} readOnly value={ir} />
                  <CopyToClipboard text={ir} onCopy={onCopy}>
                    <div className="absolute bottom-5 right-5 shadow-md rounded-full bg-custom-primary p-3 cursor-pointer hover:opacity-80 duration-200">
                      <Clipboard />
                    </div>
                  </CopyToClipboard>
                </div>
              )}
            </>
          )}
          <ModalNext
            finalNum={1}
            pageNum={page}
            toggleBack={prevPage}
            toggleNext={nextPage}
            primaryDisabled={incomplete || !ready}
            primaryText="Add Status"
          />
        </form>
      )}
    </>
  );
}
