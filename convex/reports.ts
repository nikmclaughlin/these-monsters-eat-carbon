import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

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
  aqiValue: "",
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
      return filtered;
    });
    // Create a new db document for each filtered object
    await Promise.all(
      records.map(async (obj) => {
        return ctx.db.insert("reports", obj);
      }),
    );
  },
});
