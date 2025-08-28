import crypto from "crypto";
import { NextResponse } from "next/server";
import { Orders } from "../../../../lib/orders.js";
import { getProduct } from "../../../../lib/products.js";

const BASES = {
  sandbox: "https://api-sandbox.duitku.com",
  production: "https://api-prod.duitku.com"
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, email } = body || {};
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 400 });
    }

    const merchantCode = process.env.DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;
    const env = process.env.DUITKU_ENV || "sandbox";
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    if (!merchantCode || !apiKey) {
      return NextResponse.json({ error: "Env DUITKU belum di-set" }, { status: 500 });
    }

    // Create local order
    const merchantOrderId = String(Date.now());
    Orders.createOrder({ merchantOrderId, email, productId: product.id, amount: product.price });

    // Build CreateInvoice request (POP)
    const timestamp = Date.now();
    const signature = crypto.createHash("sha256")
      .update(merchantCode + String(timestamp) + apiKey)
      .digest("hex");

    const payload = {
      paymentAmount: product.price,
      merchantOrderId,
      productDetails: product.name,
      additionalParam: "",
      merchantUserInfo: email,
      customerVaName: email,
      email,
      phoneNumber: "",
      itemDetails: [{ name: product.name, price: product.price, quantity: 1 }],
      customerDetail: {
        firstName: email.split("@")[0],
        lastName: "",
        email,
        phoneNumber: "",
        billingAddress: {
          firstName: email.split("@")[0], lastName: "", address: "N/A",
          city: "Jakarta", postalCode: "10000", phone: "", countryCode: "ID"
        },
        shippingAddress: {
          firstName: email.split("@")[0], lastName: "", address: "N/A",
          city: "Jakarta", postalCode: "10000", phone: "", countryCode: "ID"
        }
      },
      callbackUrl: baseUrl + "/api/duitku/callback",
      returnUrl: baseUrl + "/success",
      expiryPeriod: 30
    };

    const res = await fetch(BASES[env] + "/api/merchant/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-duitku-signature": signature,
        "x-duitku-timestamp": String(timestamp),
        "x-duitku-merchantcode": merchantCode
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok || data.statusCode !== "00") {
      return NextResponse.json({ error: "CreateInvoice gagal", detail: data }, { status: 500 });
    }

    Orders.setReference(merchantOrderId, data.reference);

    return NextResponse.json({
      reference: data.reference,
      paymentUrl: data.paymentUrl,
      merchantOrderId
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
          }
