import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import { useState, useEffect } from "react";
import { useHostname } from "../../useHostname";
import { useMemberID } from "../../useMemberID";
import { ActivityWaitlistType } from "@/src/components/groups/custom/activities/ActivityWaitlist";

export function useFetchActivityRequests(activityID: string, groupID: string) {
  const [requested, setRequested] = useState<ActivityWaitlistType>();
  const { memberID } = useMemberID();
  const { host } = useHostname();

  const fetchData = async () => {
    const { error, data } = await FetchGroupActivityData.getRequests({
      activityID,
      groupID,
      host,
      memberID,
    });
    if (!error) {
      const { requestsData } = data;
      setRequested(requestsData);
    } else {
      setRequested({});
      console.log(error);
    }
  };

  useEffect(() => {
    if (requested === undefined) fetchData();
  }, [requested]);

  return { requested };
}
