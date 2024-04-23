import FormInputContainer from "@/src/components/utils/FormInputContainer";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useHADetails } from "@/src/hooks/groups/custom/useHADetails";
import { GroupDetailsType } from "../GroupMembers";
import { handleGroupMemberHA } from "@/src/utils/groups/HA/handleGroupMemberHA";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DateToString } from "@/src/utils/getCurrentDate";

export type isHAType = {
  id: string;
  displayName: string;
  isHA: boolean;
};

export default function HAForm({
  groupID,
  membersList,
}: {
  groupID: string;
  membersList: GroupDetailsType;
}) {
  const router = useRouter();
  const { onChange, start, loading, toggleLoad } = useHADetails();
  const [checkedStatus, setCheckedStatus] = useState<isHAType[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const route = {} as any;
      checkedStatus.forEach((item: isHAType) => {
        route[item.id] = JSON.stringify({
          displayName: item.displayName,
          id: item.id,
          isHA: item.isHA,
        } as isHAType);
      });

      const from = DateToString(
        new Date(
          parseInt(start.year),
          parseInt(start.month) - 1,
          parseInt(start.day)
        )
      ).split(" ")[0];

      const to = DateToString(new Date()).split(" ")[0];

      let currentStore = {} as any;
      const currentStoreRef = localStorage.getItem("HA-results");

      if (currentStoreRef) {
        currentStore = JSON.parse(currentStoreRef);
      }

      currentStore[groupID] = {
        members: checkedStatus,
        time: {
          from,
          to,
        },
      };

      localStorage.setItem("HA-results", JSON.stringify(currentStore));

      setTimeout(() => {
        router.push(`/groups/${groupID}/HA-results`);
      }, 300);
    }
  }, [done]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toggleLoad();
    try {
      const members = Object.keys(membersList);

      for (const memberID of members) {
        const { status, data, error } = await handleGroupMemberHA(
          start,
          memberID
        );
        if (status) setCheckedStatus((init) => [...init, data]);
        if (error) throw new Error(error);
      }
      setDone(true);
    } catch (err: any) {
      toast.error(err.message);
    }
    toggleLoad();
  };

  const completedScan = checkedStatus.length == Object.keys(membersList).length;

  if (loading || completedScan)
    return (
      <div className="flex flex-col w-full gap-4 items-center justify-center mt-4">
        <LoadingIcon height={80} width={80} />
        {loading && !completedScan && (
          <p className="text-sm text-custom-grey-text">
            {Math.round(
              (checkedStatus.length / Object.keys(membersList).length) * 100
            )}
            % complete
          </p>
        )}
        {completedScan && (
          <p className="text-sm text-custom-grey-text">Redirecting...</p>
        )}
      </div>
    );

  return (
    <form
      className="flex flex-col items-center justify-start gap-3"
      onSubmit={handleSubmit}
    >
      <FormInputContainer
        inputName="date"
        labelText="When do you want to start calculating?"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <select
            className="w-full"
            id="day"
            name="day"
            required
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
          >
            {new Array(5).fill(1).map((item: number, index: number) => (
              <option key={index} value={index + 2024}>
                {index + 2024}
              </option>
            ))}
          </select>
        </div>
      </FormInputContainer>
      <PrimaryButton
        className="flex items-center justify-center gap-2"
        type="submit"
      >
        Start
        <Image
          alt=""
          src="/icons/features/icon_bolt.svg"
          width={13}
          height={13}
        />
      </PrimaryButton>
    </form>
  );
}
