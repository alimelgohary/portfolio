/**
 * Lightweight, non-blocking visitor tracking.
 * Uses a persistent cookie for visitor ID with fingerprint fallback.
 * Tracks session duration via beforeunload/visibilitychange.
 */

const COOKIE_NAME = '_vid';
const SESSION_KEY = '_analytics_session';

function getOrCreateVisitorCookie(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (match) return match[1];

  const id = crypto.randomUUID();
  // Set cookie for 2 years
  const expires = new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${id}; expires=${expires}; path=/; SameSite=Lax`;
  return id;
}

function getSessionData(): { id: string; start: number } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSessionData(id: string, start: number) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, start }));
}

function categorizeReferrer(referrer: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname;
    if (host === window.location.hostname) return null; // Same site, don't track
    return referrer;
  } catch {
    return referrer;
  }
}

function sendAnalytics(payload: Record<string, unknown>) {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = `https://${projectId}.supabase.co/functions/v1/track-visit`;
  const body = JSON.stringify(payload);

  // Use Blob to ensure correct Content-Type with sendBeacon
  const blob = new Blob([body], { type: 'application/json' });

  // Prefer sendBeacon for reliability on page unload, fallback to fetch
  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(url, blob);
    if (!sent) {
      // Fallback if sendBeacon fails (e.g. payload too large)
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackPageView() {
  // Debounce: only one pageview per session
  const existing = getSessionData();
  if (existing) return;

  const sessionId = crypto.randomUUID();
  const sessionStart = Date.now();
  setSessionData(sessionId, sessionStart);

  const visitorCookie = getOrCreateVisitorCookie();
  const referrer = categorizeReferrer(document.referrer);

  // Non-blocking async track
  sendAnalytics({
    page_path: window.location.pathname,
    referrer,
    session_id: sessionId,
    visitor_cookie: visitorCookie,
  });

  // Track session duration on page leave
  const sendDuration = () => {
    const session = getSessionData();
    if (!session) return;
    const duration = (Date.now() - session.start) / 1000; // seconds
    if (duration < 2) return; // Ignore bounces under 2s
    sendBeacon({
      session_id: session.id,
      session_duration: duration,
    });
  };

  // Use both events for maximum coverage
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendDuration();
  });
  window.addEventListener('beforeunload', sendDuration);
}
