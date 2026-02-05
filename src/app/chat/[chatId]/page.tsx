'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Send,
  FileText,
  User,
  Bot,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Share,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Search,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';

interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: number;
  sources?: string[];
}

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const chatId = params.chatId;
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const chat = useQuery(api.chats.getChatForUser, {
    chatId: chatId as any,
    clerkId: user?.id || ''
  });
  const isChatLoading = typeof chat === 'undefined';
  const isChatNotFound = !isChatLoading && !chat;

  const messages = useQuery(
    api.chats.getMessagesByChat,
    chat?.documentId ? { chatId: chatId as Id<"chats"> } : 'skip'
  );

  const pdfDocument = useQuery(
    api.documents.getDocument,
    chat?.documentId ? { documentId: chat.documentId } : 'skip'
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !user?.id) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: params.chatId,
          message,
          userId: user?.id || ''
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedMessageId(messageId);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleDownload = (fileUrl: string, fileName = 'document.pdf') => {
    if (!fileUrl) return;

    const downloadPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await fetch(fileUrl, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch file');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(downloadPromise, {
      loading: 'Downloading document...',
      success: 'File downloaded successfully!',
      error: 'Download failed.',
    });
  };

  if (isChatNotFound) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-8">
          <Card className="max-w-md w-full bg-white border-gray-100 p-10 text-center animate-reveal">
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Chat not found</h2>
            <p className="text-gray-500 mb-8">
              The conversation you are looking for might have been deleted or is inaccessible.
            </p>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full h-11 border-gray-200 text-gray-700 font-bold hover:bg-gray-50">
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (isChatLoading || !messages) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="text-center animate-pulse">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading conversation...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-white relative">
        {/* Chat Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="p-2 bg-gray-50 rounded-lg shrink-0">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 truncate leading-tight tracking-tight">{chat.title}</h1>
              <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                <Clock className="h-3 w-3 mr-1.5" />
                Active Session • {pdfDocument?.fileName || 'Document'}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900"
            onClick={() => handleDownload(pdfDocument?.fileUrl, pdfDocument?.fileName)}
          >
            <Download className="h-5 w-5" />
          </Button>
        </header>

        {/* Messages Container */}
        <ScrollArea className="flex-1 px-4 py-8 relative">
          <div className="max-w-3xl mx-auto space-y-10 pb-20">
            {messages.length === 0 ? (
              <div className="text-center py-20 animate-reveal">
                <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to explore</h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                  Start by asking a question about the uploaded document to begin the synthesis.
                </p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={message._id}
                  className={cn(
                    'flex gap-5 group animate-reveal',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-9 h-9 border border-gray-100 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      'max-w-[80%] rounded-[1.25rem] px-6 py-4 shadow-sm relative',
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-gray-50 text-gray-900 border border-gray-100 rounded-tl-none'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                      {message.content}
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-1 flex items-center">
                            Sources:
                          </span>
                          {message.sources.map((source, index) => (
                            <Badge key={index} variant="secondary" className="bg-white/50 text-[9px] text-gray-500 px-2 py-0 border-gray-200">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={cn(
                      'flex items-center justify-between mt-3',
                      message.role === 'user' ? 'text-white/50' : 'text-gray-400'
                    )}>
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-white/50 text-gray-400 rounded-md"
                          onClick={() => handleCopy(message._id, message.content)}
                        >
                          {copiedMessageId === message._id ? (
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-9 h-9 border border-gray-100 shrink-0">
                      <AvatarFallback className="bg-gray-100 text-gray-400">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-5 justify-start animate-reveal">
                <Avatar className="w-9 h-9 border border-gray-100 bg-primary/5">
                  <AvatarFallback className="text-primary">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-50 border border-gray-100 rounded-[1.25rem] rounded-tl-none px-6 py-4 flex items-center h-12">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-32" />
          </div>
        </ScrollArea>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-2 flex items-center focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                className="flex-1 bg-transparent border-none text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-12 text-md placeholder:text-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "h-10 w-10 p-0 rounded-xl transition-all",
                  inputValue.trim() ? "bg-primary text-white shadow-lg hover:shadow-primary/20" : "bg-gray-50 text-gray-300"
                )}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
