import { StatusInputType } from "@/src/components/status/CreateStatus";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useHostname } from "../useHostname";

export function useCreateStatus({
  memberID,
  alt,
  close,
}: {
  memberID: string;
  alt?: string;
  close?: () => void;
}) {
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
      let to_send = {
        memberID,
        status: {
          title: statusDetails.title,
          desc: statusDetails.desc,
          doctor: statusDetails.doctor,
          start: statusDetails.start,
          end: statusDetails.end,
        },
        mc: checked.status,
      } as Object;

      if (alt) to_send = { ...to_send, alt };

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
      toast.success("Added new status");
      if (close) close();
      // setTimeout(() => {
      //   router.push("/profile", { scroll: false });
      // }, 1000);
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

  return {
    setStartD,
    startD,
    setEndD,
    endD,
    setChecked,
    checked,
    loading,
    ready,
    enableMC,
    disableMC,
    handleChange,
    handleSubmit,
    statusDetails,
  };
}
