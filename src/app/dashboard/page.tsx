'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, MessageCircle, FileText, Calendar, Search, ArrowRight, Sparkles, TrendingUp, Clock, LayoutDashboard } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const chats = useQuery(api.chats.getChatsByClerkId, { clerkId: user?.id || '' });
  const documents = useQuery(api.documents.getDocumentsByClerkId, { clerkId: user?.id || '' });

  const filteredChats = chats?.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalChats = chats?.length || 0;
  const totalDocuments = documents?.filter(doc => doc.status === 'completed').length || 0;
  const totalMessages = chats?.reduce((sum, chat) => sum + chat.messageCount, 0) || 0;

  const handleNewChat = () => {
    router.push('/upload');
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <AppLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-10 animate-reveal">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-primary">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Workspace Overview</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back, <span className="text-primary">{user?.firstName || 'User'}</span>
            </h1>
            <p className="text-gray-500 text-lg">Here is what is happening with your knowledge base today.</p>
          </div>
          <Button onClick={handleNewChat} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/10">
            <Plus className="h-5 w-5 mr-2" />
            Analyze New PDF
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Conversations", value: totalChats, icon: MessageCircle, trend: "+2 this week", color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Knowledge Assets", value: totalDocuments, icon: FileText, trend: "4.2GB indexed", color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "AI Iterations", value: totalMessages, icon: TrendingUp, trend: "99.8% precision", color: "text-emerald-500", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <Card key={i} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-[10px] font-bold text-gray-400">{stat.trend}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Recents */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>Recent Activity</span>
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search knowledge..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white border-gray-100 rounded-lg text-sm focus:ring-primary/20"
              />
            </div>
          </div>

          {filteredChats.length === 0 ? (
            <Card className="bg-gray-50 border-dashed border-gray-200 py-16 text-center">
              <CardContent>
                <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <FileText className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{searchTerm ? 'No matches found' : 'No documents yet'}</h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">Upload your first PDF to begin your interactive journey.</p>
                {!searchTerm && (
                  <Button onClick={handleNewChat} variant="outline" className="border-gray-200 text-gray-900 font-bold hover:bg-white">
                    Get Started
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChats.slice(0, 6).map((chat) => (
                <Link key={chat._id} href={`/chat/${chat._id}`}>
                  <Card className="bg-white border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                        <FileText className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Active
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
                      {chat.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 line-clamp-2 mb-6">
                      AI-driven analysis performed on this document. Tap to re-engage.
                    </CardDescription>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-bold text-gray-400">{chat.messageCount} messages • {formatTimeAgo(chat.updatedAt)}</span>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Banner */}
        <Card className="bg-gray-900 border-none text-white relative overflow-hidden rounded-2xl">
          <CardContent className="p-8 md:p-10 relative z-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-4">Maximize your productivity.</h2>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Unlock multi-document analysis, higher token limits, and priority AI processing with Docsy Professional.
              </p>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold h-12 px-8 rounded-lg shadow-xl shadow-black/10">
                Explore Pro Tier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}