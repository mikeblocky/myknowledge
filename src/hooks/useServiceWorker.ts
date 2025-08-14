'use client';

import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      
      // Check online/offline status
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOnline(navigator.onLine);

      // Register service worker
      const registerSW = async () => {
        try {
          if (process.env.NODE_ENV === 'production') {
            const registration = await navigator.serviceWorker.register('/sw.js');
            setIsRegistered(true);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available, show update prompt
                    if (confirm('New version available! Reload to update?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      registerSW();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const unregister = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      setIsRegistered(false);
    }
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    isSupported,
    isRegistered,
    isOnline,
    unregister,
    checkForUpdates,
  };
} 