import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create document chunks
export const createDocumentChunks = mutation({
  args: {
    documentId: v.id("documents"),
    chunks: v.array(v.object({
      content: v.string(),
      chunkIndex: v.number(),
      metadata: v.object({
        pageNumber: v.optional(v.number()),
        startCharIndex: v.optional(v.number()),
        endCharIndex: v.optional(v.number()),
        tokenCount: v.optional(v.number()),
      }),
    })),
  },
  handler: async (ctx, args) => {
    const chunkIds = [];
    
    for (const chunk of args.chunks) {
      const chunkId = await ctx.db.insert("documentChunks", {
        documentId: args.documentId,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        metadata: chunk.metadata,
        createdAt: Date.now(),
      });
      chunkIds.push(chunkId);
    }
    
    return chunkIds;
  },
});

// Get chunks by document
export const getChunksByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentChunks")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});

// Get chunks by document with user validation (using Clerk ID)
export const getChunksByDocumentForUser = query({
  args: { 
    documentId: v.id("documents"),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document || document.clerkId !== args.clerkId) {
      throw new Error("Document not found or access denied");
    }

    return await ctx.db
      .query("documentChunks")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});

// Get chunk by document and index
export const getChunkByDocumentAndIndex = query({
  args: { 
    documentId: v.id("documents"),
    chunkIndex: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documentChunks")
      .withIndex("by_document_index", (q) => 
        q.eq("documentId", args.documentId).eq("chunkIndex", args.chunkIndex)
      )
      .first();
  },
});

// Search chunks by content (for RAG)
export const searchChunks = query({
  args: { 
    documentId: v.id("documents"),
    searchTerm: v.string()
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("documentChunks")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    
    // Simple text search - in production, you'd use vector search
    return chunks.filter(chunk => 
      chunk.content.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});
