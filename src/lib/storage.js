/* Small wrappers around localStorage that never throw, so the app still works
   in private windows or when storage is blocked. */

export function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore - storage is optional */
  }
}

export const ORG_KEYS = ['hm_teams', 'hm_mentors', 'hm_logi', 'hm_ps', 'hm_feed'];

export function clearOrgData() {
  ORG_KEYS.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  });
}
