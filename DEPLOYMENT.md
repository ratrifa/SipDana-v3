# 🚀 Deployment Guide - SipDana v3 to Vercel

## **Prerequisites**
- ✅ GitHub Account dengan repo sudah ter-push
- ✅ Vercel Account (login dengan GitHub)
- ✅ PlanetScale Account (setup database MySQL)
- ✅ Google Gemini API Key

---

## **1. SETUP DATABASE DI PLANETSCALE**

### 1.1 Buat PlanetScale Account
- Kunjungi: https://planetscale.com
- Login dengan GitHub
- Buat organization baru

### 1.2 Import Database
1. Buat database baru bernama `sip_dana`
2. Pilih **"Branches"** → **main**
3. Klik **"Connect"** → Pilih **"Connect with MySQL client"**
4. Copy connection string: `mysql://[user]:[password]@[host]/sip_dana`

### 1.3 Import dari SQL File
```bash
# Dari local machine
mysql -h [host] -u [user] -p[password] sip_dana < sip_dana.sql
```

Atau gunakan PlanetScale Dashboard:
- Klik **"Upload"** → Pilih file `sip_dana.sql`

---

## **2. DEPLOY BACKEND KE VERCEL**

### 2.1 Update Backend Config

Edit `backend/vercel.json` (sudah ada):
```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "api",
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

### 2.2 Fixed backend/api/index.ts

File sudah di-create dengan struktur serverless. Pastikan setup benar untuk Express dengan Vercel handler.

### 2.3 Deploy di Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Klik **"Add New"** → **"Project"**
3. Import GitHub repository
4. **Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** (kosongkan, default ke Vercel)

5. **Environment Variables** (Tambahkan):
   ```
   DB_HOST=xxxxx.mysql.database.azure.com
   DB_USER=xxxxx
   DB_PASSWORD=xxxxx
   DB_NAME=sip_dana
   JWT_SECRET=your-secret-key-min-32-chars
   GEMINI_API_KEY=your-google-gemini-key
   FRONTEND_URL=https://sipdana.vercel.app
   ```

6. Klik **"Deploy"**

### 2.4 Catat Backend URL
Contoh: `https://backend-sipdana.vercel.app`

---

## **3. DEPLOY FRONTEND KE VERCEL**

### 3.1 Update Frontend Config

File `frontend/vercel.json` (sudah ada):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3.2 Deploy di Vercel Dashboard

1. Klik **"Add New"** → **"Project"**
2. Import same repository
3. **Settings:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://backend-sipdana.vercel.app/api
   ```

5. Klik **"Deploy"**

### 3.3 Catat Frontend URL
Contoh: `https://sipdana.vercel.app`

---

## **4. FINAL SETUP**

### 4.1 Update Backend Environment Variable
Kembali ke **Vercel Backend Project** → **Settings** → **Environment Variables**

Ubah:
```
FRONTEND_URL=https://sipdana.vercel.app
```

Redeploy backend (otomatis atau manual)

### 4.2 Test API Connection
```bash
curl https://backend-sipdana.vercel.app/api/health
```

Harusnya return:
```json
{ "status": "Server is running" }
```

### 4.3 Test Login di Frontend
- Kunjungi: https://sipdana.vercel.app
- Login dengan credentials: `Reyhan` / password dari database

---

## **TROUBLESHOOTING**

### ❌ Error: "CORS error"
→ Pastikan `FRONTEND_URL` di backend env variables sesuai dengan frontend URL Vercel

### ❌ Error: "Database connection failed"
→ Pastikan credentials PlanetScale benar dan IP Vercel whitelisted:
- Di PlanetScale Dashboard → **Settings** → **Allow Public IPs** = ON

### ❌ Error: "401 Unauthorized"
→ Pastikan JWT_SECRET sama di production environment

### ❌ Build timeout di Vercel
→ Pastikan `package-lock.json` ada dan dependencies udah ter-install

---

## **MAINTENANCE**

### Update Backend:
1. Push changes ke GitHub
2. Vercel auto-redeploy (jika webhook aktif)
3. Check deployment logs: Vercel Dashboard → Deployments

### Update Database:
- Akses PlanetScale console
- Run migrations atau SQL queries langsung

### View Logs:
- **Frontend:** Vercel Dashboard → Deployments → Logs
- **Backend:** Vercel Dashboard → Deployments → Logs / Functions
- **Database:** PlanetScale → Insights

---

## **PRODUCTION CHECKLIST**

- [ ] Database credentials aman (di Vercel Secrets)
- [ ] JWT_SECRET sudah di-change (bukan default)
- [ ] FRONTEND_URL sudah di-set di backend
- [ ] CORS origin domain sesuai
- [ ] Gemini API Key ter-set dan valid
- [ ] Both deployments menunjukkan green status
- [ ] Login berfungsi normal
- [ ] Transactions bisa dibuat dan ditampilkan

---

**Done! 🎉 Aplikasi Anda sudah live di Vercel!**
