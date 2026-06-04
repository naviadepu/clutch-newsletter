import test from "node:test";
import assert from "node:assert/strict";

import {
  FEEDBACK_APP_VARIANT,
  FEEDBACK_PAGE,
  normalizeFeedbackBody,
} from "../lib/feedback.js";

test("normalizeFeedbackBody maps navi reader feedback submissions into segregated feedback rows", () => {
  const normalized = normalizeFeedbackBody({
    sessionId: "session-reader-1",
    kind: "reader-feedback",
    takes: [
      {
        statement: "one app for all my girl stuff",
        answer: "same",
        followUp: null,
      },
    ],
    blanks: {
      had: "better reminders",
      skipped: "ads",
      dealbreaker: "too much friction",
    },
    submittedAt: "2026-06-03T20:00:00.000Z",
  });

  assert.equal(normalized.appVariant, FEEDBACK_APP_VARIANT);
  assert.equal(normalized.page, FEEDBACK_PAGE);
  assert.equal(normalized.responseKind, "reader-feedback");
  assert.equal(normalized.responseStatus, "submitted");
  assert.equal(normalized.payloadVersion, 1);
  assert.equal(normalized.sessionId, "session-reader-1");
  assert.equal(normalized.answers.kind, "reader-feedback");
  assert.equal(normalized.answers.submittedAt, "2026-06-03T20:00:00.000Z");
});

test("normalizeFeedbackBody preserves legacy wrapped answers while backfilling segregation fields", () => {
  const normalized = normalizeFeedbackBody({
    page: "clutch-newsletter",
    answers: {
      kind: "deck",
      picked: ["friend feed", "cycle tracker"],
      top1: "friend feed",
      submittedAt: "2026-06-03T20:00:00.000Z",
    },
  });

  assert.equal(normalized.appVariant, "clutch-newsletter");
  assert.equal(normalized.page, "clutch-newsletter");
  assert.equal(normalized.responseKind, "deck");
  assert.equal(normalized.responseStatus, "submitted");
  assert.equal(normalized.payloadVersion, 1);
  assert.equal(normalized.answers.kind, "deck");
});

test("normalizeFeedbackBody rejects missing feedback answers", () => {
  assert.throws(
    () => normalizeFeedbackBody({ page: FEEDBACK_PAGE }),
    /Missing feedback answers/
  );
});

test("normalizeFeedbackBody accepts reader-survey submissions with email association", () => {
  const normalized = normalizeFeedbackBody({
    sessionId: "survey-session-1",
    responseKind: "reader-survey",
    status: "submitted",
    email: "girl@example.com",
    answers: {
      kind: "reader-survey",
      q1: ["flo", "clue"],
      q1other: "",
      q2a: "today",
      q2b: ["checked my phase"],
      q3: ["tiktok"],
      q3other: "",
      q4: ["youtube"],
      q4other: "",
      q5: ["pinterest"],
      q5other: "",
      q6: "yes, sometimes",
      q7: "spotify",
      q8: "borrowed one from a friend",
      q9text: "downloaded it and forgot",
      q9apps: ["flo"],
      q9other: "",
      q10: "apple health because it is already there",
      q11: ["short videos (tiktok / reels)"],
      q12: "(555) 555-5555",
      q13email: "girl@example.com",
      submittedAt: "2026-06-04T01:00:00.000Z",
    },
  });

  assert.equal(normalized.responseKind, "reader-survey");
  assert.equal(normalized.responseStatus, "submitted");
  assert.equal(normalized.email, "girl@example.com");
  assert.equal(normalized.phone, "(555) 555-5555");
  assert.equal(normalized.answers.q13email, "girl@example.com");
});

test("normalizeFeedbackBody rejects submitted reader-survey responses with an invalid email", () => {
  assert.throws(
    () =>
      normalizeFeedbackBody({
        responseKind: "reader-survey",
        status: "submitted",
        answers: {
          kind: "reader-survey",
          q12: "(555) 555-5555",
          q13email: "not-an-email",
          submittedAt: "2026-06-04T01:00:00.000Z",
        },
      }),
    /Invalid email/
  );
});

test("normalizeFeedbackBody rejects submitted reader-survey responses with an invalid phone number", () => {
  assert.throws(
    () =>
      normalizeFeedbackBody({
        responseKind: "reader-survey",
        status: "submitted",
        answers: {
          kind: "reader-survey",
          q12: "555",
          q13email: "girl@example.com",
          submittedAt: "2026-06-04T01:00:00.000Z",
        },
      }),
    /Invalid phone/
  );
});

test("normalizeFeedbackBody drops invalid draft contact fields instead of failing in-progress saves", () => {
  const normalized = normalizeFeedbackBody({
    responseKind: "reader-survey",
    status: "in_progress",
    answers: {
      kind: "reader-survey",
      q12: "555",
      q13email: "not-an-email",
    },
  });

  assert.equal(normalized.email, null);
  assert.equal(normalized.phone, null);
  assert.equal(normalized.answers.q12, "555");
  assert.equal(normalized.answers.q13email, "not-an-email");
});

test("normalizeFeedbackBody accepts pivot feedback submissions", () => {
  const normalized = normalizeFeedbackBody({
    sessionId: "pivot-session-1",
    responseKind: "pivot-feedback",
    status: "submitted",
    answers: {
      kind: "pivot-feedback",
      clarity: "Mostly clear",
      submittedAt: "2026-06-04T03:00:00.000Z",
    },
  });

  assert.equal(normalized.responseKind, "pivot-feedback");
  assert.equal(normalized.responseStatus, "submitted");
  assert.equal(normalized.sessionId, "pivot-session-1");
  assert.equal(normalized.answers.clarity, "Mostly clear");
});
