import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {

    const { chatId, message, userId } = await request.json();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!chatId || !message) {
      return NextResponse.json(
        { error: "Missing chatId or message" },
        { status: 400 }
      );
    }

    const chat = await convex.query(api.chats.getChatForUser, {
      chatId,
      clerkId: userId
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    if (!chat.documentId) {
      return NextResponse.json({ error: "No document associated with this chat" }, { status: 400 });
    }

    const chunks = await convex.query(api.documentChunks.getChunksByDocumentForUser, {
      documentId: chat.documentId,
      clerkId: userId,
    });

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({
        error: "No document content available. Please ensure your PDF was processed successfully."
      }, { status: 400 });
    }

    const context = chunks
      .map((chunk) => chunk.content)
      .join("\n\n")
      .slice(0, 4000);
    console.log('context', context);


    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.1,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const prompt = PromptTemplate.fromTemplate(`
You are an AI assistant that helps users understand and analyze their own PDF documents. 

IMPORTANT SECURITY REQUIREMENTS:
- You MUST ONLY use information from the PDF document provided below
- You MUST NOT reference or use information from any other documents or sources
- You MUST NOT make assumptions beyond what is explicitly stated in the provided PDF content
- If the question cannot be answered from the provided PDF content, you MUST clearly state this limitation

PDF Document Content (User's Own Document):
{context}

User Question: {question}

INSTRUCTIONS:
1. Answer ONLY based on the PDF content provided above
2. If the PDF content does not contain information to answer the question, explicitly state: "I cannot answer this question based on the content of your PDF document."
3. Be precise and relevant - do not provide general information not found in the PDF
4. If applicable, reference specific sections or content from the PDF
5. Maintain strict data isolation - only use the user's own document content

Answer:
`);

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
      context,
      question: message,
    });

    await convex.mutation(api.chats.addMessage, {
      chatId,
      content: message,
      role: "user",
      clerkId: userId,
    });

    await convex.mutation(api.chats.addMessage, {
      chatId,
      content: response.content as string,
      role: "assistant",
      clerkId: userId,
      sources: ["PDF Document"], // You could extract actual page numbers here
    });

    return NextResponse.json({
      success: true,
      response: response.content,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
