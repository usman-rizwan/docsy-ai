'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  Home
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
    { name: 'Upload PDF', href: '/upload', icon: Upload },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">Docsy</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

        <div className="p-4">
          <Button className="w-full" size="lg" asChild>
            <Link href="/upload">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Link>
          </Button>
        </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="mx-4 my-4" />

      {/* Chat History */}
      <div className="flex-1 px-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Chats</h3>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {(chats || []).map((chat) => {
              const isActive = pathname === `/chat/${chat._id}`;
              return (
                <Link
                  key={chat._id}
                  href={`/chat/${chat._id}`}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="w-48 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                        {chat.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatTimeAgo(chat.updatedAt)}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <SidebarContent />
      </div>

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}