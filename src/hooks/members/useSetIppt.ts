import { useState } from "react";

export function useSetIppt() {
  const [ipptStat, setIpptStat] = useState({
    age: 18,
    pushups: 0,
    situps: 0,
    min: 0,
    sec: 0,
  });
  const resetIppt = () => {
    setIpptStat({
      age: 18,
      pushups: 0,
      situps: 0,
      min: 0,
      sec: 0,
    });
  };

  const handleIPPTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpptStat({ ...ipptStat, [e.target.name]: e.target.value });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setIpptStat({ ...ipptStat, [e.target.name]: e.target.value });

  return {
    ipptStat,
    handleAgeChange,
    handleIPPTChange,
    resetIppt,
  };
}
