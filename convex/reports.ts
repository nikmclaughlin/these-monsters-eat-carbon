import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";

const rawData = {
  issueDate: "",
  validDate: "",
  validTime: "",
  timeZone: "",
  recordSequence: "",
  dataType: "",
  primary: "",
  reportingArea: "",
  stateCode: "",
  latitude: "",
  longitude: "",
  parameterName: "",
  aqiValue: 0,
  aqiCategory: "",
  actionDay: "",
  discussion: "",
  forecastSource: "",
};

const fetchRawAQIData = async () => {
  const response = await fetch(
    "https://s3-us-west-1.amazonaws.com//files.airnowtech.org/airnow/today/reportingarea.dat",
  );
  const res = await response.text();
  return res;
};

export const fetchAndStoreLatestReports = internalAction({
  args: {},
  handler: async (ctx) => {
    const rawString = await fetchRawAQIData();

    // create records from data
    await ctx.runMutation(internal.reports.storeResult, {
      contents: rawString,
    });
  },
});

export const storeResult = internalMutation({
  args: { contents: v.string() },
  handler: async (ctx, args) => {
    const { contents } = args;
    // Create a JS object from each line of the stored file
    const lines = contents.split("\n");
    const rawObjects = lines.map((line) =>
      line.split("|").reduce(
        (object, value, index) => ({
          ...object,
          [Object.keys(rawData)[index]]: value,
        }),
        rawData,
      ),
    );
    // Filter the keys of each object to only copy desired data
    const records = rawObjects.map((raw) => {
      const {
        validDate,
        dataType,
        reportingArea,
        parameterName,
        aqiValue,
        aqiCategory,
      } = raw;
      const filtered = {
        validDate,
        dataType,
        reportingArea,
        parameterName,
        aqiValue,
        aqiCategory,
      };
      // convert aqiValue to integer
      filtered.aqiValue = Math.round(filtered.aqiValue);
      return filtered;
    });

    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

    // Create a new db document for each filtered object containing today's data
    await Promise.all(
      records.map(async (obj) => {
        if (obj.validDate === today && obj.dataType === "F") {
          return ctx.db.insert("reports", obj);
        }
      }),
    );
  },
});

const getOldReports = internalQuery({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

    // convex limits reads to 4000 so we grab as much as we can for deletion
    const oldies = await ctx.db
      .query("reports")
      .withIndex("byValidDate", (q) => q.eq("validDate", today))
      .take(4000);
    return oldies;
  },
});

export const clearOldReports = internalMutation({
  handler: async (ctx) => {
    const oldReports = await getOldReports(ctx, {});

    await Promise.all(
      oldReports.map(async (result) => {
        await ctx.db.delete(result._id);
      }),
    );
  },
});

export const getReportsByReportingAreaName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const { name } = args;
    return await ctx.db
      .query("reports")
      .withIndex("byReportingArea", (q) => q.eq("reportingArea", name))
      .collect();
  },
});

export const getFeaturedReports = query({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("byAQIValue")
      .order("desc")
      .take(args.count);
  },
});
