"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics/dataLayer";

interface PageViewTrackerProps {
  path: string;
}

const PageViewTracker = ({ path }: PageViewTrackerProps) => {
  useEffect(() => {
    trackPageView(path);
  }, [path]);

  return null;
};

export default PageViewTracker;
