import { dbHandler } from "@/src/firebase/db";
import { DEFAULT_STATS } from "@/src/utils/constants";
import handleResponses from "@/src/utils/helpers/handleResponses";

export default async function StatisticsSection({ id }: { id: string }) {
  try {
    const availableStats = {} as { [type: string]: any[] };

    const featuredStats = Object.keys(DEFAULT_STATS).filter(
      (type: string) => DEFAULT_STATS[type].featured
    );

    const promiseArr = featuredStats.map(async (type: string) => {
      const stat = DEFAULT_STATS[type];
      const { name } = stat;
      const { data, error } = await dbHandler.getSpecific({
        path: `MEMBERS/${id}/${name}`,
      });
      if (error)
        return handleResponses({ status: false, error: error.message });
      return handleResponses({ data });
    });

    const resolvedArr = await Promise.all(promiseArr);

    resolvedArr.forEach((item: any) => {
      if (item.data) {
        Object.keys(item.data).forEach((id: string) => {
          const { statType } = item.data[id];
          if (Object.keys(availableStats).includes(statType)) {
            availableStats[statType].push(item.data[id]);
          } else {
            availableStats[statType] = [item.data[id]];
          }
        });
      }
    });

    return (
      <div className="flex items-center justify-around gap-3 w-full">
        {Object.keys(DEFAULT_STATS).map((type: string) => {
          const stat = DEFAULT_STATS[type];
          if (stat.featured) {
            let bestStat = undefined as undefined | string;
            if (Object.keys(availableStats).includes(type)) {
              const isAsc = stat.scoringType === "ASC";
              bestStat = `${
                availableStats[type].sort((a, b) =>
                  isAsc ? a.score - b.score : b.score - a.score
                )[0].score
              }`;
              if (DEFAULT_STATS[type].timing) {
                bestStat = `${Math.floor(Number(bestStat) / 60)} min +`;
              }
            }
            return (
              <div
                key={type}
                className="flex flex-col items-center justify-center gap-0"
              >
                <p className="text-sm text-custom-grey-text">{type}</p>
                {Object.keys(availableStats).includes(type) ? (
                  <h4 className="text-lg text-custom-dark-text font-bold">
                    {bestStat ?? "-"}
                  </h4>
                ) : (
                  <h4 className="text-lg text-custom-grey-text font-bold">-</h4>
                )}
              </div>
            );
          }
        })}
      </div>
    );
  } catch (err: any) {
    return (
      <div className="w-full grid place-items-center p-3 text-center text-custom-grey-text">
        <p className="text-sm">
          Oops, an error occured loading {id}'s statistics.
        </p>
        <p className="text-xs">ERROR: {err.message}</p>
      </div>
    );
  }
}
