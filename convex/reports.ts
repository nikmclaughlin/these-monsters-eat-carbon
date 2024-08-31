import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
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

const fetchAQIDataBlob = async () => {
  const response = await fetch(
    "https://s3-us-west-1.amazonaws.com//files.airnowtech.org/airnow/today/reportingarea.dat",
  );
  const blob = await response.blob();
  return blob;
};

const getDataString = async (blob: Blob) => {
  const stream = blob.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");

  const result = await reader.read().then(({ value, done }) => {
    /**
     * logging here: {value: undefined, done: true}
     * Per MDN, this means that the stream has closed before I even got the chance to read it?!
     * " If the stream becomes closed, the promise will be fulfilled with an object of the form { value: undefined, done: true }. "
     * @see https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/read
     */
    if (done) {
      console.log("Stream is done");
      return;
    }
    const string = decoder.decode(value);

    return string;
  });

  if (!result) {
    console.log("stream read failed!");
    return "";
  }

  return result;
};

export const fetchAndStoreLatestReports = internalAction({
  args: {},
  handler: async (ctx) => {
    const blob = await fetchAQIDataBlob();

    // store blob in Convex
    const storageId: Id<"_storage"> = await ctx.storage.store(blob);

    const stringified = await getDataString(blob);

    // create records from data
    await ctx.runMutation(internal.reports.storeResult, {
      storageId: storageId,
      contents: stringified,
    });
  },
});

export const storeResult = internalMutation({
  args: { storageId: v.id("_storage"), contents: v.string() },
  handler: async (ctx, args) => {
    const { storageId, contents } = args;
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
        return ctx.db.insert("reports", {
          storageId: storageId,
          ...obj,
        });
      }),
    );
  },
});
