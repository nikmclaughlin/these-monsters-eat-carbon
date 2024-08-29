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

export default crons;
