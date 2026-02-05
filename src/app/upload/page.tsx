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
  MessageCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Info,
  ArrowLeft
} from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function UploadPage() {
  const { user } = useUser();
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
        toast.success('Document processed!', {
          description: 'You can now start querying your file.',
        });
        router.push(`/chat/${latestCompletedFile.chatId}`);
      }
    }
  }, [files, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Badge className="bg-primary/10 text-primary border-none">Uploading</Badge>;
      case 'processing':
        return <Badge className="bg-indigo-50 text-indigo-600 border-none">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-50 text-emerald-600 border-none">Analysis Complete</Badge>;
      case 'error':
        return <Badge className="bg-red-50 text-red-600 border-none">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-10 animate-reveal">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link href="/dashboard" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest mb-2 group">
              <ArrowLeft className="h-3 w-3 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Analyze <span className="text-primary">New Content</span>
            </h1>
            <p className="text-gray-500 text-lg">Upload your PDF documents for deep-context AI analysis.</p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center space-x-2.5 mb-2">
              <Upload className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold text-gray-900">Upload Station</CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Your files are encrypted and processed securely. We support PDF files up to 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
                isDragOver
                  ? "border-primary bg-primary/5 shadow-inner"
                  : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
              )}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-all",
                  isDragOver ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-white text-gray-400 border border-gray-100 shadow-sm"
                )}>
                  <Upload className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {isDragOver ? "Release to upload" : "Select or drag files"}
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                  Drag and drop your project PDFs here to initiate the analysis protocol.
                </p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  multiple
                />

                <Button
                  className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-lg shadow-md transition-all"
                  asChild
                >
                  <label htmlFor="file-upload">
                    Choose Documents
                  </label>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Section */}
        {files.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2.5 text-gray-400" />
              Processing Queue ({files.length})
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="bg-white border-gray-100 shadow-sm rounded-xl overflow-hidden">
                  <div className="p-5 flex items-center space-x-6">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border",
                      file.status === 'completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-gray-50 border-gray-100 text-gray-400"
                    )}>
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-md font-bold text-gray-900 truncate max-w-md">
                            {file.name}
                          </span>
                          {getStatusBadge(file.status)}
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{file.size}</span>
                      </div>

                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <div className="space-y-2">
                          <Progress value={file.progress} className="h-1.5 bg-gray-100" />
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                              {file.status === 'uploading'
                                ? `Uploading • ${Math.round(file.progress)}%`
                                : 'Analyzing document context...'
                              }
                            </p>
                            {getStatusIcon(file.status)}
                          </div>
                        </div>
                      )}

                      {file.status === 'completed' && (
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            Ready for interaction
                          </p>
                          {getStatusIcon(file.status)}
                        </div>
                      )}

                      {file.status === 'error' && (
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                            {file.error || 'Connection error.'}
                          </p>
                          {getStatusIcon(file.status)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Card className="bg-white border-gray-100 p-8 shadow-sm rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary mb-4 border border-gray-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Privacy Control</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your files are stored with industry-standard encryption. We never share your data or use it to train our base AI models.
            </p>
          </Card>

          <Card className="bg-white border-gray-100 p-8 shadow-sm rounded-2xl">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary mb-4 border border-gray-100">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">High-Fidelity Parsing</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Docsy handles complex layouts, charts, and technical text with high accuracy to ensure your answers are always grounded.
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}