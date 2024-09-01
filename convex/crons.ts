import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "get AQI data",
  {
    hourUTC: 1,
    minuteUTC: 11,
  },
  internal.reports.fetchAndStoreLatestReports,
);

crons.daily(
  "remove old AQI reports",
  {
    hourUTC: 2,
    minuteUTC: 22,
  },
  internal.reports.clearOldReports,
);

export default crons;
