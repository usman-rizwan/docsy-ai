'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data to Convex
      createOrUpdateUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        imageUrl: user.imageUrl || undefined,
      }).catch((error) => {
        console.error('Failed to sync user data:', error);
      });
    }
  }, [isLoaded, user, createOrUpdateUser]);

  return { user, isLoaded };
}
