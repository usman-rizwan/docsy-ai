'use client';

import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  documentId?: string;
  fileUrl?: string;
  chatId?: string;
}

export function useDocumentUpload() {
  const [files, setFiles] = useState<UploadedDocument[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const createDocument = useMutation(api.documents.createDocument);

  const { startUpload, isUploading } = useUploadThing('pdfUpload', {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const uploadedFile = res[0];

        const { fileUrl, fileName, fileSize, mimeType } = uploadedFile.serverData;

        setFiles(prev =>
          prev.map(f =>
            f.name === uploadedFile.name
              ? {
                ...f,
                status: "processing" as const,
                progress: 100,
                fileUrl,
              }
              : f
          )
        );

        if (fileUrl && user?.id) {
          try {
            console.log("Creating document record for:", uploadedFile.name);

            const documentId = (await createDocument({
              title: fileName.replace(".pdf", ""),
              fileName,
              fileUrl,
              fileSize,
              mimeType,
              clerkId: user.id,
            })) as string;

            console.log("Document created with ID:", documentId);

            setFiles(prev =>
              prev.map(f =>
                f.name === uploadedFile.name
                  ? { ...f, documentId, status: "processing" as const }
                  : f
              )
            );

            const response = await fetch("/api/process-document", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileUrl, documentId ,userId: user.id}),
              credentials: 'include',
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error("HTTP error:", response.status, errorText);
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log("Processing result:", result);

            if (result.success && result.chatId) {
              setFiles(prev =>
                prev.map(f =>
                  f.documentId === documentId
                    ? { ...f, status: "completed" as const, chatId: result.chatId }
                    : f
                )
              );
              console.log("Redirecting to chat page:", `/chat/${result.chatId}`);
              router.push(`/chat/${result.chatId}`);

            } else {
              console.error("Processing failed with result:", result);
              throw new Error(result.details || result.error || "Processing failed");
            }
          } catch (error) {
            console.error("Document processing error:", error);
            setFiles(prev =>
              prev.map(f =>
                f.name === uploadedFile.name
                  ? {
                    ...f,
                    status: "error" as const,
                    error: error instanceof Error ? error.message : "Processing failed",
                  }
                  : f
              )
            );
          }
        } else {
          console.log("Missing fileUrl or user:", { fileUrl, userId: user?.id });
        }
      }
    },

    onUploadError: (error) => {
      console.error('Upload error:', error);
      setFiles(prev =>
        prev.map(f => ({
          ...f,
          status: 'error' as const,
          error: error.message,
        }))
      );
    },
  });

  const handleFileUpload = async (fileList: File[]) => {
    const newFiles: UploadedDocument[] = fileList.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    try {
      await startUpload(fileList);
    } catch (error) {
      console.error('Upload failed:', error);
      setFiles(prev =>
        prev.map(f => ({
          ...f,
          status: 'error' as const,
          error: 'Upload failed',
        }))
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    );
    if (selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  return {
    files,
    isDragOver,
    isUploading,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    clearAllFiles,
  };
}
