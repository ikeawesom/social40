import DefaultCard from "@/src/components/DefaultCard";
import CalculateHAButton from "@/src/components/groups/custom/HA/CalculateHAButton";
import LastUpdatedHANotice from "@/src/components/groups/custom/HA/LastUpdatedHANotice";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { HA_REPORT_SCHEMA } from "@/src/utils/schemas/ha";
import { cookies } from "next/headers";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default async function HAReportPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const cookieStore = cookies();
  const groupID = params.groupID;
  const data = cookieStore.get("memberID");

  if (!data) return <SignInAgainScreen />;

  try {
    const { data: groupDataRes, error: groupErr } = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });
    if (groupErr || !groupID) throw new Error("Invalid group.");
    const groupData = groupDataRes as GROUP_SCHEMA;
    const { lastUpdatedHA } = groupData;

    const { error, data: membersList } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/MEMBERS`,
      orderCol: "dateJoined",
      ascending: false,
    });

    if (error) throw new Error(error);

    const { data: reports, error: reportsError } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/HA-REPORTS`,
      orderCol: "createdOn",
      ascending: false,
    });

    if (reportsError) throw new Error(reportsError);

    const empty = Object.keys(reports).length === 0;

    return (
      <>
        <HeaderBar back text={`HA Reports for ${groupID}`} />
        <div className="w-full grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[500px] text-center">
            {empty && (
              <>
                <h1 className="text-3xl font-bold text-custom-dark-text mt-4">
                  No reports created.
                </h1>
                <p className="text-sm text-custom-grey-text mb-4">
                  {" "}
                  Start cooking one now!
                </p>
              </>
            )}
            <CalculateHAButton
              className={twMerge(empty ? "w-fit" : "w-full mt-3")}
              groupID={groupID}
              membersList={JSON.parse(JSON.stringify(membersList))}
            />
            {lastUpdatedHA && (
              <LastUpdatedHANotice
                lastUpdatedHA={lastUpdatedHA}
                containerClassName="w-fit"
              />
            )}
            {!empty && <HRow />}
            {Object.keys(reports).map((id: string) => {
              const data = reports[id] as HA_REPORT_SCHEMA;
              const { time, members, reportID } = data;
              const HAmembers = members.filter((member) => member.isHA);
              return (
                <Link
                  key={reportID}
                  href={`/groups/${groupID}/HA-report/${reportID}`}
                  className="w-full"
                >
                  <DefaultCard className="w-full duration-150 hover:bg-custom-light-text items-start justify-start flex flex-col px-3 py-2">
                    <h1 className="text-lg">
                      <span className="font-bold text-custom-primary">
                        {HAmembers.length}
                      </span>{" "}
                      HA personnel
                    </h1>
                    <p className="text-xs text-custom-grey-text">
                      Last updated: {time.to}
                    </p>
                  </DefaultCard>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
