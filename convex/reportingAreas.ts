import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

const initReportingArea = {
  city: "",
  state: "",
  zipcode: "",
  latitude: "",
  longitude: "",
};

type reportingAreaRecord = {
  name: string;
  zipCodes: string[];
};

const fetchReportingAreas = async () => {
  const response = await fetch(
    "https://files.airnowtech.org/airnow/yesterday/cityzipcodes.csv",
  );
  const text = await response.text();
  return text;
};

export const seedReportingAreas = internalAction({
  args: {},
  handler: async (ctx) => {
    const rawString = await fetchReportingAreas();

    // create records from data
    await ctx.runMutation(internal.reportingAreas.storeReportingAreas, {
      text: rawString,
    });
  },
});

export const storeReportingAreas = internalMutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    // convert string body into array of area objects
    const lines = text.split("\n");
    const rawObjects = lines.map((line) =>
      line.split("|").reduce(
        (object, value, index) => ({
          ...object,
          [Object.keys(initReportingArea)[index]]: value,
        }),
        initReportingArea,
      ),
    );
    // filter out the data we don't need
    const records = rawObjects.map((raw) => {
      const { city, zipcode } = raw;
      const filtered = {
        city,
        zipcode,
      };
      return filtered;
    });

    // merge zips by reporting area
    const mergedRecords: reportingAreaRecord[] = [];
    let foundRecord;
    records.map((record) => {
      if ((foundRecord = mergedRecords.find((el) => el.name === record.city))) {
        foundRecord.zipCodes.push(record.zipcode);
        return;
      }
      mergedRecords.push({ name: record.city, zipCodes: [record.zipcode] });
    });

    // store each object as a table document
    await Promise.all(
      mergedRecords.map(async (obj) => {
        return ctx.db.insert("reportingAreas", obj);
      }),
    );
  },
});
