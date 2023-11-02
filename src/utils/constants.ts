export const ROLES_HIERARCHY = {
  owner: { rank: 7, title: "Level 7" },
  admin: { rank: 6, title: "Level 6" },
  com4: { rank: 5, title: "Level 5" },
  com3: { rank: 4, title: "Level 4" },
  com2: { rank: 3, title: "Level 3" },
  com1: { rank: 2, title: "Level 2" },
  member: { rank: 2, title: "Level 1" },
} as { [role: string]: { rank: number; title: string } };

export const BADGE_COLORS = {
  Gold: "bg-orange-300",
  Sharpshooter: "bg-green-300",
  Recon: "bg-blue-300",
} as { [key: string]: string };

export const MAX_LENGTH = 30;
