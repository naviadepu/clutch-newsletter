import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "server is not configured" }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const email = body?.answers?.q13email ?? body?.email ?? null;
    const rawPhone = body?.answers?.q12 ?? body?.phone ?? null;
    const phone = rawPhone ? rawPhone.replace(/\D/g, "").replace(/^1?/, "+1") : null;
    const answers = body?.answers ?? {};
    const sessionId = body?.sessionId ?? null;
    const status = body?.status ?? "in_progress";

    if (sessionId) {
      // try to update existing row first
      const updated = await sql`
        UPDATE survey_responses
        SET
          email = COALESCE(${email}, survey_responses.email),
          phone = COALESCE(${phone}, survey_responses.phone),
          answers = ${JSON.stringify(answers)}::jsonb,
          submitted_at = CASE
            WHEN ${status} = 'submitted' THEN NOW()
            ELSE survey_responses.submitted_at
          END
        WHERE session_id = ${sessionId}
        RETURNING id
      `;

      if (updated.length === 0) {
        // no existing row, insert new one
        await sql`
          INSERT INTO survey_responses (submitted_at, email, phone, answers, session_id)
          VALUES (NOW(), ${email}, ${phone}, ${JSON.stringify(answers)}::jsonb, ${sessionId})
        `;
      }
    } else {
      await sql`
        INSERT INTO survey_responses (submitted_at, email, phone, answers)
        VALUES (NOW(), ${email}, ${phone}, ${JSON.stringify(answers)}::jsonb)
      `;
    }

    if (status === "submitted" && phone) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          to: phone,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: `we've got it, your feedback is in and you're on our list and in the loop of all the new things we will be doing!\n\n* team clutch`,
        });
      } catch (smsErr) {
        console.warn("[clutch:sms] failed", smsErr);
      }
    }

    return NextResponse.json({ ok: true, sessionId });
  } catch (error) {
    console.error("[clutch:feedback] save failed", error);
    return NextResponse.json({ ok: false, error: "failed to save feedback" }, { status: 500 });
  }
}