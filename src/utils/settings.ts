export const IS_DEBUG = { status: true, membersOnly: false };
export const isFullMaintenance =
  IS_DEBUG.status &&
  !IS_DEBUG.membersOnly &&
  process.env.NODE_ENV === "production";

export const MAX_LENGTH = 30;

export const COOKIE_LIFESPAN = 2 * 365 * 24 * 60 * 60;
