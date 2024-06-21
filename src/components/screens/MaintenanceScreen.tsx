import React from "react";
import Image from "next/image";

export default function MaintenanceScreen() {
  return (
    <div className="grid place-items-center h-[70vh] p-4">
      <div className="flex flex-col gap-5 items-center justify-center max-w-[500px] w-full">
        <div className="flex flex-col gap-10 items-center justify-center w-full">
          <Image
            src="/images/maintenance.svg"
            height={400}
            width={400}
            alt="Maintenance"
          />
          <h1 className="text-center text-custom-dark-text text-lg">
            Oops, we are currently under maintenance to make{" "}
            <span className="font-bold">
              Social<span className="text-custom-primary">40</span>
            </span>{" "}
            better for you! Try checking back later or contact a commander.
          </h1>
        </div>
      </div>
    </div>
  );
}
