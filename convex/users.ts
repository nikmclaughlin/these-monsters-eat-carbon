import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? await ctx.db.get(userId) : null;
  },
});

export const addTrackedZip = mutation({
  args: { zip: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId !== null) {
      const previousZips = (await ctx.db.get(userId))?.trackedZips;

      // merge and dedupe additions with existing zips
      const newZips = [
        ...new Set(previousZips ? [...previousZips, args.zip] : [args.zip]),
      ];

      await ctx.db.patch(userId, { trackedZips: newZips });
    }
  },
});

export const removeTrackedZip = mutation({
  args: { zip: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId !== null) {
      const user = await ctx.db.get(userId);
      if (user !== null) {
        if (user.trackedZips?.includes(args.zip)) {
          const newZips = user.trackedZips.filter((zip) => zip !== args.zip);
          await ctx.db.patch(userId, { trackedZips: newZips });
        }
      }
    }
  },
});

// EDIT: I think I can just do viewer.trackedZips above without issue, but I'll leave this here in case
// export const getTrackedZips = query({
//   args: {},
//   handler: async (ctx) => {
//     const userId = await getAuthUserId(ctx);
//     if (userId !== null) {
//       const user = await ctx.db.get(userId);
//       return user ? user.trackedZips : ["Invalid User data"];
//     }
//     return ["Invalid User data"];
//   },
// });
