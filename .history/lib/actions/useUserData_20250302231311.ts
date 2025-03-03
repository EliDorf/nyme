// hooks/useUserData.ts
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { User } from '@/types/user';

export function useUserData() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    // Retry logic
    const MAX_RETRIES = 3;
    let retries = 0;
    
    const attemptFetch = async (): Promise<User> => {
      try {
        const data = await getUserById(user.id);
        return data;
      } catch (err) {
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(`Retrying user data fetch (${retries}/${MAX_RETRIES})...`);
          // Exponential backoff: 500ms, 1000ms, 2000ms
          await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retries - 1)));
          return attemptFetch();
        }
        throw err;
      }
    };
    
    try {
      const data = await attemptFetch();
      setUserData(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch user data after retries:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching user data'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isUserLoaded && user) {
      fetchUserData().catch(err => {
        console.error('Error in initial user data fetch:', err);
      });
    } else if (isUserLoaded && !user) {
      // User is not logged in
      setIsLoading(false);
    }
  }, [user, isUserLoaded, fetchUserData]);

  return { 
    userData, 
    refetchUserData: fetchUserData, 
    isLoading, 
    error 
  };
}