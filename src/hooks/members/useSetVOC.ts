import { useState } from "react";

const DEFAULT_TIME = { min: 0, sec: 0 };

export function useSetVOC() {
  const [time, setTime] = useState(DEFAULT_TIME);
  const resetTime = () => setTime(DEFAULT_TIME);
  return { time, setTime, resetTime };
}
