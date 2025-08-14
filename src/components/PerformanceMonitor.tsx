'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Monitor performance metrics
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation Performance:', {
              DNS: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              TCP: navEntry.connectEnd - navEntry.connectStart,
              TTFB: navEntry.responseStart - navEntry.requestStart,
              DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              Load: navEntry.loadEventEnd - navEntry.loadEventStart,
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
      });
    }
  }, []);

  return null; // This component doesn't render anything
} 