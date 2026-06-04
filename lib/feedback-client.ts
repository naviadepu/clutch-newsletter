const FEEDBACK_APP_VARIANT = "clutch-newsletter-navi";
const FEEDBACK_PAGE = "clutch-newsletter-navi";
const FEEDBACK_SESSION_KEY = "clutch_feedback_session_2026_06";

type FeedbackBody = {
  answers: Record<string, unknown>;
  email?: string | null;
  name?: string | null;
  responseKind:
    | "deck"
    | "pivot-feedback"
    | "reader-feedback"
    | "reader-survey";
  sessionId?: string | null;
  status: "in_progress" | "submitted";
};

export function getOrCreateFeedbackSessionId() {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(FEEDBACK_SESSION_KEY);
    if (existing) return existing;

    const nextSessionId = crypto.randomUUID();
    window.localStorage.setItem(FEEDBACK_SESSION_KEY, nextSessionId);
    return nextSessionId;
  } catch {
    return crypto.randomUUID();
  }
}

export function clearFeedbackSessionId() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(FEEDBACK_SESSION_KEY);
  } catch {}
}

export async function postFeedback({
  answers,
  email = null,
  name = null,
  responseKind,
  sessionId = getOrCreateFeedbackSessionId(),
  status,
}: FeedbackBody) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answers,
      appVariant: FEEDBACK_APP_VARIANT,
      email,
      name,
      page: FEEDBACK_PAGE,
      responseKind,
      sessionId,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}
