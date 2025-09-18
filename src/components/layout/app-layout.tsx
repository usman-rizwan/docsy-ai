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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div></div> {/* Empty div for spacing */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center space-x-2">
              <SignInButtonWrapper>
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButtonWrapper>
              <SignUpButtonWrapper>
                <Button size="sm">Sign Up</Button>
              </SignUpButtonWrapper>
            </div>
          </SignedOut>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}