import crypto from "crypto";
import { NextResponse } from "next/server";
import { Orders } from "../../../../lib/orders.js";

/**
 * Callback dari server Duitku (HTTP POST)
 * Verifikasi: MD5(merchantcode + amount + merchantOrderId + apiKey)
 */
export async function POST(req) {
  // Parse body (JSON atau x-www-form-urlencoded)
  let bodyText = await req.text();
  let payload = {};
  try {
    payload = JSON.parse(bodyText);
  } catch {
    const params = new URLSearchParams(bodyText);
    params.forEach((v, k) => payload[k] = v);
  }

  const { merchantCode, merchantcode, amount, merchantOrderId, resultCode, signature } = payload;
  const mc = merchantCode || merchantcode;
  const apiKey = process.env.DUITKU_API_KEY;

  if (!mc || !amount || !merchantOrderId || !signature) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const expected = crypto.createHash("md5")
    .update(mc + String(amount) + String(merchantOrderId) + apiKey)
    .digest("hex");

  const verified = expected.toLowerCase() === String(signature).toLowerCase();

  if (verified && String(resultCode) === "00") {
    Orders.markPaid(String(merchantOrderId));
  }

  // Selalu 200 supaya Duitku berhenti retry jika sudah diproses
  return NextResponse.json({ ok: true, verified });
}
