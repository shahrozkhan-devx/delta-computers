import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";
  const phone = typeof payload?.phone === "string" ? payload.phone.trim() : "";
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  const productId = typeof payload?.productId === "string" ? payload.productId : null;

  if (name.length < 2 || name.length > 100 || phone.length < 7 || phone.length > 30 || message.length < 2 || message.length > 2000) {
    return NextResponse.json({ error: "Please enter a valid name, phone number and message." }, { status: 400 });
  }
  if (productId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId)) {
    return NextResponse.json({ error: "Product reference is invalid." }, { status: 400 });
  }
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Inquiry service is not configured yet. Please contact the shop directly on WhatsApp." }, { status: 503 });

  const { error } = await supabase.from("inquiries").insert({ name, phone, message, product_id: productId });
  if (error) {
    console.error("Inquiry insert failed:", error.message);
    return NextResponse.json({ error: "We could not save your inquiry right now. Please try WhatsApp instead." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data, error } = await supabase.from("inquiries").select("id").limit(1);
  if (error) return NextResponse.json({ error: "Inquiry service is unavailable." }, { status: 500 });
  return NextResponse.json({ configured: true, available: Boolean(data) });
}
