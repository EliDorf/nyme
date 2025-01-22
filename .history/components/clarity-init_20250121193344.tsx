'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityInit() {
  useEffect(() => {
    // Initialize Clarity on all environments to track all pages
    Clarity.init("pay8dn4hmi");
  }, []);

  return null;
}
