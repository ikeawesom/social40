import { useEffect, useState } from "react";

export function useTimer(duration: number) {
  const [seconds, setSeconds] = useState(duration);
  const [isFinished, setFinish] = useState(false);
  useEffect(() => {
    if (seconds >= 0) {
      setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (seconds < 0) setFinish(true);
  }, [seconds]);

  return { seconds, isFinished };
}
