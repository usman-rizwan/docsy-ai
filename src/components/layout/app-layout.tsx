import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { UserButton, SignedIn, SignedOut } from '@/components/auth/auth-wrapper';
import { Button } from '@/components/ui/button';
import { SignInButtonWrapper, SignUpButtonWrapper } from '@/components/auth/auth-wrapper';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-white overflow-hidden selection:bg-primary/20">
      <Sidebar />
      <div className="flex-1 md:ml-72 flex flex-col min-w-0 bg-gray-50/30">
        {/* Top bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden md:block">Workspace</h2>
          </div>
          <div className="flex items-center space-x-6">
            <SignedIn>
              <div className="p-0.5 rounded-full border border-gray-200 bg-white shadow-sm">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-3">
                <SignInButtonWrapper>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Button>
                </SignInButtonWrapper>
                <SignUpButtonWrapper>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold px-5 rounded-lg">Sign Up</Button>
                </SignUpButtonWrapper>
              </div>
            </SignedOut>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}