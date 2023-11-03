export const ROLES_HIERARCHY = {
  owner: { rank: 5, title: "Tier 5" },
  admin: { rank: 4, title: "Tier 4" },
  cos: { rank: 3, title: "Tier 3 (COS)" },
  commander: { rank: 2, title: "Tier 2" },
  member: { rank: 1, title: "Tier 1" },
} as { [role: string]: { rank: number; title: string } };

export const BADGE_COLORS = {
  Gold: "bg-orange-300",
  Sharpshooter: "bg-green-300",
  Recon: "bg-blue-300",
} as { [key: string]: string };

export const MAX_LENGTH = 30;
