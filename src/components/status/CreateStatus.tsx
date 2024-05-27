"use client";
import React, { useEffect, useState } from "react";
import DefaultCard from "../DefaultCard";
import PrimaryButton from "../utils/PrimaryButton";
import { LoadingIconBright } from "../utils/LoadingIcon";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { useRouter } from "next/navigation";
import HRow from "../utils/HRow";
import ToggleContainer from "../utils/toggle/ToggleContainer";

export type StatusInputType = {
  title: string;
  desc: string;
  doctor: string;
  start: string;
  end: string;
};

export default function CreateStatus({ memberID }: { memberID: string }) {
  const router = useRouter();
  const [statusDetails, setStatusDetails] = useState<StatusInputType>({
    title: "",
    desc: "",
    doctor: "",
    start: "",
    end: "",
  });

  const [loading, setLoading] = useState(false);
  const { host } = useHostname();
  const [checked, setChecked] = useState({
    status: false,
    ess: true,
    // sheets: false,
    // ir: false,
    cfm: false,
    consent: false,
  });

  const [startD, setStartD] = useState({
    day: "01",
    month: "01",
    year: "2024",
  });
  const [endD, setEndD] = useState({
    day: "01",
    month: "01",
    year: "2024",
  });

  useEffect(() => {
    setStatusDetails({
      ...statusDetails,
      start: `${startD.day}/${startD.month}/${startD.year}`,
      end: `${endD.day}/${endD.month}/${endD.year}`,
    });
  }, [startD, endD]);

  const readyMC = checked.ess;

  var ready =
    checked.cfm &&
    checked.consent &&
    // checked.ir &&
    (checked.status ? readyMC : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const to_send = {
        memberID,
        status: {
          title: statusDetails.title,
          desc: statusDetails.desc,
          doctor: statusDetails.doctor,
          start: statusDetails.start,
          end: statusDetails.end,
        },
        mc: checked.status,
      };

      const res = await fetch(`${host}/api/profile/set-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(to_send),
      });

      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      router.refresh();
      toast.success("Added new status.");
      setTimeout(() => {
        router.push("/profile", { scroll: false });
      }, 1000);
    } catch (err: any) {
      toast.error(err.message);
      ready = false;
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusDetails({ ...statusDetails, [e.target.name]: e.target.value });
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({ ...checked, [e.target.name]: e.target.checked });
  };

  const enableMC = () => setChecked({ ...checked, status: true });
  const disableMC = () => setChecked({ ...checked, status: false });

  return (
    <DefaultCard className="w-full">
      <form
        className="w-full flex flex-col items-start justify-center gap-4"
        onSubmit={handleSubmit}
      >
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
            {/* <input
              placeholder="DD/MM/YYYY"
              name="start"
              required
              value={statusDetails.start}
              onChange={handleChange}
            /> */}
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
                {new Array(5).fill(1).map((item: number, index: number) => (
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

          {/* <input
            placeholder="DD/MM/YYYY"
            name="end"
            required
            value={statusDetails.end}
            onChange={handleChange}
          /> */}

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
          <HRow />

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
        <PrimaryButton
          disabled={loading || !ready}
          className="grid place-items-center"
          type="submit"
        >
          {loading ? (
            <LoadingIconBright width={20} height={20} />
          ) : (
            "Create Status"
          )}
        </PrimaryButton>
      </form>
    </DefaultCard>
  );
}
