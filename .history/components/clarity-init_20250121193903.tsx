'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityInit() {
  useEffect(() => {
    try {
      // Check if Clarity is already initialized to prevent duplicate initialization
      if (!(window as any)._clarity) {
        console.log('[Clarity] Initializing tracking...');
        Clarity.init("pay8dn4hmi");
        
        // Verify initialization
        setTimeout(() => {
          if ((window as any)._clarity) {
            console.log('[Clarity] Successfully initialized and running');
          } else {
            console.error('[Clarity] Failed to initialize properly');
          }
        }, 1000);

        // Track page views manually to ensure they're captured
        const trackPageView = () => {
          if ((window as any)._clarity) {
            (window as any)._clarity('set', 'page_view', window.location.pathname);
            console.log('[Clarity] Tracked page view:', window.location.pathname);
          }
        };

        // Track initial page view
        trackPageView();

        // Track page views on route changes
        const handleRouteChange = () => {
          trackPageView();
        };

        // Add listener for Next.js route changes
        window.addEventListener('popstate', handleRouteChange);
        
        // Cleanup
        return () => {
          window.removeEventListener('popstate', handleRouteChange);
        };
      } else {
        console.log('[Clarity] Already initialized');
      }
    } catch (error) {
      console.error('[Clarity] Initialization error:', error);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return null;
}
