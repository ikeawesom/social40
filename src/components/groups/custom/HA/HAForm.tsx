import FormInputContainer from "@/src/components/utils/FormInputContainer";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHADetails } from "@/src/hooks/groups/custom/useHADetails";
import { GroupDetailsType } from "../GroupMembers";
import {
  addReport,
  handleGroupMemberHA,
} from "@/src/utils/groups/HA/handleGroupMemberHA";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DateToString } from "@/src/utils/getCurrentDate";
import {
  GroupDatesActivitiesType,
  HA_REPORT_SCHEMA,
  isHAType,
} from "@/src/utils/schemas/ha";

export default function HAForm({
  groupID,
  membersList,
}: {
  groupID: string;
  membersList: GroupDetailsType;
}) {
  const router = useRouter();
  const { onChange, start, loading, setLoading } = useHADetails();
  // const [checkedStatus, setCheckedStatus] = useState<isHAType[]>([]);
  const checkedStatus = useRef<isHAType[]>([]);
  const dailyActivitiesRef = useRef<GroupDatesActivitiesType>({});
  const [dailyActivities, setDailyActivities] =
    useState<GroupDatesActivitiesType>();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const addLocalReport = async () => {
      const from = DateToString(
        new Date(
          parseInt(start.year),
          parseInt(start.month) - 1,
          parseInt(start.day)
        )
      ).split(" ")[0];

      const to = DateToString(new Date()).split(" ")[0];

      const to_add = {
        groupID,
        members: checkedStatus.current,
        time: {
          from,
          to,
        },
        data: dailyActivitiesRef.current,
      } as HA_REPORT_SCHEMA;

      console.log(dailyActivities);

      const res = await addReport(groupID, to_add);
      const { data: id } = res;

      setTimeout(() => {
        router.push(`/groups/${groupID}/HA-report/${id}`, { scroll: false });
      }, 300);
      setDone(false);
    };

    if (done) addLocalReport();
  }, [done]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const members = Object.keys(membersList);

      for (const memberID of members) {
        // console.log("Caclculating for", memberID);
        const { status, data, error } = await handleGroupMemberHA(
          start,
          memberID
        );

        if (status) {
          // setCheckedStatus((init) => [...init, data.HA]);
          checkedStatus.current.push(data.HA);
          dailyActivitiesRef.current[memberID] = data.dailyActivities;
          setDailyActivities({
            ...dailyActivities,
            [memberID]: data.dailyActivities,
          });
          // console.log(`${memberID}: ${data.isHA}`);
        }
        if (error) throw new Error(error.message);
      }
      setDone(true);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const completedScan =
    checkedStatus.current.length == Object.keys(membersList).length;

  if (loading || completedScan)
    return (
      <div className="flex flex-col w-full gap-4 items-center justify-center mt-4">
        <LoadingIcon height={80} width={80} />
        {loading && !completedScan && (
          <p className="text-sm text-custom-grey-text">
            {Math.round(
              (checkedStatus.current.length / Object.keys(membersList).length) *
                100
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
