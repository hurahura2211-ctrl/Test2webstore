import Script from "next/script";

export const metadata = {
  title: "Digital Store · Duitku",
  description: "Contoh toko produk digital dengan payment gateway Duitku POP"
};

export default function RootLayout({ children }) {
  const isProd = process.env.DUITKU_ENV === "production";
  const sdkSrc = isProd
    ? "https://app-prod.duitku.com/lib/js/duitku.js"
    : "https://app-sandbox.duitku.com/lib/js/duitku.js";

  return (
    <html lang="id">
      <head>
        <Script src={sdkSrc} strategy="afterInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`
          :root { --bg:#0b0e14; --card:#121826; --muted:#94a3b8; --brand:#22c55e; }
          * { box-sizing: border-box; }
          body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system; background:var(--bg); color:white; }
          a { color: #60a5fa; text-decoration: none; }
          .container { max-width: 980px; margin: 0 auto; padding: 24px; }
          .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
          .card { background:var(--card); border:1px solid #1f2937; border-radius: 16px; padding: 20px; }
          .btn { background: var(--brand); color:#0b0e14; padding:12px 16px; border-radius: 10px; font-weight:600; border:none; cursor:pointer; }
          .btn.secondary { background:#1f2937; color: #e5e7eb; }
          header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px; }
          header h1 { font-size: 22px; margin:0; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <header>
            <h1>Digital Store</h1>
            <nav><a href="/">Produk</a></nav>
          </header>
          {children}
          <footer style={{marginTop:40, color:"var(--muted)", fontSize:14}}>
            Built with <a href="https://docs.duitku.com/pop/id/">Duitku POP</a>. Demo only — gunakan DB & storage beneran untuk produksi.
          </footer>
        </div>
      </body>
    </html>
  );
  }
                         
