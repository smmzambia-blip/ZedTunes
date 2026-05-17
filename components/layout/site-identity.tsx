"use client";

import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function SiteIdentity() {
  useEffect(() => {
    const updateIdentity = async () => {
      try {
        const docRef = doc(db, 'settings', 'site');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Update Page Title
          if (data.siteName) {
            document.title = data.siteName;
          }
          
          // Update Favicon
          if (data.logoBase64) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = data.logoBase64;
          }
        }
      } catch (e) {
        console.error("Error updating site identity:", e);
      }
    };
    
    updateIdentity();
  }, []);

  return null;
}
