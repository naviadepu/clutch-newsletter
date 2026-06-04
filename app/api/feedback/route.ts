import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

import { normalizeFeedbackBody } from "@/lib/feedback.js";

export const runtime = "edge";

async function persistFeedback(sql: any, record: ReturnType<typeof normalizeFeedbackBody>) {
  const serializedAnswers = JSON.stringify(record.answers);

  if (record.sessionId) {
    const rows = (await sql`
      WITH updated AS (
        UPDATE clutch_feedback
        SET
          name = COALESCE(${record.name}, clutch_feedback.name),
          email = COALESCE(${record.email}, clutch_feedback.email),
          contact_phone = COALESCE(${record.phone}, clutch_feedback.contact_phone),
          answers = ${serializedAnswers}::jsonb,
          page = ${record.page},
          app_variant = ${record.appVariant},
          session_id = ${record.sessionId},
          response_kind = ${record.responseKind},
          response_status = ${record.responseStatus},
          payload_version = ${record.payloadVersion},
          updated_at = NOW(),
          last_activity_at = NOW(),
          submitted_at = CASE
            WHEN ${record.responseStatus} = 'submitted'
              THEN COALESCE(${record.submittedAt}::timestamptz, NOW())
            ELSE clutch_feedback.submitted_at
          END
        WHERE id = (
          SELECT id
          FROM clutch_feedback
          WHERE app_variant = ${record.appVariant}
            AND session_id = ${record.sessionId}
            AND response_kind = ${record.responseKind}
          ORDER BY created_at DESC NULLS LAST, id DESC
          LIMIT 1
        )
        RETURNING id
      ),
      inserted AS (
        INSERT INTO clutch_feedback (
          name,
          email,
          contact_phone,
          answers,
          page,
          app_variant,
          session_id,
          response_kind,
          response_status,
          payload_version,
          submitted_at,
          last_activity_at,
          updated_at
        )
        SELECT
          ${record.name},
          ${record.email},
          ${record.phone},
          ${serializedAnswers}::jsonb,
          ${record.page},
          ${record.appVariant},
          ${record.sessionId},
          ${record.responseKind},
          ${record.responseStatus},
          ${record.payloadVersion},
          CASE
            WHEN ${record.responseStatus} = 'submitted'
              THEN COALESCE(${record.submittedAt}::timestamptz, NOW())
            ELSE NULL
          END,
          NOW(),
          NOW()
        WHERE NOT EXISTS (SELECT 1 FROM updated)
        RETURNING id
      )
      SELECT id FROM updated
      UNION ALL
      SELECT id FROM inserted
      LIMIT 1
    `) as Array<{ id: number }>;

    return rows[0];
  }

  const rows = (await sql`
    INSERT INTO clutch_feedback (
      name,
      email,
      contact_phone,
      answers,
      page,
      app_variant,
      response_kind,
      response_status,
      payload_version,
      submitted_at,
      last_activity_at,
      updated_at
    )
    VALUES (
      ${record.name},
      ${record.email},
      ${record.phone},
      ${serializedAnswers}::jsonb,
      ${record.page},
      ${record.appVariant},
      ${record.responseKind},
      ${record.responseStatus},
      ${record.payloadVersion},
      CASE
        WHEN ${record.responseStatus} = 'submitted'
          THEN COALESCE(${record.submittedAt}::timestamptz, NOW())
        ELSE NULL
      END,
      NOW(),
      NOW()
    )
    RETURNING id
  `) as Array<{ id: number }>;

  return rows[0];
}

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json(
      { ok: false, error: "server is not configured" },
      { status: 500 }
    );
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  try {
    const record = normalizeFeedbackBody(body);
    const sql = neon(process.env.DATABASE_URL);
    const saved = await persistFeedback(sql, record);

    return NextResponse.json({
      ok: true,
      appVariant: record.appVariant,
      id: saved?.id ?? null,
      responseKind: record.responseKind,
      responseStatus: record.responseStatus,
      sessionId: record.sessionId,
    });
  } catch (error) {
    console.error("[clutch:feedback] save failed", error);

    if (error instanceof Error && /(feedback|email|phone)/i.test(error.message)) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "failed to save feedback" },
      { status: 500 }
    );
  }
}
