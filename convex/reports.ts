import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalAction, internalMutation } from "./_generated/server";

export const fetchAndStoreLatestReports = internalAction({
  args: {},
  handler: async (ctx, args) => {
    const response = await fetch(
      "https://s3-us-west-1.amazonaws.com//files.airnowtech.org/airnow/today/reportingarea.dat",
    );
    const blob = await response.blob();

    // store blob in Convex
    const storageId: Id<"_storage"> = await ctx.storage.store(blob);

    await ctx.runMutation(internal.reports.storeResult, {
      storageId,
    });
  },
});

export const storeResult = internalMutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const { storageId } = args;
    // TODO: process raw data for insertion
    await ctx.db.insert("reports", { storageId });
  },
});

// export const updateAll = internalMutation(async (ctx) => {
//   //   const json = await res.json();
//   // ctx.db.insert('reports',)
// });
