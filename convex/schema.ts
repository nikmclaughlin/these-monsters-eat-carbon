import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  reports: defineTable({
    storageId: v.id("_storage"), // File ref for raw data
    validDate: v.string(), // Date of forecast
    dataType: v.string(), // (F)orecast or (O)bservation
    reportingArea: v.string(), // Key for zip lookups
    parameterName: v.string(), // OZONE, PM2.5, etc.
    aqiValue: v.string(), // The # measure itself
    aqiCategory: v.string(), // The AQI rating: "Good", "Moderate", "Unhealthy", etc.
  }),
});
