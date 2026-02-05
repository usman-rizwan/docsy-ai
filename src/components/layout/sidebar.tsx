'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import {
  FileText,
  MessageCircle,
  Upload,
  Settings,
  Plus,
  Menu,
  X,
  Home,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';

function formatTimeAgo(timestamp?: number) {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const chats = useQuery(api.chats.getChatsByClerkId, { clerkId: user?.id || '' });

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-gray-100">
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100 bg-white">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-primary rounded-lg shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">Docsy AI</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-500 hover:text-gray-900"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-sm transition-all" asChild>
          <Link href="/upload">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group',
                isActive
                  ? 'bg-primary/5 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn("h-4 w-4 mr-3", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-8 mb-2">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-3 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-0.5 pb-6">
            {(chats || []).length === 0 && (
              <div className="px-3 py-4 text-xs text-gray-400 italic">
                No recent conversations
              </div>
            )}
            {(chats || []).map((chat) => {
              const isActive = pathname === `/chat/${chat._id}`;
              return (
                <Link
                  key={chat._id}
                  href={`/chat/${chat._id}`}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm transition-colors group relative',
                    isActive
                      ? 'bg-gray-50 text-gray-900 border border-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <MessageCircle className={cn("mt-0.5 h-4 w-4 shrink-0", isActive ? "text-primary" : "text-gray-400")} />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium leading-none mb-1">
                        {chat.title}
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center">
                        {chat.messageCount} messages • {formatTimeAgo(chat.updatedAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Free Plan</p>
              <p className="text-[10px] text-gray-500 italic">23 / 100 units</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 rounded-lg" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-sm border-gray-200 text-gray-700"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}