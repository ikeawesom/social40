import {
  CalendarDateTypes,
  FullActivityType,
} from "@/src/components/feed/views/ActivityCalendarClientView";
import {
  getPreviousWeekStartAndEnd,
  getNextWeekStartAndEnd,
  getPreviousMonthStartAndEnd,
  getNextMonthStartAndEnd,
} from "@/src/utils/helpers/getCurrentDate";
import { fetchActivitiesWeekly } from "@/src/utils/home/fetchActivitiesWeekly";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type CalendarViewTypes = {
  dates: CalendarDateTypes;
  groupID: string;
  all?: string[] | null;
};

export function useHandleCalendarView({
  dates: { startDate, endDate },
  groupID,
  all,
}: CalendarViewTypes) {
  const [rangeDates, setRangeDates] = useState<{
    start: Date;
    end: Date;
  }>({ start: startDate, end: endDate });
  const [activities, setActivities] = useState<FullActivityType>();

  const fetchData = async () => {
    try {
      // console.log("through client:", rangeDates.start);
      const { data, error } = await fetchActivitiesWeekly(
        rangeDates.start,
        rangeDates.end,
        all ?? [groupID]
      );

      if (error) throw new Error(error);
      const actData = data as FullActivityType;
      setActivities(actData);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setActivities(undefined);
    fetchData();
  }, [rangeDates, groupID]);

  const handleWeekBack = async () => {
    const { endDate, startDate } = getPreviousWeekStartAndEnd(rangeDates.start);
    setRangeDates({ start: startDate, end: endDate });
  };
  const handleWeekForward = () => {
    const { endDate, startDate } = getNextWeekStartAndEnd(rangeDates.start);
    setRangeDates({ start: startDate, end: endDate });
  };
  const handleMonthBack = () => {
    setActivities(undefined);
    const { endDate, startDate } = getPreviousMonthStartAndEnd(
      rangeDates.start
    );
    setRangeDates({ start: startDate, end: endDate });
  };

  const handleMonthForward = () => {
    setActivities(undefined);
    const { endDate, startDate } = getNextMonthStartAndEnd(rangeDates.start);
    setRangeDates({ start: startDate, end: endDate });
  };
  return {
    activities,
    rangeDates,
    handleWeekBack,
    handleWeekForward,
    handleMonthBack,
    handleMonthForward,
  };
}
