import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const envPath = path.join(process.cwd(), ".env");
const envText = fs.readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

const sql = neon(env.DATABASE_URL);
const baseUrl = process.env.APP_BASE_URL ?? "http://127.0.0.1:3101";
const sessionId = `e2e-${Date.now()}`;

const draftResponse = await fetch(`${baseUrl}/api/feedback`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    appVariant: "clutch-newsletter-navi",
    page: "clutch-newsletter-navi",
    responseKind: "deck",
    sessionId,
    status: "in_progress",
    answers: {
      kind: "deck",
      picked_ids: ["feed", "cycle"],
      picked_labels: ["friend feed", "cycle tracker"],
      top1_id: "feed",
      top1_label: "friend feed",
      dealbreaker: "spam notifications",
      savedAt: new Date().toISOString(),
    },
  }),
});
assert.equal(draftResponse.status, 200);

const submittedResponse = await fetch(`${baseUrl}/api/feedback`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    appVariant: "clutch-newsletter-navi",
    page: "clutch-newsletter-navi",
    responseKind: "reader-survey",
    sessionId,
    status: "submitted",
    email: "e2e@example.com",
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
      q13email: "e2e@example.com",
      submittedAt: new Date().toISOString(),
    },
  }),
});
assert.equal(submittedResponse.status, 200);

const rows = await sql`
  SELECT
    app_variant,
    page,
    session_id,
    contact_phone,
    email,
    response_kind,
    response_status,
    payload_version,
    submitted_at,
    answers
  FROM clutch_feedback
  WHERE session_id = ${sessionId}
  ORDER BY response_kind ASC
`;

assert.equal(rows.length, 2);
assert.deepEqual(
  rows.map((row) => [row.response_kind, row.response_status]),
  [
    ["deck", "in_progress"],
    ["reader-survey", "submitted"],
  ]
);
assert(rows.every((row) => row.app_variant === "clutch-newsletter-navi"));
assert(rows.every((row) => row.page === "clutch-newsletter-navi"));
assert(rows.every((row) => row.payload_version === 1));
assert.equal(rows[0].answers.kind, "deck");
assert.equal(rows[1].answers.kind, "reader-survey");
assert.equal(rows[1].contact_phone, "(555) 555-5555");
assert.equal(rows[1].email, "e2e@example.com");
assert.equal(rows[1].answers.q13email, "e2e@example.com");

console.log(`Verified feedback E2E for session ${sessionId}.`);
