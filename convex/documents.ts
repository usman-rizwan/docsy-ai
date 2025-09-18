import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new document record
export const createDocument = mutation({
  args: {
    title: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    userId: v.optional(v.id("users")),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...rest } = args;

    const documentId = await ctx.db.insert("documents", {
      ...rest,
      ...(clerkId !== undefined ? { clerkId } : {}),
      status: "uploading",
      uploadedAt: Date.now(),
    });
    return documentId;
  },
});

// Update document status
export const updateDocumentStatus = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    metadata: v.optional(v.object({
      tokenCount: v.optional(v.number()),
      loc: v.optional(v.object({
        lines: v.optional(v.object({
          from: v.optional(v.number()),
          to: v.optional(v.number()),
        }))
      })),
    })),
  },
  handler: async (ctx, args) => {
    const { documentId, ...updates } = args;
    
    if (updates.status === "completed") {
      updates.processedAt = Date.now();
    }

    await ctx.db.patch(documentId, updates);
  },
});

// Get documents by user (Convex user ID)
export const getDocumentsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get documents by Clerk ID (for backward compatibility)
export const getDocumentsByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .collect();
  },
});

// Get document by ID
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// Get documents by status
export const getDocumentsByStatus = query({
  args: { 
    userId: v.string(),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", args.userId).eq("status", args.status)
      )
      .collect();
  },
});

// Update document with user ID
export const updateDocumentUser = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      userId: args.userId,
    });
  },
});
