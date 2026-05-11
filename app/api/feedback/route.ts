import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  console.log("[clutch:feedback]", JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
