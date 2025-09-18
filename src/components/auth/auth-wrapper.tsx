'use client';

import { ReactNode } from 'react';
import { 
  SignedIn as ClerkSignedIn, 
  SignedOut as ClerkSignedOut, 
  UserButton as ClerkUserButton,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs';
import { useUserSync } from '@/hooks/useUserSync';

export function SignedIn({ children }: { children: ReactNode }) {
  return (
    <ClerkSignedIn>
      <UserSyncWrapper>{children}</UserSyncWrapper>
    </ClerkSignedIn>
  );
}

function UserSyncWrapper({ children }: { children: ReactNode }) {
  useUserSync();
  return <>{children}</>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

export function UserButton() {
  return (
    <ClerkUserButton 
      appearance={{
        elements: {
          avatarBox: 'w-8 h-8',
          userButtonPopoverCard: 'shadow-lg border border-gray-200',
          userButtonPopoverActionButton: 'hover:bg-gray-50',
          userButtonPopoverActionButtonText: 'text-gray-700',
        },
      }}
    />
  );
}

export function SignInButtonWrapper({ children }: { children: ReactNode }) {
  return (
    <SignInButton mode="modal">
      {children}
    </SignInButton>
  );
}

export function SignUpButtonWrapper({ children }: { children: ReactNode }) {
  return (
    <SignUpButton mode="modal">
      {children}
    </SignUpButton>
  );
}