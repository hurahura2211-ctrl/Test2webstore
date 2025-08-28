"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const sp = useSearchParams();
  const order = sp.get("order");
  const [status, setStatus] = useState("Menunggu konfirmasi pembayaran…");
  const [download, setDownload] = useState(null);

  async function check() {
    if (!order) return;
    const res = await fetch(`/api/order-status?merchantOrderId=${order}`);
    const data = await res.json();
    if (data.status === "PAID") {
      setStatus("Pembayaran terkonfirmasi ✓");
      setDownload(data.downloadUrl);
    } else {
      setStatus("Belum terbayar / pending.");
    }
  }

  useEffect(() => {
    const id = setInterval(check, 3000);
    return () => clearInterval(id);
  }, [order]);

  return (
    <main className="card">
      <h2 style={{ marginTop: 0 }}>Status Order</h2>
      <p>Order ID: <code>{order}</code></p>
      <p>{status}</p>
      {download ? (
        <a className="btn" href={download}>Download Produk</a>
      ) : (
        <button className="btn secondary" onClick={check}>
          Cek status sekarang
        </button>
      )}
    </main>
  );
}
