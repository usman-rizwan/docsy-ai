import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), 
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
  documents: defineTable({
    title: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    userId: v.optional(v.id("users")), 
    clerkId: v.string(), 
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    uploadedAt: v.number(),
    processedAt: v.optional(v.number()),
    metadata: v.optional(v.object({
      tokenCount: v.optional(v.number()),
      loc: v.optional(v.object({
        lines:v.optional(v.object({
          from:v.optional(v.number()),
          to:v.optional(v.number()),
        }))
      })),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),

  documentChunks: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    chunkIndex: v.number(),
    metadata: v.object({
      pageNumber: v.optional(v.number()),
      startCharIndex: v.optional(v.number()),
      endCharIndex: v.optional(v.number()),
      tokenCount: v.optional(v.number()),
    }),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"]) 
    .index("by_document_index", ["documentId", "chunkIndex"]),

  chats: defineTable({
    title: v.string(),
    userId: v.optional(v.id("users")), 
    clerkId: v.string(), 
    documentId: v.optional(v.id("documents")),
    createdAt: v.number(),
    updatedAt: v.number(),
    messageCount: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_document", ["documentId"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    userId: v.optional(v.id("users")), 
    clerkId: v.string(),
    sources: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_chat", ["chatId"])
    .index("by_user", ["userId"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_chat_created", ["chatId", "createdAt"]),
});
