

import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api"
import { auth, currentUser } from '@clerk/nextjs/server'




const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {


    const { fileUrl, documentId ,userId} = await request.json();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!fileUrl || !documentId) {
      return NextResponse.json(
        { error: "Missing fileUrl or documentId" },
        { status: 400 }
      );
    }

    await convex.mutation(api.documents.updateDocumentStatus, {
      documentId,
      status: "processing",
    });

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    const data = await response.blob();

    const loader = new WebPDFLoader(data);
    const docs = await loader.load();
    const pdfTextContent = docs.map((doc) => doc.pageContent).join("\n\n");

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 120,
    });
    const chunkDocs = await textSplitter.createDocuments([pdfTextContent]);

    const chunks = chunkDocs.map((chunk, index) => ({
      content: chunk.pageContent,
      chunkIndex: index,
      metadata: {
        tokenCount: chunk.pageContent.length,
      },
    }));

    await convex.mutation(api.documentChunks.createDocumentChunks, {
      documentId,
      chunks,
    });

    const document = await convex.query(api.documents.getDocument, { documentId });

    // Create chat
    const chatId = await convex.mutation(api.chats.createChat, {
      title: document?.title || "New Chat",
      clerkId: userId,
      documentId,
    });

    await convex.mutation(api.documents.updateDocumentStatus, {
      documentId,
      status: "completed",
    });

    return NextResponse.json({ success: true, chatId });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}