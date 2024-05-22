import { calculateIPPT } from "@/src/utils/members/SetStatistics";
import { useEffect, useState } from "react";

export function useSetIppt() {
  const [calculating, setCalculating] = useState(false);
  const [ipptStat, setIpptStat] = useState({
    age: 18,
    pushups: 0,
    situps: 0,
    min: 0,
    sec: 0,
    score: 0,
  });
  const resetIppt = () => {
    setIpptStat({
      age: 18,
      pushups: 0,
      situps: 0,
      min: 0,
      sec: 0,
      score: 0,
    });
  };

  const modifyScore = async () => {
    const { age, min, pushups, sec, situps } = ipptStat;
    const timing = Number(min) * 60 + Number(sec);
    const { data: newScore } = await calculateIPPT({
      age,
      pushups,
      situps,
      timing,
    });
    setIpptStat({ ...ipptStat, score: newScore });
    setCalculating(false);
  };

  useEffect(() => {
    setCalculating(true);
    setTimeout(() => {
      console.log();
      modifyScore();
    }, 400);
  }, [
    ipptStat.age,
    ipptStat.min,
    ipptStat.sec,
    ipptStat.pushups,
    ipptStat.situps,
  ]);

  const handleIPPTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpptStat({ ...ipptStat, [e.target.name]: e.target.value });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setIpptStat({ ...ipptStat, [e.target.name]: e.target.value });

  return {
    calculating,
    ipptStat,
    handleAgeChange,
    handleIPPTChange,
    resetIppt,
  };
}
