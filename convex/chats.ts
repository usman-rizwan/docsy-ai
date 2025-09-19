import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new chat
export const createChat = mutation({
  args: {
    title: v.string(),
    userId: v.optional(v.id("users")),
    clerkId: v.string(),
    documentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const chatId = await ctx.db.insert("chats", {
      ...args,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    });
    return chatId;
  },
});

// Get chats by user (Convex user ID)
export const getChatsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get chats by Clerk ID (for backward compatibility)
export const getChatsByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .order("desc")
      .collect();
  },
});

// Get chat by ID
export const getChat = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chatId);
  },
});

export const getChatForUser = query({
  args: { 
    chatId: v.id("chats"),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.clerkId !== args.clerkId) {
      return null;
    }
    return chat;
  },
});

// Update chat
export const updateChat = mutation({
  args: {
    chatId: v.id("chats"),
    title: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    messageCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { chatId, ...updates } = args;
    await ctx.db.patch(chatId, updates);
  },
});

// Add message to chat
export const addMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    userId: v.optional(v.id("users")),
    clerkId: v.string(),
    sources: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });

    const currentChat = await ctx.db.get(args.chatId);
    if (currentChat) {
      await ctx.db.patch(args.chatId, {
        messageCount: currentChat.messageCount + 1,
        updatedAt: Date.now(),
      });
    }

    return messageId;
  },
});

// Get messages by chat
export const getMessagesByChat = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat_created", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});
