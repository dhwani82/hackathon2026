import type { FeedPost } from '../data/demoFeed';

let reposts: FeedPost[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getReposts(): FeedPost[] {
  return reposts;
}

export function addRepost(post: FeedPost) {
  if (reposts.some((p) => p.id === post.id)) return;
  reposts = [...reposts, post];
  emit();
}

export function removeRepost(postId: string) {
  reposts = reposts.filter((p) => p.id !== postId);
  emit();
}

export function isReposted(postId: string): boolean {
  return reposts.some((p) => p.id === postId);
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
