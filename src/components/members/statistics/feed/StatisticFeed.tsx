import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { DEFAULT_STATS } from "@/src/utils/constants";
import Image from "next/image";
import DefaultCard from "../../../DefaultCard";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import HRow from "../../../utils/HRow";
import IPPTFeedCard from "./IPPTFeedCard";
import FeaturedSection from "../FeaturedSection";
import { getSimple } from "@/src/utils/helpers/parser";
import DeleteStatisticButton from "../DeleteStatisticButton";

export async function StatisticFeed({
  type,
  id,
}: {
  type: string;
  id: string;
}) {
  try {
    const { error, data } = await dbHandler.getSpecific({
      path: `MEMBERS/${id}/${type}`,
      orderCol: "dateCompleted",
      ascending: false,
    });
    if (error) throw new Error(error);

    const empty = Object.keys(data).length === 0;

    if (empty)
      return (
        <div className="w-full min-h-[30vh] grid place-items-center">
          <div className="flex items-center justify-center gap-4 flex-col">
            <Image
              alt="Nothing here..."
              src="/icons/features/icon_stats_active.svg"
              width={150}
              height={150}
            />
            <p className="text-center text-custom-dark-text">
              Oops, no statistics added for {type}!
            </p>
          </div>
        </div>
      );

    const isAsc = DEFAULT_STATS[type].scoringType;

    const bestStatID = Object.keys(data).sort((a, b) =>
      !isAsc ? data[a].score - data[b].score : data[b].score - data[a].score
    )[0];

    const bestStat = data[bestStatID];
    const statsData = Object.keys(data).filter(
      (id: string) => id !== bestStatID
    );

    const parsedBest = getSimple(bestStat);
    const parsedOthers = getSimple(statsData);

    const emptyOthers = Object.keys(statsData).length === 0;

    return (
      <>
        <h1 className="font-bold text-custom-dark-text">
          Best Performance for {type}
        </h1>

        <FeaturedSection memberID={id} bestStat={parsedBest} type={type} />

        <h1 className="mt-6 font-bold text-custom-dark-text">Other Attempts</h1>
        <HRow className="bg-custom-grey-text mt-0" />
        {emptyOthers ? (
          <div className="w-full grid place-items-center p-4">
            <p className="text-center text-sm text-custom-grey-text">
              No other attempts for {type}!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-start text-custom-dark-text">
            {parsedOthers.map((id: string) => (
              <>
                {type === "IPPT" ? (
                  <IPPTFeedCard
                    key={id}
                    data={JSON.parse(JSON.stringify(data[id]))}
                    id={id}
                    type={type}
                  />
                ) : (
                  <DefaultCard
                    className="w-full flex items-center justify-between gap-4"
                    key={id}
                  >
                    <div>
                      <h1>{type}</h1>
                      <p className="text-xs text-custom-grey-text">
                        {
                          TimestampToDateString(data[id].dateCompleted).split(
                            " "
                          )[0]
                        }
                      </p>
                    </div>
                    <h1 className="text-xl font-bold">{data[id].score}</h1>
                  </DefaultCard>
                )}
                <DeleteStatisticButton memberID={id} type={type} />
              </>
            ))}
          </div>
        )}
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
