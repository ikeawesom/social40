export const ROLES_HIERARCHY = {
  owner: { rank: 4, title: "Level 4" },
  admin: { rank: 3, title: "Level 3" },
  commander: { rank: 2, title: "Level 2" },
  member: { rank: 1, title: "Level 1" },
} as { [role: string]: { rank: number; title: string } };

export const BADGE_COLORS = {
  Gold: "bg-orange-300",
  Sharpshooter: "bg-green-300",
  Recon: "bg-blue-300",
} as { [key: string]: string };

export const MAX_LENGTH = 30;
