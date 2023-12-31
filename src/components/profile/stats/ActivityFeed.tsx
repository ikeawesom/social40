import React from "react";
import ComingSoonIcon from "../../utils/ComingSoonIcon";

export default function ActivityFeed({
  viewProfile,
  memberID,
}: {
  viewProfile?: boolean;
  memberID: string;
}) {
  return <ComingSoonIcon small width={60} height={60} />;
  // const empty = Object.keys(activities).length === 0;

  // if (!empty)
  //   return (
  //     <div className="col-span-1 w-full">
  //       {Object.keys(activities).map((activityID: string) => (
  //         <div
  //           key={activityID}
  //           className="p-2 border-b-2 border-custom-light-text flex flex-col items-start justify-center gap-y-2"
  //         >
  //           <h1 className="text-custom-dark-text text-sm">
  //             {activities[activityID].createdByName}
  //           </h1>
  //           <div className="flex flex-col items-start justify-center">
  //             <h1 className="text-lg font-semibold text-custom-dark-text">
  //               {activities[activityID].activityTitle}
  //             </h1>
  //             <h4>{activities[activityID].activityDesc}</h4>
  //           </div>
  //           <div className="flex flex-row items-center justify-between w-full">
  //             <p className="text-xs text-custom-grey-text">
  //               {activities[activityID].createdOn}
  //             </p>
  //             <p>{activities[activityID].likes}</p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // return (
  //   <div className="min-h-[30vh] grid place-items-center p-2">
  //     <p className="text-center text-custom-grey-text text-sm">
  //       Hmm.. it's quiet here. Post something!
  //     </p>
  //   </div>
  // );
}
