import { getAgeGroup, getIpptScore } from "ippt-utils";
import { IPPTStats } from "./SetStatistics";

export function calculateIPPT(stats: IPPTStats) {
  const { age, pushups, situps, timing } = stats;

  const ageGroup = getAgeGroup(age);
  const updatedTime = Math.ceil((timing + 1) / 10) * 10;
  const result = getIpptScore(ageGroup, pushups, situps, updatedTime);
  return { score: result.score, result };
}
