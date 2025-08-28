import Link from "next/link";
import { PRODUCTS } from "../lib/products";

export default function Page() {
  return (
    <main>
      <div className="grid">
        {PRODUCTS.map(p => (
          <article className="card" key={p.id}>
            <h2 style={{marginTop:0}}>{p.name}</h2>
            <p style={{color:"var(--muted)"}}>{p.description}</p>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <strong>Rp {p.price.toLocaleString("id-ID")}</strong>
              <Link href={`/checkout?productId=${p.id}`}>
                <button className="btn">Beli</button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
