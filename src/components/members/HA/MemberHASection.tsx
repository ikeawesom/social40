import { dbHandler } from "@/src/firebase/db";
import { DailyHAType } from "@/src/utils/schemas/ha";
import LastUpdatedHANotice from "../../groups/custom/HA/LastUpdatedHANotice";
import DownloadIndivHAButton from "./DownloadIndivHAButton";
import Image from "next/image";
import DefaultCard from "../../DefaultCard";

export async function MemberHASection({ memberID }: { memberID: string }) {
  const { data, error } = await dbHandler.get({ col_name: "HA", id: memberID });
  if (error) return <></>;
  const memberHA = data as DailyHAType;
  const { dailyActivities, isHA, lastUpdated } = memberHA;
  return (
    <DefaultCard className="w-full">
      <div className="w-full flex flex-col items-start justify-start gap-2">
        <h1 className="font-bold text-center text-custom-dark-text">
          Heat Acclimatisation
        </h1>
        <div className="w-full flex items-center justify-start gap-1">
          <p className="text-sm text-custom-dark-text">HA Status:</p>
          {isHA ? (
            <span className="text-sm font-bold text-custom-green flex items-center justify-start gap-0">
              HA Certified{" "}
              <Image
                alt="tick"
                src="/icons/icon_tick_green.svg"
                width={25}
                height={25}
                className="-translate-y-[0.5px]"
              />
            </span>
          ) : (
            <span className="text-sm font-bold text-custom-red flex items-center justify-start gap-0">
              Not HA
              <Image
                alt=""
                src="/icons/features/icon_cross_red.svg"
                width={25}
                height={25}
                className="-translate-y-[0.5px]"
              />
            </span>
          )}
        </div>
        <LastUpdatedHANotice inMember={memberID} lastUpdatedHA={lastUpdated} />
        <DownloadIndivHAButton
          memberID={memberID}
          dailyActivities={dailyActivities}
        />
      </div>
    </DefaultCard>
  );
}
