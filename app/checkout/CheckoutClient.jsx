"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, getProduct } from "../../lib/products";

export default function CheckoutClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const productId = sp.get("productId") || "";
  const product = useMemo(() => getProduct(productId), [productId]);

  useEffect(() => {
    if (!product) setMessage("Produk tidak ditemukan.");
  }, [product]);

  async function onPay() {
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch("/api/duitku/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Gagal membuat invoice");
      window.location.href = data.paymentUrl;
    } catch (e) {
      setMessage(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  if (!product) return <main className="card"><p>{message || "Produk tidak ditemukan."}</p></main>;

  return (
    <main className="card">
      <h2>Checkout</h2>
      <p><b>{product.name}</b> — Rp{product.price.toLocaleString("id-ID")}</p>

      <label>Email untuk menerima link download</label>
      <input
        placeholder="email@contoh.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn" onClick={onPay} disabled={loading || !email}>
        {loading ? "Memproses..." : "Bayar dengan Duitku"}
      </button>

      {message && <p style={{ color: "crimson" }}>{message}</p>}
    </main>
  );
}
