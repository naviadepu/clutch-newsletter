export const FEEDBACK_APP_VARIANT = "clutch-newsletter-navi";
export const FEEDBACK_PAGE = "clutch-newsletter-navi";
export const FEEDBACK_STORAGE_SESSION_KEY = "clutch_feedback_session_2026_06";

import { normalizeEmail, normalizeUsPhone } from "./contact-validation.js";

const VALID_RESPONSE_KINDS = new Set([
  "deck",
  "pivot-feedback",
  "reader-feedback",
  "reader-survey",
]);
const VALID_RESPONSE_STATUSES = new Set(["started", "in_progress", "submitted"]);

function cleanString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasInlineAnswers(body) {
  return Boolean(
    cleanString(body?.kind) ||
      Array.isArray(body?.takes) ||
      Array.isArray(body?.picked_ids) ||
      Array.isArray(body?.picked) ||
      isObject(body?.blanks) ||
      cleanString(body?.dealbreaker) ||
      cleanString(body?.submittedAt)
  );
}

export function normalizeFeedbackBody(body) {
  if (!isObject(body)) {
    throw new Error("Invalid feedback body");
  }

  const wrappedAnswers = isObject(body.answers) ? body.answers : null;
  const answers = wrappedAnswers ?? (hasInlineAnswers(body) ? body : null);
  if (!answers) {
    throw new Error("Missing feedback answers");
  }

  const page = cleanString(body.page) ?? FEEDBACK_PAGE;
  const appVariant = cleanString(body.appVariant) ?? page;
  const responseKind =
    cleanString(body.responseKind) ??
    cleanString(body.kind) ??
    cleanString(answers.kind);
  if (!responseKind || !VALID_RESPONSE_KINDS.has(responseKind)) {
    throw new Error("Unsupported feedback kind");
  }

  const inferredStatus = cleanString(body.status) ??
    cleanString(body.responseStatus) ??
    (cleanString(body.submittedAt) || cleanString(answers.submittedAt)
      ? "submitted"
      : "in_progress");
  if (!VALID_RESPONSE_STATUSES.has(inferredStatus)) {
    throw new Error("Unsupported feedback status");
  }

  const payloadVersion = Number.isInteger(body.payloadVersion)
    ? body.payloadVersion
    : 1;

  const rawEmail = cleanString(body.email) ?? cleanString(answers.q13email);
  const rawPhone =
    cleanString(body.phone) ??
    cleanString(answers.q12) ??
    cleanString(answers.phone);
  const email = normalizeEmail(rawEmail);
  const phone = normalizeUsPhone(rawPhone);

  if (rawEmail && !email && inferredStatus === "submitted") {
    throw new Error("Invalid email");
  }

  if (rawPhone && !phone && inferredStatus === "submitted") {
    throw new Error("Invalid phone");
  }

  return {
    appVariant,
    page,
    sessionId: cleanString(body.sessionId),
    name: cleanString(body.name),
    email,
    phone,
    responseKind,
    responseStatus: inferredStatus,
    payloadVersion,
    submittedAt: cleanString(body.submittedAt) ?? cleanString(answers.submittedAt),
    answers,
  };
}
