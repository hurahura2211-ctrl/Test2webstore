import { NextResponse } from "next/server";
import { Orders } from "../../../../lib/orders.js";
import { getProduct } from "../../../../lib/products.js";
import path from "path";
import fs from "fs";

export async function GET(req, { params }) {
  const { token } = params;
  const order = Orders.findByToken(token);
  if (!order || order.status !== "PAID") {
    return NextResponse.json({ error: "Invalid or unpaid token" }, { status: 403 });
  }
  const product = getProduct(order.productId);
  if (!product) return NextResponse.json({ error: "Product missing" }, { status: 404 });

  const filePath = path.join(process.cwd(), "public", product.file);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`
    }
  });
}
