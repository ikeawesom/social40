"use client";
import React, { useState } from "react";
import DefaultCard from "../DefaultCard";
import PrimaryButton from "../utils/PrimaryButton";
import { LoadingIconBright } from "../utils/LoadingIcon";
import SecondaryButton from "../utils/SecondaryButton";
import { getCurrentDateString } from "@/src/utils/getCurrentDate";
import Link from "next/link";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { useRouter } from "next/navigation";

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
    ess: false,
    sheets: false,
    ir: false,
    cfm: false,
    consent: false,
  });

  const readyMC = checked.ess && checked.sheets;

  var ready =
    checked.cfm &&
    checked.consent &&
    checked.ir &&
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
          <div className="flex items-center justify-start gap-4 mt-1">
            <input
              type="checkbox"
              id="mc"
              className="h-fit flex-1"
              onChange={() =>
                setChecked({ ...checked, status: !checked.status })
              }
            />
            <label htmlFor="mc" className="flex-3 text-sm">
              Medical Leave
            </label>
          </div>
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
            <input
              placeholder="DD/MM/YYYY"
              name="start"
              required
              value={statusDetails.start}
              onChange={handleChange}
            />
            <SecondaryButton
              className="w-fit self-stretch border-custom-orange text-custom-orange"
              onClick={() =>
                setStatusDetails({
                  ...statusDetails,
                  start: getCurrentDateString().split(" ")[0],
                })
              }
            >
              Today
            </SecondaryButton>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-1">
          <p className="text-custom-dark-text text-sm">End Date</p>

          <input
            placeholder="DD/MM/YYYY"
            name="end"
            required
            value={statusDetails.end}
            onChange={handleChange}
          />
        </div>

        <div className="items-start justify-center flex flex-col gap-1">
          {checked.status && (
            <>
              <div className="flex items-center justify-start gap-4">
                <input
                  type="checkbox"
                  required
                  id="ess"
                  className="h-fit flex-1"
                  name="ess"
                  onChange={handleCheck}
                />
                <label htmlFor="ess" className="flex-3 text-sm">
                  I have applied for my medical leave via the{" "}
                  <span className="text-custom-primary">ESS app</span>.
                </label>
              </div>
              <div className="flex items-center justify-start gap-4">
                <input
                  type="checkbox"
                  required
                  id="sheets"
                  className="h-fit flex-1"
                  name="sheets"
                  onChange={handleCheck}
                />
                <label htmlFor="sheets" className="flex-3 text-sm">
                  I have submitted the screenshots of my medical leave to the
                  Google Forms found{" "}
                  <Link
                    href="https://bit.ly/40SAR-MC"
                    className="text-custom-primary font-semibold"
                  >
                    here
                  </Link>
                  .
                </label>
              </div>
            </>
          )}
          <div className="flex items-center justify-start gap-4">
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
          </div>
          <div className="flex items-center justify-start gap-4">
            <input
              type="checkbox"
              required
              id="cfm"
              className="h-fit flex-1"
              name="cfm"
              onChange={handleCheck}
            />
            <label htmlFor="cfm" className="flex-3 text-sm">
              I have confirmed that the details provided above is accurate to
              the best of my knowledge.
            </label>
          </div>
          <div className="flex items-center justify-start gap-4">
            <input
              type="checkbox"
              required
              id="consent"
              className="h-fit flex-1"
              name="consent"
              onChange={handleCheck}
            />
            <label htmlFor="consent" className="flex-3 text-sm">
              I consent that this information can be used for tracking when
              needed.
            </label>
          </div>
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
