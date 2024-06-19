export type CreditsRoleType = {
  role?: string;
  displayName: string;
  importance: number;
  memberID?: string;
  substring?: string;
};

export const EXECUTIVES = [
  {
    role: "Founder",
    importance: 0,
    displayName: "3SG Ike Lim",
    memberID: "stallion-ike",
    substring: "Tango Commander, Stallion",
  },
  {
    role: "Advisor",
    importance: 1,
    displayName: "CPT Yam Jun Wei",
    memberID: "stallion-jun-wei",
    substring: "Officer Commanding, Stallion",
  },
  {
    role: "Co-Advisor",
    importange: 2,
    displayName: "MAJ Cephas Ong",
    substring: "Commanding Officer, 40 SAR",
  },
] as CreditsRoleType[];

export const TECHNICALS = [
  {
    role: "Tech Lead",
    displayName: "3SG Ike Lim",
    substring: "Tango Commander, Stallion",
    memberID: "stallion-ike",
    importance: 0,
  },
] as CreditsRoleType[];

export const SPECIAL_THANKS = [
  { displayName: "3SG Rizq Aqil", importance: 0, memberID: "stallion-rizq" },
  { displayName: "3SG Koh Kailun", importance: 0, memberID: "stallion-kailun" },
  { displayName: "3SG Pradeep G", importance: 1, memberID: "stallion-pradeep" },
  { displayName: "3SG Evan Huang", importance: 1, memberID: "stallion-evan" },
  { displayName: "3SG Lim Ni Ler", importance: 1, memberID: "stallion-ni-ler" },
  { displayName: "3SG Ping Lefan", importance: 2, memberID: "stallion-lefan" },
  { displayName: "3SG Yu Hang", importance: 2, memberID: "stallion-yu-hang" },
] as CreditsRoleType[];
