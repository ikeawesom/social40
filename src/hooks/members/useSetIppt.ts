import { calculateIPPT } from "@/src/utils/members/calculateIPPT";
import { useEffect, useState } from "react";

export function useSetIppt() {
  const [ipptScore, setIpptScore] = useState({ calculating: false, score: 0 });
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

  const modifyScore = () => {
    const { age, min, pushups, sec, situps } = ipptStat;
    const timing = Number(min) * 60 + Number(sec);
    const { score: newScore } = calculateIPPT({
      age,
      pushups,
      situps,
      timing,
    });
    setIpptScore({ calculating: false, score: newScore });
  };

  useEffect(() => {
    setIpptScore({ ...ipptScore, calculating: true });
    setTimeout(() => modifyScore(), 400);
  }, [ipptStat]);

  const handleIPPTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpptStat({ ...ipptStat, [e.target.name]: e.target.value });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setIpptStat({ ...ipptStat, [e.target.name]: e.target.value });

  const handleIPPTScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpptScore({ ...ipptScore, score: Number(e.target.value) });
  };

  return {
    ipptScore,
    handleIPPTScoreChange,
    ipptStat,
    handleAgeChange,
    handleIPPTChange,
    resetIppt,
  };
}
