'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * UserSyncProvider - Ensures user is synced to database
 * This component automatically syncs user data from Clerk to database on mount
 * It serves as a fallback if webhooks fail
 */
export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [syncAttempted, setSyncAttempted] = useState(false);

  useEffect(() => {
    // Delay sync to prevent blocking render
    const timeoutId = setTimeout(() => {
      syncUser();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isLoaded, isSignedIn, user?.id]);

  const syncUser = async () => {
    // Only sync if user is loaded, signed in, and we haven't attempted sync yet
    if (!isLoaded || !isSignedIn || !user || syncAttempted) {
      return;
    }

    try {
      // Check sync status first
      const statusResponse = await fetch('/api/user/sync', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!statusResponse.ok) {
        console.warn('Failed to check sync status:', statusResponse.status);
        setSyncAttempted(true);
        return;
      }

      const statusData = await statusResponse.json();
      
      // If user is not synced, attempt to sync
      if (!statusData.isSynced) {
        console.log('User not synced, attempting sync...');
        
        const syncResponse = await fetch('/api/user/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          console.log('User synced successfully:', syncData);
        } else {
          console.warn('Failed to sync user:', syncResponse.status);
        }
      } else {
        console.log('User already synced to database');
      }
    } catch (error) {
      // Silent fail - don't block the app
      console.warn('Error syncing user (non-blocking):', error);
    } finally {
      setSyncAttempted(true);
    }
  };

  // Always render children immediately
  return <>{children}</>;
}
