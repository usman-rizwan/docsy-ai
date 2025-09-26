'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
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
  Share
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
  // const params = React.use(props.params);
  const chatId = params.chatId;
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  console.log('user', user);


  const chat = useQuery(api.chats.getChatForUser, {
    chatId: chatId as any,
    clerkId: user?.id || ''
  });
  const isChatLoading = typeof chat === 'undefined';
  const isChatNotFound = !isChatLoading && !chat;

  if (isChatNotFound) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Chat Not Found</h2>
            <p className="text-muted-foreground text-sm">
              This chat doesn’t exist or you don’t have permission to view it.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }


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


      const result = await response.json();

    } catch (error) {
      console.error('Error sending message:', error);
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
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };



  const handleDownload = (fileUrl: string, fileName = 'document.pdf') => {
    if (!fileUrl) {
      console.error('File URL is missing');
      return;
    }

    // Create a promise for the download process
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

        resolve()
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(downloadPromise, {
      loading: 'Downloading file...',
      success: () => 'Download  successfully!',
      error: (err) => `Download failed: ${err.message || 'Unknown error'}`,
    });
  };




  if (!chat || !messages) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat Header */}
        <div className="border-b bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">{chat.title}</h1>
                <p className="text-sm text-muted-foreground">{pdfDocument?.fileName || 'PDF Document'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button> */}
              <Button variant="ghost" size="sm" onClick={() => handleDownload(pdfDocument?.fileUrl, pdfDocument?.fileName)}>
                <Download className="h-4 w-4" />
              </Button>
              {/* <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
                <p className="text-muted-foreground">Ask questions about your PDF document to get started.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border shadow-sm'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>

                    {message.sources && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          {message.sources.map((source, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={cn(
                      'flex items-center justify-between mt-2 text-xs',
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleCopy(message._id, message.content)}
                          >
                            {copiedMessageId === message._id ? (
                              <span className="text-[10px] text-green-600 font-medium">Copied!</span>
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>

                        </div>
                      )}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </Avatar>
                <div className="bg-card border shadow-sm rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your PDF..."
                  className="min-h-[44px] resize-none"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are generated based on your PDF content. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
