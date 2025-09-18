import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUpload: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    try {
      // Return the file information
      return { 
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      console.error("Upload completion error:", error);
      throw new UploadThingError("Failed to process upload");
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
