"use client";

import { useEffect, useState } from "react";
import Notice from "../utils/Notice";

export default function MaintenanceSection() {
  const [show, setShow] = useState<boolean>();

  useEffect(() => {
    const hideDebug = localStorage.getItem("hideDebug");
    if (!hideDebug) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (show === false) {
      localStorage.setItem("hideDebug", "true");
    }
  }, [show]);

  const handleHide = () => setShow(false);

  if (show === true)
    return (
      <Notice status="warning">
        <div className="flex flex-col items-start justify-start gap-1 mt-1">
          <h1 className="text-xl font-bold">
            Social40 is currently under maintenance.
          </h1>
          <p>
            As you have the role of an <span className="font-bold">admin</span>,
            you may still browse Social40. However, be wary as you may
            experience some missing functionality.
          </p>
          <div className="w-full flex items-center justify-end">
            <p
              onClick={handleHide}
              className="text-sm underline hover:opacity-70"
            >
              Dismiss this warning
            </p>
          </div>
        </div>
      </Notice>
    );
}
