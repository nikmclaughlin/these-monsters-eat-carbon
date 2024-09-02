import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, query } from "./_generated/server";

const initReportingArea = {
  name: "",
  state: "",
  zipCode: "",
  latitude: "",
  longitude: "",
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

    // convert string body into array of area objects
    const lines = rawString.split("\n");
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
      const { name, zipCode } = raw;
      const filtered = {
        name: name,
        zipCode: zipCode,
      };
      return filtered;
    });

    // Split records to fit within Convex db write limits
    const recordSlices = [];
    const sliceSize = 8000;
    let lastIndex = 0;
    for (let i = 0; i < records.length; i += sliceSize) {
      recordSlices.push(records.slice(i, i + sliceSize));
      lastIndex = i;
    }

    recordSlices.push(records.slice(lastIndex, records.length - 1));

    await Promise.all(
      recordSlices.map(async (slice) => {
        await ctx.runMutation(internal.reportingAreas.storeReportingAreas, {
          areas: slice,
        });
      }),
    );
  },
});

export const storeReportingAreas = internalMutation({
  args: { areas: v.array(v.object({ name: v.string(), zipCode: v.string() })) },
  handler: async (ctx, args) => {
    const { areas } = args;

    // store each object as a table document
    await Promise.all(
      areas.map(async (record) => {
        return ctx.db.insert("reportingAreas", record);
      }),
    );
  },
});

export const getReportingAreaNameFromZip = query({
  args: { zip: v.string() },
  handler: async (ctx, args) => {
    const reportingArea = await ctx.db
      .query("reportingAreas")
      .withIndex("byZipCode", (q) => q.eq("zipCode", args.zip))
      .first();

    return reportingArea?.name || "Data not found";
  },
});

/**
 * EDIT: Turns out Convex can't query for a string in a string[] field so I have to break these out.
 * Leaving this here for posterity, and reference in case I ever need this as a util:
 *
 * Logic below merges an array of objects based on a reference property value, preserving the non-ref
 * value(s) in an array prop
 *  */

// // merge zips by reporting area
// const mergedRecords: reportingAreaRecord[] = [];
// let foundRecord;
// records.map((record) => {
//   if ((foundRecord = mergedRecords.find((el) => el.name === record.city))) {
//     foundRecord.zipCodes.push(record.zipcode);
//     return;
//   }
//   mergedRecords.push({ name: record.city, zipCodes: [record.zipcode] });
// });
