'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  MessageCircle
} from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UploadPage() {
  const { user } = useUser();
  console.log('user',user);
  
  const router = useRouter();
  
  const {
    files,
    isDragOver,
    isUploading,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
  } = useDocumentUpload();
  

  useEffect(() => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.chatId);
    if (completedFiles.length > 0) {
      const latestCompletedFile = completedFiles[completedFiles.length - 1];
      if (latestCompletedFile.chatId) {
        console.log('Redirecting to chat:', latestCompletedFile.chatId);
        toast.success('File processed! Redirecting to chat...');
        router.push(`/chat/${latestCompletedFile.chatId}`);

      }
    }
  }, [files, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-blue-600 " />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="secondary">Uploading</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'completed':
        return <Badge variant="default">Ready</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload PDFs</h1>
          <p className="text-muted-foreground">Upload your PDF documents to start chatting with them</p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload PDF Documents</CardTitle>
            <CardDescription>
              Upload PDF files up to 10MB each. Documents will be automatically processed and made ready for chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Drop PDF files here or click to upload
              </h3>
              <p className="text-muted-foreground mb-4">PDF files up to 8MB</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label
                htmlFor="file-upload"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium cursor-pointer inline-block transition-colors"
              >
                Upload PDF
              </label>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files ({files.length})</CardTitle>
              <CardDescription>
                Monitor the upload and processing status of your files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(file.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          {getStatusBadge(file.status)}
                        </div>
                        <span className="text-sm text-gray-500">{file.size}</span>
                      </div>
                      
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <div className="mb-2">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {file.status === 'uploading' 
                              ? `Uploading... ${Math.round(file.progress)}%`
                              : 'Processing document...'
                            }
                          </p>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="space-y-2">
                          <p className="text-sm text-green-600">
                            Ready to chat! Redirecting to chat page...
                          </p>
                          {file.chatId && (
                            <Button
                              size="sm"
                              onClick={() => router.push(`/chat/${file.chatId}`)}
                              className="text-xs"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Go to Chat
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <p className="text-sm text-red-600">
                          {file.error || 'Failed to process file. Please try again.'}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {files.some(f => f.status === 'completed') && (
                <div className="mt-6 pt-4 border-t">
                  <Link href="/dashboard">
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chatting with Uploaded Documents
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Upload Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Ensure your PDFs are text-based (not scanned images) for best results</span>
              </li>
              
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Larger documents may take longer to process</span>
              </li>
             
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}