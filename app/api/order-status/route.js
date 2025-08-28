import { NextResponse } from "next/server";
import { Orders } from "../../../lib/orders.js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const merchantOrderId = searchParams.get("merchantOrderId");
  if (!merchantOrderId) {
    return NextResponse.json({ error: "merchantOrderId required" }, { status: 400 });
  }
  const o = Orders.getOrder(merchantOrderId);
  if (!o) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const base = process.env.BASE_URL || "http://localhost:3000";
  return NextResponse.json({
    status: o.status,
    downloadUrl: o.status === "PAID" ? `${base}/api/download/${o.token}` : null
  });
}
