import React, { useState, useEffect } from 'react';
import * as repostsStore from '../store/repostsStore';
import type { FeedPost } from '../data/demoFeed';

// No React context — use a module-level store to avoid "useContext of null" when multiple React copies exist.
// useReposts subscribes to the store so components re-render when reposts change.

export function RepostsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useReposts() {
  const [reposts, setReposts] = useState<FeedPost[]>(() => repostsStore.getReposts());

  useEffect(() => {
    return repostsStore.subscribe(() => setReposts(repostsStore.getReposts()));
  }, []);

  return {
    reposts,
    addRepost: repostsStore.addRepost,
    removeRepost: repostsStore.removeRepost,
    isReposted: repostsStore.isReposted,
  };
}
