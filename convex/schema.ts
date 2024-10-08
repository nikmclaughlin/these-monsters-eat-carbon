import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    trackedZips: v.optional(v.array(v.string())),
  })
    .index("email", ["email"])
    .index("trackedZips", ["trackedZips"]),
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  reports: defineTable({
    validDate: v.string(), // Date of forecast
    dataType: v.string(), // (F)orecast or (O)bservation
    reportingArea: v.string(), // Key for zip lookups
    parameterName: v.string(), // OZONE, PM2.5, etc.
    aqiValue: v.union(v.string(), v.number()), // The # measure itself
    aqiCategory: v.string(), // The AQI rating: "Good", "Moderate", "Unhealthy", etc.
  })
    .index("byValidDate", ["validDate"])
    .index("byReportingArea", ["reportingArea"])
    .index("byAQIValue", ["aqiValue"]),
  reportingAreas: defineTable({
    name: v.string(),
    zipCode: v.string(),
  })
    .index("byZipCode", ["zipCode"])
    .index("byName", ["name"]),
});
