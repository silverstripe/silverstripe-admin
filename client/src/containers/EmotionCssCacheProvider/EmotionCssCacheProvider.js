import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

/**
 * This ensures that Emotion's styles are inserted before ours so we can override
 * the default react-select styling
 */
function EmotionCssCacheProvider({ children }) {
  if (!window.ssReactSelectCache) {
    window.ssReactSelectCache = createCache({
      key: 'react-select',
      insertionPoint: document.querySelector('title'),
    });
  }

  return <CacheProvider value={window.ssReactSelectCache}>{children}</CacheProvider>;
}

export default EmotionCssCacheProvider;
