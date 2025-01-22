'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityInit() {
  useEffect(() => {
    // Only initialize in production to avoid polluting data during development
   // if (process.env.NODE_ENV === 'production') 
   {
      Clarity.init("pay8dn4hmi");
    }
  }, []);

  return null;
}
