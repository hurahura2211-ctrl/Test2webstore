export const dynamic = 'force-dynamic';
"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, getProduct } from "../../lib/products";

export default function CheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const productId = sp.get("productId") || PRODUCTS[0].id;
  const product = useMemo(()=> getProduct(productId), [productId]);

  useEffect(()=>{
    if (!product) setMessage("Produk tidak ditemukan.");
  }, [product]);

  async function onPay(e) {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/duitku/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Gagal membuat invoice");
      const { reference, paymentUrl, merchantOrderId } = data;

      const goSuccess = () => router.push(`/success?order=${merchantOrderId}`);
      const goPending = () => router.push(`/success?order=${merchantOrderId}&pending=1`);

      if (typeof window !== "undefined" && window.checkout && reference) {
        window.checkout.process(reference, {
          defaultLanguage: "id",
          successEvent: () => goSuccess(),
          pendingEvent: () => goPending(),
          errorEvent: (r) => { console.error(r); setMessage("Pembayaran error. Coba lagi."); },
          closeEvent: () => setMessage("Popup ditutup sebelum pembayaran selesai.")
        });
      } else if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setMessage("Tidak mendapat reference pembayaran.");
      }
    } catch (err) {
      console.error(err);
      setMessage(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  if (!product) return <main><p>{message}</p></main>;

  return (
    <main className="card">
      <h2 style={{marginTop:0}}>Checkout</h2>
      <p><strong>{product.name}</strong></p>
      <p style={{color:"var(--muted)"}}>Total: Rp {product.price.toLocaleString("id-ID")}</p>
      <form onSubmit={onPay}>
        <label style={{display:"block", marginBottom:8}}>Email untuk kirim link download</label>
        <input
          required
          type="email"
          placeholder="[email protected]"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #1f2937", background:"#0b0e14", color:"white", marginBottom:16}}
        />
        <button className="btn" disabled={loading}>{loading ? "Memproses..." : "Bayar dengan Duitku"}</button>
        {!!message && <p style={{marginTop:12, color:"#fca5a5"}}>{message}</p>}
      </form>
    </main>
  );
             }
    
