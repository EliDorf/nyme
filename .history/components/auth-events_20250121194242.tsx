'use client';

import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { trackSignupComplete, trackLogin, type LoginMethod } from '../lib/analytics/dataLayer';

const AuthEvents = () => {
  const { user } = useUser();
  const { sessionId } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Get the signup method from metadata (set during webhook)
    const signupMethod = user.publicMetadata.signupMethod as LoginMethod;
    const userId = user.id;

    // Check if this is the first session after signup
    const isNewUser = user.createdAt && 
      (new Date().getTime() - new Date(user.createdAt).getTime()) < 5000;

    const primaryEmail = user.primaryEmailAddress?.emailAddress;

    if (isNewUser) {
      trackSignupComplete(userId, 'free', primaryEmail);
    }

    // Track login for existing users
    if (!isNewUser && sessionId) {
      const loginMethod: LoginMethod = signupMethod || 
        (user.emailAddresses[0]?.verification?.strategy === 'oauth_google' 
          ? 'google_auth' 
          : 'email');
      trackLogin(userId, loginMethod, primaryEmail);
    }
  }, [user, sessionId]);

  return null;
};

export default AuthEvents;
