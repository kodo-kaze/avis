'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Updates the browser tab title based on the current route.
 * It builds a human‑readable title from the pathname and appends the app name.
 * Example: "/workspace" → "Workspace – AVIS"
 */
export default function TitleUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove leading/trailing slashes and split into segments
    const segments = pathname.split('/').filter(Boolean);

    // Root (home) page – use the default title defined in metadata
    if (segments.length === 0) {
      document.title = 'AVIS';
      return;
    }

    const formatted = segments.map((seg) => {
      // Replace hyphens/underscores with spaces and capitalize each word
      return seg
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    });

    // Join segments with a separator and add the app name suffix
    document.title = `${formatted.join(' – ')} – AVIS`;
  }, [pathname]);

  // This component does not render any UI
  return null;
}
