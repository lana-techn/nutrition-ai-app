/**
 * Access Control Configuration
 * Centralized configuration for feature access restrictions
 */

/**
 * Whitelist of user IDs allowed to access Journal Search feature
 */
export const JOURNAL_SEARCH_ALLOWED_USERS = [
  'user_33j1htPUTvfxU7GT9aLEBa3Jdrw',
  'user_33jRLFL67lGvvGW90HxK8qy73AI',
  'user_33jjI0TAsQ8korgVCkwN1HKv3St',
  'user_33mZYk1iCMCQUZOLfWzYUgHpq3J',
  'user_346GhNK5yThH2tqv4TmUAsgmG5e',
];

/**
 * Check if user has access to Journal Search feature
 */
export function hasJournalSearchAccess(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return JOURNAL_SEARCH_ALLOWED_USERS.includes(userId);
}

/**
 * Get list of allowed user IDs (for admin/debug purposes)
 */
export function getAllowedJournalSearchUsers(): string[] {
  return [...JOURNAL_SEARCH_ALLOWED_USERS];
}
