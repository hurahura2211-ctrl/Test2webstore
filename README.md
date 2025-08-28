# Duitku Digital Store (Next.js) — Template

Template siap pakai untuk jualan produk digital dengan **Duitku POP** di Next.js + Vercel.

## Deploy cepat (2 cara)

### A) Import GitHub → Vercel (paling mudah)
1. Klik **Use this template** di GitHub (atau buat repo baru dari ZIP).
2. Masuk ke [Vercel](https://vercel.com/new) → **Add New Project** → pilih repo ini.
3. Tambahkan **Environment Variables**:
   - `DUITKU_MERCHANT_CODE` = `xxxxx`
   - `DUITKU_API_KEY` = `xxxxx`
   - `DUITKU_ENV` = `sandbox` (ganti `production` saat go-live)
   - `BASE_URL` = `https://<domain-vercel-kamu>`
4. Deploy.

> Atau gunakan tombol Deploy di bawah ini setelah mengganti placeholder `REPO_URL`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=REPO_URL&project-name=duitku-digital-store&repository-name=duitku-digital-store&env=DUITKU_MERCHANT_CODE,DUITKU_API_KEY,DUITKU_ENV,BASE_URL&envDescription=Isi kunci Duitku dan BASE_URL domain anda.&envLink=https%3A%2F%2Fdocs.duitku.com%2Fpop%2Fid%2F)

### B) Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
# pilih scope dan project
# setelah deploy pertama, set env:
export DUITKU_MERCHANT_CODE=xxxxx
export DUITKU_API_KEY=xxxxx
export DUITKU_ENV=sandbox
export BASE_URL=https://<domain>.vercel.app
./scripts/set-vercel-env.sh <scope> <project-name>
vercel --prod
```

## Go-Live
- Ubah `DUITKU_ENV=production`
- Pakai kunci produksi
- Set **Callback URL** di dashboard: `https://<domain>/api/duitku/callback`
- Set **Return URL** (opsional): `https://<domain>/success`
- Redeploy

## Pengembangan lokal
```bash
npm i
cp .env.example .env.local
npm run dev
```

## Catatan
- Status pembayaran final **hanya** ditetapkan lewat **HTTP Callback** terverifikasi (MD5). Jangan andalkan `returnUrl` saja.
- Simpan order di DB produksi (template ini masih in-memory).

---

Lisensi: MIT
