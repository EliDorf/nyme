// hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { User } from '@/types/user';

export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);

  const fetchUserData = async () => {
    if (user) {
      const data = await getUserById(user.id);
      setUserData(data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return { userData, refetchUserData: fetchUserData };
}